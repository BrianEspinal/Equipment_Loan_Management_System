import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Laptop,
  ArrowLeftRight,
  CheckCircle2,
  Plus,
  RotateCcw,
  Users,
} from 'lucide-react';
import { equipmentApi } from '../api/equipmentApi';
import { loansApi } from '../api/loansApi';
import { employeesApi } from '../api/catalogApi';
import { LoanDto, ReturnLoanDto } from '../types/loan';
import { EquipmentDto } from '../types/equipment';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { Input, TextArea } from '../components/common/Input';
import { useToast } from '../context/ToastContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [equipmentList, setEquipmentList] = useState<EquipmentDto[]>([]);
  const [activeLoans, setActiveLoans] = useState<LoanDto[]>([]);
  const [allLoans, setAllLoans] = useState<LoanDto[]>([]);
  const [employeeCount, setEmployeeCount] = useState(0);

  // Return modal state
  const [selectedLoanToReturn, setSelectedLoanToReturn] = useState<LoanDto | null>(null);
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const [returnNotes, setReturnNotes] = useState('');
  const [isReturning, setIsReturning] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eqRes, actLoansRes, allLoansRes, empRes] = await Promise.all([
        equipmentApi.getAll(),
        loansApi.getActive(),
        loansApi.getAll(),
        employeesApi.getAll(),
      ]);

      if (eqRes.isSuccess && eqRes.data) setEquipmentList(eqRes.data);
      if (actLoansRes.isSuccess && actLoansRes.data) setActiveLoans(actLoansRes.data);
      if (allLoansRes.isSuccess && allLoansRes.data) setAllLoans(allLoansRes.data);
      if (empRes.isSuccess && empRes.data) setEmployeeCount(empRes.data.length);
    } catch (err: any) {
      showToast('error', 'Error al cargar métricas', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalEquipment = equipmentList.length;
  const availableEquipment = equipmentList.filter(
    (e) => e.status.toLowerCase() === 'available' || e.status.toLowerCase() === 'disponible'
  ).length;

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoanToReturn) return;

    try {
      setIsReturning(true);
      const dto: ReturnLoanDto = {
        actualReturnDate: returnDate ? new Date(returnDate).toISOString() : new Date().toISOString(),
        notes: returnNotes,
      };
      const res = await loansApi.returnLoan(selectedLoanToReturn.id, dto);
      if (res.isSuccess) {
        showToast('success', 'Devolución registrada con éxito', `Equipo ${selectedLoanToReturn.equipmentName} devuelto.`);
        setSelectedLoanToReturn(null);
        setReturnNotes('');
        loadData();
      } else {
        showToast('error', 'No se pudo procesar la devolución', res.errors.join(', '));
      }
    } catch (err: any) {
      showToast('error', 'Error al devolver equipo', err.message);
    } finally {
      setIsReturning(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando resumen del sistema..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-900/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-sky-100 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Sistema en Línea
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Control de Préstamo de Equipos
          </h2>
          <p className="text-sky-100 text-sm max-w-xl">
            Gestiona préstamos, inventario de tecnología y control de asignaciones por empleado en tiempo real.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="bg-white text-slate-800 hover:bg-slate-50 border-none shadow-md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/loans?action=new')}
          >
            Nuevo Préstamo
          </Button>
          <Button
            variant="secondary"
            className="bg-slate-900/60 hover:bg-slate-900/80 text-white backdrop-blur-md border border-white/20 shadow-md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/equipment?action=new')}
          >
            Registrar Equipo
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total de Equipos"
          value={totalEquipment}
          subtitle="En el catálogo de inventario"
          colorScheme="sky"
          icon={<Laptop className="w-6 h-6" />}
        />
        <StatCard
          title="Equipos Disponibles"
          value={availableEquipment}
          subtitle="Listos para ser asignados"
          colorScheme="emerald"
          icon={<CheckCircle2 className="w-6 h-6" />}
        />
        <StatCard
          title="Préstamos Activos"
          value={activeLoans.length}
          subtitle="Equipos actualmente prestados"
          colorScheme="amber"
          icon={<ArrowLeftRight className="w-6 h-6" />}
        />
        <StatCard
          title="Total Empleados"
          value={employeeCount}
          subtitle="Registrados para solicitar equipos"
          colorScheme="indigo"
          icon={<Users className="w-6 h-6" />}
        />
      </div>

      {/* Active Loans Quick View */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Préstamos Activos Recientes</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Equipos actualmente en poder de los colaboradores
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/loans')}
          >
            Ver todos los préstamos ({allLoans.length})
          </Button>
        </div>

        {activeLoans.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2 opacity-80" />
            <p className="text-sm font-semibold text-slate-700">No hay préstamos activos pendientes</p>
            <p className="text-xs text-slate-400 mt-1">Todos los equipos prestados han sido devueltos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Equipo</th>
                  <th className="px-6 py-3.5">Empleado</th>
                  <th className="px-6 py-3.5">Fecha Préstamo</th>
                  <th className="px-6 py-3.5">Fecha Esperada Devolución</th>
                  <th className="px-6 py-3.5">Estado</th>
                  <th className="px-6 py-3.5 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeLoans.slice(0, 5).map((loan) => (
                  <tr key={loan.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>{loan.equipmentName || `Equipo #${loan.equipmentId}`}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700">
                        {loan.employeeName || `Empleado #${loan.employeeId}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(loan.loanDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-700">
                      {new Date(loan.expectedReturnDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={loan.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<RotateCcw className="w-3.5 h-3.5 text-sky-600" />}
                        onClick={() => setSelectedLoanToReturn(loan)}
                      >
                        Devolver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
            placeholder="Estado físico del equipo al ser entregado, accesorios devueltos, etc."
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
              isLoading={isReturning}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Confirmar Devolución
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
