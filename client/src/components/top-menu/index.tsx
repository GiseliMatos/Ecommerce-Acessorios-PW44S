import React, { useState } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { useCart } from "@/context/hooks/use-cart";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const { authenticated, handleLogout } = useAuth();
  const { getTotalItems } = useCart();
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearchDialog(false);
      setSearchTerm("");
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      {/* Banner Promocional Preto */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1001,
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          padding: "10px 16px",
          textAlign: "center",
          fontSize: "13px",
          fontWeight: "600",
          letterSpacing: "0.5px",
        }}
      >
        ✨ COLEÇÃO EXCLUSIVA DE ACESSÓRIOS: DESCONTOS DE ATÉ 50% | FRETE GRÁTIS ACIMA DE R$149 ✨
      </div>

      {/* Navbar Principal Branca */}
      <div
        style={{
          position: "fixed",
          top: "40px",
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img 
              src="/assets/images/selene.png" 
              alt="Selena Acessórios" 
              style={{
                height: "60px",
                width: "auto",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Menu Central */}
          <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <a
              onClick={() => navigate("/products/category/1")}
              style={{
                cursor: "pointer",
                color: "#666",
                fontSize: "14px",
                fontWeight: "500",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e1306c")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
            >
              COLARES
            </a>
            <a
              onClick={() => navigate("/products/category/2")}
              style={{
                cursor: "pointer",
                color: "#666",
                fontSize: "14px",
                fontWeight: "500",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e1306c")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
            >
              BRINCOS
            </a>
            <a
              onClick={() => navigate("/products/category/3")}
              style={{
                cursor: "pointer",
                color: "#666",
                fontSize: "14px",
                fontWeight: "500",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e1306c")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
            >
              PULSEIRAS
            </a>
            <a
              onClick={() => navigate("/products/category/4")}
              style={{
                cursor: "pointer",
                color: "#666",
                fontSize: "14px",
                fontWeight: "500",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e1306c")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
            >
              ANÉIS
            </a>
            <a
              onClick={() => navigate("/products/category/5")}
              style={{
                cursor: "pointer",
                color: "#e1306c",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              CONJUNTOS
            </a>

            {/* Botão Novidades */}
            <Button
              label="NOVIDADES"
              onClick={() => navigate("/products")}
              style={{
                backgroundColor: "#e1306c",
                color: "#fff",
                border: "none",
                borderRadius: "20px",
                padding: "8px 20px",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "0.5px",
                cursor: "pointer",
              }}
            />
          </nav>

          {/* Ícones Direita */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {/* Busca */}
            <i
              className="pi pi-search"
              onClick={() => setShowSearchDialog(true)}
              style={{
                fontSize: "20px",
                color: "#666",
                cursor: "pointer",
              }}
            />

            {/* Carrinho com Badge */}
            <div 
              onClick={() => navigate("/cart")}
              style={{ position: "relative", display: "inline-block" }}
            >
              <i
                className="pi pi-shopping-cart"
                style={{
                  fontSize: "20px",
                  color: "#666",
                  cursor: "pointer",
                }}
              />
              {getTotalItems() > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    backgroundColor: "#e1306c",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: "600",
                  }}
                >
                  {getTotalItems()}
                </span>
              )}
            </div>

            {/* User/Login */}
            {authenticated ? (
              <>
                <i
                  className="pi pi-user"
                  style={{
                    fontSize: "20px",
                    color: "#666",
                    cursor: "pointer",
                  }}
                />
                <i
                  className="pi pi-sign-out"
                  onClick={handleLogoutClick}
                  style={{
                    fontSize: "20px",
                    color: "#666",
                    cursor: "pointer",
                  }}
                />
              </>
            ) : (
              <i
                className="pi pi-user"
                onClick={() => navigate("/login")}
                style={{
                  fontSize: "20px",
                  color: "#666",
                  cursor: "pointer",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Espaçamento para o conteúdo */}
      <div style={{ height: "123px" }} />

      {/* caixa de busca */}
      <Dialog
        header="Buscar Produtos"
        visible={showSearchDialog}
        style={{ width: "500px", maxWidth: "90vw" }}
        onHide={() => {
          setShowSearchDialog(false);
          setSearchTerm("");
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            placeholder="Digite o nome do produto..."
            style={{ flex: 1 }}
            autoFocus
          />
          <Button
            label="Buscar"
            icon="pi pi-search"
            onClick={handleSearch}
            style={{
              backgroundColor: "#e1306c",
              border: "none",
            }}
          />
        </div>
      </Dialog>
    </>
  );
};

export default TopMenu;
