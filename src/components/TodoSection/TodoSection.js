export default class TodoSection {
  constructor() {
    this.todos = [];

    this.$todoSection = null;
  }

  render() {
    if (!this.$todoSection) {
      this.$todoSection = document.createElement("section");
      this.$todoSection.id = "todo-section";

      const $title = document.createElement("h2");
      $title.innerText = "할일 목록";
      this.$todoSection.appendChild($title);
    }

    return this.$todoSection;
  }
}
