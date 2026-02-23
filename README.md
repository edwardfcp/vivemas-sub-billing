# ViveMás Coach - Billing & Subscription System

Este proyecto es el módulo de facturación y gestión de suscripciones para **ViveMás Coach**. Utiliza Next.js, Stripe y SQLite para ofrecer una experiencia premium de facturación bio-individual.

## 🚀 Características

- **Diseño Premium**: Interfaz moderna, clara y minimalista alineada con la identidad visual de `vivemascoach.com`.
- **Integración con Stripe**: Flujos de Checkout, Customer Portal y Webhooks automatizados.
- **Lógica de Upgrade (Upsell)**: Sistema de actualización de planes con prorrateo automático integrado.
- **Base de Datos Local**: Uso de SQLite (`better-sqlite3`) para persistencia ligera y rápida.
- **Admin Dashboard**: Panel interno para monitorear usuarios y transacciones en tiempo real.
- **Autenticación Simulada**: Selector de perfiles para pruebas rápidas de UX.

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), Tailwind CSS.
- **Backend**: Next.js API Routes, Stripe SDK.
- **Database**: SQLite.
- **Tipografía**: Montserrat.

## 📋 Requisitos Previos

1. [Node.js](https://nodejs.org/) (v18 o superior).
2. [Stripe CLI](https://stripe.com/docs/stripe-cli) para pruebas locales de webhooks.

## ⚙️ Configuración

1. Clonar el repositorio.
2. Crear un archivo `.env.local` basado en el siguiente esquema:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Instalar dependencias:
```bash
npm install
```

## 🧪 Pruebas Locales

1. **Iniciar el servidor**:
```bash
npm run dev
```

2. **Escuchar Webhooks**:
Abre una terminal nueva y ejecuta:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Copia el `signing secret` que te da la consola y pégalo en `STRIPE_WEBHOOK_SECRET` en tu `.env.local`.

3. **Flujo de Usuario**:
- Selecciona uno de los 3 perfiles de prueba en la cabecera.
- Ve a **Precios** y realiza una suscripción (puedes usar la tarjeta de prueba 4242).
- Verifica en el **Dashboard** que tu estado sea "Active".
- Prueba el botón de **Upgrade** para ver el prorrateo en acción.

## 📁 Estructura del Código

- `/src/app/api`: Endpoints para checkout, portal, upsell y webhooks.
- `/src/lib/stripe.ts`: Configuración del SDK de Stripe.
- `/src/lib/db.ts`: Esquema e inicialización de SQLite.
- `/src/lib/constants.ts`: Configuración de planes y sus IDs de Stripe.
- `/src/components`: Contextos de usuario y componentes de UI reutilizables.

---
© 2026 ViveMás Coach. Todos los derechos reservados.
