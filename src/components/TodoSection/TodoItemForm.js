import Button from "../Button";

const INITIAL_NAME = "새로운 할일 입력";

export default class TodoItemForm {
  constructor({ name, pomodoroTime, isEdit, onSubmit, onCancel }) {
    this.name = name;
    this.pomodoroTime = pomodoroTime;
    this.isEdit = isEdit;
    this.onSubmit = onSubmit;
    this.onCancel = onCancel;

    this.isFirstFocus = true;

    this.$form = null;
  }

  #createNameInput() {
    const $nameInput = document.createElement("input");
    $nameInput.type = "text";
    $nameInput.id = "name";
    $nameInput.name = "name";
    $nameInput.required = true;

    $nameInput.value = this.name ?? INITIAL_NAME;

    $nameInput.addEventListener("focus", () => {
      if (this.isFirstFocus && !this.isEdit) {
        if ($nameInput.value === INITIAL_NAME) {
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

    $pomodoroInput.value = this.pomodoroTime;
    $pomodoroTimeContainer.appendChild($pomodoroInput);

    return $pomodoroTimeContainer;
  }

  #createButtonContainer() {
    const $buttonContainer = document.createElement("div");
    $buttonContainer.classList.add("button-container");

    $buttonContainer.appendChild(
      new Button({
        text: "저장",
        type: "submit",
      }).render()
    );

    $buttonContainer.appendChild(
      new Button({
        text: "취소",
        type: "button",
        onClick: () => {
          if (this.onCancel) {
            this.onCancel();
          }
        },
      }).render()
    );

    this.$form.addEventListener("submit", (event) => {
      if (this.onSubmit) {
        this.onSubmit(event);
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
