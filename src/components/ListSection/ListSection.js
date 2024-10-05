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
      isSelected: true,
      onClick: null,
      onDelete: null,
      onInput: (name) => {
        if (this.store.getListMap().has(name)) {
          alert("동일한 이름으로 만들 수 없습니다.");
          return;
        }

        this.store.addListItem(name);
      },
    }).render();

    $list.appendChild($editableListItem);
  }

  #handleItemClick(name) {
    this.store.setSelectedListItem(name);
  }

  #handleItemDeleteButtonClick(name) {
    if (confirm(`${name}을 삭제하시겠습니까?`)) {
      this.store.deleteListItem(name);
    }
  }

  // 요소 생성 메소드..
  #createTitleContainer() {
    const $titleCotainer = document.createElement("div");
    $titleCotainer.classList.add("title-container");

    const $title = document.createElement("h2");
    $title.innerText = "목록";
    $titleCotainer.appendChild($title);

    const $addButton = document.createElement("button");
    $addButton.type = "button";
    $addButton.innerText = "+";
    $addButton.addEventListener("click", () => {
      this.#handleAddButtonClick();
    });
    $titleCotainer.appendChild($addButton);

    return $titleCotainer;
  }

  #createList() {
    const $list = document.createElement("ul");

    for (const [key, value] of this.store.getListMap()) {
      const $listItem = new ListItem({
        name: key,
        todoCount: value.length,
        isSelected: this.store.getSelectedListItem() === key,
        onClick: this.#handleItemClick.bind(this),
        onDelete: this.#handleItemDeleteButtonClick.bind(this),
      });
      $list.appendChild($listItem.render());
    }

    return $list;
  }

  render() {
    if (!this.$listSection) {
      this.$listSection = document.createElement("section");
      this.$listSection.id = "list-section";

      this.$listSection.appendChild(this.#createTitleContainer());
    }

    const $existingList = this.$listSection.querySelector("ul");
    if ($existingList) {
      $existingList.remove();
    }

    this.$listSection.appendChild(this.#createList());

    return this.$listSection;
  }
}
