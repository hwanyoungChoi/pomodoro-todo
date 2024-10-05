import TodoItem from "./TodoItem";
import TodoItemForm from "./TodoItemForm";

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

  #handleFormSubmitButtonClick(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const name = formData.get("name");
    const pomodoroTime = formData.get("pomodoroTime");

    this.store.addTodoItemByList(this.store.getSelectedListItem(), {
      name,
      pomodoroTime,
      pomodoroCount: 0,
      isCompleted: false,
    });
  }

  #handleFormCancelButtonClick() {
    const form = this.$todoSection.querySelector("form");
    if (form) {
      form.remove();
    }
  }

  #handleAddButtonClick() {
    this.$todoSection.appendChild(
      new TodoItemForm({
        onSubmit: this.#handleFormSubmitButtonClick.bind(this),
        onCancel: this.#handleFormCancelButtonClick.bind(this),
      }).render()
    );
  }

  #handleTodoItemComplete(index, todoItem) {
    const updatedTodoItem = {
      ...todoItem,
      isCompleted: !todoItem.isCompleted,
    };
    this.store.updateTodoItemByList(
      this.store.getSelectedListItem(),
      index,
      updatedTodoItem
    );
  }

  #handleTodoItemDelete(index) {
    if (confirm("정말 삭제하시겠어요?")) {
      this.store.deleteTodoItemByList(this.store.getSelectedListItem(), index);
    }
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
    $addButton.addEventListener("click", () => {
      this.#handleAddButtonClick();
    });
    $left.appendChild($addButton);

    const $count = document.createElement("div");
    $count.innerText = `${this.#getCompletedTodoCount()} / ${
      this.#getTodoList().length
    }`;
    $titleContainer.appendChild($count);

    return $titleContainer;
  }

  #createTodoList() {
    const $todoList = document.createElement("ul");

    this.#getTodoList().forEach((todoItem, index) => {
      const $todoItem = new TodoItem({
        ...todoItem,
        onComplete: this.#handleTodoItemComplete.bind(this, index, todoItem),
        onDelete: this.#handleTodoItemDelete.bind(this, index),
      });
      $todoList.appendChild($todoItem.render());
    });

    return $todoList;
  }

  render() {
    if (!this.$todoSection) {
      this.$todoSection = document.createElement("section");
      this.$todoSection.id = "todo-section";
    }

    this.$todoSection.innerHTML = "";

    if (this.store.getSelectedListItem()) {
      this.$todoSection.appendChild(this.#createTitleContainer());
      this.$todoSection.appendChild(this.#createTodoList());
    } else {
      this.$todoSection.innerText = "선택 된 목록이 없습니다.";
    }

    return this.$todoSection;
  }
}
