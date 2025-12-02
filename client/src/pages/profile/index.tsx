import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog"; // Importando o Dialog
import OrderService, { type IOrder } from "@/services/order-service";
import AddressService, { type IAddress } from "@/services/address-service";

type TabType = "orders" | "addresses";

export const ProfilePage = () => {
  const { authenticated, authenticatedUser } = useAuth();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  
  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    if (!authenticated) {
      navigate("/login");
      return;
    }

    loadOrders();
    loadAddresses();
  }, [authenticated, navigate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderService.findAllByAuthenticatedUser();
      if (response.status === 200) {
        setOrders(response.data);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível carregar os pedidos.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const response = await AddressService.findAllByAuthenticatedUser();
      if (response.status === 200) {
        setAddresses(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
    }
  };

  const handleOpenDetails = (order: IOrder) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getShippingLabel = (formaEntrega: string) => {
    switch (formaEntrega) {
      case "standard": return "Padrão";
      case "express": return "Expresso";
      case "pickup": return "Retirar na Loja";
      case "ENTREGA_NORMAL": return "Padrão"; // Caso venha do backend assim
      case "ENTREGA_EXPRESSA": return "Expresso";
      case "RETIRADA_LOJA": return "Retirar na Loja";
      default: return formaEntrega;
    }
  };

  const getPaymentLabel = (formaPagamento: string) => {
    switch (formaPagamento) {
        case "credit": return "Cartão de Crédito";
        case "pix": return "PIX";
        case "boleto": return "Boleto";
        case "CARTAO_CREDITO": return "Cartão de Crédito";
        case "PIX": return "PIX";
        case "BOLETO": return "Boleto";
        default: return formaPagamento;
    }
  };

  const renderOrderDetails = () => {
    if (!selectedOrder) return null;

    return (
      <div style={{ padding: "10px" }}>
        {/* Cabeçalho do Detalhe */}
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
            gap: "15px", 
            marginBottom: "20px",
            backgroundColor: "#f9f9f9",
            padding: "15px",
            borderRadius: "8px"
        }}>
            <div>
                <span style={{color:"#888", fontSize:"12px", display:"block"}}>Data do Pedido</span>
                <span style={{fontWeight:"600", color: "#333"}}>
                    {new Date(selectedOrder.dateOrder).toLocaleDateString("pt-BR")}
                </span>
            </div>
            <div>
                <span style={{color:"#888", fontSize:"12px", display:"block"}}>Status</span>
                <span style={{color:"#17a2b8", fontWeight:"700"}}>Processando</span>
            </div>
            <div>
                <span style={{color:"#888", fontSize:"12px", display:"block"}}>Pagamento</span>
                <span style={{fontWeight:"600", color: "#333"}}>
                    {getPaymentLabel(selectedOrder.formaPagamento)}
                </span>
            </div>
            <div>
                <span style={{color:"#888", fontSize:"12px", display:"block"}}>Total</span>
                <span style={{color:"#e1306c", fontWeight:"700", fontSize:"16px"}}>
                    {selectedOrder.totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
            </div>
        </div>

        {/* Lista de Itens */}
        <div style={{ marginBottom: "20px" }}>
            <h4 style={{marginBottom: "15px", fontSize: "16px", fontWeight: "700", borderBottom: "1px solid #eee", paddingBottom: "10px"}}>
                Itens do Pedido
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {selectedOrder.items.map((item, idx) => (
                    <div key={idx} style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "10px",
                        backgroundColor: "#fff",
                        border: "1px solid #eee",
                        borderRadius: "6px"
                    }}>
                        <div>
                            <p style={{fontWeight: "600", fontSize: "14px", marginBottom: "4px"}}>{item.product.name}</p>
                            <p style={{fontSize: "12px", color: "#666"}}>Qtd: {item.quantity}</p>
                        </div>
                        <span style={{fontWeight: "600", fontSize: "14px", color: "#555"}}>
                            {(item.price * item.quantity).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Endereço de Entrega */}
        {selectedOrder.address && (
            <div style={{ borderTop: "1px solid #eee", paddingTop: "15px" }}>
                <h4 style={{marginBottom: "10px", fontSize: "16px", fontWeight: "700"}}>Endereço de Entrega</h4>
                <div style={{ fontSize:"14px", color: "#666", lineHeight: "1.6" }}>
                    <p>{selectedOrder.address.street}, {selectedOrder.address.complement}</p>
                    <p>{selectedOrder.address.zipCode} - {selectedOrder.address.city}/{selectedOrder.address.state}</p>
                </div>
            </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>
      <Toast ref={toast} />

      <Dialog 
        header={`Detalhes do Pedido #${selectedOrder?.id}`} 
        visible={showModal} 
        style={{ width: '600px', maxWidth: '95vw' }} 
        onHide={() => setShowModal(false)}
        draggable={false}
        resizable={false}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      >
        {renderOrderDetails()}
      </Dialog>

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
            <span>Minha Conta</span>
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
        {/* Header do Usuário */}
        <div style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: "30px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#e1306c",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
              fontWeight: "700"
            }}>
              {authenticatedUser?.displayName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 style={{
                fontSize: "28px",
                fontWeight: "700",
                marginBottom: "5px"
              }}>
                {authenticatedUser?.displayName || "Usuário"}
              </h1>
              <p style={{ fontSize: "14px", color: "#666" }}>
                {authenticatedUser?.username || "usuario@email.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden"
        }}>
          {/* Tab Headers */}
          <div style={{
            display: "flex",
            borderBottom: "2px solid #e0e0e0",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => setActiveTab("orders")}
              style={{
                flex: 1,
                minWidth: "150px",
                padding: "20px",
                backgroundColor: activeTab === "orders" ? "#fff" : "#f5f5f5",
                border: "none",
                borderBottom: activeTab === "orders" ? "3px solid #e1306c" : "none",
                fontSize: "16px",
                fontWeight: "600",
                color: activeTab === "orders" ? "#e1306c" : "#666",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              <i className="pi pi-shopping-bag" style={{ marginRight: "10px" }} />
              Meus Pedidos
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              style={{
                flex: 1,
                minWidth: "150px",
                padding: "20px",
                backgroundColor: activeTab === "addresses" ? "#fff" : "#f5f5f5",
                border: "none",
                borderBottom: activeTab === "addresses" ? "3px solid #e1306c" : "none",
                fontSize: "16px",
                fontWeight: "600",
                color: activeTab === "addresses" ? "#e1306c" : "#666",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              <i className="pi pi-map-marker" style={{ marginRight: "10px" }} />
              Endereços
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: "30px" }}>
            {/* Pedidos */}
            {activeTab === "orders" && (
              <div>
                <h2 style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  marginBottom: "25px"
                }}>
                  Meus Pedidos
                </h2>

                {loading ? (
                  <div style={{
                    textAlign: "center",
                    padding: "60px 20px"
                  }}>
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: "40px", color: "#e1306c" }} />
                    <p style={{ fontSize: "16px", color: "#666", marginTop: "20px" }}>
                      Carregando pedidos...
                    </p>
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{
                    textAlign: "center",
                    padding: "60px 20px"
                  }}>
                    <i className="pi pi-shopping-bag" style={{
                      fontSize: "64px",
                      color: "#ccc",
                      marginBottom: "20px",
                      display: "block"
                    }} />
                    <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>
                      Você ainda não fez nenhum pedido
                    </p>
                    <button
                      onClick={() => navigate("/products")}
                      style={{
                        padding: "12px 30px",
                        backgroundColor: "#e1306c",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Começar a Comprar
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems:"center", flexDirection: "column", gap: "20px"}}>
                    {orders.map(order => (
                      <div
                        key={order.id}
                        onClick={() => handleOpenDetails(order)} 
                        style={{
                          padding: "25px",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          width: "100%", 
                          maxWidth: "1200px" 
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                            e.currentTarget.style.borderColor = "#e1306c";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.borderColor = "#e0e0e0";
                        }}
                      >
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "start",
                          flexWrap: "wrap",
                          gap: "15px", 
                        }}>
                          <div>
                            <p style={{
                              fontSize: "18px",
                              fontWeight: "600",
                              marginBottom: "10px"
                            }}>
                              Pedido #{order.id}
                            </p>
                            <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                              Data: {order.dateOrder ? new Date(order.dateOrder).toLocaleDateString("pt-BR") : "N/A"}
                            </p>
                            <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                              Forma de Entrega: {getShippingLabel(order.formaEntrega)}
                            </p>
                            <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
                              {order.items.length} {order.items.length === 1 ? "item" : "itens"}
                            </p>
                            <span style={{
                              display: "inline-block",
                              padding: "6px 12px",
                              backgroundColor: "#17a2b8",
                              color: "#fff",
                              fontSize: "12px",
                              fontWeight: "600",
                              borderRadius: "4px"
                            }}>
                              Processando
                            </span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
                              Total
                            </p>
                            <p style={{
                              fontSize: "24px",
                              fontWeight: "700",
                              color: "#e1306c"
                            }}>
                              {order.totalPrice.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                              })}
                            </p>
                            <span style={{ fontSize: "12px", color: "#e1306c", textDecoration: "underline", marginTop: "10px", display: "inline-block"}}>
                                Ver detalhes
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Endereços */}
            {activeTab === "addresses" && (
              <div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "25px",
                  flexWrap: "wrap",
                  gap: "15px"
                }}>
                  <h2 style={{
                    fontSize: "24px",
                    fontWeight: "700"
                  }}>
                    Meus Endereços
                  </h2>
                  <button
                    onClick={() => navigate("/addresses")}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#e1306c",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    <i className="pi pi-plus" style={{ marginRight: "8px" }} />
                    Gerenciar Endereços
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div style={{
                    textAlign: "center",
                    padding: "60px 20px"
                  }}>
                    <i className="pi pi-map-marker" style={{
                      fontSize: "64px",
                      color: "#ccc",
                      marginBottom: "20px",
                      display: "block"
                    }} />
                    <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>
                      Você ainda não cadastrou nenhum endereço
                    </p>
                    <button
                      onClick={() => navigate("/addresses")}
                      style={{
                        padding: "12px 30px",
                        backgroundColor: "#e1306c",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Adicionar Endereço
                    </button>
                  </div>
                ) : (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px"
                  }}>
                    {addresses.map(address => (
                      <div
                        key={address.id}
                        style={{
                          padding: "25px",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          position: "relative"
                        }}
                      >
                        <h3 style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          marginBottom: "15px"
                        }}>
                          Endereço
                        </h3>
                        <p style={{
                          fontSize: "14px",
                          color: "#666",
                          lineHeight: "1.8"
                        }}>
                          {address.street}<br />
                          {address.complement && `${address.complement}`}<br />
                          {address.city} - {address.state}<br />
                          CEP: {address.zipCode}<br />
                          {address.country}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};