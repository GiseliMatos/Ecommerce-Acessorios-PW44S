import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import type { IProduct, ICategory } from "@/commons/types";
import ProductService from "@/services/product-service";
import CategoryService from "@/services/category-service";
import { Toast } from "primereact/toast";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";

export const ProductListPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [sortOrder, setSortOrder] = useState<string>("recent");
  const [first, setFirst] = useState(0);
  const [rows] = useState(12);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();

  // Quando entrar pela URL /products/category/xx → já pré-seleciona
  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(Number(categoryId));
    }
  }, [categoryId]);

  // Carrega produtos e categorias quando mudar selectedCategory
  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  // Reaplica ordenação e busca sempre que produtos ou sortOrder mudar
  useEffect(() => {
    filterAndSortProducts();
  }, [products, sortOrder, searchParams]);

  const loadData = async () => {
    try {
      // Carrega categorias
      const categoriesResponse = await CategoryService.findAll();
      if (categoriesResponse.status === 200) {
        setCategories(
          Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []
        );
      }

      // Carrega produtos filtrados POR CATEGORIA ou todos
      let productsResponse;

      if (selectedCategory !== null) {
        productsResponse = await ProductService.findByCategory(selectedCategory);
      } else {
        productsResponse = await ProductService.findAll();
      }

      if (productsResponse.status === 200) {
        setProducts(
          Array.isArray(productsResponse.data)
            ? productsResponse.data
            : []
        );
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar os dados.",
        life: 3000,
      });
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Filtro de busca por nome
    const searchTerm = searchParams.get("search");
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenação
    switch (sortOrder) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
    setFirst(0);
  };

  const onPageChange = (event: any) => {
    setFirst(event.first);
  };

  const paginatedProducts = filteredProducts.slice(first, first + rows);

  const sortOptions = [
    { label: "Mais Recentes", value: "recent" },
    { label: "Menor Preço", value: "price-asc" },
    { label: "Maior Preço", value: "price-desc" },
    { label: "Nome A-Z", value: "name" }
  ];

  const searchTerm = searchParams.get("search");

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>
      <Toast ref={toast} />

      {/* BREADCRUMB */}
      <div style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderBottom: "1px solid #e0e0e0"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p style={{ fontSize: "14px", color: "#666" }}>
            <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#e1306c" }}>Home</span>
            {" > "}
            <span>Produtos</span>
            {searchTerm && (
              <>
                {" > "}
                <span>Busca: "{searchTerm}"</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ display: "flex", gap: "30px" }}>

          {/* SIDEBAR */}
          <aside style={{
            width: "280px",
            flexShrink: 0,
            display: window.innerWidth < 768 ? "none" : "block"
          }}>
            <div style={{
              backgroundColor: "#fff",
              padding: "25px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "20px",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>FILTROS</h3>

              {/* CATEGORIAS */}
              <div style={{ marginBottom: "30px" }}>
                <h4 style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  marginBottom: "15px",
                  textTransform: "uppercase",
                  color: "#666"
                }}>CATEGORIA</h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === null}
                      onChange={() => {
                        setSelectedCategory(null);
                        navigate("/products");
                      }}
                      style={{ marginRight: "10px", accentColor: "#e1306c" }}
                    />
                    Todas
                  </label>

                  {categories.map(category => (
                    <label key={category.id} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => {
                          setSelectedCategory(category.id || null);
                          navigate(`/products/category/${category.id}`);
                        }}
                        style={{ marginRight: "10px", accentColor: "#e1306c" }}
                      />
                      {category.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* LIMPAR FILTROS */}
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSortOrder("recent");
                  navigate("/products");
                }}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#fff",
                  border: "2px solid #e1306c",
                  color: "#e1306c",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "all 0.3s ease"
                }}
              >
                Limpar Filtros
              </button>
            </div>
          </aside>

          {/* ÁREA PRINCIPAL */}
          <div style={{ flex: 1 }}>

            {/* TOP BAR */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
              flexWrap: "wrap",
              gap: "15px"
            }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", textTransform: "uppercase" }}>
                {searchTerm ? `RESULTADOS PARA "${searchTerm}"` : "PRODUTOS"}
                <span style={{ fontSize: "16px", color: "#666", marginLeft: "10px" }}>
                  ({filteredProducts.length} {filteredProducts.length === 1 ? "item" : "itens"})
                </span>
              </h2>

              <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>

                {/* VISUALIZAÇÃO */}
                <div style={{ display: "flex", gap: "5px" }}>
                  <button
                    onClick={() => setViewMode("grid")}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: viewMode === "grid" ? "#e1306c" : "#fff",
                      color: viewMode === "grid" ? "#fff" : "#666",
                      border: "1px solid #ddd",
                      borderRadius: "4px 0 0 4px",
                      cursor: "pointer"
                    }}
                  >
                    <i className="pi pi-th-large" />
                  </button>

                  <button
                    onClick={() => setViewMode("list")}
                    style={{
                      padding: "8px 12px",
                      backgroundColor: viewMode === "list" ? "#e1306c" : "#fff",
                      color: viewMode === "list" ? "#fff" : "#666",
                      border: "1px solid #ddd",
                      borderRadius: "0 4px 4px 0",
                      cursor: "pointer"
                    }}
                  >
                    <i className="pi pi-list" />
                  </button>
                </div>

                {/* ORDENAR */}
                <Dropdown
                  value={sortOrder}
                  options={sortOptions}
                  onChange={(e) => setSortOrder(e.value)}
                  placeholder="Ordenar por"
                  style={{ width: "200px" }}
                />
              </div>
            </div>

            {/* GRID / LISTA */}
            {paginatedProducts.length === 0 ? (
              <div style={{
                backgroundColor: "#fff",
                padding: "60px 20px",
                textAlign: "center",
                borderRadius: "8px"
              }}>
                <i className="pi pi-inbox" style={{ fontSize: "48px", color: "#ccc", marginBottom: "20px" }} />
                <p style={{ fontSize: "18px", color: "#666" }}>
                  {searchTerm ? `Nenhum produto encontrado para "${searchTerm}".` : "Nenhum produto encontrado."}
                </p>
              </div>
            ) : (
              <>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: viewMode === "grid"
                    ? "repeat(auto-fill, minmax(280px, 1fr))"
                    : "1fr",
                  gap: "20px",
                  marginBottom: "40px"
                }}>
                  {paginatedProducts.map(product => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        display: viewMode === "list" ? "flex" : "block"
                      }}
                    >
                      {/* IMAGEM */}
                      <div style={{
                        width: viewMode === "list" ? "200px" : "100%",
                        height: viewMode === "list" ? "200px" : "280px",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        {product.urlImg ? (
                          <img
                            src={product.urlImg}
                            alt={product.name}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          />
                        ) : (
                          <i className="pi pi-image" style={{ fontSize: "48px", color: "#ccc" }} />
                        )}
                      </div>

                      {/* INFO */}
                      <div style={{ padding: "20px", flex: 1 }}>
                        <p style={{
                          fontSize: "12px",
                          color: "#999",
                          textTransform: "uppercase",
                          marginBottom: "8px"
                        }}>
                          {product.category?.name || "Sem categoria"}
                        </p>

                        <h3 style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          marginBottom: "8px",
                          color: "#333",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {product.name}
                        </h3>

                        {viewMode === "list" && product.description && (
                          <p style={{
                            fontSize: "14px",
                            color: "#666",
                            marginBottom: "12px",
                            lineHeight: "1.5"
                          }}>
                            {product.description.substring(0, 150)}
                            {product.description.length > 150 ? "..." : ""}
                          </p>
                        )}

                        <p style={{
                          fontSize: "24px",
                          fontWeight: "700",
                          color: "#e1306c",
                          marginBottom: "15px"
                        }}>
                          {product.price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                          })}
                        </p>

                        <button
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#C9A063",
                            color: "#fff",
                            border: "none",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            borderRadius: "4px",
                            transition: "background-color 0.3s"
                          }}
                        >
                          ADICIONAR AO CARRINHO
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PAGINAÇÃO */}
                {filteredProducts.length > rows && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Paginator
                      first={first}
                      rows={rows}
                      totalRecords={filteredProducts.length}
                      onPageChange={onPageChange}
                      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                    />
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
