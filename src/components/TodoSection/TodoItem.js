export default class TodoItem {
  /**
   * @constructor
   * @param {Object} options - 할일 아이템의 속성
   * @param {string} options.name - 할일 아이템의 이름
   * @param {number} options.pomodoroTime - 할일 아이템의 포모도로 시간 (초 단위)
   * @param {boolean} options.pomodoroCount - 할일 아이템의 포도도로 완료 수
   * @param {boolean} options.isCompleted - 할일 아이템의 완료 여부
   * @param {Function} options.onComplete - 할일 아이템의 완료 이벤트
   * @param {Function} options.onDelete - 할일 아이템의 삭제 이벤트
   */
  constructor({
    name,
    pomodoroTime,
    pomodoroCount,
    isCompleted,
    onComplete,
    onDelete,
  }) {
    this.name = name;
    this.pomodoroTime = pomodoroTime;
    this.pomodoroCount = pomodoroCount;
    this.isCompleted = isCompleted;
    this.onComplete = onComplete;
    this.onDelete = onDelete;

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
      if (this.onComplete) {
        this.onComplete();
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

    return $nameContainer;
  }

  #createRightContainer() {
    const $rightContainer = document.createElement("div");
    $rightContainer.classList.add("right-container");

    if (!this.isCompleted) {
      const $playButton = document.createElement("button");
      $playButton.type = "button";
      $playButton.innerText = "▶️";
      $rightContainer.appendChild($playButton);
    }

    const $deleteButton = document.createElement("button");
    $deleteButton.type = "button";
    $deleteButton.innerText = "X";
    $deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (this.onDelete) {
        this.onDelete(this.name);
      }
    });
    $rightContainer.appendChild($deleteButton);

    return $rightContainer;
  }

  render() {
    if (!this.$todoItem) {
      this.$todoItem = document.createElement("li");
      this.$todoItem.classList.add("todo-item");
    }

    this.$todoItem.innerHTML = "";

    this.$todoItem.appendChild(this.#createNameContainer());
    this.$todoItem.appendChild(this.#createRightContainer());

    return this.$todoItem;
  }
}
