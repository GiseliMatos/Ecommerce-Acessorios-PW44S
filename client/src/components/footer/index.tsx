import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const styles = {
    footer: {
      backgroundColor: "#1a1f2e",
      color: "#a0a0a0",
      padding: "60px 20px 30px",
      width: "100vw",
      marginTop: "auto",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "40px",
      textAlign: "center" as const,
    },
    sectionTitle: {
      color: "#e91e63",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "20px",
      letterSpacing: "1px",
    },
    list: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    listItem: {
      marginBottom: "12px",
    },
    link: {
      color: "#a0a0a0",
      textDecoration: "none",
      fontSize: "14px",
      cursor: "pointer",
      transition: "color 0.2s",
    },
    socialLink: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#2d3748",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#a0a0a0",
      textDecoration: "none",
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.2s",
    },
    socialContainer: {
      display: "flex",
      gap: "15px",
      justifyContent: "center",
    },
    bottomBar: {
      borderTop: "1px solid #2d3748",
      marginTop: "50px",
      paddingTop: "30px",
      textAlign: "center" as const,
    },
    copyright: {
      color: "#6b7280",
      fontSize: "13px",
      margin: 0,
    },
  };

  const renderLink = (label: string, path: string = "/") => (
    <li style={styles.listItem}>
      <a
        onClick={() => navigate(path)}
        style={styles.link}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#a0a0a0")}
      >
        {label}
      </a>
    </li>
  );

  const renderSocial = (Icon: React.ElementType, href: string, color: string) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={styles.socialLink}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.color = "#ffffff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#2d3748";
        e.currentTarget.style.color = "#a0a0a0";
      }}
    >
      <Icon size={18} />
    </a>
  );

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* A Selene Acessórios */}
        <div>
          <h3 style={styles.sectionTitle}>SELENE ACESSÓRIOS</h3>
          <ul style={styles.list}>
            {renderLink("Sobre Nós")}
            {renderLink("Trabalhe Conosco")}
            {renderLink("Nossas Lojas Físicas")}
            {renderLink("Política de Privacidade")}
          </ul>
        </div>

        {/* AJUDA */}
        <div>
          <h3 style={styles.sectionTitle}>AJUDA</h3>
          <ul style={styles.list}>
            {renderLink("Fale Conosco")}
            {renderLink("Trocas e Devoluções")}
            {renderLink("Formas de Pagamento")}
            {renderLink("Rastrear Pedido")}
          </ul>
        </div>

        {/* MINHA CONTA */}
        <div>
          <h3 style={styles.sectionTitle}>MINHA CONTA</h3>
          <ul style={styles.list}>
            {renderLink("Login / Cadastro", "/login")}
            {renderLink("Meus Pedidos")}
            {renderLink("Meus Favoritos")}
          </ul>
        </div>

        {/* SIGA-NOS */}
        <div>
          <h3 style={styles.sectionTitle}>SIGA-NOS</h3>
          <div style={styles.socialContainer}>
            {renderSocial(FaFacebookF, "https://facebook.com", "#e1306c")}
            {renderSocial(FaInstagram, "https://instagram.com", "#e1306c")}
            {renderSocial(FaTwitter, "https://twitter.com", "#e1306c")}
          </div>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <p style={styles.copyright}>
          © 2025 Selene Acessórios. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
