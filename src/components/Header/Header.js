import Button from "../Button";

export default class Header {
  /**
   * @constructor
   * @param {*} store
   */
  constructor(store) {
    this.store = store;

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
          <em>${this.store.getSelectedListItem()} / </em>
          ${
            this.store.getTodoListByList(
              this.store.getPlayedTodoInfo().listName
            )[this.store.getPlayedTodoInfo().todoItemIndex].name
          }
        </div>
      `;

      const $rightContainer = document.createElement("div");
      $title.appendChild($rightContainer);

      $rightContainer.appendChild(
        new Button({
          text: "⏹️",
          type: "button",
          onClick: () => this.store.deletePlayedTodoInfo(),
        }).render()
      );

      $rightContainer.appendChild(
        new Button({
          text: "⏸️",
          type: "button",
          onClick: () => {},
        }).render()
      );

      this.$header.appendChild($title);
    }

    return this.$header;
  }
}
