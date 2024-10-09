import { COMPONENT_KEYS } from "../../lib/constant";
import Button from "../Button";
import Counter from "../Counter";

export default class Header {
  /**
   * @constructor
   * @param {*} store
   */
  constructor(store) {
    this.store = store;
    this.store.subscribe(COMPONENT_KEYS.HEADER, () => this.render());

    this.$header = null;
  }

  render() {
    if (!this.$header) {
      this.$header = document.createElement("header");
    }

    this.$header.innerHTML = "";

    if (!this.store.getPlayedTodoInfo()) {
      const $title = document.createElement("h1");
      $title.innerText = "Pomodoro Todo App";
      this.$header.appendChild($title);
    } else {
      const $title = document.createElement("h1");
      $title.innerHTML = `
        <div>
          <em>${this.store.getPlayedTodoInfo().listName} / </em>
          ${
            this.store.getTodoListByList(
              this.store.getPlayedTodoInfo().listName
            )[this.store.getPlayedTodoInfo().todoItemIndex].name
          }
        </div>
      `;

      const $rightContainer = document.createElement("div");
      $rightContainer.classList.add("right-container");
      $title.appendChild($rightContainer);

      $rightContainer.appendChild(
        new Counter(
          this.store.getPlayedTodoInfo().listName,
          this.store.getPlayedTodoInfo().todoItemIndex
        ).render()
      );

      $rightContainer.appendChild(
        new Button({
          text: "⏹️",
          type: "button",
          onClick: () => this.store.stopCount(),
        }).render()
      );

      $rightContainer.appendChild(
        new Button({
          text: this.store.getIsPaused() ? "▶️" : "⏸️",
          type: "button",
          onClick: () => this.store.toggleCount(),
        }).render()
      );

      this.$header.appendChild($title);
    }

    return this.$header;
  }
}
