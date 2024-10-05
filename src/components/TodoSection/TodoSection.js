import TodoItem from "./TodoItem";

export default class TodoSection {
  /**
   * @constructor
   * @param {*} store
   */
  constructor(store) {
    this.store = store;

    this.$todoSection = null;
  }

  #getTodoList() {
    return this.store.getTodoListByList(this.store.getSelectedListItem()) ?? [];
  }

  #getCompletedTodoCount() {
    return this.#getTodoList().filter((todoItem) => todoItem.isCompleted)
      .length;
  }

  // 요소 생성 메소드..
  #createTitleContainer() {
    const $titleContainer = document.createElement("div");
    $titleContainer.classList.add("title-container");

    const $left = document.createElement("div");
    $left.classList.add("left");
    $titleContainer.appendChild($left);

    const $title = document.createElement("h2");
    $title.innerText = this.store.getSelectedListItem();
    $left.appendChild($title);

    const $addButton = document.createElement("button");
    $addButton.setAttribute("type", "button");
    $addButton.innerText = "+";
    $addButton.addEventListener("click", () => {});
    $left.appendChild($addButton);

    const $count = document.createElement("div");
    $count.innerText = `${this.#getCompletedTodoCount()} / ${
      this.#getTodoList().length
    }`;
    $titleContainer.appendChild($count);

    return $titleContainer;
  }

  render() {
    if (!this.$todoSection) {
      this.$todoSection = document.createElement("section");
      this.$todoSection.id = "todo-section";
    }

    this.$todoSection.innerHTML = "";

    if (this.store.getSelectedListItem()) {
      this.$todoSection.appendChild(this.#createTitleContainer());

      const $todoList = document.createElement("ul");

      this.#getTodoList().forEach((todoItem) => {
        const $todoItem = new TodoItem({
          ...todoItem,
        });
        $todoList.appendChild($todoItem.render());
      });

      this.$todoSection.appendChild($todoList);
    } else {
      this.$todoSection.innerText = "선택 된 목록이 없습니다.";
    }

    return this.$todoSection;
  }
}
