import React, { useEffect, useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  Building2,
  Mail,
  BadgeCheck,
} from 'lucide-react';
import { employeesApi, departmentsApi } from '../api/catalogApi';
import { Employee, Department } from '../types/catalog';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export const EmployeesPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    departmentId: number;
  }>({
    employeeCode: '',
    firstName: '',
    lastName: '',
    email: '',
    departmentId: 0,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [empRes, deptRes] = await Promise.all([
        employeesApi.getAll(),
        departmentsApi.getAll(),
      ]);

      if (empRes.isSuccess && empRes.data) setEmployees(empRes.data);
      if (deptRes.isSuccess && deptRes.data) setDepartments(deptRes.data);
    } catch (err: any) {
      showToast('error', 'Error al cargar empleados', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      employeeCode: '',
      firstName: '',
      lastName: '',
      email: '',
      departmentId: departments.length > 0 ? departments[0].id : 0,
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      employeeCode: emp.employeeCode,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      departmentId: emp.departmentId,
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departmentId) {
      showToast('warning', 'Departamento requerido', 'Selecciona un departamento válido.');
      return;
    }

    try {
      setIsSaving(true);
      const res = await employeesApi.create({
        employeeCode: formData.employeeCode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        departmentId: Number(formData.departmentId),
      });

      if (res.isSuccess) {
        showToast('success', 'Empleado creado con éxito', `${formData.firstName} ${formData.lastName}`);
        setIsCreateModalOpen(false);
        loadData();
      } else {
        showToast('error', 'Error al registrar empleado', res.errors.join(', '));
      }
    } catch (err: any) {
      showToast('error', 'Error al crear empleado', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    try {
      setIsSaving(true);
      const res = await employeesApi.update(editingEmployee.id, {
        id: editingEmployee.id,
        employeeCode: formData.employeeCode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        departmentId: Number(formData.departmentId),
      });

      if (res.isSuccess) {
        showToast('success', 'Empleado actualizado con éxito');
        setEditingEmployee(null);
        loadData();
      } else {
        showToast('error', 'Error al actualizar', res.errors.join(', '));
      }
    } catch (err: any) {
      showToast('error', 'Error al actualizar empleado', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;

    try {
      setIsSaving(true);
      const res = await employeesApi.delete(deletingEmployee.id);
      if (res.isSuccess) {
        showToast('success', 'Empleado eliminado con éxito');
        setDeletingEmployee(null);
        loadData();
      } else {
        showToast('error', 'No se pudo eliminar el empleado', res.errors.join(', '));
      }
    } catch (err: any) {
      showToast('error', 'Error al eliminar empleado', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deptMap = useMemo(() => {
    const map = new Map<number, string>();
    departments.forEach((d) => map.set(d.id, d.name));
    return map;
  }, [departments]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept =
        selectedDept === 'ALL' || emp.departmentId.toString() === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [employees, searchQuery, selectedDept]);

  if (loading) {
    return <LoadingSpinner message="Cargando directorio de empleados..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Directorio de Empleados</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administra los colaboradores autorizados para solicitar y recibir equipos
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Nuevo Empleado
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre, código de empleado, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="w-full sm:w-64">
          <Select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="ALL">Todos los Departamentos</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Employees Table */}
      {filteredEmployees.length === 0 ? (
        <EmptyState
          title="No se encontraron empleados"
          description={
            searchQuery || selectedDept !== 'ALL'
              ? 'Prueba modificando tus filtros de búsqueda.'
              : 'Agrega colaboradores para poder asignarles préstamos de equipos.'
          }
          actionLabel="Registrar Empleado"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Colaborador</th>
                  <th className="px-6 py-3.5">Código</th>
                  <th className="px-6 py-3.5">Correo Electrónico</th>
                  <th className="px-6 py-3.5">Departamento</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                          {emp.firstName.charAt(0)}
                          {emp.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {emp.firstName} {emp.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                        <BadgeCheck className="w-3 h-3 text-sky-600" />
                        {emp.employeeCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{emp.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-sky-50 text-sky-700 px-2.5 py-1 rounded-lg border border-sky-100">
                        <Building2 className="w-3.5 h-3.5" />
                        {deptMap.get(emp.departmentId) || `Depto #${emp.departmentId}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar Empleado"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingEmployee(emp)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar Empleado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Employee Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Registrar Nuevo Empleado"
        subtitle="Ingresa los datos personales y asigna un departamento"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Código de Empleado"
            placeholder="EMP-001"
            required
            value={formData.employeeCode}
            onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre(s)"
              placeholder="Juan"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              label="Apellido(s)"
              placeholder="Pérez"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="juan.perez@empresa.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Select
            label="Departamento"
            required
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
          >
            {departments.length === 0 ? (
              <option value="0">⚠️ No hay departamentos creados</option>
            ) : (
              departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))
            )}
          </Select>

          <div className="flex justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Guardar Empleado
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        title="Editar Empleado"
        subtitle={`ID: #${editingEmployee?.id} - ${editingEmployee?.firstName} ${editingEmployee?.lastName}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Código de Empleado"
            required
            value={formData.employeeCode}
            onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre(s)"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              label="Apellido(s)"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <Input
            label="Correo Electrónico"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Select
            label="Departamento"
            required
            value={formData.departmentId}
            onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>

          <div className="flex justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingEmployee(null)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
            >
              Actualizar Empleado
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Employee Modal */}
      <Modal
        isOpen={!!deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
        title="Eliminar Empleado"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p>
              ¿Deseas eliminar al empleado{' '}
              <span className="font-bold">
                {deletingEmployee?.firstName} {deletingEmployee?.lastName}
              </span>{' '}
              ({deletingEmployee?.employeeCode})?
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeletingEmployee(null)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              isLoading={isSaving}
              onClick={handleDeleteConfirm}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
