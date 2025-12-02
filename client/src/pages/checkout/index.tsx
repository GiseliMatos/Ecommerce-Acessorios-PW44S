import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/hooks/use-cart";
import { useAuth } from "@/context/hooks/use-auth";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog"; // Import do Dialog adicionado
import AddressService, { type IAddress } from "@/services/address-service";
import OrderService from "@/services/order-service";

type ShippingOption = "standard" | "express" | "pickup";
type PaymentMethod = "credit" | "pix" | "boleto";

export const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingOption, setShippingOption] = useState<ShippingOption>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showAddressDialog, setShowAddressDialog] = useState(false);

  const discountRate = paymentMethod === "pix" ? 0.05 : 0;

  useEffect(() => {
    if (!authenticated) {
      navigate("/login?redirect=/checkout");
      return;
    }

    if (items.length === 0) {
      navigate("/cart");
      return;
    }

    loadAddresses();
  }, [authenticated, items, navigate]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await AddressService.findAllByAuthenticatedUser();
      if (response.status === 200 && response.data.length > 0) {
        setAddresses(response.data);
        // Seleciona o primeiro endereço automaticamente 
        if (!selectedAddress) {
            setSelectedAddress(response.data[0]);
        }
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao carregar endereços.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getShippingCost = (): number => {
    const subtotal = getTotalPrice();

    // Frete grátis 
    if (subtotal >= 149) {
      return 0;
    }

    switch (shippingOption) {
      case "standard":
        return 10.00;
      case "express":
        return 25.00;
      case "pickup":
        return 0;
      default:
        return 10.00;
    }
  };

  const getDiscount = (): number => {
    if (paymentMethod === "pix") {
      return getTotalPrice() * 0.05;
    }
    return 0;
  };

  const getFinalTotal = (): number => {
    const subtotal = getTotalPrice();
    const shipping = getShippingCost();
    const discount = getDiscount();
    return subtotal + shipping - discount;
  };

  const handleFinalizePurchase = async () => {
    if (!selectedAddress) {
      toast.current?.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Selecione um endereço de entrega.",
        life: 3000,
      });
      return;
    }

    setIsProcessing(true);

    const paymentMap: Record<string, string> = {
      "credit": "CARTAO_CREDITO",
      "pix": "PIX",
      "boleto": "BOLETO"
    };

    const shippingMap: Record<string, string> = {
      "standard": "ENTREGA_NORMAL",
      "express": "ENTREGA_EXPRESSA",
      "pickup": "RETIRADA_LOJA"
    };

    try {
      const orderData = {
        totalPrice: Number(getFinalTotal().toFixed(2)),
        formaPagamento: paymentMap[paymentMethod],
        formaEntrega: shippingMap[shippingOption],
        address: selectedAddress,
        items: items.map(item => ({
          price: Number((item.product.price * (1 - discountRate)).toFixed(2)),
          quantity: item.quantity,
          product: item.product
        }))
      };

      const response = await OrderService.create(orderData);

      if (response.status === 201) {
        clearCart();
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Pedido realizado com sucesso!",
          life: 2000,
        });

        setTimeout(() => {
          navigate(`/order-success?orderId=${response.data.id}`);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao finalizar pedido. Verifique os dados.",
        life: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!authenticated || items.length === 0) {
    return null;
  }

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

  const subtotal = getTotalPrice();
  const shippingCost = getShippingCost();
  const discount = getDiscount();
  const finalTotal = getFinalTotal();

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>
      <Toast ref={toast} />

      {/* --- INÍCIO DA SELEÇÃO DE ENDEREÇO --- */}
      <Dialog 
        header="Selecionar Endereço de Entrega" 
        visible={showAddressDialog} 
        style={{ width: '600px', maxWidth: '90vw' }} 
        onHide={() => setShowAddressDialog(false)}
        draggable={false}
        resizable={false}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {addresses.map(addr => (
                <div 
                    key={addr.id}
                    onClick={() => {
                        setSelectedAddress(addr);
                        setShowAddressDialog(false);
                    }}
                    style={{
                        padding: "15px",
                        border: selectedAddress?.id === addr.id ? "2px solid #e1306c" : "1px solid #ddd",
                        backgroundColor: selectedAddress?.id === addr.id ? "#fff5f8" : "#fff",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        transition: "all 0.2s ease"
                    }}
                >
                    <div style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: selectedAddress?.id === addr.id ? "6px solid #e1306c" : "2px solid #ccc",
                        flexShrink: 0
                    }} />
                    
                    <div>
                        <p style={{ fontWeight: "600", marginBottom: "4px", fontSize: "16px" }}>
                            {addr.street}, {addr.complement}
                        </p>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                            {addr.city} - {addr.state}
                        </p>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                            CEP: {addr.zipCode}
                        </p>
                    </div>
                </div>
            ))}
            
            <button
                onClick={() => navigate("/addresses")}
                style={{
                    marginTop: "10px",
                    padding: "15px",
                    backgroundColor: "transparent",
                    border: "2px dashed #ccc",
                    color: "#666",
                    borderRadius: "8px",
                    cursor: "pointer",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "600",
                    gap: "10px",
                    transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#e1306c";
                    e.currentTarget.style.color = "#e1306c";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#ccc";
                    e.currentTarget.style.color = "#666";
                }}
            >
                <i className="pi pi-plus" />
                Cadastrar Novo Endereço
            </button>
        </div>
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
            gap: "20px",
            flexWrap: "wrap"
          }}>
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
          <div>
            {/* Forma de Pagamento */}
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

              <div style={{ marginBottom: "15px" }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  border: paymentMethod === "credit" ? "2px solid #e1306c" : "2px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  cursor: "pointer",
                  gap: "15px",
                  backgroundColor: paymentMethod === "credit" ? "#fff5f8" : "#fff"
                }}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "credit"}
                    onChange={() => setPaymentMethod("credit")}
                    style={{ accentColor: "#e1306c" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "5px"
                    }}>
                      <i className="pi pi-credit-card" style={{ fontSize: "20px", color: "#e1306c" }} />
                      <span style={{ fontSize: "16px", fontWeight: "600" }}>Cartão de Crédito</span>
                    </div>
                    <p style={{ fontSize: "14px", color: "#666", marginLeft:"-550px"}}>
                      Parcele em até 12x sem juros
                    </p>
                  </div>
                </label>

                <label style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  border: paymentMethod === "pix" ? "2px solid #e1306c" : "2px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  cursor: "pointer",
                  gap: "15px",
                  backgroundColor: paymentMethod === "pix" ? "#fff5f8" : "#fff"
                }}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "pix"}
                    onChange={() => setPaymentMethod("pix")}
                    style={{ accentColor: "#e1306c" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "5px"
                    }}>
                      <i className="pi pi-qrcode" style={{ fontSize: "20px", color: "#e1306c" }} />
                      <span style={{ fontSize: "16px", fontWeight: "600" }}>PIX</span>
                      <span style={{
                        padding: "4px 8px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        fontSize: "12px",
                        fontWeight: "600",
                        borderRadius: "4px"
                      }}>
                        5% OFF
                      </span>
                    </div>
                    <p style={{ fontSize: "14px", color: "#666", marginLeft:"-450px"}}>
                      Ganhe 5% de desconto no pagamento via PIX
                    </p>
                  </div>
                </label>

                <label style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  border: paymentMethod === "boleto" ? "2px solid #e1306c" : "2px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                  gap: "15px",
                  backgroundColor: paymentMethod === "boleto" ? "#fff5f8" : "#fff"
                }}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "boleto"}
                    onChange={() => setPaymentMethod("boleto")}
                    style={{ accentColor: "#e1306c" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "5px"
                    }}>
                      <i className="pi pi-money-bill" style={{ fontSize: "20px", color: "#e1306c" }} />
                      <span style={{ fontSize: "16px", fontWeight: "600" }}>Boleto Bancário</span>
                    </div>
                    <p style={{ fontSize: "14px", color: "#666", marginLeft:"-570px"}}>
                      Vencimento em 3 dias úteis
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Opções de Frete */}
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
                OPÇÕES DE FRETE
              </h2>

              {subtotal >= 149 && (
                <div style={{
                  padding: "15px",
                  backgroundColor: "#d4edda",
                  border: "1px solid #c3e6cb",
                  borderRadius: "4px",
                  marginBottom: "20px",
                  color: "#155724"
                }}>
                  <i className="pi pi-check-circle" style={{ marginRight: "10px" }} />
                  Parabéns! Você ganhou frete grátis!
                </div>
              )}

              <div style={{ marginBottom: "15px" }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  border: shippingOption === "standard" ? "2px solid #e1306c" : "2px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  cursor: "pointer",
                  gap: "15px",
                  backgroundColor: shippingOption === "standard" ? "#fff5f8" : "#fff"
                }}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingOption === "standard"}
                    onChange={() => setShippingOption("standard")}
                    style={{ accentColor: "#e1306c" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "5px"
                    }}>
                      <span style={{ fontSize: "16px", fontWeight: "600" }}>Padrão</span>
                      <span style={{ fontSize: "16px", fontWeight: "600", color: subtotal >= 149 ? "#28a745" : "#333" }}>
                        {subtotal >= 149 ? "GRÁTIS" : "R$ 10,00"}
                      </span>
                    </div>
                    <p style={{ fontSize: "14px", color: "#666", marginLeft:"-580px"}}>
                      Chega entre 10 e 15 dias
                    </p>
                  </div>
                </label>

                <label style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  border: shippingOption === "express" ? "2px solid #e1306c" : "2px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  cursor: "pointer",
                  gap: "15px",
                  backgroundColor: shippingOption === "express" ? "#fff5f8" : "#fff"
                }}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingOption === "express"}
                    onChange={() => setShippingOption("express")}
                    style={{ accentColor: "#e1306c" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "5px"
                    }}>
                      <span style={{ fontSize: "16px", fontWeight: "600" }}>Expresso</span>
                      <span style={{ fontSize: "16px", fontWeight: "600", color: subtotal >= 149 ? "#28a745" : "#333" }}>
                        {subtotal >= 149 ? "GRÁTIS" : "R$ 25,00"}
                      </span>
                    </div>
                    <p style={{ fontSize: "14px", color: "#666", marginLeft:"-610px"}}>
                      Chega em até 5 dias
                    </p>
                  </div>
                </label>

                <label style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                  border: shippingOption === "pickup" ? "2px solid #e1306c" : "2px solid #ddd",
                  borderRadius: "8px",
                  cursor: "pointer",
                  gap: "15px",
                  backgroundColor: shippingOption === "pickup" ? "#fff5f8" : "#fff"
                }}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingOption === "pickup"}
                    onChange={() => setShippingOption("pickup")}
                    style={{ accentColor: "#e1306c" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "5px"
                    }}>
                      <span style={{ fontSize: "16px", fontWeight: "600" }}>Retire na Loja</span>
                      <span style={{ fontSize: "16px", fontWeight: "600", color: "#28a745" }}>
                        GRÁTIS
                      </span>
                    </div>
                    <p style={{ fontSize: "14px", color: "#666", marginLeft:"-620px"}}>
                      Disponível amanhã
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

              {selectedAddress ? (
                <div style={{
                  padding: "20px",
                  border: "2px solid #e1306c",
                  borderRadius: "8px",
                  backgroundColor: "#fff5f8"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "15px" }}>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "10px" }}>
                        Endereço Selecionado
                      </p>
                      <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
                        {selectedAddress.street}<br />
                        {selectedAddress.complement && `${selectedAddress.complement}`}<br />
                        {selectedAddress.city} - {selectedAddress.state}<br />
                        CEP: {selectedAddress.zipCode}<br />
                        {selectedAddress.country}
                      </p>
                    </div>
                    <button
                      // Abre o modal
                      onClick={() => setShowAddressDialog(true)}
                      style={{
                        padding: "8px 16px",
                        backgroundColor: "#fff",
                        color: "#e1306c",
                        border: "1px solid #e1306c",
                        borderRadius: "4px",
                        fontSize: "14px",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      Alterar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{
                  padding: "20px",
                  border: "2px solid #ffc107",
                  borderRadius: "8px",
                  backgroundColor: "#fff3cd",
                  textAlign: "center"
                }}>
                  <p style={{ fontSize: "16px", color: "#856404", marginBottom: "15px" }}>
                    Você ainda não possui endereços cadastrados
                  </p>
                  <button
                    onClick={() => navigate("/addresses")}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: "#e1306c",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    Cadastrar Endereço
                  </button>
                </div>
              )}
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
                    borderBottom: "1px solid #e0e0e0",
                    paddingLeft: "50px"
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
                            objectFit: "contain"
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
                    {subtotal.toLocaleString("pt-BR", {
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
                  <span style={{
                    fontSize: "14px",
                    color: shippingCost === 0 ? "#28a745" : "#333",
                    fontWeight: "600"
                  }}>
                    {shippingCost === 0 ? "GRÁTIS" : shippingCost.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                  </span>
                </div>

                {discount > 0 && (
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "15px"
                  }}>
                    <span style={{ fontSize: "14px", color: "#666" }}>Desconto PIX (5%)</span>
                    <span style={{ fontSize: "14px", color: "#28a745", fontWeight: "600" }}>
                      - {discount.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      })}
                    </span>
                  </div>
                )}

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "15px",
                  borderTop: "1px solid #e0e0e0"
                }}>
                  <span style={{ fontSize: "18px", fontWeight: "700" }}>Total</span>
                  <span style={{ fontSize: "24px", fontWeight: "700", color: "#e1306c" }}>
                    {finalTotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={handleFinalizePurchase}
                disabled={isProcessing || !selectedAddress}
                style={{
                  width: "100%",
                  padding: "18px",
                  backgroundColor: isProcessing || !selectedAddress ? "#ccc" : "#C9A063",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  cursor: isProcessing || !selectedAddress ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s ease",
                  letterSpacing: "1px"
                }}
              >
                {isProcessing ? (
                  <>
                    <i className="pi pi-spin pi-spinner" style={{ marginRight: "10px" }} />
                    Processando...
                  </>
                ) : (
                  "Finalizar Compra"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};