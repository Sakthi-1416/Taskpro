import React, { useReducer, useEffect, useState } from "react";
import { initialState, reducer } from "./appReducer";
import { Trash2, Pencil, Wrench, Plus } from "lucide-react";

const Store = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/tasks");
        const data = await res.json();
        dispatch({ type: "SET_DATA", payload: data });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Add new task
  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const newTask = {
      id: Date.now(), // simple unique id
      text: newTaskText,
      completed: false,
    };
    dispatch({ type: "ADD_TASK", payload: newTask });
    setNewTaskText("");
  };

  // Toggle task completion
  const handleToggle = (task) => {
    dispatch({
      type: "UPDATE_TASK",
      payload: { ...task, completed: !task.completed },
    });
  };

  // Delete task
  const handleDelete = (id) => {
    dispatch({ type: "DELETE_TASK", payload: id });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-amber-500">Task List</h1>

      {/* Add Task */}
      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          placeholder="Enter new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button
          onClick={handleAddTask}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center space-x-1"
        >
          <Plus size={16} />
          <span>Add</span>
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {state.tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div onClick={() => handleToggle(task)} className="cursor-pointer">
              <p className="font-medium text-gray-900">{task.text}</p>
              <p className="text-sm text-gray-500">ID: {task.id}</p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer ${
                task.completed
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
              onClick={() => handleToggle(task)}
            >
              {task.completed ? "Done" : "Pending"}
            </span>

            {/* Icons */}
            <div className="flex items-center space-x-3 text-gray-500">
              <Pencil className="hover:text-blue-500 cursor-pointer" />
              <Trash2
                className="hover:text-red-500 cursor-pointer"
                onClick={() => handleDelete(task.id)}
              />
              <Wrench className="hover:text-yellow-500 cursor-pointer" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Store;
