export default class Counter {
  constructor(listName, todoItemIndex) {
    this.listName = listName;
    this.todoItemIndex = todoItemIndex;

    this.$counter = null;
  }

  render() {
    this.$counter = document.createElement("div");
    this.$counter.classList.add(
      `counter-${this.listName}-${this.todoItemIndex}`
    );

    return this.$counter;
  }
}
