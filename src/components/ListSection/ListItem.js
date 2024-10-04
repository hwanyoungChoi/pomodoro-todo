export default class ListItem {
  /**
   * @constructor
   * @param {string} name - 목록 아이템의 이름
   * @param {number} todoCount - 목록 아이템에 속한 남은 할일 수
   * @param {boolean} isEdit - 편집 전용 여부
   * @param {Function} onClick - 목록 아이템 클릭 이벤트
   * @param {Function} onDelete - 목록 아이템 삭제 버튼 클릭 이벤트
   * @param {Function} onInput - 목록 이름 입력 완료 이벤트
   */
  constructor(name, todoCount, isEdit, onClick, onDelete, onInput) {
    this.name = name;
    this.todoCount = todoCount;
    this.isEdit = isEdit;
    this.onClick = onClick;
    this.onDelete = onDelete;
    this.onInput = onInput;

    this.$listItem = null;
  }

  render() {
    if (!this.$listItem) {
      this.$listItem = document.createElement("li");
      this.$listItem.classList.add("list-item");
    }

    if (this.isEdit) {
      const $inputField = document.createElement("input");
      $inputField.type = "text";
      this.$listItem.appendChild($inputField);

      setTimeout(() => {
        $inputField.focus();
        $inputField.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            const name = $inputField.value.trim();
            if (name && this.onInput) {
              this.onInput(name);
              //   this.store.addListItem(name);
              this.$listItem.remove();
            }
          }

          if (event.key === "Escape") {
            this.$listItem.remove();
          }
        });
      }, 0);
    } else {
      const $name = document.createElement("div");
      $name.innerText = this.name;
      this.$listItem.appendChild($name);
    }

    const $deleteButton = document.createElement("button");
    $deleteButton.setAttribute("type", "button");
    $deleteButton.innerText = "X";
    $deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (this.onDelete) {
        this.onDelete(this.name);
      }
    });

    const $todoCount = document.createElement("div");
    $todoCount.innerText = this.todoCount;

    const $right = document.createElement("div");
    $right.classList.add("right");
    $right.appendChild($deleteButton);
    $right.appendChild($todoCount);

    this.$listItem.appendChild($right);
    this.$listItem.addEventListener("click", () => {
      if (this.onClick) {
        this.onClick(this.name);
      }
    });

    return this.$listItem;
  }
}
