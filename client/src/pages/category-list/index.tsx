import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { ICategory } from "@/commons/types";
import CategoryService from "@/services/category-service";
import { Toast } from "primereact/toast";

export const CategoryListPage = () => {
  const [data, setData] = useState<ICategory[]>([]);
  const { findAll } = CategoryService;
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await findAll();

      if (response.status === 200) {
        setData(Array.isArray(response.data) ? response.data : []);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: response.message || "Não foi possível carregar a lista de categorias.",
          life: 3000,
        });
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar a lista de categorias.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24">
      <Toast ref={toast} />
      <h2 className="text-2xl mb-4">Lista de Categorias</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <DataTable
          value={data}
          stripedRows
          emptyMessage="Nenhuma categoria encontrada."
        >
          <Column field="id" header="ID" style={{ width: "10%" }} />
          <Column field="name" header="Nome" />
        </DataTable>
      )}
    </div>
  );
};
