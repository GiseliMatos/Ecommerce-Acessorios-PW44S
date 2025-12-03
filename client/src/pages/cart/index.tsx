import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/hooks/use-cart";
import { InputNumber } from "primereact/inputnumber";

export const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>
        <div style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderBottom: "1px solid #e0e0e0"
        }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <p style={{ fontSize: "14px", color: "#666" }}>
              <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#e1306c" }}>Home</span>
              {" > "}
              <span>Carrinho</span>
            </p>
          </div>
        </div>

        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "60px 20px",
          textAlign: "center"
        }}>
          <div style={{
            backgroundColor: "#fff",
            padding: "60px 20px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <i className="pi pi-shopping-cart" style={{
              fontSize: "80px",
              color: "#ccc",
              marginBottom: "30px",
              display: "block"
            }} />
            <h2 style={{
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "15px",
              color: "#333"
            }}>
              Seu carrinho está vazio
            </h2>
            <p style={{
              fontSize: "16px",
              color: "#666",
              marginBottom: "30px"
            }}>
              Adicione produtos ao carrinho para continuar comprando
            </p>
            <button
              onClick={() => navigate("/products")}
              style={{
                padding: "15px 40px",
                backgroundColor: "#e1306c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "600",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                letterSpacing: "1px"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#c91e5a"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e1306c"}
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "30px" }}>
      <div style={{
        backgroundColor: "#fff",
        padding: "5px",
        borderBottom: "1px solid #e0e0e0"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p style={{ fontSize: "14px", color: "#666" }}>
            <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#e1306c" }}>Home</span>
            {" > "}
            <span>Carrinho</span>
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "30px",
          textTransform: "uppercase",
          letterSpacing: "2px"
        }}>
          MEU CARRINHO
        </h1>

        <div style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth < 992 ? "1fr" : "2fr 1fr",
          gap: "30px"
        }}>
          <div>
            {items.map(item => (
              <div
                key={item.product.id}
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  display: "flex",
                  gap: "20px",
                  alignItems: "center"
                }}
              >
                <div
                  onClick={() => navigate(`/product/${item.product.id}`)}
                  style={{
                    width: "120px",
                    height: "120px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    flexShrink: 0,
                    cursor: "pointer"
                  }}
                >
                  {item.product.urlImg ? (
                    <img
                      src={item.product.urlImg}
                      alt={item.product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "center"
                      }}
                    />
                  ) : (
                    <i
                      className="pi pi-image"
                      style={{ fontSize: "32px", color: "#ccc" }}
                    />
                  )}
                </div>

                <div style={{ flex: 1, textAlign: "left", marginLeft: "20px"}}>
                  <h3
                    onClick={() => navigate(`/product/${item.product.id}`)}
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "8px",
                      color: "#333",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#e1306c")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
                  >
                    {item.product.name}
                  </h3>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#999",
                      marginBottom: "15px",
                    }}
                  >
                    {item.product.category?.name || "Sem categoria"}
                  </p>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap"
                  }}>
                    {/* Quantidade */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600" }}>Quantidade:</span>
                      <InputNumber
                        value={item.quantity}
                        onValueChange={(e) => updateQuantity(item.product.id!, e.value || 1)}
                        min={1}
                        max={99}
                        showButtons
                        buttonLayout="horizontal"
                        decrementButtonClassName="p-button-secondary"
                        incrementButtonClassName="p-button-secondary"
                        style={{ width: "70px", marginRight: "80px" }}  
                        inputStyle={{ width: "40px" }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: "14px", color: "#666" }}>Preço unitário: </span>
                      <span style={{ fontSize: "16px", fontWeight: "600", color: "#333" }}>
                        {item.product.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL"
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "15px"
                }}>
                  <p style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#e1306c"
                  }}>
                    {(item.product.price * item.quantity).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.product.id!)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#fff",
                      color: "#dc3545",
                      border: "1px solid #dc3545",
                      borderRadius: "4px",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#dc3545";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#fff";
                      e.currentTarget.style.color = "#dc3545";
                    }}
                  >
                    <i className="pi pi-trash" style={{ marginRight: "8px" }} />
                    Remover
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate("/products")}
              style={{
                padding: "15px 30px",
                backgroundColor: "#fff",
                color: "#666",
                border: "2px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                fontWeight: "600",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginTop: "20px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#e1306c";
                e.currentTarget.style.color = "#e1306c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#ddd";
                e.currentTarget.style.color = "#666";
              }}
            >
              <i className="pi pi-arrow-left" style={{ marginRight: "10px" }} />
              Continuar Comprando
            </button>
          </div>

          <div>
            <div style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              position: "sticky",
              top: "20px"
            }}>
              <h2 style={{
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "25px",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                RESUMO DO PEDIDO
              </h2>

              <div style={{
                borderBottom: "1px solid #e0e0e0",
                paddingBottom: "20px",
                marginBottom: "20px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px"
                }}>
                  <span style={{ fontSize: "14px", color: "#666" }}>
                    Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "item" : "itens"})
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "600" }}>
                    {getTotalPrice().toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px"
                }}>
                  <span style={{ fontSize: "14px", color: "#666" }}>Frete</span>
                  <span style={{ fontSize: "14px", color: getTotalPrice() >= 149 ? "#28a745" : "#666" }}>
                    {getTotalPrice() >= 149 ? "GRÁTIS" : "A Calcular"}
                  </span>
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "25px"
              }}>
                <span style={{ fontSize: "18px", fontWeight: "700" }}>Total</span>
                <span style={{ fontSize: "24px", fontWeight: "700", color: "#e1306c" }}>
                  {getTotalPrice().toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  })}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                style={{
                  width: "100%",
                  padding: "18px",
                  backgroundColor: "#C9A063",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  letterSpacing: "1px",
                  marginBottom: "15px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b8904f"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#C9A063"}
              >
                FINALIZAR COMPRA
              </button>

              <div style={{
                backgroundColor: "#f9f9f9",
                padding: "15px",
                borderRadius: "4px",
                fontSize: "12px",
                color: "#666",
                lineHeight: "1.6"
              }}>
                <p style={{ marginBottom: "10px" }}>
                  <i className="pi pi-shield" style={{ marginRight: "8px", color: "#e1306c" }} />
                  Compra 100% segura
                </p>
                <p style={{ marginBottom: "10px" }}>
                  <i className="pi pi-credit-card" style={{ marginRight: "8px", color: "#e1306c" }} />
                  Parcele em até 12x sem juros
                </p>
                <p>
                  <i className="pi pi-sync" style={{ marginRight: "8px", color: "#e1306c" }} />
                  Troca grátis em até 30 dias
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};