import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { EquipmentPage } from './pages/EquipmentPage';
import { LoansPage } from './pages/LoansPage';
import { EmployeesPage } from './pages/EmployeesPage';
import { CatalogsPage } from './pages/CatalogsPage';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/loans" element={<LoansPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/catalogs" element={<CatalogsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
