export default class Button {
  constructor({ text, type, onClick }) {
    this.text = text;
    this.type = type;
    this.onClick = onClick;

    this.$button = null;
  }

  render() {
    if (!this.$button) {
      this.$button = document.createElement("button");
    }

    this.$button.innerText = this.text;
    this.$button.type = this.type;
    this.$button.addEventListener("click", (event) => {
      event.stopPropagation();

      if (this.onClick) {
        this.onClick();
      }
    });

    return this.$button;
  }
}
