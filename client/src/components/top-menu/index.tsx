import React, { useState } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { useCart } from "@/context/hooks/use-cart";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar"; // Importar Sidebar

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const { authenticated, handleLogout } = useAuth();
  const { getTotalItems } = useCart();
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleMobileMenu, setVisibleMobileMenu] = useState(false); // Estado para o menu mobile

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/login");
    setVisibleMobileMenu(false);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setVisibleMobileMenu(false);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSearchDialog(false);
      setSearchTerm("");
      setVisibleMobileMenu(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Componente interno para os Links de Navegação (Reutilizável)
  const NavLinks = ({ isMobile = false }) => {
    const linkStyle: React.CSSProperties = isMobile
      ? {
          fontSize: "16px",
          padding: "12px 0",
          borderBottom: "1px solid #f0f0f0",
          display: "block",
          color: "#333",
          fontWeight: "600",
          textDecoration: "none",
        }
      : {
          cursor: "pointer",
          color: "#666",
          fontSize: "14px",
          fontWeight: "500",
          textDecoration: "none",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          transition: "color 0.2s",
        };

    return (
      <nav
        style={{
          display: isMobile ? "flex" : "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "0px" : "32px",
          alignItems: isMobile ? "stretch" : "center",
        }}
      >
        <a onClick={() => handleNavigate("/products/category/1")} style={linkStyle}>Colares</a>
        <a onClick={() => handleNavigate("/products/category/2")} style={linkStyle}>Brincos</a>
        <a onClick={() => handleNavigate("/products/category/3")} style={linkStyle}>Pulseiras</a>
        <a onClick={() => handleNavigate("/products/category/4")} style={linkStyle}>Anéis</a>
        <a onClick={() => handleNavigate("/products/category/5")} style={linkStyle}>Conjuntos</a>
        
        <Button
          label="NOVIDADES"
          onClick={() => handleNavigate("/products")}
          style={{
            marginTop: isMobile ? "20px" : "0",
            backgroundColor: "#e1306c",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            padding: "8px 20px",
            fontSize: "12px",
            fontWeight: "600",
            letterSpacing: "0.5px",
            cursor: "pointer",
            width: isMobile ? "100%" : "auto",
          }}
        />
        
        {/* Itens extras do menu mobile (Conta/Logout) */}
        {isMobile && (
          <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
            {authenticated ? (
              <>
                <div 
                   onClick={() => handleNavigate("/profile")}
                   style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <i className="pi pi-user" /> Minha Conta
                </div>
                <div 
                   onClick={handleLogoutClick}
                   style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '10px', color: '#e1306c' }}
                >
                   <i className="pi pi-sign-out" /> Sair
                </div>
              </>
            ) : (
              <div 
                 onClick={() => handleNavigate("/login")}
                 style={{ ...linkStyle, display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <i className="pi pi-user" /> Entrar / Cadastrar
              </div>
            )}
          </div>
        )}
      </nav>
    );
  };

  return (
    <>
      {/* CSS Responsivo Injetado */}
      <style>{`
        /* Desktop Padrão */
        .desktop-nav { display: flex !important; }
        .mobile-trigger { display: none !important; }
        .logo-img { height: 60px; }
        .banner-text { font-size: 13px; padding: 10px 16px; }
        .user-actions-desktop { display: flex !important; }
        .navbar-container { padding: 16px 24px; }

        /* Mobile (até 960px - cobre o 390px) */
        @media (max-width: 960px) {
          .desktop-nav { display: none !important; }
          .mobile-trigger { display: block !important; }
          .logo-img { height: 40px; } /* Logo menor no mobile */
          .banner-text { font-size: 10px; padding: 8px 10px; } /* Texto banner menor */
          .user-actions-desktop { display: none !important; } /* Esconde user/login no topo mobile para limpar espaço */
          .navbar-container { padding: 10px 16px; }
        }
      `}</style>

      {/* Banner Promocional */}
      <div
        className="banner-text"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1001,
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          textAlign: "center",
          fontWeight: "600",
          letterSpacing: "0.5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "40px" // Altura mínima garantida
        }}
      >
        ✨ COLEÇÃO EXCLUSIVA: ATÉ 50% OFF | FRETE GRÁTIS +R$149 ✨
      </div>

      {/* Navbar Principal */}
      <div
        style={{
          position: "fixed",
          top: "40px", // Assumindo que o banner tem ~40px
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
          className="navbar-container"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Esquerda: Hambúrguer (Mobile) + Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {/* Botão Hambúrguer Mobile */}
            <div className="mobile-trigger">
              <Button 
                icon="pi pi-bars" 
                text 
                rounded
                onClick={() => setVisibleMobileMenu(true)}
                style={{ color: "#333", padding: "0", width: "35px", height: "35px" }} 
              />
            </div>

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
                className="logo-img"
                style={{ width: "auto", objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Centro: Menu Desktop */}
          <div className="desktop-nav">
            <NavLinks />
          </div>

          {/* Direita: Ícones */}
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
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

            {/* Carrinho */}
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

            {/* User Desktop (Escondido no mobile via CSS) */}
            <div className="user-actions-desktop" style={{ gap: "20px", alignItems: "center" }}>
              {authenticated ? (
                <>
                  <i
                    className="pi pi-user"
                    onClick={() => navigate("/profile")}
                    style={{ fontSize: "20px", color: "#666", cursor: "pointer" }}
                    title="Minha Conta"
                  />
                  <i
                    className="pi pi-sign-out"
                    onClick={handleLogoutClick}
                    style={{ fontSize: "20px", color: "#666", cursor: "pointer" }}
                    title="Sair"
                  />
                </>
              ) : (
                <i
                  className="pi pi-user"
                  onClick={() => navigate("/login")}
                  style={{ fontSize: "20px", color: "#666", cursor: "pointer" }}
                  title="Entrar"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Espaçamento para o conteúdo não ficar atrás do header */}
      <div style={{ height: "110px" }} />

      {/* Sidebar Mobile */}
      <Sidebar 
        visible={visibleMobileMenu} 
        onHide={() => setVisibleMobileMenu(false)}
        style={{ width: "80%" }}
      >
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
             <img src="/assets/images/selene.png" alt="Logo" style={{ height: "40px" }} />
        </div>
        <NavLinks isMobile={true} />
      </Sidebar>

      {/* Caixa de busca */}
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