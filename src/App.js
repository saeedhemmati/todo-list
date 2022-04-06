import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { debounce } from "lodash";

const TodoContainer = styled.div`
  width: 500px;
  min-height: 200px;
  border-radius: 6px;
  background-color: ${(props) => props.color};
  color: #000;
  margin-bottom: 10px;
`;

const TodoLabel = styled.h2`
  font-size: 16px;
`;

const TodoHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PinButton = styled.button`
  background-color: transparent;
  border: none;
`;

const ColorBox = styled.div`
  border: ${(props) => `${props.isSelected ? '1px' : '0px'} solid #000`};
  display: inline-block;
  cursor: pointer;
  background-color: ${(props) => props.color};
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 10px;
`;

const SelectColorContainer = styled.div`
  display: flex;
  align-items: center;
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
    label: "First",
    isPin: false,
    priority: Priority.LOW,
    color: Color.RED,
  },
  {
    isDone: false,
    label: "Second",
    isPin: false,
    priority: Priority.MEDIUM,
    color: Color.GREEN,
  },
];

const newTodo = {
  color: "",
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

  // useEffect(() => {
  //   () => debounceOnChange.cancel()
  // })

  const addTodoHandler = () => {
    setTodoList(v => [
      ...v,
      todo
    ]);
    setTodo({...newTodo});
  };

  const getColorList = useMemo(() => {
    let el = [];
    for (const color of Object.keys(Color)) {
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

  return (
    <>
      {todoList.map((todo) => (
        <TODOItem key={todo.label} todo={todo} setTodoList={setTodoList} todoList={todoList} />
      ))}
      <h6>Add todo</h6>
      <label htmlFor="todo-title">todo title:</label>
      <input
        type="text"
        id="todo-title"
        value={todo.label}
        onChange={(e) => setTodo(v => ({...v, label: e.target.value }))}
      />
      <br />
      <SelectColorContainer>Select color: {getColorList}</SelectColorContainer>
      <br />
      <button onClick={addTodoHandler}>Add</button>
    </>
  );
};

const TODOItem = ({ todo, setTodoList, todoList }) => {
  const setTODOProperty = (property, value) => {
    const cloneTodo = { ...todo };
    cloneTodo[property] = value;
    const index = todoList.findIndex((_todo) => _todo.label === todo.label);
    todoList.splice(index, 1, cloneTodo);
    setTodoList([...todoList]);
  }
  
  return (
    <TodoContainer color={todo.color}>
      <TodoHeader>
        <TodoLabel>{todo.label}</TodoLabel>
        <PinButton onClick={() => setTODOProperty('isPin', !todo.isPin)}>
          {todo.isPin ? "unpin" : "pin"}
        </PinButton>
      </TodoHeader>
    </TodoContainer>
  );
};

export default ToDo;
