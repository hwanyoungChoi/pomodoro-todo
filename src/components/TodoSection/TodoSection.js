import Button from "../Button";
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
    const formExists = this.$todoSection.querySelector("#todo-item-form");
    if (formExists) {
      return;
    }

    this.$todoSection.appendChild(
      new TodoItemForm({
        onSubmit: this.#handleFormSubmitButtonClick.bind(this),
        onCancel: this.#handleFormCancelButtonClick.bind(this),
      }).render()
    );
  }

  #handleTodoItemComplete(index, todoItem) {
    this.store.updateTodoItemByList(
      this.store.getSelectedListItem(),
      index,
      todoItem
    );
  }

  #handleTodoItemDelete(index) {
    if (confirm("정말 삭제하시겠어요?")) {
      this.store.deleteTodoItemByList(this.store.getSelectedListItem(), index);
    }
  }

  #handleTodoItemPlay(index) {
    this.store.setPlayedTodoInfo(this.store.getSelectedListItem(), index);
  }

  #handleTodoItemStop() {
    this.store.deletePlayedTodoInfo();
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

    $left.appendChild(
      new Button({
        text: "+",
        type: "button",
        onClick: () => this.#handleAddButtonClick(),
      }).render()
    );

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
        isPlayed: this.store.getPlayedTodoInfo()?.todoItemIndex === index,
        onUpdate: this.#handleTodoItemComplete.bind(this, index),
        onDelete: this.#handleTodoItemDelete.bind(this, index),
        onPlay: this.#handleTodoItemPlay.bind(this, index),
        onStop: this.#handleTodoItemStop.bind(this),
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
