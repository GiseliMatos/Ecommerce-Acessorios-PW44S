import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/hooks/use-cart";
import { useAuth } from "@/context/hooks/use-auth";

export const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      navigate("/login?redirect=/checkout");
    }

    if (items.length === 0) {
      navigate("/cart");
    }
  }, [authenticated, items, navigate]);

  const handleFinalizePurchase = async () => {
    setIsProcessing(true);

    // Simular processamento
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      navigate("/order-success");
    }, 2000);
  };

  if (!authenticated || items.length === 0) {
    return null;
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>
      {/* Breadcrumb */}
      <div style={{
        backgroundColor: "#fff",
        padding: "20px",
        borderBottom: "1px solid #e0e0e0"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <p style={{ fontSize: "14px", color: "#666" }}>
            <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#e1306c" }}>Home</span>
            {" > "}
            <span onClick={() => navigate("/cart")} style={{ cursor: "pointer", color: "#e1306c" }}>Carrinho</span>
            {" > "}
            <span>Finalizar Compra</span>
          </p>
        </div>
      </div>

      {/* Etapas do Checkout */}
      <div style={{
        backgroundColor: "#fff",
        padding: "30px 20px",
        borderBottom: "1px solid #e0e0e0"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px"
          }}>
            {/* Etapa 1 - Carrinho */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#28a745",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600"
              }}>
                <i className="pi pi-check" />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#28a745" }}>Carrinho</span>
            </div>

            <div style={{ width: "60px", height: "2px", backgroundColor: "#e0e0e0" }} />

            {/* Etapa 2 - Identificação */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#28a745",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600"
              }}>
                <i className="pi pi-check" />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#28a745" }}>Identificação</span>
            </div>

            <div style={{ width: "60px", height: "2px", backgroundColor: "#e0e0e0" }} />

            {/* Etapa 3 - Pagamento */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#e1306c",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600"
              }}>
                3
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#e1306c" }}>Pagamento</span>
            </div>

            <div style={{ width: "60px", height: "2px", backgroundColor: "#e0e0e0" }} />

            {/* Etapa 4 - Confirmação */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#ddd",
                color: "#666",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600"
              }}>
                4
              </div>
              <span style={{ fontSize: "14px", color: "#666" }}>Confirmação</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth < 992 ? "1fr" : "2fr 1fr",
          gap: "30px"
        }}>
          {/* Formulário de Pagamento */}
          <div>
            <div style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: "20px"
            }}>
              <h2 style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "25px",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                FORMA DE PAGAMENTO
              </h2>

              {/* Opções de Pagamento */}
              <div style={{ marginBottom: "30px" }}>

                {/* Cartão de Crédito */}
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  cursor: "pointer",
                  gap: "15px"
                }}>
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    style={{ accentColor: "#e1306c" }}
                  />

                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "5px"
                    }}>
                      <i className="pi pi-credit-card" style={{ fontSize: "20px", color: "#e1306c" }} />
                      <span style={{ fontSize: "16px", fontWeight: "600" }}>Cartão de Crédito</span>
                    </div>

                    <p style={{ fontSize: "14px", color: "#666" }}>
                      Parcele em até 12x sem juros
                    </p>
                  </div>
                </label>

                {/* PIX */}
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  cursor: "pointer",
                  gap: "15px"
                }}>
                  <input
                    type="radio"
                    name="payment"
                    style={{ accentColor: "#e1306c" }}
                  />

                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "5px"
                    }}>
                      <i className="pi pi-qrcode" style={{ fontSize: "20px", color: "#e1306c" }} />
                      <span style={{ fontSize: "16px", fontWeight: "600" }}>PIX</span>
                    </div>

                    <p style={{ fontSize: "14px", color: "#666" }}>
                      Ganhe 5% de desconto
                    </p>
                  </div>
                </label>

                {/* Boleto */}
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                  gap: "15px"
                }}>
                  <input
                    type="radio"
                    name="payment"
                    style={{ accentColor: "#e1306c" }}
                  />

                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "5px"
                    }}>
                      <i className="pi pi-money-bill" style={{ fontSize: "20px", color: "#e1306c" }} />
                      <span style={{ fontSize: "16px", fontWeight: "600" }}>Boleto Bancário</span>
                    </div>

                    <p style={{ fontSize: "14px", color: "#666" }}>
                      Vencimento em 3 dias úteis
                    </p>
                  </div>
                </label>

              </div>

            </div>

            {/* Endereço de Entrega */}
            <div style={{
              backgroundColor: "#fff",
              padding: "30px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <h2 style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "25px",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                ENDEREÇO DE ENTREGA
              </h2>

              <div style={{
                padding: "20px",
                border: "2px solid #e1306c",
                borderRadius: "8px",
                backgroundColor: "#fff5f8"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "10px" }}>
                      Endereço Principal
                    </p>
                    <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
                      Rua Exemplo, 123<br />
                      Bairro Centro<br />
                      São Paulo - SP<br />
                      CEP: 01234-567
                    </p>
                  </div>
                  <button style={{
                    padding: "8px 16px",
                    backgroundColor: "#fff",
                    color: "#e1306c",
                    border: "1px solid #e1306c",
                    borderRadius: "4px",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}>
                    Alterar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resumo do Pedido */}
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

              {/* Lista de Produtos */}
              <div style={{
                maxHeight: "300px",
                overflowY: "auto",
                marginBottom: "20px",
                paddingRight: "10px"
              }}>
                {items.map(item => (
                  <div key={item.product.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "15px",
                    paddingBottom: "15px",
                    paddingLeft: "50px",
                    borderBottom: "1px solid #e0e0e0"
                  }}>
                    <div
                      onClick={() => navigate(`/product/${item.product.id}`)}
                      style={{
                        width: "60px",
                        height: "60px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
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
                        <i className="pi pi-image" style={{ fontSize: "20px", color: "#ccc" }} />
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
                        {item.product.name}
                      </p>
                      <p style={{ fontSize: "12px", color: "#666" }}>
                        Qtd: {item.quantity}
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "#e1306c" }}>
                        {(item.product.price * item.quantity).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL"
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totais */}
              <div style={{
                borderTop: "2px solid #e0e0e0",
                paddingTop: "20px",
                marginBottom: "20px"
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "15px"
                }}>
                  <span style={{ fontSize: "14px", color: "#666" }}>Subtotal</span>
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
                  <span style={{ fontSize: "14px", color: "#28a745", fontWeight: "600" }}>
                    GRÁTIS
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "15px",
                  borderTop: "1px solid #e0e0e0"
                }}>
                  <span style={{ fontSize: "18px", fontWeight: "700" }}>Total</span>
                  <span style={{ fontSize: "24px", fontWeight: "700", color: "#e1306c" }}>
                    {getTotalPrice().toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                  </span>
                </div>
              </div>

              {/* Botão Finalizar */}
              <button
                onClick={handleFinalizePurchase}
                disabled={isProcessing}
                style={{
                  width: "100%",
                  padding: "18px",
                  backgroundColor: isProcessing ? "#ccc" : "#C9A063",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s ease",
                  letterSpacing: "1px"
                }}
                onMouseEnter={(e) => {
                  if (!isProcessing) e.currentTarget.style.backgroundColor = "#b8904f";
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing) e.currentTarget.style.backgroundColor = "#C9A063";
                }}
              >
                {isProcessing ? (
                  <>
                    <i className="pi pi-spin pi-spinner" style={{ marginRight: "10px" }} />
                    PROCESSANDO...
                  </>
                ) : (
                  <>
                    <i className="pi pi-check" style={{ marginRight: "10px" }} />
                    FINALIZAR COMPRA
                  </>
                )}
              </button>

              {/* Informações de Segurança */}
              <div style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#f9f9f9",
                borderRadius: "4px",
                fontSize: "12px",
                color: "#666",
                lineHeight: "1.6"
              }}>
                <p style={{ marginBottom: "10px" }}>
                  <i className="pi pi-shield" style={{ marginRight: "8px", color: "#e1306c" }} />
                  Compra 100% segura e protegida
                </p>
                <p>
                  <i className="pi pi-lock" style={{ marginRight: "8px", color: "#e1306c" }} />
                  Seus dados estão criptografados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
