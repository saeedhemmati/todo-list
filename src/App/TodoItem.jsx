import React from "react";
import styled from "styled-components";

const OperationWrapper = styled.div`
  display: flex;
  align-items: center;
`;

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

const TODOItem = ({ todo, setTodoList, todoList }) => {
  const setPinTodo = (value) => {
    let cloneTodo = { ...todo };
    cloneTodo = {
      ...cloneTodo,
      isPin: value,
      modifyDate: new Date(),
    };
    const index = todoList.findIndex((_todo) => _todo.label === todo.label);
    todoList.splice(index, 1, cloneTodo);
    const orderedList = getOrderedTodoList();
    setTodoList([...orderedList]);
  };

  const getOrderedTodoList = () => {
    const orderedPinList = todoList
      .filter((item) => item.isPin)
      .sort((a, b) => b.modifyDate - a.modifyDate);
    const otherItemsOfTodoList = todoList.filter((item) => !item.isPin);
    return orderedPinList.concat(otherItemsOfTodoList);
  };

  const setIsDone = (e) => {
    const isChecked = e.target.checked;
    const index = todoList.findIndex((item) => item === todo);
    if (isChecked) {
      if (index !== todoList.length - 1) {
        const el = todoList.find((item) => item === todo);
        todoList.splice(index, 1);
        setTodoList(todoList.concat({ ...el, isDone: isChecked }));
      }
      return;
    }
    const getDoneList = todoList.filter((item) => item.isDone);
    const idx = getDoneList.findIndex((item) => item === todo);
    getDoneList.splice(idx, 1);
    getDoneList.unshift({
      ...todo,
      isDone: isChecked,
    });
    setTodoList((v) => [...v.filter((item) => !item.isDone), ...getDoneList]);
  };

  return (
    <TodoContainer color={todo.color}>
      <TodoHeader>
        <TodoLabel>{todo.label}</TodoLabel>
        <OperationWrapper>
          <PinButton onClick={() => setPinTodo(!todo.isPin)}>
            {todo.isPin ? "Unpin" : "Pin"}
          </PinButton>
          <div>
            <input type="checkbox" onChange={setIsDone} checked={todo.isDone} />
            Done
          </div>
        </OperationWrapper>
      </TodoHeader>
    </TodoContainer>
  );
};

export default TODOItem;
