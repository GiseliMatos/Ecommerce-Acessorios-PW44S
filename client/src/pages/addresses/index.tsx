import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import AddressService, { type IAddress } from "@/services/address-service";

export const AddressesPage = () => {
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState<IAddress>({
    street: "",
    complement: "",
    zipCode: "",
    city: "",
    state: "",
    country: "Brasil"
  });

  useEffect(() => {
    if (!authenticated) {
      navigate("/login?redirect=/addresses");
      return;
    }

    loadAddresses();
  }, [authenticated, navigate]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await AddressService.findAllByAuthenticatedUser();
      if (response.status === 200) {
        setAddresses(response.data);
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
        city: data.localidade || "",
        state: data.uf || "",
        complement: data.complemento || prev.complement
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
    setFormData(prev => ({ ...prev, zipCode: value }));
    
    const cleanCep = value.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      searchCep(value);
    }
  };

  const handleOpenDialog = (address?: IAddress) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      setEditingAddress(null);
      setFormData({
        street: "",
        complement: "",
        zipCode: "",
        city: "",
        state: "",
        country: "Brasil"
      });
    }
    setShowDialog(true);
  };

  const handleSaveAddress = async () => {
    if (!formData.street || !formData.zipCode || !formData.city || !formData.state) {
      toast.current?.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Preencha todos os campos obrigatórios.",
        life: 3000,
      });
      return;
    }

    try {
      const response = await AddressService.create(formData);
      if (response.status === 201) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Endereço adicionado!",
          life: 2000,
        });
        loadAddresses();
        setShowDialog(false);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao salvar endereço.",
        life: 3000,
      });
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      await AddressService.remove(id);
      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Endereço removido!",
        life: 2000,
      });
      loadAddresses();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao remover endereço.",
        life: 3000,
      });
    }
  };

  if (!authenticated) {
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

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: "40px" }}>
      <Toast ref={toast} />
      
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
                  border: "2px solid transparent",
                  position: "relative"
                }}
              >
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "15px",
                  color: "#333"
                }}>
                  Endereço
                </h3>

                <p style={{
                  fontSize: "14px",
                  color: "#666",
                  lineHeight: "1.8",
                  marginBottom: "20px"
                }}>
                  {address.street}
                  {address.complement && ` - ${address.complement}`}<br />
                  {address.city} - {address.state}<br />
                  CEP: {address.zipCode}<br />
                  {address.country}
                </p>

                <div style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap"
                }}>
                  <button
                    onClick={() => handleDeleteAddress(address.id!)}
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
                  >
                    <i className="pi pi-trash" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
              CEP *
            </label>
            <InputMask
              value={formData.zipCode}
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

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
              País *
            </label>
            <InputText
              value={formData.country}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};
