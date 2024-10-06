export default class Store {
  constructor(storageKey, rerenderCallback) {
    this.storageKey = storageKey;
    this.rerenderCallback = rerenderCallback;

    const { listMap, selectedListItem, playedTodoItem, playedTodoInfo } =
      this.#loadStorage() ?? {
        listMap: new Map(),
        selectedListItem: null,
        playedTodoInfo: null,
      };
    this.listMap = listMap;
    this.selectedListItem = selectedListItem;
    this.playedTodoInfo = playedTodoInfo;
  }

  #loadStorage() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (data) {
      const listMap = new Map(data.listMap);
      return {
        listMap,
        selectedListItem: data.selectedListItem,
        playedTodoInfo: data.playedTodoInfo,
      };
    }
    return null;
  }

  #saveStorage() {
    const dataToSave = {
      listMap: Array.from(this.listMap),
      selectedListItem: this.selectedListItem,
      playedTodoInfo: this.playedTodoInfo,
    };
    localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));

    if (this.rerenderCallback) {
      this.rerenderCallback();
    }
  }

  /**
   * 목록 Map 조회 메소드
   * @returns
   */
  getListMap() {
    return this.listMap;
  }

  /**
   * 단일 목록 생성 메소드
   * @param {string} name - 목록 이름
   * @param {*} todoList - 초기 할일 목록(optional)
   */
  addListItem(name, todoList) {
    this.listMap.set(name, todoList ?? []);
    this.#saveStorage();
  }

  /**
   * 단일 목록 제거 메소드
   * @param {string} name - 목록 이름
   */
  deleteListItem(name) {
    this.listMap.delete(name);

    if (name === this.selectedListItem) {
      this.setSelectedListItem(null);
    }
    this.#saveStorage();
  }

  /**
   * 선택된 목록 조회 메소드
   * @returns
   */
  getSelectedListItem() {
    return this.selectedListItem;
  }

  /**
   * 단일 목록 선택 메소드
   * @param {string} name - 목록 이름
   */
  setSelectedListItem(name) {
    this.selectedListItem = name;
    this.#saveStorage();
  }

  /**
   * 특정 목록에 대한 할일 목록 반환 메소드
   * @param {string} name - 목록 이름
   * @returns
   */
  getTodoListByList(name) {
    return this.listMap.get(name);
  }

  /**
   * 특정 목록에 할일 추가 메소드
   * @param {string} name - 목록 이름
   * @param {*} todoItem - 할일 정보
   */
  addTodoItemByList(name, todoItem) {
    const todoList = [...this.getTodoListByList(name), todoItem];
    this.listMap.set(name, todoList);
    this.#saveStorage();
  }

  /**
   * 특정 목록의 할일 제거 메소드
   * @param {string} name - 목록 이름
   * @param {number} todoItemIndex - 제거할 할 일 index
   */
  deleteTodoItemByList(name, todoItemIndex) {
    const todoList = this.getTodoListByList(name).filter(
      (_, index) => index !== todoItemIndex
    );
    this.listMap.set(name, todoList);
    this.#saveStorage();
  }

  /**
   * 특정 목록의 할일 수정 메소드
   * @param {string} name - 목록 이름
   * @param {number} todoItemIndex - 수정할 할 일 index
   * @param {*} todoItem - 수정된 할 일 정보
   */
  updateTodoItemByList(name, todoItemIndex, todoItem) {
    const todoList = this.getTodoListByList(name);
    todoList[todoItemIndex] = todoItem;
    this.listMap.set(name, todoList);
    this.#saveStorage();
  }

  /**
   * 포모도로 실행 중인 정보 반환 메소드
   * @returns
   */
  getPlayedTodoInfo() {
    return this.playedTodoInfo;
  }

  /**
   * 포모도로 실행 정보 업데이트 메소드
   * @param {string} name - 목록 이름
   * @param {number} todoItemIndex - 할일 index
   */
  setPlayedTodoInfo(name, todoItemIndex) {
    this.playedTodoInfo = {
      listName: name,
      todoItemIndex,
    };
    this.#saveStorage();
  }

  /**
   * 포모도로 실행 제거 메소드
   */
  deletePlayedTodoInfo() {
    this.playedTodoInfo = null;
    this.#saveStorage();
  }
}
