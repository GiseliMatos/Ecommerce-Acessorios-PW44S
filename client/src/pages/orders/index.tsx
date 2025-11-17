import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";

interface IOrder {
  id: number;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
}

export const OrdersPage = () => {
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    if (!authenticated) {
      navigate("/login?redirect=/orders");
      return;
    }

    // Simular carregamento de pedidos
    const mockOrders: IOrder[] = [
      {
        id: 123456,
        date: "2024-01-15",
        total: 299.90,
        status: "delivered",
        items: 3
      },
      {
        id: 123455,
        date: "2024-01-10",
        total: 159.90,
        status: "shipped",
        items: 2
      },
      {
        id: 123454,
        date: "2024-01-05",
        total: 89.90,
        status: "processing",
        items: 1
      }
    ];
    setOrders(mockOrders);
  }, [authenticated, navigate]);

  const getStatusInfo = (status: IOrder["status"]) => {
    const statusMap = {
      pending: { label: "Pendente", color: "#ffc107", icon: "pi-clock" },
      processing: { label: "Processando", color: "#17a2b8", icon: "pi-sync" },
      shipped: { label: "Enviado", color: "#007bff", icon: "pi-truck" },
      delivered: { label: "Entregue", color: "#28a745", icon: "pi-check-circle" },
      cancelled: { label: "Cancelado", color: "#dc3545", icon: "pi-times-circle" }
    };
    return statusMap[status];
  };

  if (!authenticated) {
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
            <span>Meus Pedidos</span>
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
          MEUS PEDIDOS
        </h1>

        {orders.length === 0 ? (
          <div style={{
            backgroundColor: "#fff",
            padding: "60px 20px",
            textAlign: "center",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <i className="pi pi-shopping-bag" style={{
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
              Você ainda não fez nenhum pedido
            </h2>
            <p style={{
              fontSize: "16px",
              color: "#666",
              marginBottom: "30px"
            }}>
              Explore nossa coleção e faça seu primeiro pedido!
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
              Ver Produtos
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {orders.map(order => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: "#fff",
                    padding: "30px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "auto 1fr auto auto",
                    gap: "20px",
                    alignItems: "center"
                  }}>
                    {/* Número do Pedido */}
                    <div>
                      <p style={{ fontSize: "12px", color: "#999", marginBottom: "5px" }}>
                        PEDIDO
                      </p>
                      <p style={{ fontSize: "18px", fontWeight: "700", color: "#333" }}>
                        #{order.id}
                      </p>
                    </div>

                    {/* Informações */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "repeat(3, 1fr)",
                      gap: "20px"
                    }}>
                      <div>
                        <p style={{ fontSize: "12px", color: "#999", marginBottom: "5px" }}>
                          DATA
                        </p>
                        <p style={{ fontSize: "14px", fontWeight: "600" }}>
                          {new Date(order.date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>

                      <div>
                        <p style={{ fontSize: "12px", color: "#999", marginBottom: "5px" }}>
                          ITENS
                        </p>
                        <p style={{ fontSize: "14px", fontWeight: "600" }}>
                          {order.items} {order.items === 1 ? "item" : "itens"}
                        </p>
                      </div>

                      <div>
                        <p style={{ fontSize: "12px", color: "#999", marginBottom: "5px" }}>
                          TOTAL
                        </p>
                        <p style={{ fontSize: "16px", fontWeight: "700", color: "#e1306c" }}>
                          {order.total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL"
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div style={{
                      padding: "10px 20px",
                      backgroundColor: `${statusInfo.color}15`,
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      whiteSpace: "nowrap"
                    }}>
                      <i className={`pi ${statusInfo.icon}`} style={{ color: statusInfo.color }} />
                      <span style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: statusInfo.color
                      }}>
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Botão Ver Detalhes */}
                    <button
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#fff",
                        color: "#e1306c",
                        border: "2px solid #e1306c",
                        borderRadius: "4px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        whiteSpace: "nowrap"
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
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
