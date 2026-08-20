# Equipment Loan Management System - Frontend

Frontend moderno desarrollado con **React 18 + TypeScript + Vite + Tailwind CSS** para el sistema de control de préstamos de equipos tecnológicos (ELMS).

---

## 🚀 Requisitos Previos

- **Node.js**: v18 o superior (v20+ recomendado).
- **.NET SDK**: 10.0 (para ejecutar el backend `EquipmentLoan.API`).

---

## ⚙️ Configuración y Ejecución

### 1. Iniciar la API Backend (.NET)
Desde la raíz del repositorio:
```bash
dotnet run --project src/EquipmentLoan.API/EquipmentLoan.API.csproj
```
La API estará disponible por defecto en:
- `http://localhost:5055`
- `https://localhost:7140`

### 2. Iniciar el Frontend (React + Vite)
Desde la carpeta `frontend/`:
```bash
# Instalar dependencias (solo la primera vez)
npm install

# Iniciar servidor de desarrollo
npm run dev
```
La aplicación web se ejecutará en:
- `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```text
frontend/
├── src/
│   ├── api/                     # Servicios HTTP tipados (Axios)
│   │   ├── client.ts            # Cliente Axios centralizado con interceptores
│   │   ├── equipmentApi.ts      # Endpoints /api/equipment
│   │   ├── loansApi.ts          # Endpoints /api/loans
│   │   └── catalogApi.ts        # Endpoints /api/categories, /api/brands, /api/departments, /api/employees
│   ├── components/
│   │   ├── common/              # Badge, Button, Modal, Input, Select, StatCard, LoadingSpinner, EmptyState
│   │   └── layout/              # Sidebar, Navbar, AppLayout
│   ├── context/
│   │   └── ToastContext.tsx     # Notificaciones dinámicas de éxito/error/alerta
│   ├── pages/
│   │   ├── DashboardPage.tsx    # Métricas clave, préstamos activos y accesos rápidos
│   │   ├── EquipmentPage.tsx    # Inventario con búsqueda, filtros por categoría/marca/estado y CRUD
│   │   ├── LoansPage.tsx        # Control de préstamos, altas, filtros y devoluciones con notas
│   │   ├── EmployeesPage.tsx    # Directorio de colaboradores con departamento y código
│   │   └── CatalogsPage.tsx     # Gestión de Categorías, Marcas y Departamentos
│   ├── types/                   # Modelos y DTOs TypeScript sincronizados con el backend .NET
│   │   ├── api.ts               # ServiceResult<T>
│   │   ├── equipment.ts         # EquipmentDto, CreateEquipmentDto, UpdateEquipmentDto
│   │   ├── loan.ts              # LoanDto, CreateLoanDto, ReturnLoanDto
│   │   └── catalog.ts           # Category, Brand, Department, Employee
│   ├── App.tsx                  # Enrutamiento SPA con React Router
│   ├── index.css                # Tailwind CSS y estilos base
│   └── main.tsx                 # Entrada principal
├── vite.config.ts               # Configuración de Vite con Proxy hacia http://localhost:5055
└── package.json
```

---

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo local.
- `npm run build`: Valida tipos con `tsc -b` y compila la aplicación para producción en `dist/`.
- `npm run preview`: Previsualiza el bundle compilado localmente.
