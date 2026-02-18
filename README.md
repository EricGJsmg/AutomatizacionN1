# Automatización Cypress

Framework de pruebas E2E basado en el patrón **Page Object Model (POM)** y una arquitectura de servicios para la validación de flujos logísticos.

## 🚀 Estructura del Proyecto

- **`cypress/e2e/`**: Suites de pruebas funcionales (ej. Inbound).
- **`cypress/pages/`**: Definición de elementos y acciones de UI (DXC y Radiofrecuencia).
- **`cypress/support/services/`**: Capa de integración con APIs (GraphQL, Mule, Vulcan) y Base de Datos.
- **`cypress/support/commands/`**: Comandos personalizados modularizados.
- **`cypress/environments/`**: Configuración dinámica para entornos DEV, INT y PRO.

## 🛠️ Requisitos Previos

- Node.js (v18+ recomendado)
- Configurar el archivo `.env` con las credenciales necesarias.

## 💻 Comandos Principales

### Instalación
```bash
npm install
```

### Ejecución de Pruebas
```bash
# Abrir el Cypress Runner
npx cypress open

# Ejecutar en modo headless (consola)
npx cypress run

# Ejecutar un entorno específico (ejemplo)
npx cypress run --env environment=cdo.dev
```

## 🏗️ Flujo de Trabajo
1. **Datos**: Gestión mediante archivos `.sql` y `.json` en la carpeta `data/` del test.
2. **Servicios**: Uso de `db-service` y servicios API para pre-condiciones y validaciones post-ejecución.
3. **UI**: Interacción con aplicaciones web (DXC) y terminales móviles (RF).
