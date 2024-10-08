export default class Store {
  constructor(storageKey, rerenderCallback) {
    this.storageKey = storageKey;
    this.rerenderCallback = rerenderCallback;

    const {
      listMap,
      selectedListItem,
      playedTodoInfo,
      remainingTime,
      intervalId,
    } = this.#loadStorage() ?? {
      listMap: new Map(),
      selectedListItem: null,
      playedTodoInfo: null,
      remainingTime: null,
      intervalId: null,
    };
    this.listMap = listMap;
    this.selectedListItem = selectedListItem;
    this.playedTodoInfo = playedTodoInfo;
    this.remainingTime = remainingTime;
    this.intervalId = intervalId;

    // 브라우저 새로고침 등 페이지 재진입 시 상태 복원
    if (this.remainingTime && this.playedTodoInfo) {
      this.resumeCount();
    }
  }

  #loadStorage() {
    const data = JSON.parse(localStorage.getItem(this.storageKey));
    if (data) {
      const listMap = new Map(data.listMap);
      return {
        listMap,
        selectedListItem: data.selectedListItem,
        playedTodoInfo: data.playedTodoInfo,
        remainingTime: data.remainingTime,
        intervalId: data.intervalId,
      };
    }

    return null;
  }

  #saveStorage(shouldRerender = true) {
    const dataToSave = {
      listMap: Array.from(this.listMap),
      selectedListItem: this.selectedListItem,
      playedTodoInfo: this.playedTodoInfo,
      remainingTime: this.remainingTime,
      intervalId: this.intervalId,
    };
    localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));

    if (shouldRerender && this.rerenderCallback) {
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
    this.stopCount();

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

    // 제거하기 전에 포모도로 실행 중인 할일인 경우 실행 제거
    if (
      this.playedTodoInfo?.listName === name &&
      this.playedTodoInfo?.todoItemIndex === todoItemIndex
    ) {
      this.stopCount();
    }

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

    // 수정하기 전에 포모도로 실행 중인 할일이면서 완료처리되는 경우 실행 제거
    if (
      this.playedTodoInfo?.listName === name &&
      this.playedTodoInfo?.todoItemIndex === todoItemIndex &&
      todoItem.isCompleted
    ) {
      this.stopCount();
    }

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
   * 포모도로 카운트 시작 메소드
   * @param {*} name - 목록 이름
   * @param {*} todoItemIndex - 할일 index
   */
  startCount(name, todoItemIndex) {
    // 초기화
    this.stopCount();
    this.playedTodoInfo = {
      listName: name,
      todoItemIndex,
    };
    this.#saveStorage();

    const todoItem = this.getTodoListByList(this.selectedListItem)[
      this.playedTodoInfo.todoItemIndex
    ];
    this.remainingTime = todoItem.pomodoroTime * 60;

    this.updateCount();

    this.intervalId = setInterval(() => {
      this.remainingTime--;
      this.updateCount();

      if (this.remainingTime <= 0) {
        clearInterval(this.intervalId);
        this.updateTodoItemByList(
          this.selectedListItem,
          this.playedTodoInfo.todoItemIndex,
          {
            ...todoItem,
            pomodoroCount: todoItem.pomodoroCount + 1,
          }
        );
        this.stopCount();
      }
    }, 1000);
  }

  /**
   * 카운트 복원
   */
  resumeCount() {
    const todoItem = this.getTodoListByList(this.selectedListItem)[
      this.playedTodoInfo.todoItemIndex
    ];

    this.intervalId = setInterval(() => {
      this.remainingTime--;
      this.updateCount();

      if (this.remainingTime <= 0) {
        clearInterval(this.intervalId);
        this.updateTodoItemByList(
          this.playedTodoInfo.listName,
          this.playedTodoInfo.todoItemIndex,
          {
            ...todoItem,
            pomodoroCount: todoItem.pomodoroCount + 1,
          }
        );
        this.stopCount();
      }
    }, 1000);
  }

  /**
   * 포모도로 카운트 진행
   */
  updateCount() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;

    const $counters = document.querySelectorAll(
      `.counter-${this.playedTodoInfo.listName}-${this.playedTodoInfo.todoItemIndex}`
    );

    if ($counters) {
      $counters.forEach(
        ($counter) =>
          ($counter.innerText = `${String(minutes).padStart(2, "0")}:${String(
            seconds
          ).padStart(2, "0")}`)
      );
    }

    this.#saveStorage(false);
  }

  /**
   * 포모도로 카운트 중지
   */
  stopCount() {
    clearInterval(this.intervalId);
    this.remainingTime = null;
    this.playedTodoInfo = null;

    this.#saveStorage();
  }

  /**
   * 포모도로 카운트 일시정지/재실행 토글
   */
  toggleCount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    } else {
      this.resumeCount();
    }

    this.#saveStorage();
    this.updateCount();
  }

  getIsPaused() {
    return !this.intervalId;
  }
}
