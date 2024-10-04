import ListItem from "./ListItem";

export default class ListSection {
  /**
   * @constructor
   * @param {*} store
   */
  constructor(store) {
    this.store = store;

    this.$listSection = null;
    this.$inputField = null;
  }

  #handleAddButtonClick() {
    const $list = this.$listSection.querySelector("ul");

    const isEditing = !!$list.querySelector("input");
    if (isEditing) {
      return;
    }

    const $editableListItem = new ListItem({
      name: "",
      todoCount: 0,
      isEdit: true,
      onClick: null,
      onDelete: null,
      onInput: (name) => {
        this.store.addListItem(name);
      },
    }).render();

    $list.appendChild($editableListItem);
  }

  #handleItemClick(name) {
    alert(`click ${name}`);
  }

  #handleItemDeleteButtonClick(name) {
    if (confirm(`${name}을 삭제하시겠습니까?`)) {
      this.store.deleteListItem(name);
    }
  }

  render() {
    if (!this.$listSection) {
      // 섹션 영역
      this.$listSection = document.createElement("section");
      this.$listSection.id = "list-section";

      // 섹션 내 타이틀 영역
      const $titleCotainer = document.createElement("div");
      $titleCotainer.classList.add("title-container");

      const $title = document.createElement("h2");
      $title.innerText = "목록";
      $titleCotainer.appendChild($title);

      const $addButton = document.createElement("button");
      $addButton.setAttribute("type", "button");
      $addButton.innerText = "+";
      $addButton.addEventListener("click", () => {
        this.#handleAddButtonClick();
      });
      $titleCotainer.appendChild($addButton);

      this.$listSection.appendChild($titleCotainer);
    }

    // 섹션 내 목록 영역
    const $list = this.$listSection.querySelector("ul");
    if ($list) {
      this.$listSection.querySelector("ul").remove();
    }

    const $newList = document.createElement("ul");

    for (const [key, value] of this.store.getListMap()) {
      const $listItem = new ListItem({
        name: key,
        todoCount: value.length,
        onClick: this.#handleItemClick.bind(this),
        onDelete: this.#handleItemDeleteButtonClick.bind(this),
      });
      $newList.appendChild($listItem.render());
    }

    this.$listSection.appendChild($newList);

    return this.$listSection;
  }
}
