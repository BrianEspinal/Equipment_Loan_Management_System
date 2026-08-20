import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Search,
  RotateCcw,
  User,
  Laptop,
  FileText,
} from 'lucide-react';
import { loansApi } from '../api/loansApi';
import { equipmentApi } from '../api/equipmentApi';
import { employeesApi } from '../api/catalogApi';
import { LoanDto, CreateLoanDto, ReturnLoanDto } from '../types/loan';
import { EquipmentDto } from '../types/equipment';
import { Employee } from '../types/catalog';
import { Button } from '../components/common/Button';
import { Input, Select, TextArea } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export const LoansPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState<LoanDto[]>([]);
  const [availableEquipment, setAvailableEquipment] = useState<EquipmentDto[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Filter & Search
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'ALL'>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLoanToReturn, setSelectedLoanToReturn] = useState<LoanDto | null>(null);
  const [selectedLoanDetails, setSelectedLoanDetails] = useState<LoanDto | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // New Loan Form
  const [createForm, setCreateForm] = useState<{
    equipmentId: number;
    employeeId: number;
    expectedReturnDate: string;
    notes: string;
  }>({
    equipmentId: 0,
    employeeId: 0,
    expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    notes: '',
  });

  // Return Form
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnNotes, setReturnNotes] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [loansRes, availEqRes, empRes] = await Promise.all([
        loansApi.getAll(),
        equipmentApi.getAvailable(),
        employeesApi.getAll(),
      ]);

      if (loansRes.isSuccess && loansRes.data) setLoans(loansRes.data);
      if (availEqRes.isSuccess && availEqRes.data) setAvailableEquipment(availEqRes.data);
      if (empRes.isSuccess && empRes.data) setEmployees(empRes.data);
    } catch (err: any) {
      showToast('error', 'Error al cargar préstamos', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle URL action=new param
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenCreate();
      setSearchParams({});
    }
  }, [searchParams]);

  const handleOpenCreate = () => {
    setCreateForm({
      equipmentId: availableEquipment.length > 0 ? availableEquipment[0].id : 0,
      employeeId: employees.length > 0 ? employees[0].id : 0,
      expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.equipmentId || !createForm.employeeId) {
      showToast('warning', 'Campos requeridos', 'Debes seleccionar un equipo disponible y un empleado.');
      return;
    }

    try {
      setIsSaving(true);
      const dto: CreateLoanDto = {
        equipmentId: Number(createForm.equipmentId),
        employeeId: Number(createForm.employeeId),
        expectedReturnDate: new Date(createForm.expectedReturnDate).toISOString(),
        notes: createForm.notes || null,
      };

      const res = await loansApi.create(dto);
      if (res.isSuccess) {
        showToast('success', 'Préstamo creado con éxito', 'El equipo ahora figura como prestado.');
        setIsCreateModalOpen(false);
        loadData();
      } else {
        showToast('error', 'Error al registrar préstamo', res.errors.join(', '));
      }
    } catch (err: any) {
      showToast('error', 'Error al crear préstamo', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanToReturn) return;

    try {
      setIsSaving(true);
      const dto: ReturnLoanDto = {
        actualReturnDate: returnDate ? new Date(returnDate).toISOString() : new Date().toISOString(),
        notes: returnNotes || null,
      };

      const res = await loansApi.returnLoan(selectedLoanToReturn.id, dto);
      if (res.isSuccess) {
        showToast('success', 'Devolución confirmada', 'El equipo ha quedado disponible para nuevos préstamos.');
        setSelectedLoanToReturn(null);
        setReturnNotes('');
        loadData();
      } else {
        showToast('error', 'Error al procesar devolución', res.errors.join(', '));
      }
    } catch (err: any) {
      showToast('error', 'Error al devolver préstamo', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const isStatusActive = loan.status.toLowerCase() === 'active' || loan.status.toLowerCase() === 'activo';
      const matchesTab = activeTab === 'ALL' || (activeTab === 'ACTIVE' && isStatusActive);

      const matchesSearch =
        loan.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (loan.notes && loan.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTab && matchesSearch;
    });
  }, [loans, activeTab, searchQuery]);

  if (loading) {
    return <LoadingSpinner message="Cargando préstamos..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Control de Préstamos</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Asigna equipos tecnológicos a colaboradores y registra devoluciones
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Nuevo Préstamo
        </Button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ACTIVE'
                ? 'bg-white text-sky-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Préstamos Activos ({loans.filter((l) => l.status.toLowerCase() === 'active' || l.status.toLowerCase() === 'activo').length})
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-white text-sky-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Historial Completo ({loans.length})
          </button>
        </div>

        <div className="w-full md:w-80">
          <Input
            placeholder="Buscar por equipo, empleado o notas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Loans Table */}
      {filteredLoans.length === 0 ? (
        <EmptyState
          title={activeTab === 'ACTIVE' ? 'No hay préstamos activos' : 'No se encontraron préstamos'}
          description={
            searchQuery
              ? 'No hay registros que coincidan con los términos de búsqueda.'
              : activeTab === 'ACTIVE'
              ? 'Todos los equipos asignados han sido devueltos a almacén.'
              : 'Empieza creando el primer préstamo en la plataforma.'
          }
          actionLabel="Nuevo Préstamo"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">ID / Equipo</th>
                  <th className="px-6 py-3.5">Empleado</th>
                  <th className="px-6 py-3.5">Fecha Préstamo</th>
                  <th className="px-6 py-3.5">Fecha Esperada</th>
                  <th className="px-6 py-3.5">Fecha Devolución</th>
                  <th className="px-6 py-3.5">Estado</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLoans.map((loan) => {
                  const isActive = loan.status.toLowerCase() === 'active' || loan.status.toLowerCase() === 'activo';
                  return (
                    <tr key={loan.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                            <Laptop className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{loan.equipmentName || `Equipo #${loan.equipmentId}`}</p>
                            <p className="text-xs text-slate-400 font-mono">Préstamo #{loan.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-700">
                            {loan.employeeName || `Empleado #${loan.employeeId}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(loan.loanDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">
                        {new Date(loan.expectedReturnDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {loan.actualReturnDate
                          ? new Date(loan.actualReturnDate).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={loan.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedLoanDetails(loan)}
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            title="Ver detalles"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          {isActive && (
                            <Button
                              size="sm"
                              variant="outline"
                              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-sky-600" />}
                              onClick={() => {
                                setSelectedLoanToReturn(loan);
                                setReturnDate(new Date().toISOString().split('T')[0]);
                                setReturnNotes('');
                              }}
                            >
                              Devolver
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Loan Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Préstamo de Equipo"
        subtitle="Selecciona un equipo disponible y el colaborador asignado"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Select
            label="Equipo Disponible"
            required
            value={createForm.equipmentId}
            onChange={(e) => setCreateForm({ ...createForm, equipmentId: Number(e.target.value) })}
          >
            {availableEquipment.length === 0 ? (
              <option value="0">⚠️ No hay equipos disponibles actualmente</option>
            ) : (
              availableEquipment.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} ({eq.inventoryCode}) - {eq.brandName || ''} {eq.model || ''}
                </option>
              ))
            )}
          </Select>

          <Select
            label="Empleado Solicitante"
            required
            value={createForm.employeeId}
            onChange={(e) => setCreateForm({ ...createForm, employeeId: Number(e.target.value) })}
          >
            {employees.length === 0 ? (
              <option value="0">⚠️ No hay empleados registrados</option>
            ) : (
              employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeCode})
                </option>
              ))
            )}
          </Select>

          <Input
            label="Fecha Estimada de Devolución"
            type="date"
            required
            value={createForm.expectedReturnDate}
            onChange={(e) => setCreateForm({ ...createForm, expectedReturnDate: e.target.value })}
          />

          <TextArea
            label="Notas / Motivo del Préstamo (Opcional)"
            placeholder="Ej: Asignado para proyecto de trabajo remoto durante 2 semanas..."
            value={createForm.notes}
            onChange={(e) => setCreateForm({ ...createForm, notes: e.target.value })}
          />

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
              disabled={availableEquipment.length === 0 || employees.length === 0}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Confirmar Préstamo
            </Button>
          </div>
        </form>
      </Modal>

      {/* Return Loan Modal */}
      <Modal
        isOpen={!!selectedLoanToReturn}
        onClose={() => setSelectedLoanToReturn(null)}
        title="Registrar Devolución de Equipo"
        subtitle={`Préstamo #${selectedLoanToReturn?.id} - ${selectedLoanToReturn?.equipmentName}`}
      >
        <form onSubmit={handleReturnSubmit} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-800 space-y-1">
            <p><span className="font-semibold">Empleado:</span> {selectedLoanToReturn?.employeeName}</p>
            <p><span className="font-semibold">Equipo:</span> {selectedLoanToReturn?.equipmentName}</p>
            <p>
              <span className="font-semibold">Fecha Préstamo:</span>{' '}
              {selectedLoanToReturn && new Date(selectedLoanToReturn.loanDate).toLocaleDateString()}
            </p>
          </div>

          <Input
            label="Fecha Real de Devolución"
            type="date"
            required
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />

          <TextArea
            label="Notas / Observaciones de Devolución"
            placeholder="Detalles sobre el estado físico al recibirlo..."
            value={returnNotes}
            onChange={(e) => setReturnNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedLoanToReturn(null)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Confirmar Devolución
            </Button>
          </div>
        </form>
      </Modal>

      {/* Loan Details Modal */}
      <Modal
        isOpen={!!selectedLoanDetails}
        onClose={() => setSelectedLoanDetails(null)}
        title="Detalles del Préstamo"
        subtitle={`Registro #${selectedLoanDetails?.id}`}
      >
        <div className="space-y-4 text-sm text-slate-700">
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Equipo</p>
              <p className="font-bold text-slate-800 mt-0.5">{selectedLoanDetails?.equipmentName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Empleado</p>
              <p className="font-bold text-slate-800 mt-0.5">{selectedLoanDetails?.employeeName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Fecha Inicio</p>
              <p className="mt-0.5">{selectedLoanDetails && new Date(selectedLoanDetails.loanDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Fecha Esperada</p>
              <p className="mt-0.5">{selectedLoanDetails && new Date(selectedLoanDetails.expectedReturnDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Fecha Real Devolución</p>
              <p className="mt-0.5">
                {selectedLoanDetails?.actualReturnDate
                  ? new Date(selectedLoanDetails.actualReturnDate).toLocaleDateString()
                  : 'Pendiente'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Estado</p>
              <div className="mt-0.5">
                {selectedLoanDetails && <StatusBadge status={selectedLoanDetails.status} />}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Notas / Observaciones</p>
            <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-xs italic">
              {selectedLoanDetails?.notes || 'Sin observaciones registradas.'}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setSelectedLoanDetails(null)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
