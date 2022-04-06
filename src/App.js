import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { debounce } from "lodash";
import TODOItem from "./App/TodoItem";

const ColorBox = styled.div`
  border: ${(props) => `${props.isSelected ? "1px" : "0px"} solid #000`};
  display: inline-block;
  cursor: pointer;
  background-color: ${(props) => props.color};
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 10px;
  &:first-of-type {
    margin-left: 10px;
  }
`;

const SubmitButtonContainer = styled.div`
  margin-top: 30px;
  button {
    width: 100%;
  }
`;

const SelectColorContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 30px 0;
`;

const Priority = Object.freeze({
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
});

const Color = Object.freeze({
  RED: "red",
  GREEN: "green",
  BLUE: "blue",
  BROWN: "brown",
  YELLOW: "yellow",
  PURPLE: "purple",
});

const initialTodos = [
  {
    isDone: false,
    label: "Second",
    isPin: false,
    priority: Priority.MEDIUM,
    color: Color.GREEN,
    modifyDate: new Date(),
  },
  {
    isDone: false,
    label: "First",
    isPin: false,
    priority: Priority.LOW,
    color: Color.RED,
    modifyDate: new Date(),
  },
];

const newTodo = {
  color: Color.GREEN,
  label: "",
  isPin: false,
  priority: Priority.LOW,
  isDone: false,
};

const ToDo = () => {
  const [todoList, setTodoList] = useState([...initialTodos]);
  const [todo, setTodo] = useState(newTodo);

  const onChangeTodoTitle = (title) => {
    setTodo((v) => ({ ...v, label: title }));
  };

  const debounceOnChange = useMemo(() => debounce(onChangeTodoTitle, 500), []);

  useEffect(() => {
    return () => debounceOnChange.cancel();
  });

  const addTodoHandler = (e) => {
    e.preventDefault();
    const orderedTodoListAsPriority = [...todoList, todo].sort(
      (a, b) => b.priority - a.priority,
    );
    setTodoList(orderedTodoListAsPriority);
    setTodo({ ...newTodo });
    ref.current = ref.current + 1;
  };

  const getColorList = useMemo(() => {
    let el = [];
    for (const color of Object.values(Color)) {
      const colorBox = (
        <ColorBox
          color={color}
          isSelected={todo.color === color}
          onClick={() => setTodo((v) => ({ ...v, color: color }))}
        />
      );
      el = [...el, colorBox];
    }

    return <>{el}</>;
  }, [todo.color]);

  const setTodoPriority = (e) => {
    setTodo((v) => ({
      ...v,
      priority: Number(e.target.value),
    }));
  };

  const ref = useRef(0);

  return (
    <>
      {todoList.map((todo) => (
        <TODOItem
          key={todo.label}
          todo={todo}
          setTodoList={setTodoList}
          todoList={todoList}
        />
      ))}
      <form onSubmit={addTodoHandler} key={ref.current}>
        <h2>Add todo</h2>
        <label htmlFor="todo-title">todo title:</label>
        <div>
          <input
            type="text"
            id="todo-title"
            defaultValue={todo.label}
            onChange={(e) => setTodo((v) => ({ ...v, label: e.target.value }))}
          />
        </div>
        <div>
          <SelectColorContainer>
            Select color: {getColorList}
          </SelectColorContainer>
        </div>
        <div>
          <h2>Priority:</h2>
          <input
            type="radio"
            name="priority"
            value={Priority.HIGH}
            onChange={setTodoPriority}
            id="high"
          />
          <label htmlFor="high">High</label>
          <input
            type="radio"
            name="priority"
            value={Priority.MEDIUM}
            onChange={setTodoPriority}
            id="medium"
          />
          <label htmlFor="medium">Medium</label>
          <input
            type="radio"
            id="low"
            name="priority"
            value={Priority.Low}
            onChange={setTodoPriority}
          />
          <label htmlFor="low">Low</label>
        </div>
        <SubmitButtonContainer>
          <button type="submit">Add</button>
        </SubmitButtonContainer>
      </form>
    </>
  );
};

export default ToDo;
