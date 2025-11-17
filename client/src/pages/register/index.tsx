import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import type { IUserRegister } from "@/commons/types";
import AuthService from "@/services/auth-service";
import { Toast } from "primereact/toast";

export const RegisterPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserRegister>({
    defaultValues: { username: "", password: "", displayName: "" },
  });
  const { signup } = AuthService;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const onSubmit = async (data: IUserRegister) => {
    setLoading(true);
    try {
      const response = await signup(data);
      if (response.status === 200) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Usuário cadastrado com sucesso.",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao cadastrar usuário.",
          life: 3000,
        });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao cadastrar usuário.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      marginTop: "-100px"
    }}>
      <Toast ref={toast} />
      
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        maxWidth: "450px",
        width: "100%",
        padding: "50px 40px"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "40px"
        }}>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#333",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            Criar Conta
          </h1>
          <p style={{
            fontSize: "14px",
            color: "#666"
          }}>
            Preencha os dados para se cadastrar
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Display Name */}
          <div style={{ marginBottom: "25px" }}>
            <label 
              htmlFor="displayName" 
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333"
              }}
            >
              Nome Completo
            </label>
            <Controller
              name="displayName"
              control={control}
              rules={{ required: "Informe seu nome completo" }}
              render={({ field }) => (
                <InputText
                  id="displayName"
                  {...field}
                  placeholder="Digite seu nome completo"
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    fontSize: "14px",
                    border: errors.displayName ? "2px solid #dc3545" : "1px solid #ddd",
                    borderRadius: "6px"
                  }}
                />
              )}
            />
            {errors.displayName && (
              <small style={{
                color: "#dc3545",
                fontSize: "12px",
                marginTop: "5px",
                display: "block"
              }}>
                {errors.displayName.message}
              </small>
            )}
          </div>

          {/* Username */}
          <div style={{ marginBottom: "25px" }}>
            <label 
              htmlFor="username" 
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333"
              }}
            >
              Usuário
            </label>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Informe um nome de usuário" }}
              render={({ field }) => (
                <InputText
                  id="username"
                  {...field}
                  placeholder="Digite um nome de usuário"
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    fontSize: "14px",
                    border: errors.username ? "2px solid #dc3545" : "1px solid #ddd",
                    borderRadius: "6px"
                  }}
                />
              )}
            />
            {errors.username && (
              <small style={{
                color: "#dc3545",
                fontSize: "12px",
                marginTop: "5px",
                display: "block"
              }}>
                {errors.username.message}
              </small>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "30px" }}>
            <label 
              htmlFor="password" 
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#333"
              }}
            >
              Senha
            </label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Informe uma senha",
                minLength: { value: 6, message: "A senha deve ter no mínimo 6 caracteres" },
              }}
              render={({ field }) => (
                <Password
                  id="password"
                  {...field}
                  toggleMask
                  feedback={false}
                  placeholder="Digite uma senha"
                  inputStyle={{
                    width: "160%",
                    padding: "12px 15px",
                    fontSize: "14px",
                    border: errors.password ? "2px solid #dc3545" : "1px solid #ddd",
                    borderRadius: "6px"
                  }}
                  style={{ width: "100%" }}
                />
              )}
            />
            {errors.password && (
              <small style={{
                color: "#dc3545",
                fontSize: "12px",
                marginTop: "5px",
                display: "block"
              }}>
                {errors.password.message}
              </small>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            label="CRIAR CONTA"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#e1306c",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "700",
              letterSpacing: "1px",
              cursor: loading || isSubmitting ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease"
            }}
            onMouseEnter={(e) => {
              if (!loading && !isSubmitting) {
                e.currentTarget.style.backgroundColor = "#c91e5a";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && !isSubmitting) {
                e.currentTarget.style.backgroundColor = "#e1306c";
              }
            }}
          />
        </form>

        {/* Login Link */}
        <div style={{
          textAlign: "center",
          marginTop: "30px",
          paddingTop: "25px",
          borderTop: "1px solid #e0e0e0"
        }}>
          <p style={{
            fontSize: "14px",
            color: "#666"
          }}>
            Já tem uma conta?{" "}
            <Link 
              to="/login" 
              style={{
                color: "#e1306c",
                fontWeight: "600",
                textDecoration: "none"
              }}
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
