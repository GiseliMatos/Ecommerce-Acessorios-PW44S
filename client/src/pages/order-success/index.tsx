import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OrderService, { type IOrder } from "@/services/order-service";

export const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    
    if (!orderId) {
      navigate("/");
      return;
    }

    loadOrder();
  }, [searchParams, navigate]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await OrderService.findAllByAuthenticatedUser();
      if (response.status === 200 && response.data.length > 0) {
        const lastOrder = response.data[response.data.length - 1];
        setOrder(lastOrder);
      }
    } catch (error) {
      console.error("Erro ao carregar pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentLabel = (formaPagamento: string) => {
    switch (formaPagamento) {
      case "credit": return "Cartão de Crédito";
      case "pix": return "PIX";
      case "boleto": return "Boleto Bancário";
      default: return formaPagamento;
    }
  };

  const getShippingLabel = (formaEntrega: string) => {
    switch (formaEntrega) {
      case "standard": return "Padrão (10-15 dias)";
      case "express": return "Expresso (até 5 dias)";
      case "pickup": return "Retirar na Loja";
      default: return formaEntrega;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh" 
      }}>
        <i className="pi pi-spin pi-spinner" style={{ fontSize: "3rem" }} />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "60px 20px",
        textAlign: "center"
      }}>
        <div style={{
          backgroundColor: "#fff",
          padding: "60px 40px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          {/* Ícone de Sucesso */}
          <div style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "#28a745",
            margin: "0 auto 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <i className="pi pi-check" style={{ fontSize: "50px", color: "#fff" }} />
          </div>

          <h1 style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "20px",
            color: "#333"
          }}>
            Pedido Realizado com Sucesso!
          </h1>

          <p style={{
            fontSize: "18px",
            color: "#666",
            marginBottom: "30px",
            lineHeight: "1.6"
          }}>
            Seu pedido foi confirmado e está sendo processado.<br />
            Em breve você receberá um e-mail com os detalhes.
          </p>

          {/* Informações do Pedido */}
          {order && (
            <div style={{
              backgroundColor: "#f9f9f9",
              padding: "30px",
              borderRadius: "8px",
              marginBottom: "30px",
              textAlign: "left"
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "20px",
                textAlign: "center"
              }}>
                Informações do Pedido
              </h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "1fr 1fr",
                gap: "20px"
              }}>
                <div>
                  <p style={{ fontSize: "14px", color: "#999", marginBottom: "5px" }}>
                    Número do Pedido
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600" }}>
                    #{order.id}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "14px", color: "#999", marginBottom: "5px" }}>
                    Data
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600" }}>
                    {order.dateOrder ? new Date(order.dateOrder).toLocaleDateString("pt-BR") : new Date().toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "14px", color: "#999", marginBottom: "5px" }}>
                    Forma de Pagamento
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600" }}>
                    {getPaymentLabel(order.formaPagamento)}
                  </p>
                </div>

                <div>
                  <p style={{ fontSize: "14px", color: "#999", marginBottom: "5px" }}>
                    Forma de Entrega
                  </p>
                  <p style={{ fontSize: "16px", fontWeight: "600" }}>
                    {getShippingLabel(order.formaEntrega)}
                  </p>
                </div>

                <div style={{ gridColumn: window.innerWidth < 768 ? "1" : "1 / -1" }}>
                  <p style={{ fontSize: "14px", color: "#999", marginBottom: "5px" }}>
                    Total do Pedido
                  </p>
                  <p style={{ fontSize: "24px", fontWeight: "700", color: "#e1306c" }}>
                    {order.totalPrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                  </p>
                </div>
              </div>

              {/* Endereço de Entrega */}
              {order.address && (
                <div style={{
                  marginTop: "20px",
                  paddingTop: "20px",
                  borderTop: "1px solid #e0e0e0"
                }}>
                  <p style={{ fontSize: "14px", color: "#999", marginBottom: "10px" }}>
                    Endereço de Entrega
                  </p>
                  <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
                    {order.address.street}<br />
                    {order.address.complement && `${order.address.complement}`}<br />
                    {order.address.city} - {order.address.state}<br />
                    CEP: {order.address.zipCode}<br />
                    {order.address.country}
                  </p>
                </div>
              )}

              {/* Itens do Pedido */}
              <div style={{
                marginTop: "20px",
                paddingTop: "20px",
                borderTop: "1px solid #e0e0e0"
              }}>
                <p style={{ fontSize: "14px", color: "#999", marginBottom: "15px" }}>
                  Itens do Pedido ({order.items.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {order.items.map((item, index) => (
                    <div key={index} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      backgroundColor: "#fff",
                      borderRadius: "4px"
                    }}>
                      <div style={{ textAlign: "left" }}>
                        <p style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
                          {item.product.name}
                        </p>
                        <p style={{ fontSize: "12px", color: "#666" }}>
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                      <p style={{ fontSize: "14px", fontWeight: "600", color: "#e1306c" }}>
                        {(item.price * item.quantity).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL"
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Próximos Passos */}
          <div style={{
            backgroundColor: "#fff5f8",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
            border: "1px solid #e1306c"
          }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "15px",
              color: "#e1306c"
            }}>
              <i className="pi pi-info-circle" style={{ marginRight: "10px" }} />
              Próximos Passos
            </h3>
            <ul style={{
              textAlign: "left",
              fontSize: "14px",
              color: "#666",
              lineHeight: "2",
              paddingLeft: "20px"
            }}>
              <li>Você receberá um e-mail de confirmação em instantes</li>
              <li>Acompanhe o status do seu pedido na área "Meus Pedidos"</li>
              <li>Você será notificado quando o pedido for enviado</li>
            </ul>
          </div>

          {/* Botões de Ação */}
          <div style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => navigate("/profile")}
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
              <i className="pi pi-list" style={{ marginRight: "10px" }} />
              Ver Meus Pedidos
            </button>

            <button
              onClick={() => navigate("/")}
              style={{
                padding: "15px 40px",
                backgroundColor: "#fff",
                color: "#666",
                border: "2px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "600",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s ease",
                letterSpacing: "1px"
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
              <i className="pi pi-home" style={{ marginRight: "10px" }} />
              Voltar para Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
