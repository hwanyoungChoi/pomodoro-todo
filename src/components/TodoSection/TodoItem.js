export default class TodoItem {
  constructor({ name, pomodoroTime, pomodoroCount, isCompleted, onComplete }) {
    this.name = name;
    this.pomodoroTime = pomodoroTime;
    this.pomodoroCount = pomodoroCount;
    this.isCompleted = isCompleted;
    this.onComplete = onComplete;

    this.$todoItem = null;
  }

  render() {
    if (!this.$todoItem) {
      this.$todoItem = document.createElement("li");
      this.$todoItem.classList.add("todo-item");
    }

    this.$todoItem.innerHTML = "";

    const $nameContainer = document.createElement("div");
    $nameContainer.classList.add("name-container");
    this.$todoItem.appendChild($nameContainer);

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

    const $name = document.createElement("label");
    $name.setAttribute("for", `isCompleted-${this.name}`);
    $name.innerHTML = `
        ${this.name}
        <span>(${this.pomodoroTime}m)</span>
        <em>${this.pomodoroCount}</em>
    `;
    $nameContainer.appendChild($name);

    return this.$todoItem;
  }
}
