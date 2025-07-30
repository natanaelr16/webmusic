import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// ===================================================================
// CONFIGURACIÓN DE CLIENTES SUPABASE
// ===================================================================
// Estos clientes se conectan con la base de datos PostgreSQL en Supabase
// Row Level Security (RLS) está habilitado, por lo que las consultas
// automáticamente filtran datos por usuario autenticado

// Cliente para componentes del lado del cliente (Client Components)
export const createClient = () => createClientComponentClient()

// Cliente para componentes del lado del servidor (Server Components)
export const createServerClient = () => createServerComponentClient({ cookies })

// ===================================================================
// TIPOS DE DATOS - BASADOS EN EL MODELO DE BASE DE DATOS
// ===================================================================
// Estos tipos reflejan exactamente las tablas en Supabase PostgreSQL

/**
 * Tabla: conciertos
 * Propósito: Almacena información del evento (probablemente una sola fila)
 * Nota para Backend: Esta tabla debe tener al menos un registro del concierto
 */
export interface Concert {
    id: string                    // UUID - Identificador único del concierto
    nombre: string               // TEXT - Nombre del concierto para mostrar en UI
    fecha: string               // TIMESTAMPTZ - Fecha y hora del evento
    lugar: string               // TEXT - Ubicación del evento
    precio_preventa: number     // NUMERIC - Precio durante preventa (no usar directamente)
    precio_general: number      // NUMERIC - Precio después de preventa (no usar directamente)
    fecha_fin_preventa: string  // TIMESTAMPTZ - Cuándo termina la preventa
    created_at: string          // TIMESTAMPTZ - Cuándo se creó el registro
}

/**
 * Tabla: transacciones
 * Propósito: Registra cada intento de compra
 * Nota para Backend: Se crea antes de redirigir a pasarela de pagos
 */
export interface Transaction {
    id: string                                           // UUID - Identificador único
    user_id: string                                     // UUID - ID del usuario (gestionado por Supabase Auth)
    concierto_id: string                               // UUID - Referencia al concierto
    cantidad_boletas: number                           // SMALLINT - Número de boletas (1-3)
    monto_total: number                                // NUMERIC - Precio total (calculado por backend)
    estado: 'pendiente' | 'completada' | 'fallida'    // ENUM - Estado de la transacción
    created_at: string                                 // TIMESTAMPTZ - Cuándo se creó
}

/**
 * Tabla: boletas
 * Propósito: Almacena cada boleta individual comprada exitosamente
 * Nota para Backend: Se crea cuando el pago se confirma vía webhook
 */
export interface Ticket {
    id: string                                    // UUID - ID único de la boleta (se cifra para QR)
    transaccion_id: string                       // UUID - Referencia a la transacción que la generó
    user_id: string                             // UUID - Propietario de la boleta
    estado: 'vendida' | 'usada' | 'anulada'    // ENUM - Estado actual de la boleta
    validated_at?: string                       // TIMESTAMPTZ - Cuándo se escaneó en el evento
    created_at: string                          // TIMESTAMPTZ - Cuándo se creó la boleta
}

// ===================================================================
// API DE CONCIERTOS
// ===================================================================
// Funciones para interactuar con la tabla 'conciertos'

export const concertAPI = {
    /**
     * Obtiene el precio actual de las boletas
     * IMPORTANTE: Usa la función RPC 'get_precio_actual' creada por el backend
     * Esta función calcula automáticamente si aplica precio de preventa o general
     * basándose en la fecha actual vs fecha_fin_preventa
     * 
     * @param concertId - UUID del concierto
     * @returns number - Precio actual (65000 o 85000)
     */
    getCurrentPrice: async (concertId: string): Promise<number> => {
        const supabase = createClient()

        // Llamada a la función RPC que calcula el precio actual
        // Backend debe implementar esta función en Supabase
        const { data, error } = await supabase.rpc('get_precio_actual', {
            concierto_id: concertId
        })

        if (error) {
            console.error('Error obteniendo precio actual:', error)
            throw new Error(`Error al obtener precio: ${error.message}`)
        }

        return data as number
    },

    /**
     * Obtiene los detalles completos de un concierto
     * 
     * @param concertId - UUID del concierto
     * @returns Concert - Objeto con toda la información del concierto
     */
    getConcert: async (concertId: string): Promise<Concert> => {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('conciertos')
            .select('*')
            .eq('id', concertId)
            .single()

        if (error) {
            console.error('Error obteniendo concierto:', error)
            throw new Error(`Error al obtener concierto: ${error.message}`)
        }

        return data as Concert
    },

    /**
     * Obtiene todos los conciertos disponibles
     * Nota: Para este proyecto probablemente solo habrá uno
     * 
     * @returns Concert[] - Array de conciertos
     */
    getConcerts: async (): Promise<Concert[]> => {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('conciertos')
            .select('*')
            .order('fecha', { ascending: true })

        if (error) {
            console.error('Error obteniendo conciertos:', error)
            throw new Error(`Error al obtener conciertos: ${error.message}`)
        }

        return data as Concert[]
    }
}

// ===================================================================
// API DE COMPRAS
// ===================================================================
// Funciones para manejar el proceso de compra

export const purchaseAPI = {
    /**
     * Inicia el proceso de compra llamando a la Edge Function 'iniciar-compra'
     * 
     * FLUJO PARA EL BACKEND:
     * 1. Esta función llama a la Edge Function que YA ESTÁ IMPLEMENTADA
     * 2. La Edge Function debe:
     *    - Verificar/crear usuario por email
     *    - Calcular precio actual con get_precio_actual
     *    - Crear registro en tabla 'transacciones' con estado 'pendiente'
     *    - Generar link de pago (por ahora simulado)
     *    - Devolver { payment_link: "https://checkout.wompi.co/..." }
     * 
     * @param email - Email del usuario
     * @param quantity - Cantidad de boletas (1-3)
     * @param concertId - UUID del concierto
     * @returns { payment_link: string } - URL para redirigir al usuario
     */
    initiatePurchase: async (
        email: string,
        quantity: number,
        concertId: string
    ): Promise<{ payment_link: string }> => {
        const supabase = createClient()

        // Validación frontend antes de llamar al backend
        if (!email || !email.includes('@')) {
            throw new Error('Email inválido')
        }

        if (quantity < 1 || quantity > 3) {
            throw new Error('Cantidad debe ser entre 1 y 3 boletas')
        }

        // Llamada a la Edge Function que está desplegada en Supabase
        // Backend: Esta función debe estar en /supabase/functions/iniciar-compra/index.ts
        const { data, error } = await supabase.functions.invoke('iniciar-compra', {
            body: {
                email,                    // Email del usuario
                cantidad: quantity,       // Número de boletas
                concierto_id: concertId   // UUID del concierto
            }
        })

        if (error) {
            console.error('Error en iniciar-compra:', error)
            throw new Error(`Error al iniciar compra: ${error.message}`)
        }

        // Verificar que el backend devolvió el payment_link
        if (!data || !data.payment_link) {
            throw new Error('Backend no devolvió payment_link')
        }

        return data
    }
}

// ===================================================================
// API DE BOLETAS
// ===================================================================
// Funciones para gestionar boletas del usuario y validación

export const ticketAPI = {
    /**
     * Obtiene todas las boletas del usuario autenticado
     * 
     * NOTA IMPORTANTE: Gracias a Row Level Security (RLS), esta consulta
     * automáticamente filtra las boletas por el usuario que ha iniciado sesión.
     * No necesitamos filtrar manualmente por user_id.
     * 
     * @returns Array de boletas con información completa del concierto
     */
    getUserTickets: async () => {
        const supabase = createClient()

        // Consulta con JOIN para obtener información completa
        // RLS se encarga automáticamente de filtrar por usuario actual
        const { data, error } = await supabase
            .from('boletas')
            .select(`
        *,
        transacciones (
          cantidad_boletas,
          monto_total,
          created_at,
          conciertos (
            nombre,
            fecha,
            lugar
          )
        )
      `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error obteniendo boletas:', error)
            throw new Error(`Error al obtener boletas: ${error.message}`)
        }

        return data
    },

    /**
     * Valida una boleta escaneando su código QR
     * Llama a la Edge Function 'validar-boleta'
     * 
     * FLUJO PARA EL BACKEND:
     * Esta función debe estar implementada en /supabase/functions/validar-boleta/index.ts
     * Debe:
     * 1. Descifrar el contenido del QR para obtener el ID de la boleta
     * 2. Verificar que la boleta existe y está en estado 'vendida'
     * 3. Actualizar estado a 'usada' y marcar validated_at
     * 4. Devolver información de la validación
     * 
     * @param qrContent - Contenido del código QR escaneado
     * @returns { valid: boolean, ticket?: object, message: string }
     */
    validateTicket: async (qrContent: string) => {
        const supabase = createClient()

        if (!qrContent || qrContent.trim() === '') {
            throw new Error('Contenido QR vacío')
        }

        // Llamada a la Edge Function de validación
        // Backend: Esta función aún no está implementada según la documentación
        const { data, error } = await supabase.functions.invoke('validar-boleta', {
            body: {
                qr_content: qrContent
            }
        })

        if (error) {
            console.error('Error validando boleta:', error)
            throw new Error(`Error al validar boleta: ${error.message}`)
        }

        return data
    }
}