import { useState } from "react";
import { Link } from "react-router-dom";
import { recoverPasswordRequest } from "../services/auth";
import { useUiFeedback } from "../context/UiFeedbackContext";
import truckImage from "../../ASSETS/caminhão.avif";

export function RecoverPasswordPage() {
  const { showLoading, hideLoading, showSuccess, showError } = useUiFeedback();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");
    setIsLoading(true);
    showLoading("Carregando...");

    try {
      await recoverPasswordRequest({ email });
      setFeedback("Se o e-mail existir, você receberá o link de recuperação.");
      showSuccess("Solicitação enviada com sucesso");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Não foi possível enviar o link de recuperação. Tente novamente.";
      setFeedback(message);
      showError(message);
    } finally {
      setIsLoading(false);
      hideLoading();
    }
  }

  return (
    <main className="recovery-screen">
      <section className="recovery-screen__visual" aria-hidden="true">
        <img src={truckImage} alt="" />
      </section>

      <section className="recovery-screen__form-section">
        <form className="recovery-card" onSubmit={handleSubmit}>
          <div className="recovery-card__brand">
            <h1>SMART FROTA</h1>
            <p>SOLUÇÕES EM FROTA</p>
          </div>

          <p className="recovery-card__heading">Recuperar Senha</p>
          <p className="recovery-card__description">
            Informe seu e-mail para receber o link de recuperação
          </p>

          <label className="recovery-field-group" htmlFor="recoveryEmail">
            <span className="recovery-field-group__label">EMAIL</span>
            <input
              id="recoveryEmail"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <button
            className="recovery-submit-button"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "ENVIANDO..." : "ENTRAR"}
          </button>

          <p className="recovery-login-link">
            <Link to="/login">Voltar para o login</Link>
          </p>

          {feedback ? (
            <p className="recovery-feedback-message">{feedback}</p>
          ) : null}
        </form>
      </section>
    </main>
  );
}
