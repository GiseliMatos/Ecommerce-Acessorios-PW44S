import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { IProduct } from "@/commons/types";
import ProductService from "@/services/product-service";
import { Toast } from "primereact/toast";

export const ProductListPage = () => {
  const [data, setData] = useState<IProduct[]>([]);
  const { findAll } = ProductService;
  const toast = useRef<Toast>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    const response = await findAll();

    if (response.status === 200) {
      setData(Array.isArray(response.data) ? response.data : []);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar a lista de produtos.",
        life: 3000,
      });
    }
  };

  const priceTemplate = (rowData: IProduct) => {
    return rowData.price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="container mx-auto px-4 pt-24">
      <Toast ref={toast} />
      <h2 className="text-2xl mb-4">Lista de Produtos</h2>
      <DataTable value={data} stripedRows emptyMessage="Nenhum produto encontrado.">
        <Column field="id" header="ID" style={{ width: "5%" }} />
        <Column field="name" header="Nome" />
        <Column field="description" header="Descrição" />
        <Column header="Preço" body={priceTemplate} style={{ width: "15%" }} />
        <Column field="category.name" header="Categoria" />
      </DataTable>
    </div>
  );
};
