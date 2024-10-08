import Store from "../src/lib/store";

describe("Store Class", () => {
  let store;
  const mockRerenderCallback = jest.fn();

  beforeEach(() => {
    store = new Store("todoAppTest", mockRerenderCallback);
  });

  test("초기값", () => {
    expect(store.listMap).toEqual(new Map());
    expect(store.selectedListItem).toBeNull();
    expect(store.playedTodoInfo).toBeNull();
    expect(store.remainingTime).toBeNull();
    expect(store.intervalId).toBeNull();
  });

  describe("목록 메소드", () => {
    beforeEach(() => {
      store.addListItem("목록", ["A할일", "B할일"]);
    });

    test("목록 생성", () => {
      expect(store.getListMap().get("목록")).toEqual(["A할일", "B할일"]);
    });

    test("목록 삭제", () => {
      store.deleteListItem("목록");

      expect(store.getListMap().has("목록")).toBe(false);
    });

    test("목록 선택", () => {
      store.setSelectedListItem("목록");

      expect(store.getSelectedListItem()).toBe("목록");
    });
  });

  describe("할일 메소드", () => {
    beforeEach(() => {
      store.addListItem("목록");
      store.addTodoItemByList("목록", {
        name: "A할일",
        pomodoroTime: 10,
        pomodoroCount: 0,
        isCompleted: false,
      });
    });

    test("할일 생성", () => {
      expect(store.getTodoListByList("목록")).toHaveLength(1);
    });

    test("할일 삭제", () => {
      store.deleteTodoItemByList("목록", 0);

      expect(store.getTodoListByList("목록")).toHaveLength(0);
    });

    test("할일 수정", () => {
      const updatedTodoItem = {
        name: "A할일수정",
        pomodoroTime: 20,
        pomodoroCount: 1,
        isCompleted: true,
      };
      store.updateTodoItemByList("목록", 0, updatedTodoItem);

      expect(store.getTodoListByList("목록")[0]).toBe(updatedTodoItem);
    });
  });

  describe("포모도로 카운트 메소드", () => {
    beforeEach(() => {
      jest.useFakeTimers();

      store.addListItem("목록", [
        {
          name: "할일",
          pomodoroTime: 1,
          pomodoroCount: 0,
          isCompleted: false,
        },
      ]);
    });

    test("카운터 시작", () => {
      store.startCount("목록", 0);
      expect(store.remainingTime).toBe(60); // s

      jest.advanceTimersByTime(30000); // ms
      expect(store.remainingTime).toBe(30);

      jest.advanceTimersByTime(30000);
      expect(store.remainingTime).toBeNull();
    });

    test("카운터 정상 종료 시 포모도로 횟수 증가", () => {
      store.startCount("목록", 0);
      jest.advanceTimersByTime(60000);

      expect(store.getTodoListByList("목록")[0].pomodoroCount).toBe(1);
    });

    test("카운터 정지", () => {
      store.startCount("목록", 0);
      jest.advanceTimersByTime(10000);

      store.stopCount();

      expect(store.remainingTime).toBeNull();
    });

    test("카운터 정지 시 포모도로 횟수 유지", () => {
      store.startCount("목록", 0);
      jest.advanceTimersByTime(10000);

      store.stopCount();

      expect(store.getTodoListByList("목록")[0].pomodoroCount).toBe(0);
    });
  });
});
