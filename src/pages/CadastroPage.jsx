import { useState } from "react";
import { Link } from "react-router-dom";
import { registerRequest } from "../services/auth";
import truckImage from "../../ASSETS/caminhão.avif";

export function CadastroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");

    if (password !== confirmPassword) {
      setFeedback("As senhas não conferem.");
      return;
    }

    setIsLoading(true);

    try {
      await registerRequest({
        name,
        email,
        password,
      });

      setFeedback("Conta criada com sucesso.");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Não foi possível criar a conta. Verifique os dados e tente novamente.";
      setFeedback(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="register-screen">
      <section className="register-screen__visual" aria-hidden="true">
        <img src={truckImage} alt="" />
      </section>

      <section className="register-screen__form-section">
        <form className="register-card" onSubmit={handleSubmit}>
          <div className="register-card__brand">
            <h1>SMART FROTA</h1>
            <p>SOLUÇÕES EM FROTA</p>
          </div>

          <p className="register-card__heading">Criar Conta</p>

          <label className="register-field-group" htmlFor="name">
            <span className="register-field-group__label">NOME</span>
            <input
              id="name"
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </label>

          <label className="register-field-group" htmlFor="email">
            <span className="register-field-group__label">EMAIL</span>
            <input
              id="email"
              type="email"
              placeholder="Digite o seu e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="register-field-group" htmlFor="password">
            <span className="register-field-group__label">SENHA</span>
            <input
              id="password"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <label className="register-field-group" htmlFor="confirmPassword">
            <span className="register-field-group__label">CONFIRMAR SENHA</span>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirmar senha"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>

          <button
            className="register-submit-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "CADASTRANDO..." : "CADASTRAR"}
          </button>

          <p className="register-login-link">
            <Link to="/login">Já tem uma conta? Entrar</Link>
          </p>

          {feedback ? (
            <p className="register-feedback-message">{feedback}</p>
          ) : null}
        </form>
      </section>
    </main>
  );
}
