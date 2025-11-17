import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Imagens banner 
  const bannerImages = [
    {
      url: "/assets/images/pecas.webp",
      link: "/products"
    },
    {
      url: "/assets/images/organicos.webp",
      link: "/products"
    },
    {
      url: "/assets/images/metal_gold.webp",
      link: "/products"
    },
    {
      url: "/assets/images/colares.webp",
      link: "/products"
    },
    {
      url: "/assets/images/colecao.webp",
      link: "/products"
    },
  ];

  // Auto-play do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleImageClick = (link: string) => {
    navigate(link);
  };

  return (
    <>
      {/* Banner Principal */}
      <div style={{ 
        position: "relative", 
        width: "100%", 
        height: "70vh", 
        maxHeight: "600px",
        overflow: "hidden",
        marginTop: "-40px",
        backgroundColor: "#f5f5f5"
      }}>
        {/* Slides do Banner */}
        {bannerImages.map((image, index) => (
          <div
            key={index}
            onClick={() => handleImageClick(image.link)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: currentSlide === index ? 1 : 0,
              transition: "opacity 1s ease-in-out",
              backgroundImage: `url(${image.url})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              cursor: "pointer"
            }}
          />
        ))}

        {/* Botão Anterior */}
        <button
          onClick={prevSlide}
          style={{
            position: "absolute",
            left: "30px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(155, 155, 155, 0.3)",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            transition: "all 0.3s ease",
            backdropFilter: "blur(5px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(155, 155, 155, 0.3)";
          }}
        >
          <i className="pi pi-chevron-left" style={{ fontSize: "20px", color: "#ffffff" }} />
        </button>

        {/* Botão Próximo */}
        <button
          onClick={nextSlide}
          style={{
            position: "absolute",
            right: "30px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(155, 155, 155, 0.3)",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            transition: "all 0.3s ease",
            backdropFilter: "blur(5px)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(155, 155, 155, 0.3)";
          }}
        >
          <i className="pi pi-chevron-right" style={{ fontSize: "20px", color: "#ffffff" }} />
        </button>

        {/* Indicadores */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "12px",
            zIndex: 10,
          }}
        >
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: currentSlide === index ? "40px" : "12px",
                height: "12px",
                borderRadius: "6px",
                border: "2px solid #ffffff",
                backgroundColor: currentSlide === index ? "#e1306c" : "rgba(155, 155, 155, 0.3)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(5px)",
              }}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Seção de Categorias em Destaque */}
      <div style={{
        padding: "60px 20px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "20px"
        }}>
          {/* Card 1 - Colares */}
          <div
            onClick={() => navigate("/products")}
            style={{
              position: "relative",
              height: "450px",
              overflow: "hidden",
              cursor: "pointer",
              borderRadius: "8px"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: "url(/assets/images/colar.webp)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.5s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "40px 30px",
              background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
              color: "#ffffff",
              zIndex: 1
            }}>
              <p style={{
                fontSize: "12px",
                letterSpacing: "2px",
                marginBottom: "10px",
                textTransform: "uppercase",
                fontWeight: "500"
              }}>ACESSÓRIOS</p>
              <h2 style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "15px",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>COLARES</h2>
              <button style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                border: "2px solid #ffffff",
                padding: "12px 30px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e1306c";
                e.currentTarget.style.borderColor = "#e1306c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#ffffff";
              }}
              >
                Descubra
              </button>
            </div>
          </div>

          {/* Card 2 - Brincos */}
          <div
            onClick={() => navigate("/products")}
            style={{
              position: "relative",
              height: "450px",
              overflow: "hidden",
              cursor: "pointer",
              borderRadius: "8px"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: "url(/assets/images/brinco.webp)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.5s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "40px 30px",
              background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
              color: "#ffffff",
              zIndex: 1
            }}>
              <p style={{
                fontSize: "12px",
                letterSpacing: "2px",
                marginBottom: "10px",
                textTransform: "uppercase",
                fontWeight: "500"
              }}>ACESSÓRIOS</p>
              <h2 style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "15px",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>BRINCOS</h2>
              <button style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                border: "2px solid #ffffff",
                padding: "12px 30px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e1306c";
                e.currentTarget.style.borderColor = "#e1306c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#ffffff";
              }}
              >
                Descubra
              </button>
            </div>
          </div>

          {/* Card 3 - Anéis */}
          <div
            onClick={() => navigate("/products")}
            style={{
              position: "relative",
              height: "450px",
              overflow: "hidden",
              cursor: "pointer",
              borderRadius: "8px"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: "url(/assets/images/anel.webp)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "transform 0.5s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "40px 30px",
              background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
              color: "#ffffff",
              zIndex: 1
            }}>
              <p style={{
                fontSize: "12px",
                letterSpacing: "2px",
                marginBottom: "10px",
                textTransform: "uppercase",
                fontWeight: "500"
              }}>ACESSÓRIOS</p>
              <h2 style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "15px",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>ANÉIS</h2>
              <button style={{
                backgroundColor: "transparent",
                color: "#ffffff",
                border: "2px solid #ffffff",
                padding: "12px 30px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e1306c";
                e.currentTarget.style.borderColor = "#e1306c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#ffffff";
              }}
              >
                Descubra
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Benefícios */}
      <div style={{
        backgroundColor: "#f9f9f9",
        padding: "50px 20px",
        borderTop: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0"
      }}>
        <div style={{
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "40px",
          textAlign: "center"
        }}>
          {/* Frete Grátis */}
          <div>
            <i className="pi pi-truck" style={{
              fontSize: "40px",
              color: "#e1306c",
              marginBottom: "15px",
              display: "block"
            }} />
            <h3 style={{
              fontSize: "16px",
              fontWeight: "700",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>FRETE GRÁTIS</h3>
            <p style={{
              fontSize: "14px",
              color: "#666",
              lineHeight: "1.6"
            }}>acima de R$149</p>
          </div>

          {/* Pague com PIX */}
          <div>
            <i className="pi pi-qrcode" style={{
              fontSize: "40px",
              color: "#e1306c",
              marginBottom: "15px",
              display: "block"
            }} />
            <h3 style={{
              fontSize: "16px",
              fontWeight: "700",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>PAGUE COM PIX</h3>
            <p style={{
              fontSize: "14px",
              color: "#666",
              lineHeight: "1.6"
            }}>e ganhe 5% OFF</p>
          </div>

          {/* Parcelamento */}
          <div>
            <i className="pi pi-credit-card" style={{
              fontSize: "40px",
              color: "#e1306c",
              marginBottom: "15px",
              display: "block"
            }} />
            <h3 style={{
              fontSize: "16px",
              fontWeight: "700",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>PARCELAMENTO</h3>
            <p style={{
              fontSize: "14px",
              color: "#666",
              lineHeight: "1.6"
            }}>em até 12x sem juros</p>
          </div>

          {/* Trocas */}
          <div>
            <i className="pi pi-sync" style={{
              fontSize: "40px",
              color: "#e1306c",
              marginBottom: "15px",
              display: "block"
            }} />
            <h3 style={{
              fontSize: "16px",
              fontWeight: "700",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>TROCAS</h3>
            <p style={{
              fontSize: "14px",
              color: "#666",
              lineHeight: "1.6"
            }}>prazo de 30 dias</p>
          </div>

          {/* Cashback */}
          <div>
            <i className="pi pi-wallet" style={{
              fontSize: "40px",
              color: "#e1306c",
              marginBottom: "15px",
              display: "block"
            }} />
            <h3 style={{
              fontSize: "16px",
              fontWeight: "700",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>CASHBACK</h3>
            <p style={{
              fontSize: "14px",
              color: "#666",
              lineHeight: "1.6"
            }}>ganhe 12% de bônus</p>
          </div>

          {/* Entrega Rápida */}
          <div>
            <i className="pi pi-bolt" style={{
              fontSize: "40px",
              color: "#e1306c",
              marginBottom: "15px",
              display: "block"
            }} />
            <h3 style={{
              fontSize: "16px",
              fontWeight: "700",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}>ENTREGA RÁPIDA</h3>
            <p style={{
              fontSize: "14px",
              color: "#666",
              lineHeight: "1.6"
            }}>Seu pedido em 24h</p>
          </div>
        </div>
      </div>

      {/* Seção "Você vai gostar" - Carrossel de Produtos */}
      <div style={{
        padding: "60px 20px",
        maxWidth: "1800px",
        margin: "0 auto"
      }}>
        <h2 style={{
          fontSize: "32px",
          fontWeight: "700",
          textAlign: "center",
          marginBottom: "50px",
          textTransform: "uppercase",
          letterSpacing: "2px"
        }}>VOCÊ VAI GOSTAR!</h2>
        
        <div style={{
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            display: "flex",
            gap: "20px",
            animation: "scroll 20s linear infinite",
            width: "fit-content"
          }}>
            {/* Produtos - duplicados para efeito contínuo */}
            {[...Array(2)].map((_, setIndex) => (
              <React.Fragment key={setIndex}>
                {/* Produto 1 */}
                <div style={{
                  minWidth: "280px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                onClick={() => navigate("/products")}>
                  <div style={{
                    width: "100%",
                    height: "280px",
                    backgroundImage: "url(/assets/images/colar.webp)",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }} />
                  <div style={{ padding: "20px" }}>
                    <p style={{
                      fontSize: "12px",
                      color: "#999",
                      marginBottom: "8px",
                      textTransform: "uppercase"
                    }}>Novidades semana</p>
                    <h3 style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "12px",
                      color: "#333"
                    }}>Conjunto Ponto de Luz</h3>
                    <p style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#e1306c",
                      marginBottom: "15px"
                    }}>R$ 79,90</p>
                    <button style={{
                      width: "100%",
                      backgroundColor: "#C9A063",
                      color: "#fff",
                      border: "none",
                      padding: "12px",
                      fontSize: "14px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b8904f"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#C9A063"}>
                      ADICIONAR AO CARRINHO
                    </button>
                  </div>
                </div>

                {/* Produto 2 */}
                <div style={{
                  minWidth: "280px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                onClick={() => navigate("/products")}>
                  <div style={{
                    width: "100%",
                    height: "280px",
                    backgroundImage: "url(/assets/images/brinco.webp)",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }} />
                  <div style={{ padding: "20px" }}>
                    <p style={{
                      fontSize: "12px",
                      color: "#999",
                      marginBottom: "8px",
                      textTransform: "uppercase"
                    }}>Novidades semana</p>
                    <h3 style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "12px",
                      color: "#333"
                    }}>Conjunto Infinito</h3>
                    <p style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#e1306c",
                      marginBottom: "15px"
                    }}>R$ 119,90</p>
                    <button style={{
                      width: "100%",
                      backgroundColor: "#C9A063",
                      color: "#fff",
                      border: "none",
                      padding: "12px",
                      fontSize: "14px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b8904f"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#C9A063"}>
                      ADICIONAR AO CARRINHO
                    </button>
                  </div>
                </div>

                {/* Produto 3 */}
                <div style={{
                  minWidth: "280px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                onClick={() => navigate("/products")}>
                  <div style={{
                    width: "100%",
                    height: "280px",
                    backgroundImage: "url(/assets/images/anel.webp)",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }} />
                  <div style={{ padding: "20px" }}>
                    <p style={{
                      fontSize: "12px",
                      color: "#999",
                      marginBottom: "8px",
                      textTransform: "uppercase"
                    }}>Novidades semana</p>
                    <h3 style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "12px",
                      color: "#333"
                    }}>Argola Trabalhada</h3>
                    <p style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#e1306c",
                      marginBottom: "15px"
                    }}>R$ 59,90</p>
                    <button style={{
                      width: "100%",
                      backgroundColor: "#C9A063",
                      color: "#fff",
                      border: "none",
                      padding: "12px",
                      fontSize: "14px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b8904f"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#C9A063"}>
                      ADICIONAR AO CARRINHO
                    </button>
                  </div>
                </div>

                {/* Produto 4 */}
                <div style={{
                  minWidth: "280px",
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "transform 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                onClick={() => navigate("/products")}>
                  <div style={{
                    width: "100%",
                    height: "280px",
                    backgroundImage: "url(/assets/images/colares.webp)",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }} />
                  <div style={{ padding: "20px" }}>
                    <p style={{
                      fontSize: "12px",
                      color: "#999",
                      marginBottom: "8px",
                      textTransform: "uppercase"
                    }}>Novidades semana</p>
                    <h3 style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      marginBottom: "12px",
                      color: "#333"
                    }}>Conjunto de Esferas</h3>
                    <p style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#e1306c",
                      marginBottom: "15px"
                    }}>R$ 119,90</p>
                    <button style={{
                      width: "100%",
                      backgroundColor: "#C9A063",
                      color: "#fff",
                      border: "none",
                      padding: "12px",
                      fontSize: "14px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#b8904f"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#C9A063"}>
                      ADICIONAR AO CARRINHO
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-280px * 4 - 80px));
            }
          }
        `}</style>
      </div>

      {/* Seção Newsletter */}
      <div style={{
        backgroundColor: "#fff",
        padding: "80px 20px",
        textAlign: "center"
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto"
        }}>
          <h2 style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: "700",
            marginBottom: "15px",
            textTransform: "uppercase",
            letterSpacing: "3px"
          }}>NEWSLETTER</h2>
          <p style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "40px",
            lineHeight: "1.6"
          }}>Cadastre-se para receber as novidades e ganhe 15% na primeira compra!</p>
          
          <div style={{
            display: "flex",
            gap: "15px",
            maxWidth: "600px",
            margin: "0 auto",
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            <input
              type="text"
              placeholder="Nome"
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "15px 20px",
                fontSize: "14px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                outline: "none"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#e1306c"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#ddd"}
            />
            <input
              type="email"
              placeholder="E-mail"
              style={{
                flex: "1",
                minWidth: "200px",
                padding: "15px 20px",
                fontSize: "14px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                outline: "none"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#e1306c"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#ddd"}
            />
            <button style={{
              padding: "15px 40px",
              backgroundColor: "#e1306c",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              letterSpacing: "1px"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#c91e5a"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e1306c"}>
              Cadastrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
