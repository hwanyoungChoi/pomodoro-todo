import Button from "../Button";
import TodoItemForm from "./TodoItemForm";

export default class TodoItem {
  /**
   * @constructor
   * @param {Object} options - 할일 아이템의 속성
   * @param {string} options.name - 할일 아이템의 이름
   * @param {number} options.pomodoroTime - 할일 아이템의 포모도로 시간 (초 단위)
   * @param {boolean} options.pomodoroCount - 할일 아이템의 포도도로 완료 수
   * @param {boolean} options.isCompleted - 할일 아이템의 완료 여부
   * @param {boolean} isPlayed - 할일 포모도로 시작 여부
   * @param {Function} onUpdate - 할일 아이템 업데이트 이벤트
   * @param {Function} onDelete - 할일 아이템의 삭제 이벤트
   * @param {Function} onPlay - 할일 아이템 시작 이벤트
   * @param {Function} onStop - 할일 아이템 중지 이벤트
   */
  constructor({
    name,
    pomodoroTime,
    pomodoroCount,
    isCompleted,
    isPlayed,
    onUpdate,
    onDelete,
    onPlay,
    onStop,
  }) {
    this.name = name;
    this.pomodoroTime = pomodoroTime;
    this.pomodoroCount = pomodoroCount;
    this.isCompleted = isCompleted;
    this.isPlayed = isPlayed;
    this.onUpdate = onUpdate;
    this.onDelete = onDelete;
    this.onPlay = onPlay;
    this.onStop = onStop;

    this.isEdit = false;

    this.$todoItem = null;
  }

  #createNameContainer() {
    const $nameContainer = document.createElement("div");
    $nameContainer.classList.add("name-container");

    if (this.isCompleted) {
      $nameContainer.classList.add("completed");
    }

    const $checkbox = document.createElement("input");
    $checkbox.type = "checkbox";
    $checkbox.id = `isCompleted-${this.name}`;
    $checkbox.checked = this.isCompleted;
    $nameContainer.appendChild($checkbox);

    $checkbox.addEventListener("change", () => {
      if (this.onUpdate) {
        this.onUpdate({
          name: this.name,
          pomodoroTime: this.pomodoroTime,
          pomodoroCount: this.pomodoroCount,
          isCompleted: !this.isCompleted,
        });
      }
    });

    const $name = document.createElement("span");
    $name.classList.add("name");
    $name.innerHTML = `
        ${this.name}
        <span>(${this.pomodoroTime}m)</span>
        <em>${this.pomodoroCount}</em>
    `;
    $nameContainer.appendChild($name);

    $name.addEventListener("click", () => {
      this.isEdit = true;
      this.render();
    });

    return $nameContainer;
  }

  #createRightContainer() {
    const $rightContainer = document.createElement("div");
    $rightContainer.classList.add("right-container");

    if (!this.isCompleted) {
      $rightContainer.appendChild(
        new Button({
          text: this.isPlayed ? "⏹️" : "▶️",
          type: "button",
          onClick: () => {
            if (this.onPlay && !this.isPlayed) {
              this.onPlay();
            }
            if (this.onStop && this.isPlayed) {
              this.onStop();
            }
          },
        }).render()
      );
    }

    $rightContainer.appendChild(
      new Button({
        text: "X",
        type: "button",
        onClick: () => {
          if (this.onDelete) {
            this.onDelete();
          }
        },
      }).render()
    );

    return $rightContainer;
  }

  #createEditForm() {
    return new TodoItemForm({
      name: this.name,
      pomodoroTime: this.pomodoroTime,
      onSubmit: (event) => {
        event.preventDefault();
        this.isEdit = false;

        const formData = new FormData(event.target);

        const name = formData.get("name");
        const pomodoroTime = formData.get("pomodoroTime");

        this.onUpdate({
          name,
          pomodoroTime,
          pomodoroCount: this.pomodoroCount,
          isCompleted: this.isCompleted,
        });

        this.render();
      },
      onCancel: () => {
        this.isEdit = false;
        this.render();
      },
    }).render();
  }

  render() {
    if (!this.$todoItem) {
      this.$todoItem = document.createElement("li");
      this.$todoItem.classList.add("todo-item");
    }

    this.$todoItem.innerHTML = "";

    if (!this.isEdit) {
      this.$todoItem.appendChild(this.#createNameContainer());
      this.$todoItem.appendChild(this.#createRightContainer());
    } else {
      this.$todoItem.appendChild(this.#createEditForm());
    }

    return this.$todoItem;
  }
}
