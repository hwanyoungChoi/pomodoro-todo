export default class Store {
  constructor(storageKey, rerenderCallback) {
    this.storageKey = storageKey;
    this.rerenderCallback = rerenderCallback;

    const { listMap, selectedItem } = this.#loadStorage() ?? {
      listMap: new Map(),
      selectedItem: null,
    };
    this.listMap = listMap;
    this.selectedItem = selectedItem;
  }

  #loadStorage() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (data) {
      const listMap = new Map(data.listMap);
      return { listMap, selectedItem: data.selectedItem };
    }
    return null;
  }

  #saveStorage() {
    // 상태 저장
    const dataToSave = {
      listMap: Array.from(this.listMap),
      selectedItem: this.selectedItem,
    };
    localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));

    // 데이터 갱신 시 rerender하기 위함
    if (this.rerenderCallback) {
      this.rerenderCallback();
    }
  }

  // 목록 methods
  getListMap() {
    return this.listMap;
  }

  addListItem(name, todoList) {
    this.listMap.set(name, todoList ?? []);
    this.#saveStorage();
  }

  deleteListItem(name) {
    this.listMap.delete(name);
    this.#saveStorage();
  }

  getSelectedItem() {
    return this.selectedItem;
  }

  setSelectedItem(name) {
    this.selectedItem = name;
    this.#saveStorage();
  }

  // 할일 methods
  getTodoListByList(name) {
    return this.listMap.get(name);
  }

  addTodoItemByList(name, todoItem) {
    const todoList = this.getTodoListByList(name);
    todoList.push(todoItem);

    this.listMap.set(name, todoList);
    this.#saveStorage();
  }

  deleteTodoItemByList(name, todoItemIndex) {
    const todoList = this.getTodoListByList(name);
    todoList.splice(todoItemIndex, 1);

    this.listMap.set(name, todoList);
    this.#saveStorage();
  }
}
