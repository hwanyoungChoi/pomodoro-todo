import App from "./App";
import "./reset.css";
import "./style.css";

window.document.addEventListener("DOMContentLoaded", () => {
  const rootElement = window.document.getElementById("app");
  const app = new App();

  rootElement.appendChild(app.render());
});
