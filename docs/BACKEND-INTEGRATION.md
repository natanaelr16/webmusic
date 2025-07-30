# 🔗 Guía de Integración Frontend-Backend

## Resumen para el Equipo de Backend

Esta guía explica exactamente cómo está estructurado el frontend y qué necesita el backend para funcionar correctamente.

---

## 📋 Checklist de Integración

### ✅ Lo que YA está implementado (Según documentación)
- [x] Edge Function `iniciar-compra` - **DESPLEGADA**
- [x] Tabla `conciertos` en Supabase
- [x] Tabla `transacciones` en Supabase  
- [x] Tabla `boletas` en Supabase
- [x] Row Level Security (RLS) configurado

### 🔄 Lo que necesita implementarse
- [ ] Función RPC `get_precio_actual`
- [ ] Edge Function `validar-boleta`
- [ ] Edge Function `procesar-pago-webhook`
- [ ] Datos reales en tabla `conciertos`

---

## 🗃️ Estructura de Base de Datos Esperada

### Tabla: conciertos
```sql
CREATE TABLE conciertos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  fecha TIMESTAMPTZ NOT NULL,
  lugar TEXT NOT NULL,
  precio_preventa NUMERIC NOT NULL,
  precio_general NUMERIC NOT NULL,
  fecha_fin_preventa TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar datos de ejemplo
INSERT INTO conciertos (id, nombre, fecha, lugar, precio_preventa, precio_general, fecha_fin_preventa)
VALUES (
  '1', -- O generar UUID real
  'WebMusic Festival 2024',
  '2024-07-15T20:00:00Z',
  'Coliseo MedPlus, Medellín',
  65000,
  85000,
  '2024-07-01T23:59:59Z'
);
```

### Función RPC: get_precio_actual
```sql
CREATE OR REPLACE FUNCTION get_precio_actual(concierto_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  concierto RECORD;
  precio_actual NUMERIC;
BEGIN
  -- Obtener datos del concierto
  SELECT * INTO concierto 
  FROM conciertos 
  WHERE id = concierto_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Concierto no encontrado';
  END IF;
  
  -- Determinar precio según fecha actual
  IF NOW() <= concierto.fecha_fin_preventa THEN
    precio_actual := concierto.precio_preventa;
  ELSE
    precio_actual := concierto.precio_general;
  END IF;
  
  RETURN precio_actual;
END;
$$ LANGUAGE plpgsql;
```

---

## 🔌 APIs que el Frontend está llamando

### 1. Edge Function: iniciar-compra ✅ IMPLEMENTADA

**Endpoint**: `POST /functions/v1/iniciar-compra`

**Request Body**:
```json
{
  "email": "usuario@email.com",
  "cantidad": 2,
  "concierto_id": "1"
}
```

**Expected Response**:
```json
{
  "payment_link": "https://checkout.wompi.co/l/simulado_abc123"
}
```

**Ubicación en Frontend**: 
- `src/lib/supabase.ts` → `purchaseAPI.initiatePurchase()`
- `src/lib/hooks/use-purchase.ts` → `initiatePurchase()`

### 2. RPC Function: get_precio_actual ⏳ PENDIENTE

**Llamada desde Frontend**:
```typescript
const { data, error } = await supabase.rpc('get_precio_actual', {
  concierto_id: '1'
});
```

**Expected Response**: `65000` o `85000` (número)

**Ubicación en Frontend**: 
- `src/lib/supabase.ts` → `concertAPI.getCurrentPrice()`

### 3. Edge Function: validar-boleta ⏳ PENDIENTE

**Endpoint**: `POST /functions/v1/validar-boleta`

**Request Body**:
```json
{
  "qr_content": "TICKET_abc123_encrypted_content"
}
```

**Expected Response**:
```json
{
  "valid": true,
  "ticket": {
    "id": "abc123",
    "user_email": "usuario@email.com",
    "concert_name": "WebMusic Festival 2024",
    "status": "vendida"
  },
  "message": "Boleta válida - Acceso permitido"
}
```

**Ubicación en Frontend**: 
- `src/lib/supabase.ts` → `ticketAPI.validateTicket()`
- `src/components/pages/TicketValidationPage.tsx`

---

## 📱 Flujo de Usuario Completo

### 1. Usuario llega a Landing Page
```typescript
// Frontend llama automáticamente:
await supabase.rpc('get_precio_actual', { concierto_id: '1' });
await supabase.from('conciertos').select('*').eq('id', '1').single();
```

### 2. Usuario llena formulario de compra
```typescript
// Frontend envía:
{
  email: "usuario@email.com",
  cantidad: 2,
  concierto_id: "1"
}
```

### 3. Backend procesa con iniciar-compra ✅
```typescript
// Backend debe:
// 1. Verificar/crear usuario
// 2. Calcular precio con get_precio_actual
// 3. Crear transacción con estado 'pendiente'
// 4. Generar payment_link
// 5. Devolver { payment_link: "..." }
```

### 4. Usuario es redirigido a pasarela
```typescript
// Frontend automáticamente:
window.location.href = response.payment_link;
```

### 5. Pasarela procesa pago
```typescript
// Webhook llama a procesar-pago-webhook ⏳ PENDIENTE
// Backend debe:
// 1. Verificar pago
// 2. Actualizar transacción a 'completada'
// 3. Crear boletas en tabla 'boletas'
// 4. Enviar email con PDF
```

### 6. Usuario regresa a página de éxito
```typescript
// URLs de retorno configuradas:
// Éxito: /pago-exitoso?email=usuario@email.com
// Fallo: /pago-fallido?reason=declined
```

### 7. Usuario ve sus boletas
```typescript
// Frontend llama (con RLS automático):
await supabase.from('boletas').select(`
  *,
  transacciones (
    cantidad_boletas,
    monto_total,
    created_at,
    conciertos (nombre, fecha, lugar)
  )
`);
```

---

## 🔒 Row Level Security (RLS)

### Políticas Necesarias

```sql
-- Política para boletas: usuario solo ve sus propias boletas
CREATE POLICY "Users can view own tickets" ON boletas
  FOR SELECT USING (auth.uid() = user_id);

-- Política para transacciones: usuario solo ve sus propias transacciones  
CREATE POLICY "Users can view own transactions" ON transacciones
  FOR SELECT USING (auth.uid() = user_id);

-- Política para conciertos: todos pueden leer
CREATE POLICY "Anyone can read concerts" ON conciertos
  FOR SELECT TO public USING (true);
```

---

## 🧪 Testing de Integración

### 1. Probar get_precio_actual
```sql
-- En Supabase SQL Editor:
SELECT get_precio_actual('1');
-- Debe devolver 65000 si estamos en preventa, 85000 si no
```

### 2. Probar iniciar-compra desde Frontend
```javascript
// En DevTools Console:
const { data, error } = await supabase.functions.invoke('iniciar-compra', {
  body: {
    email: 'test@test.com',
    cantidad: 1,
    concierto_id: '1'
  }
});
console.log(data);
// Debe devolver: { payment_link: "https://..." }
```

### 3. Verificar creación de transacción
```sql
-- En Supabase SQL Editor después de llamar iniciar-compra:
SELECT * FROM transacciones ORDER BY created_at DESC LIMIT 1;
-- Debe mostrar la transacción recién creada con estado 'pendiente'
```

---

## 🚨 URLs de Retorno de Pasarela

### Configuración en la Pasarela de Pagos

```
URL de Éxito: https://tu-dominio.com/pago-exitoso?email={customer_email}
URL de Fallo: https://tu-dominio.com/pago-fallido?reason={failure_reason}
URL de Webhook: https://tu-proyecto.supabase.co/functions/v1/procesar-pago-webhook
```

---

## 📝 Variables de Entorno Necesarias

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (Supabase Edge Functions)
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
WOMPI_PROD_KEY=tu_clave_produccion_wompi
WOMPI_INTEGRITY_SECRET=tu_secret_integridad
```

---

## 🔍 Debugging y Logs

### Frontend Logs
```javascript
// El frontend genera logs detallados en console:
// 🎵 Landing Page cargada
// 📝 Para conectar con datos reales:
// 🔄 Iniciando proceso de compra...
// 📡 Llamando a Edge Function iniciar-compra...
// 📥 Respuesta recibida del backend:
```

### Backend Logs Recomendados
```typescript
// En iniciar-compra Edge Function:
console.log('📧 Email recibido:', email);
console.log('💰 Precio calculado:', precio_actual);
console.log('💳 Transacción creada:', transaccion_id);
console.log('🔗 Payment link generado:', payment_link);
```

---

## ✅ Checklist Final de Testing

- [ ] **Precio dinámico**: `get_precio_actual` devuelve precio correcto según fecha
- [ ] **Compra simple**: `iniciar-compra` crea transacción y devuelve payment_link
- [ ] **Redirección**: payment_link redirige correctamente a pasarela
- [ ] **Webhook**: `procesar-pago-webhook` actualiza transacción y crea boletas
- [ ] **Autenticación**: Usuario puede hacer login después de compra
- [ ] **Boletas**: Usuario ve sus boletas en "Mis Boletas"
- [ ] **Validación**: QR scanner valida boletas correctamente
- [ ] **RLS**: Usuarios solo ven sus propios datos

---

¿Dudas sobre la integración? Contacto: natanaelr16@hotmail.com