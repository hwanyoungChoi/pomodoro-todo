export default class Header {
  constructor() {
    this.$header = null;
  }

  render() {
    if (!this.$header) {
      this.$header = document.createElement("header");

      const $title = document.createElement("h1");
      $title.innerText = "Pomodoro Todo App";
      this.$header.appendChild($title);
    }

    return this.$header;
  }
}
