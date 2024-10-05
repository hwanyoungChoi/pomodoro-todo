export default class TodoItem {
  constructor({ name, pomodoroTime, pomodoroCount, isCompleted }) {
    this.name = name;
    this.pomodoroTime = pomodoroTime;
    this.pomodoroCount = pomodoroCount;
    this.isCompleted = isCompleted;

    this.$todoItem = null;
  }

  render() {
    if (!this.$todoItem) {
      this.$todoItem = document.createElement("li");
      this.$todoItem.classList.add("todo-item");
    }

    this.$todoItem.innerHTML = "";
    this.$todoItem.innerText = this.name;

    return this.$todoItem;
  }
}
