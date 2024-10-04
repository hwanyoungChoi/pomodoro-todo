import Header from "./components/Header";
import ListSection from "./components/ListSection";
import TodoSection from "./components/TodoSection";
import Store from "./lib/store";

export default class App {
  constructor() {
    this.store = new Store("todoApp", this.render.bind(this));

    this.$app = null;
    this.$header = new Header();
    this.$listSection = new ListSection(this.store);
    this.$todoSection = new TodoSection();
  }

  render() {
    if (!this.$app) {
      this.$app = document.createElement("div");
    }

    this.$app.innerHTML = "";
    this.$app.appendChild(this.$header.render());

    const $main = document.createElement("main");
    $main.appendChild(this.$listSection.render());
    $main.appendChild(this.$todoSection.render());

    this.$app.appendChild($main);

    return this.$app;
  }
}
