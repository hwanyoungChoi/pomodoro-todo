import Button from "../Button";

export default class ListItem {
  /**
   * @constructor
   * @param {Object} options - 목록 아이템의 속성
   * @param {string} options.name - 목록 아이템의 이름
   * @param {number} todoCount - 목록 아이템에 속한 남은 할일 수
   * @param {boolean} isEdit - 편집 전용 여부
   * @param {boolean} isSelected - 선택 상태 여부
   * @param {Function} onClick - 목록 아이템 클릭 이벤트
   * @param {Function} onDelete - 목록 아이템 삭제 버튼 클릭 이벤트
   * @param {Function} onInput - 목록 이름 입력 완료 이벤트
   */
  constructor({
    name,
    todoCount,
    isEdit,
    isSelected,
    onClick,
    onDelete,
    onInput,
  }) {
    this.name = name;
    this.todoCount = todoCount;
    this.isEdit = isEdit;
    this.isSelected = isSelected;
    this.onClick = onClick;
    this.onDelete = onDelete;
    this.onInput = onInput;

    this.$listItem = null;
  }

  // 요소 생성 메소드..
  #createName() {
    const $name = document.createElement("div");
    $name.innerText = this.name;
    return $name;
  }

  #createInputField() {
    const $inputField = document.createElement("input");
    $inputField.type = "text";

    setTimeout(() => {
      $inputField.focus();
      $inputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          const name = $inputField.value.trim();
          if (name && this.onInput) {
            this.onInput(name);
            this.$listItem.remove();
          }
        }

        if (event.key === "Escape") {
          this.$listItem.remove();
        }
      });
    }, 0);

    return $inputField;
  }

  #createDeleteButton() {
    return new Button({
      text: "X",
      type: "button",
      onClick: () => this.onDelete(this.name),
    }).render();
  }

  #createRightContainer() {
    const $rightContainer = document.createElement("div");
    $rightContainer.classList.add("right");

    if (!this.isEdit) {
      $rightContainer.appendChild(this.#createDeleteButton());
    }

    const $todoCount = document.createElement("div");
    $todoCount.classList.add("todo-count");
    $todoCount.innerText = this.todoCount;
    $rightContainer.appendChild($todoCount);

    return $rightContainer;
  }

  render() {
    if (!this.$listItem) {
      this.$listItem = document.createElement("li");
      this.$listItem.classList.add("list-item");
    }

    this.$listItem.innerHTML = "";

    if (this.isSelected) {
      this.$listItem.classList.add("selected");
    }

    if (this.isEdit) {
      this.$listItem.appendChild(this.#createInputField());
    } else {
      this.$listItem.appendChild(this.#createName());
    }

    this.$listItem.appendChild(this.#createRightContainer());

    this.$listItem.addEventListener("click", () => {
      if (this.onClick) {
        this.onClick(this.name);
      }
    });

    return this.$listItem;
  }
}
