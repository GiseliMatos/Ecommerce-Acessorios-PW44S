import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";

interface IAddress {
  id: number;
  name: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export const AddressesPage = () => {
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    isDefault: false
  });

  useEffect(() => {
    if (!authenticated) {
      navigate("/login?redirect=/addresses");
      return;
    }

    // Simular carregamento de endereços
    const mockAddresses: IAddress[] = [
      {
        id: 1,
        name: "Casa",
        cep: "01234-567",
        street: "Rua Exemplo",
        number: "123",
        complement: "Apto 45",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        isDefault: true
      }
    ];
    setAddresses(mockAddresses);
  }, [authenticated, navigate]);

  const searchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    
    if (cleanCep.length !== 8) {
      return;
    }

    setLoadingCep(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "CEP não encontrado.",
          life: 3000,
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || ""
      }));

      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "CEP encontrado!",
        life: 2000,
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao buscar CEP.",
        life: 3000,
      });
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepChange = (value: string) => {
    setFormData(prev => ({ ...prev, cep: value }));
    
    const cleanCep = value.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      searchCep(value);
    }
  };

  const handleOpenDialog = (address?: IAddress) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        name: address.name,
        cep: address.cep,
        street: address.street,
        number: address.number,
        complement: address.complement || "",
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        isDefault: address.isDefault
      });
    } else {
      setEditingAddress(null);
      setFormData({
        name: "",
        cep: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        isDefault: false
      });
    }
    setShowDialog(true);
  };

  const handleSaveAddress = () => {
    if (!formData.name || !formData.cep || !formData.street || !formData.number || 
        !formData.neighborhood || !formData.city || !formData.state) {
      toast.current?.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Preencha todos os campos obrigatórios.",
        life: 3000,
      });
      return;
    }

    if (editingAddress) {
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addr, ...formData }
          : formData.isDefault ? { ...addr, isDefault: false } : addr
      ));
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Endereço atualizado!",
        life: 2000,
      });
    } else {
      const newAddress: IAddress = {
        id: Date.now(),
        ...formData
      };
      
      setAddresses(prev => {
        if (formData.isDefault) {
          return [...prev.map(addr => ({ ...addr, isDefault: false })), newAddress];
        }
        return [...prev, newAddress];
      });
      
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Endereço adicionado!",
        life: 2000,
      });
    }

    setShowDialog(false);
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    toast.current?.show({
      severity: "success",
      summary: "Sucesso",
      detail: "Endereço removido!",
      life: 2000,
    });
  };

  const handleSetDefault = (id: number) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.current?.show({
      severity: "success",
      summary: "Sucesso",
      detail: "Endereço padrão atualizado!",
      life: 2000,
    });
  };

  if (!authenticated) {
    return null;
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>
      <Toast ref={toast} />
      
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
            <span>Meus Endereços</span>
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          flexWrap: "wrap",
          gap: "15px"
        }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "2px"
          }}>
            MEUS ENDEREÇOS
          </h1>

          <button
            onClick={() => handleOpenDialog()}
            style={{
              padding: "15px 30px",
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
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#e1306c"}
          >
            <i className="pi pi-plus" style={{ marginRight: "10px" }} />
            Novo Endereço
          </button>
        </div>

        {addresses.length === 0 ? (
          <div style={{
            backgroundColor: "#fff",
            padding: "60px 20px",
            textAlign: "center",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <i className="pi pi-map-marker" style={{
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
              Nenhum endereço cadastrado
            </h2>
            <p style={{
              fontSize: "16px",
              color: "#666",
              marginBottom: "30px"
            }}>
              Adicione um endereço para facilitar suas compras
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "20px"
          }}>
            {addresses.map(address => (
              <div
                key={address.id}
                style={{
                  backgroundColor: "#fff",
                  padding: "25px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: address.isDefault ? "2px solid #e1306c" : "2px solid transparent",
                  position: "relative"
                }}
              >
                {address.isDefault && (
                  <div style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    padding: "5px 12px",
                    backgroundColor: "#e1306c",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "600",
                    borderRadius: "12px"
                  }}>
                    PADRÃO
                  </div>
                )}

                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "15px",
                  color: "#333"
                }}>
                  {address.name}
                </h3>

                <p style={{
                  fontSize: "14px",
                  color: "#666",
                  lineHeight: "1.8",
                  marginBottom: "20px"
                }}>
                  {address.street}, {address.number}
                  {address.complement && ` - ${address.complement}`}<br />
                  {address.neighborhood}<br />
                  {address.city} - {address.state}<br />
                  CEP: {address.cep}
                </p>

                <div style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap"
                }}>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      style={{
                        flex: 1,
                        padding: "10px",
                        backgroundColor: "#fff",
                        color: "#e1306c",
                        border: "1px solid #e1306c",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
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
                      Tornar Padrão
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleOpenDialog(address)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "#fff",
                      color: "#666",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
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
                    <i className="pi pi-pencil" style={{ marginRight: "5px" }} />
                    Editar
                  </button>
                  
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    style={{
                      padding: "10px",
                      backgroundColor: "#fff",
                      color: "#dc3545",
                      border: "1px solid #dc3545",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#dc3545";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#fff";
                      e.currentTarget.style.color = "#dc3545";
                    }}
                  >
                    <i className="pi pi-trash" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog de Adicionar/Editar Endereço */}
      <Dialog
        header={editingAddress ? "Editar Endereço" : "Novo Endereço"}
        visible={showDialog}
        style={{ width: "600px", maxWidth: "90vw" }}
        onHide={() => setShowDialog(false)}
        footer={
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              onClick={() => setShowDialog(false)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#fff",
                color: "#666",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveAddress}
              style={{
                padding: "10px 20px",
                backgroundColor: "#e1306c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Salvar
            </button>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
              Nome do Endereço *
            </label>
            <InputText
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Casa, Trabalho"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
              CEP *
            </label>
            <InputMask
              value={formData.cep}
              onChange={(e) => handleCepChange(e.value || "")}
              mask="99999-999"
              placeholder="00000-000"
              style={{ width: "100%" }}
            />
            {loadingCep && <small>Buscando CEP...</small>}
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
              Rua *
            </label>
            <InputText
              value={formData.street}
              onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
                Número *
              </label>
              <InputText
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
                Complemento
              </label>
              <InputText
                value={formData.complement}
                onChange={(e) => setFormData(prev => ({ ...prev, complement: e.target.value }))}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
              Bairro *
            </label>
            <InputText
              value={formData.neighborhood}
              onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
                Cidade *
              </label>
              <InputText
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
                Estado *
              </label>
              <InputText
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                maxLength={2}
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
              style={{ accentColor: "#e1306c" }}
            />
            <label>Definir como endereço padrão</label>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
