import {
  getSourceUrl,
  addStringNoLocale,
  createThing,
  addDatetime,
  addUrl,
  setThing,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";
import { useSession } from "@inrupt/solid-ui-react";
import React, { useState } from "react";
import "./style.css";

const TEXT_PREDICATE = "http://schema.org/text";
const CREATED_PREDICATE = "http://www.w3.org/2002/12/cal/ical#created";
const TODO_CLASS = "http://www.w3.org/2002/12/cal/ical#Vtodo";
const TYPE_PREDICATE = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

const AddTodo = ({ todoList, setTodoList }) => {
  const { session } = useSession();
  const [todoText, setTodoText] = useState("");

  const addTodo = async (text) => {
    const indexUrl = getSourceUrl(todoList);

    const todoWithText = addStringNoLocale(createThing(), TEXT_PREDICATE, text);
    const todoWithDate = addDatetime(
      todoWithText,
      CREATED_PREDICATE,
      new Date()
    );

    const todoWithType = addUrl(todoWithDate, TYPE_PREDICATE, TODO_CLASS);
    const updatedTodoList = setThing(todoList, todoWithType);

    const updatedDataset = await saveSolidDatasetAt(indexUrl, updatedTodoList, {
      fetch: session.fetch,
    });

    setTodoList(updatedDataset);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    addTodo(todoText);
    setTodoText("");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <label htmlFor="todo-input">
        <input
          id="todo-input"
          type="text"
          autoComplete="off"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
      </label>
      <button className="add-button" type="submit">
        Add Todo
      </button>
    </form>
  );
};

export default AddTodo;
