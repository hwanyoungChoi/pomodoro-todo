import Header from "./components/Header";
import ListSection from "./components/ListSection";
import TodoSection from "./components/TodoSection";
import { COMPONENT_KEYS } from "./lib/constant";
import Store from "./lib/store";

export default class App {
  constructor() {
    this.store = new Store("todoApp");
    this.store.subscribe(COMPONENT_KEYS.APP, () => this.render());

    this.$app = null;
    this.$header = new Header(this.store);
    this.$listSection = new ListSection(this.store);
    this.$todoSection = new TodoSection(this.store);
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
