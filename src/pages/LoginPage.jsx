import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest } from "../services/auth";
import truckImage from "../../ASSETS/caminhão.avif";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepConnected, setKeepConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");
    setIsLoading(true);

    try {
      await loginRequest({
        email,
        password,
        keepConnected,
      });

      localStorage.setItem("smart-frota-authenticated", "true");
      if (keepConnected) {
        localStorage.setItem("smart-frota-remember", "true");
      } else {
        localStorage.removeItem("smart-frota-remember");
      }

      setFeedback("Login realizado com sucesso.");
      navigate("/home");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Não foi possível autenticar. Verifique os dados e tente novamente.";
      setFeedback(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-screen__visual" aria-hidden="true">
        <img src={truckImage} alt="" />
      </section>

      <section className="login-screen__form-section">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card__brand">
            <h1>SMART FROTA</h1>
            <p>SOLUÇÕES EM FROTA</p>
          </div>

          <p className="login-card__heading">
            <span>Acesse o </span>
            <strong>PORTAL DE GESTÃO</strong>
          </p>

          <label className="login-field-group" htmlFor="email">
            <span className="login-field-group__label">EMAIL</span>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="login-field-group" htmlFor="password">
            <span className="login-field-group__label">SENHA</span>
            <input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <div className="login-meta-row">
            <label className="login-checkbox-row" htmlFor="keepConnected">
              <input
                id="keepConnected"
                type="checkbox"
                checked={keepConnected}
                onChange={(event) => setKeepConnected(event.target.checked)}
              />
              <span>Manter Conectado</span>
            </label>

            <Link to="/recuperar-senha">Recuperar senha</Link>
          </div>

          <button
            className="login-submit-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "ENTRANDO..." : "ENTRAR"}
          </button>

          <p className="login-register-link">
            <Link to="/cadastro">Não possui conta? Cadastre-se</Link>
          </p>

          {feedback ? (
            <p className="login-feedback-message">{feedback}</p>
          ) : null}
        </form>
      </section>
    </main>
  );
}
