import { useNavigate } from "react-router-dom";

export const OrderSuccessPage = () => {
  const navigate = useNavigate();

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
              gridTemplateColumns: "1fr 1fr",
              gap: "20px"
            }}>
              <div>
                <p style={{ fontSize: "14px", color: "#999", marginBottom: "5px" }}>
                  Número do Pedido
                </p>
                <p style={{ fontSize: "16px", fontWeight: "600" }}>
                  #{Math.floor(Math.random() * 1000000)}
                </p>
              </div>

              <div>
                <p style={{ fontSize: "14px", color: "#999", marginBottom: "5px" }}>
                  Data
                </p>
                <p style={{ fontSize: "16px", fontWeight: "600" }}>
                  {new Date().toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div>
                <p style={{ fontSize: "14px", color: "#999", marginBottom: "5px" }}>
                  Forma de Pagamento
                </p>
                <p style={{ fontSize: "16px", fontWeight: "600" }}>
                  Cartão de Crédito
                </p>
              </div>

              <div>
                <p style={{ fontSize: "14px", color: "#999", marginBottom: "5px" }}>
                  Previsão de Entrega
                </p>
                <p style={{ fontSize: "16px", fontWeight: "600" }}>
                  {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          </div>

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
              onClick={() => navigate("/orders")}
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
