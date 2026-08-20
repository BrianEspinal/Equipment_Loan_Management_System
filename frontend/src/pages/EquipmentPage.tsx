import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Laptop,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { equipmentApi } from '../api/equipmentApi';
import { categoriesApi, brandsApi } from '../api/catalogApi';
import { EquipmentDto, CreateEquipmentDto, UpdateEquipmentDto } from '../types/equipment';
import { Category, Brand } from '../types/catalog';
import { Button } from '../components/common/Button';
import { Input, Select, TextArea } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

export const EquipmentPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [equipmentList, setEquipmentList] = useState<EquipmentDto[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<EquipmentDto | null>(null);
  const [deletingEquipment, setDeletingEquipment] = useState<EquipmentDto | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState<{
    inventoryCode: string;
    name: string;
    model: string;
    serialNumber: string;
    status: string;
    description: string;
    categoryId: number;
    brandId: number;
  }>({
    inventoryCode: '',
    name: '',
    model: '',
    serialNumber: '',
    status: 'Available',
    description: '',
    categoryId: 0,
    brandId: 0,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [eqRes, catRes, brandRes] = await Promise.all([
        equipmentApi.getAll(),
        categoriesApi.getAll(),
        brandsApi.getAll(),
      ]);

      if (eqRes.isSuccess && eqRes.data) setEquipmentList(eqRes.data);
      if (catRes.isSuccess && catRes.data) setCategories(catRes.data);
      if (brandRes.isSuccess && brandRes.data) setBrands(brandRes.data);
    } catch (err: any) {
      showToast('error', 'Error al cargar inventario', err.message);
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
    setFormData({
      inventoryCode: '',
      name: '',
      model: '',
      serialNumber: '',
      status: 'Available',
      description: '',
      categoryId: categories.length > 0 ? categories[0].id : 0,
      brandId: brands.length > 0 ? brands[0].id : 0,
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (eq: EquipmentDto) => {
    setEditingEquipment(eq);
    setFormData({
      inventoryCode: eq.inventoryCode,
      name: eq.name,
      model: eq.model || '',
      serialNumber: eq.serialNumber || '',
      status: eq.status,
      description: eq.description || '',
      categoryId: eq.categoryId,
      brandId: eq.brandId,
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.brandId) {
      showToast('warning', 'Selecciona categoría y marca', 'Debes registrar al menos una categoría y una marca.');
      return;
    }

    try {
      setIsSaving(true);
      const dto: CreateEquipmentDto = {
        inventoryCode: formData.inventoryCode,
        name: formData.name,
        model: formData.model || null,
        serialNumber: formData.serialNumber || null,
        description: formData.description || null,
        categoryId: Number(formData.categoryId),
        brandId: Number(formData.brandId),
      };

      const res = await equipmentApi.create(dto);
      if (res.isSuccess) {
        showToast('success', 'Equipo registrado con éxito', `Se agregó ${formData.name} al inventario.`);
        setIsCreateModalOpen(false);
        loadData();
      } else {
        showToast('error', 'No se pudo crear el equipo', res.errors.join(', '));
      }
    } catch (err: any) {
      showToast('error', 'Error al crear equipo', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEquipment) return;

    try {
      setIsSaving(true);
      const dto: UpdateEquipmentDto = {
        id: editingEquipment.id,
        inventoryCode: formData.inventoryCode,
        name: formData.name,
        model: formData.model || null,
        serialNumber: formData.serialNumber || null,
        status: formData.status,
        description: formData.description || null,
        categoryId: Number(formData.categoryId),
        brandId: Number(formData.brandId),
      };

      const res = await equipmentApi.update(editingEquipment.id, dto);
      if (res.isSuccess) {
        showToast('success', 'Equipo actualizado con éxito');
        setEditingEquipment(null);
        loadData();
      } else {
        showToast('error', 'Error al actualizar', res.errors.join(', '));
      }
    } catch (err: any) {
      showToast('error', 'Error al actualizar equipo', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEquipment) return;

    try {
      setIsSaving(true);
      const res = await equipmentApi.delete(deletingEquipment.id);
      if (res.isSuccess) {
        showToast('success', 'Equipo eliminado correctamente');
        setDeletingEquipment(null);
        loadData();
      } else {
        showToast('error', 'No se pudo eliminar el equipo', res.errors.join(', '));
      }
    } catch (err: any) {
      showToast('error', 'Error al eliminar equipo', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered Equipment list
  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.inventoryCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.model && item.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.serialNumber && item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        selectedCategory === 'ALL' || item.categoryId.toString() === selectedCategory;

      const matchesBrand =
        selectedBrand === 'ALL' || item.brandId.toString() === selectedBrand;

      const matchesStatus =
        selectedStatus === 'ALL' || item.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCat && matchesBrand && matchesStatus;
    });
  }, [equipmentList, searchQuery, selectedCategory, selectedBrand, selectedStatus]);

  if (loading) {
    return <LoadingSpinner message="Cargando inventario de equipos..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Inventario de Equipos</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Consulta, registra y administra los activos tecnológicos de la empresa
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Registrar Equipo
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nombre, código de inventario, modelo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <Select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="ALL">Todas las Marcas</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">Todos los Estados</option>
            <option value="Available">Disponible</option>
            <option value="Loaned">Prestado</option>
            <option value="Maintenance">Mantenimiento</option>
          </Select>
        </div>
      </div>

      {/* Equipment Table */}
      {filteredEquipment.length === 0 ? (
        <EmptyState
          title="No se encontraron equipos"
          description={
            searchQuery || selectedCategory !== 'ALL' || selectedBrand !== 'ALL' || selectedStatus !== 'ALL'
              ? 'Intenta ajustar tus criterios de búsqueda o filtros.'
              : 'Empieza agregando un nuevo equipo a la base de datos.'
          }
          actionLabel="Registrar Equipo"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Código / Nombre</th>
                  <th className="px-6 py-3.5">Categoría</th>
                  <th className="px-6 py-3.5">Marca / Modelo</th>
                  <th className="px-6 py-3.5">No. Serie</th>
                  <th className="px-6 py-3.5">Estado</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEquipment.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                          <Laptop className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{eq.name}</p>
                          <p className="text-xs text-slate-400 font-mono">{eq.inventoryCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        {eq.categoryName || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-semibold text-slate-800">{eq.brandName || 'S/M'}</p>
                      <p className="text-xs text-slate-400">{eq.model || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                      {eq.serialNumber || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={eq.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(eq)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar Equipo"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingEquipment(eq)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar Equipo"
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
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500 flex justify-between items-center">
            <span>Total de equipos mostrados: {filteredEquipment.length}</span>
            <span>Total en inventario: {equipmentList.length}</span>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Registrar Nuevo Equipo"
        subtitle="Ingresa la información básica y el identificador de inventario"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Código de Inventario"
              placeholder="EQ-2026-001"
              required
              value={formData.inventoryCode}
              onChange={(e) => setFormData({ ...formData, inventoryCode: e.target.value })}
            />
            <Input
              label="Nombre del Equipo"
              placeholder="Laptop Dell Latitude"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Categoría"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
            >
              {categories.length === 0 ? (
                <option value="0">No hay categorías registradas</option>
              ) : (
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              )}
            </Select>

            <Select
              label="Marca"
              required
              value={formData.brandId}
              onChange={(e) => setFormData({ ...formData, brandId: Number(e.target.value) })}
            >
              {brands.length === 0 ? (
                <option value="0">No hay marcas registradas</option>
              ) : (
                brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))
              )}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Modelo"
              placeholder="Latitude 5420"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
            <Input
              label="Número de Serie"
              placeholder="SN-987654321"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            />
          </div>

          <TextArea
            label="Descripción / Observaciones"
            placeholder="Detalles de hardware, condición, accesorios..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Guardar Equipo
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingEquipment}
        onClose={() => setEditingEquipment(null)}
        title="Editar Información de Equipo"
        subtitle={`ID: #${editingEquipment?.id} - ${editingEquipment?.name}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Código de Inventario"
              required
              value={formData.inventoryCode}
              onChange={(e) => setFormData({ ...formData, inventoryCode: e.target.value })}
            />
            <Input
              label="Nombre del Equipo"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Categoría"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>

            <Select
              label="Marca"
              required
              value={formData.brandId}
              onChange={(e) => setFormData({ ...formData, brandId: Number(e.target.value) })}
            >
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>

            <Select
              label="Estado"
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Available">Disponible</option>
              <option value="Loaned">Prestado</option>
              <option value="Maintenance">Mantenimiento</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Modelo"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
            <Input
              label="Número de Serie"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
            />
          </div>

          <TextArea
            label="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingEquipment(null)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
            >
              Actualizar Equipo
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingEquipment}
        onClose={() => setDeletingEquipment(null)}
        title="Eliminar Equipo"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p>
              ¿Estás seguro de que deseas eliminar el equipo{' '}
              <span className="font-bold">{deletingEquipment?.name}</span> (Código:{' '}
              <span className="font-mono">{deletingEquipment?.inventoryCode}</span>)?
              Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeletingEquipment(null)}
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
