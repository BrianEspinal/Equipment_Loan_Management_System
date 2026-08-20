import React, { useEffect, useState } from 'react';
import {
  Tag,
  Building2,
  Bookmark,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { categoriesApi, brandsApi, departmentsApi } from '../api/catalogApi';
import { Category, Brand, Department } from '../types/catalog';
import { Button } from '../components/common/Button';
import { Input, TextArea } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

type CatalogType = 'CATEGORIES' | 'BRANDS' | 'DEPARTMENTS';

interface GenericCatalogItem {
  id: number;
  name: string;
  description?: string | null;
}

export const CatalogsPage: React.FC = () => {
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<CatalogType>('CATEGORIES');
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GenericCatalogItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<GenericCatalogItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<{ name: string; description: string }>({
    name: '',
    description: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, brandRes, deptRes] = await Promise.all([
        categoriesApi.getAll(),
        brandsApi.getAll(),
        departmentsApi.getAll(),
      ]);

      if (catRes.isSuccess && catRes.data) setCategories(catRes.data);
      if (brandRes.isSuccess && brandRes.data) setBrands(brandRes.data);
      if (deptRes.isSuccess && deptRes.data) setDepartments(deptRes.data);
    } catch (err: any) {
      showToast('error', 'Error al cargar catálogos', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getActiveApi = () => {
    switch (activeTab) {
      case 'CATEGORIES':
        return categoriesApi;
      case 'BRANDS':
        return brandsApi;
      case 'DEPARTMENTS':
        return departmentsApi;
    }
  };

  const getTabInfo = () => {
    switch (activeTab) {
      case 'CATEGORIES':
        return {
          title: 'Categorías de Equipos',
          subtitle: 'Clasifica los tipos de activos (Laptops, Monitores, Periféricos, etc.)',
          singular: 'Categoría',
          data: categories,
          icon: Tag,
        };
      case 'BRANDS':
        return {
          title: 'Marcas de Equipos',
          subtitle: 'Fabricantes de los equipos (Dell, HP, Apple, Lenovo, etc.)',
          singular: 'Marca',
          data: brands,
          icon: Bookmark,
        };
      case 'DEPARTMENTS':
        return {
          title: 'Departamentos de la Empresa',
          subtitle: 'Áreas operativas (IT, RRHH, Finanzas, Ventas, etc.)',
          singular: 'Departamento',
          data: departments,
          icon: Building2,
        };
    }
  };

  const currentTab = getTabInfo();

  const handleOpenCreate = () => {
    setFormData({ name: '', description: '' });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (item: GenericCatalogItem) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description || '' });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const api = getActiveApi();
      const res = await api.create({
        name: formData.name,
        description: formData.description || null,
      });

      if (res.isSuccess) {
        showToast('success', `${currentTab.singular} creada`, formData.name);
        setIsCreateModalOpen(false);
        loadData();
      } else {
        showToast('error', 'Error al crear', res.errors.join(', '));
      }
    } catch (err: any) {
      showToast('error', `Error al crear ${currentTab.singular.toLowerCase()}`, err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      setIsSaving(true);
      const api = getActiveApi();
      const res = await api.update(editingItem.id, {
        id: editingItem.id,
        name: formData.name,
        description: formData.description || null,
      });

      if (res.isSuccess) {
        showToast('success', `${currentTab.singular} actualizada`);
        setEditingItem(null);
        loadData();
      } else {
        showToast('error', 'Error al actualizar', res.errors.join(', '));
      }
    } catch (err: any) {
      showToast('error', `Error al actualizar ${currentTab.singular.toLowerCase()}`, err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;

    try {
      setIsSaving(true);
      const api = getActiveApi();
      const res = await api.delete(deletingItem.id);
      if (res.isSuccess) {
        showToast('success', `${currentTab.singular} eliminada`);
        setDeletingItem(null);
        loadData();
      } else {
        showToast('error', 'No se pudo eliminar el elemento', res.errors.join(', '));
      }
    } catch (err: any) {
      showToast('error', 'Error al eliminar', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando catálogos..." />;
  }

  const TabIcon = currentTab.icon;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Mantenimiento de Catálogos</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configura las clasificaciones base para equipos y departamentos
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreate}
        >
          Agregar {currentTab.singular}
        </Button>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('CATEGORIES')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'CATEGORIES'
              ? 'bg-white text-sky-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          Categorías ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('BRANDS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'BRANDS'
              ? 'bg-white text-sky-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Marcas ({brands.length})
        </button>

        <button
          onClick={() => setActiveTab('DEPARTMENTS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'DEPARTMENTS'
              ? 'bg-white text-sky-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Departamentos ({departments.length})
        </button>
      </div>

      {/* Section Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
            <TabIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{currentTab.title}</h3>
            <p className="text-xs text-slate-500">{currentTab.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      {currentTab.data.length === 0 ? (
        <EmptyState
          title={`No hay ${currentTab.title.toLowerCase()}`}
          description={`Empieza creando el primer registro de ${currentTab.singular.toLowerCase()}.`}
          actionLabel={`Agregar ${currentTab.singular}`}
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">ID</th>
                  <th className="px-6 py-3.5">Nombre</th>
                  <th className="px-6 py-3.5">Descripción</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentTab.data.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      #{item.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {item.description || <span className="italic text-slate-300">Sin descripción</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar"
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

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={`Agregar ${currentTab.singular}`}
        subtitle={`Completa los detalles para la nueva ${currentTab.singular.toLowerCase()}`}
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Nombre"
            placeholder={`Nombre de la ${currentTab.singular.toLowerCase()}`}
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextArea
            label="Descripción (Opcional)"
            placeholder="Detalles o notas informativas..."
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
              Guardar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={`Editar ${currentTab.singular}`}
        subtitle={`ID: #${editingItem?.id}`}
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Nombre"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <TextArea
            label="Descripción (Opcional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingItem(null)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
            >
              Actualizar
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        title={`Eliminar ${currentTab.singular}`}
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p>
              ¿Seguro que deseas eliminar <span className="font-bold">{deletingItem?.name}</span>?
              Si está asociada a equipos o empleados existentes, la eliminación podría no permitirse.
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeletingItem(null)}
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
