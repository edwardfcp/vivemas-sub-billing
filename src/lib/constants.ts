export const PLANS = [
    {
        id: 'monthly',
        name: 'Mensual',
        price: 2499,
        displayPrice: '24.99',
        period: 'mes',
        description: 'Perfecto para comenzar tu transformación.',
        features: ['Evaluación Bio-Individual', 'Planes Nutricionales', 'Rutinas de Ejercicio', 'Soporte vía Chat'],
        stripePriceId: 'price_1T40KIJj1Ix7W5K5hYvMZd2T',
    },
    {
        id: 'quarterly',
        name: 'Trimestral',
        price: 6499,
        displayPrice: '64.99',
        period: '3 meses',
        description: 'El favorito para ver resultados reales.',
        features: ['Todo en Mensual', 'Ahorro del 15%', 'Protocolo v3.5 Activo', 'Análisis de TDEE Avanzado'],
        stripePriceId: 'price_1T40LOJj1Ix7W5K5AnA0We4s',
        popular: true,
    },
    {
        id: 'semiannual',
        name: 'Semestral',
        price: 9999,
        displayPrice: '99.99',
        period: '6 meses',
        description: 'Compromiso total con tu longevidad.',
        features: ['Todo en Trimestral', 'Ahorro del 33%', 'Sesión 1-a-1 Inicial', 'Prioridad en Soporte'],
        stripePriceId: 'price_1T40LoJj1Ix7W5K51s43qeiK',
    },
];

export const UPSELL_PLANS = [
    {
        id: 'quarterly_upsell',
        targetPriceId: 'price_1T40LOJj1Ix7W5K5AnA0We4s',
        specialPrice: 5999,
        displayPrice: '59.99',
        name: 'Upgrade Trimestral',
        description: 'Solo por hoy, cambia a Trimestral y ahorra más.',
    }
];
