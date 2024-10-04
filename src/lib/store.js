export default class Store {
  constructor(storageKey, rerenderCallback) {
    this.storageKey = storageKey;
    this.rerenderCallback = rerenderCallback;

    this.listMap = this.#loadStorage() ?? new Map();
    this.selectedItem = null;
  }

  #loadStorage() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    return data ? new Map(data) : null;
  }

  #saveStorage() {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(Array.from(this.listMap))
    );

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

  toggleListItem(name) {
    if (this.selectedItem === name) {
      this.selectedItem = null;
      return;
    }

    this.selectedItem = name;
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
