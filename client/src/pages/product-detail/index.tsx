import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { IProduct } from "@/commons/types";
import ProductService from "@/services/product-service";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { useCart } from "@/context/hooks/use-cart";

export const ProductDetailPage = () => {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      loadProduct(parseInt(id));
    }
  }, [id]);

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true);
      const response = await ProductService.findById(productId);

      if (response.status === 200 && response.data) {
        setProduct(response.data as IProduct);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Produto não encontrado.",
          life: 3000,
        });
        navigate("/products");
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar o produto.",
        life: 3000,
      });
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: `${quantity} ${quantity === 1 ? "item adicionado" : "itens adicionados"} ao carrinho!`,
        life: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5"
      }}>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: "48px", color: "#e1306c" }} />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>
      <Toast ref={toast} />

      {/* Breadcrumb */}
      <div style={{
        backgroundColor: "#fff",
        padding: "5px",
        borderBottom: "1px solid #e0e0e0"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p style={{ fontSize: "14px", color: "#666" }}>
            <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#e1306c" }}>Home</span>
            {" > "}
            <span onClick={() => navigate("/products")} style={{ cursor: "pointer", color: "#e1306c" }}>Produtos</span>
            {" > "}
            <span>{product.name}</span>
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "1fr 1fr",
          gap: "40px",
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          {/* Imagem do Produto */}
          <div>
            <div
              style={{
                width: "100%",
                height: "500px",
                backgroundColor: "#fff",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                overflow: "hidden"
              }}
            >
              {product.urlImg ? (
                <img
                  src={product.urlImg}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain" // não corta a imagem
                  }}
                />
              ) : (
                <i className="pi pi-image" style={{ fontSize: "80px", color: "#ccc" }} />
              )}
            </div>


            {/* Miniaturas (placeholder) */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px"
            }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  height: "100px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "2px solid transparent",
                  transition: "border-color 0.3s ease"
                }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#e1306c"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}>
                  <i className="pi pi-image" style={{ fontSize: "24px", color: "#ccc" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Informações do Produto */}
          <div>
            {/* Categoria */}
            <p style={{
              fontSize: "14px",
              color: "#999",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>
              {product.category?.name || "Sem categoria"}
            </p>

            {/* Nome */}
            <h1 style={{
              fontSize: "32px",
              fontWeight: "700",
              marginBottom: "20px",
              color: "#333",
              lineHeight: "1.2"
            }}>
              {product.name}
            </h1>

            {/* Preço */}
            <div style={{
              padding: "20px 0",
              borderTop: "1px solid #e0e0e0",
              borderBottom: "1px solid #e0e0e0",
              marginBottom: "30px"
            }}>
              <p style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#e1306c",
                marginBottom: "10px"
              }}>
                {product.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })}
              </p>
              <p style={{
                fontSize: "14px",
                color: "#666"
              }}>
                ou 12x de {(product.price / 12).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL"
                })} sem juros
              </p>
            </div>

            {/* Descrição */}
            {product.description && (
              <div style={{ marginBottom: "30px" }}>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "15px",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  Descrição
                </h3>
                <p style={{
                  fontSize: "16px",
                  color: "#666",
                  lineHeight: "1.8"
                }}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantidade */}
            <div style={{ marginBottom: "30px" }}>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                Quantidade
              </label>
              <InputNumber
                value={quantity}
                onValueChange={(e) => setQuantity(e.value || 1)}
                min={1}
                max={99}
                showButtons
                buttonLayout="horizontal"
                decrementButtonClassName="p-button-secondary"
                incrementButtonClassName="p-button-secondary"
                style={{ width: "70px", marginRight: "80px" }}           // largura do componente
                inputStyle={{ width: "40px" }}
              />
            </div>

            {/* Botões de Ação */}
            <div style={{
              display: "flex",
              gap: "15px",
              marginBottom: "30px",
              flexWrap: "wrap"
            }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  minWidth: "200px",
                  padding: "18px 30px",
                  backgroundColor: "#C9A063",
                  color: "#fff",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.3s ease",
                  letterSpacing: "1px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b8904f"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#C9A063"}
              >
                <i className="pi pi-shopping-cart" style={{ marginRight: "10px" }} />
                ADICIONAR AO CARRINHO
              </button>

              <button
                style={{
                  padding: "18px 30px",
                  backgroundColor: "#fff",
                  color: "#e1306c",
                  border: "2px solid #e1306c",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e1306c";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.color = "#e1306c";
                }}
              >
                <i className="pi pi-heart" />
              </button>
            </div>

            {/* Informações Adicionais */}
            <div style={{
              backgroundColor: "#f9f9f9",
              padding: "20px",
              borderRadius: "8px"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px"
              }}>
                <i className="pi pi-truck" style={{ fontSize: "24px", color: "#e1306c", marginRight: "15px" }} />
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
                    Frete Grátis
                  </p>
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    Para compras acima de R$ 149,00
                  </p>
                </div>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px"
              }}>
                <i className="pi pi-sync" style={{ fontSize: "24px", color: "#e1306c", marginRight: "15px" }} />
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
                    Troca Grátis
                  </p>
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    Até 30 dias após a compra
                  </p>
                </div>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center"
              }}>
                <i className="pi pi-shield" style={{ fontSize: "24px", color: "#e1306c", marginRight: "15px" }} />
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
                    Compra Segura
                  </p>
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    Seus dados estão protegidos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        <div style={{ marginTop: "60px" }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "30px",
            textTransform: "uppercase",
            letterSpacing: "2px",
            textAlign: "center"
          }}>
            VOCÊ TAMBÉM PODE GOSTAR
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px"
          }}>
            {/* Placeholder para produtos relacionados */}
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "transform 0.3s ease"
              }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{
                  width: "100%",
                  height: "280px",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <i className="pi pi-image" style={{ fontSize: "48px", color: "#ccc" }} />
                </div>
                <div style={{ padding: "20px" }}>
                  <p style={{ fontSize: "12px", color: "#999", marginBottom: "8px" }}>
                    CATEGORIA
                  </p>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
                    Produto Relacionado {i}
                  </h3>
                  <p style={{ fontSize: "20px", fontWeight: "700", color: "#e1306c" }}>
                    R$ 99,90
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
