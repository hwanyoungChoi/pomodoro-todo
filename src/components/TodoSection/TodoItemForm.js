export default class TodoItemForm {
  constructor({ onSubmit, onCancel }) {
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;

    this.initialName = "새로운 할일 입력";
    this.isFirstFocus = true;

    this.$form = null;
  }

  #createNameInput() {
    const $nameInput = document.createElement("input");
    $nameInput.type = "text";
    $nameInput.id = "name";
    $nameInput.name = "name";
    $nameInput.required = true;

    $nameInput.value = this.initialName;

    $nameInput.addEventListener("focus", () => {
      if (this.isFirstFocus) {
        if ($nameInput.value === this.initialName) {
          $nameInput.value = "";
        }
      }

      this.isFirstFocus = false;
    });

    return $nameInput;
  }

  #createPomodoroTimeContainer() {
    const $pomodoroTimeContainer = document.createElement("div");
    $pomodoroTimeContainer.classList.add("pomodoro-time-container");

    const $pomodoroLabel = document.createElement("label");
    $pomodoroLabel.setAttribute("for", "pomodoroTime");
    $pomodoroLabel.textContent = "포모도로 시간 (분):";
    $pomodoroTimeContainer.appendChild($pomodoroLabel);

    const $pomodoroInput = document.createElement("input");
    $pomodoroInput.type = "number";
    $pomodoroInput.id = "pomodoroTime";
    $pomodoroInput.name = "pomodoroTime";
    $pomodoroInput.min = 1;
    $pomodoroInput.max = 60;
    $pomodoroInput.required = true;
    $pomodoroTimeContainer.appendChild($pomodoroInput);

    return $pomodoroTimeContainer;
  }

  #createButtonContainer() {
    const $buttonContainer = document.createElement("div");
    $buttonContainer.classList.add("button-container");

    const $submitButton = document.createElement("button");
    $submitButton.type = "submit";
    $submitButton.textContent = "저장";
    $buttonContainer.appendChild($submitButton);

    const $cancelButton = document.createElement("button");
    $cancelButton.type = "button";
    $cancelButton.textContent = "취소";
    $buttonContainer.appendChild($cancelButton);

    this.$form.addEventListener("submit", (event) => {
      if (this.onSubmit) {
        this.onSubmit(event);
      }
    });

    $cancelButton.addEventListener("click", () => {
      if (this.onCancel) {
        this.onCancel();
      }
    });

    return $buttonContainer;
  }

  render() {
    if (!this.$form) {
      this.$form = document.createElement("form");
      this.$form.id = "todo-item-form";
    }

    this.$form.appendChild(this.#createNameInput());
    this.$form.appendChild(this.#createPomodoroTimeContainer());
    this.$form.appendChild(this.#createButtonContainer());

    return this.$form;
  }
}
