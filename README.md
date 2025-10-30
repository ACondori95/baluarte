# 🇦🇷 App de Presupuestos y Finanzas para PyMES Argentinas (MERN)

**Estado:** Inicial (MVP Planificado)

Este documento describe el alcance, la tecnología y la estrategia de monetización para el Producto Mínimo Viable (MVP) de una aplicación de gestión financiera diseñada para pequeñas y medianas empresas (PyMES) en Argentina, con enfoque en la integración de Mercado Pago.

---

## 1. Alcance y Objetivos del MVP

El objetivo principal es ofrecer a las PyMES argentinas una herramienta intuitiva y segura para **gestionar el flujo de caja**, **establecer presupuestos mensuales** y **obtener un panorama rápido de su salud financiera**.

### 1.1. Características Clave (MVP)

- **Autenticación de Usuarios:** Registro y login seguro (individual, un solo usuario por cuenta).
- **Perfil de Negocio:** Configuración simple para definir el nombre del negocio y la moneda principal (ARS).
- **Gestión de Categorías:** CRUD (Crear, Leer, Actualizar, Eliminar) de categorías personalizadas para ingresos y egresos (ej: _Ventas MP_, _Alquileres_, _Sueldos_).
- **Registro de Transacciones:** Carga manual de transacciones (ingresos y egresos) con fecha, monto, categoría y descripción.
- **Definición de Presupuestos:** Capacidad para establecer límites de presupuesto mensual por categoría de egreso.
- **Visualización de Dashboard:** Panel principal con gráficos y resúmenes de:
  - Flujo de caja mensual (Ingresos vs. Egresos).
  - Comparativa de Presupuesto vs. Gasto Real por categoría.
- **Suscripciones:** Integración con Mercado Pago para gestionar el cobro de la membresía mensual.

---

## 2. Pila Tecnológica (MERN Stack)

| Componente        | Tecnología                                         | Rol                                  |
| :---------------- | :------------------------------------------------- | :----------------------------------- |
| **Frontend**      | **React** (**JavaScript ES6+**)                    | Interfaz de Usuario.                 |
| **Backend**       | **Node.js** & **Express.js** (**JavaScript ES6+**) | API RESTful y Lógica de Negocio.     |
| **Base de Datos** | **MongoDB** (vía Mongoose)                         | Almacenamiento de datos NoSQL.       |
| **Pagos**         | **Mercado Pago SDK**                               | Procesamiento de pagos recurrentes.  |
| **Autenticación** | **JWT** & **Bcrypt**                               | Seguridad de sesiones y contraseñas. |

---

## 3. Estrategia de Monetización (Mercado Pago)

Proponemos una estructura de tres niveles para maximizar la adquisición y monetizar el valor diferencial.

| Plan                 | Precio (ARS/Mensual) | Características Principales                                                               | Observaciones                                |
| :------------------- | :------------------- | :---------------------------------------------------------------------------------------- | :------------------------------------------- |
| **Base (Gratuito)**  | **\$0**              | Carga manual de transacciones. Dashboard básico. Límite de 50 transacciones/mes.          | Ideal para la prueba y adopción inicial.     |
| **Pro (Estándar)**   | **ARS 2.990**        | Transacciones ilimitadas. Presupuestos avanzados. Exportación de reportes (CSV).          | El plan principal de generación de ingresos. |
| **Premium (Futuro)** | **ARS 5.990**        | Sincronización automática de cuentas (futuro). Acceso multi-usuario. Soporte prioritario. | Plan a largo plazo.                          |

**Medio de Pago:** La integración inicial se centrará en el **SDK de Mercado Pago** para facilitar la suscripción mensual a los planes Pro.

---

## 4. Alcance Futuro (Post-MVP)

Estas funcionalidades se desarrollarán una vez que el MVP sea estable y probado en el mercado.

- **Sincronización Bancaria (Automatización):** Integración segura con proveedores locales para obtener automáticamente los movimientos de tarjetas de crédito/débito.
- **Multi-Moneda:** Soporte para PyMES que manejan transacciones en USD y otras divisas.
- **Reportes Avanzados:** Generación de informes P&G (Pérdidas y Ganancias) detallados.
- **Gestión de Equipos:** Roles y permisos para múltiples empleados.
