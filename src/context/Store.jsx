import React, { useReducer, useEffect, useState } from "react";
import appReducer, { initialState } from "./appReducer";
import { Trash2, Pencil, Plus, Check } from "lucide-react";
import axios from "axios";

const Store = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // 🔹 Fetch Data
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get("http://localhost:3000/tasks");
        dispatch({ type: "SET_DATA", payload: res.data });
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  }, []);

  // 🔹 Derived Filter
  const filteredTasks = state.tasks.filter((task) =>
    task.text.toLowerCase().includes(state.search.toLowerCase()),
  );

  // 🔹 Input Change
  const handleChange = (value) => {
    setText(value);
    dispatch({ type: "SET_SEARCH", payload: value });
  };

  // 🔹 Add Task
  const addTask = async () => {
    if (!text.trim()) return;

    const tempTask = {
      id: Date.now(),
      text: text,
      completed: false,
    };

    dispatch({ type: "ADD_TASK", payload: tempTask });

    setText("");
    dispatch({ type: "SET_SEARCH", payload: "" });

    try {
      const res = await axios.post("http://localhost:3000/tasks", {
        text: tempTask.text,
        completed: false,
      });

      dispatch({
        type: "REPLACE_TASK",
        payload: { tempId: tempTask.id, newTask: res.data },
      });
    } catch (err) {
      dispatch({ type: "DELETE_TASK", payload: tempTask.id });
    }
  };

  // 🔹 Toggle Task
  const toggleTask = async (task) => {
    dispatch({ type: "TOGGLE_TASK", payload: task.id });

    try {
      await axios.patch(`http://localhost:3000/tasks/${task.id}`, {
        completed: !task.completed,
      });
    } catch {
      dispatch({ type: "TOGGLE_TASK", payload: task.id });
    }
  };

  // 🔹 Delete Task
  const deleteTask = async (id) => {
    dispatch({ type: "DELETE_TASK", payload: id });

    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Start Edit
  const startEdit = (task) => {
    setEditId(task.id);
    setEditText(task.text);
  };

  // 🔹 Save Edit
  const saveEdit = async (id) => {
    dispatch({ type: "UPDATE_TASK", payload: { id, text: editText } });

    setEditId(null);

    try {
      await axios.patch(`http://localhost:3000/tasks/${id}`, {
        text: editText,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Task Pro 🚀</h1>

      {/* Input */}
      <div className="flex w-full max-w-xl mb-6">
        <input
          type="text"
          placeholder="Search or add task..."
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="flex-1 p-3 rounded-l-xl bg-gray-300 text-black"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 px-4 rounded-r-xl text-white flex items-center gap-2"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Task List */}
      <ul className="w-full max-w-xl space-y-4">
        {filteredTasks.map((t) => (
          <li
            key={t.id}
            className="bg-white rounded-2xl p-4 flex justify-between items-center"
          >
            {/* Task */}
            <div className="flex-1">
              {editId === t.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border p-1"
                />
              ) : (
                <p className="font-semibold">{t.text}</p>
              )}
            </div>

            {/* Toggle */}
            <div
              onClick={() => toggleTask(t)}
              className={`cursor-pointer px-3 py-1 rounded ${
                t.completed ? "bg-green-200" : "bg-red-200"
              }`}
            >
              {t.completed ? "Done" : "Pending"}
            </div>

            {/* Actions */}
            <div className="flex gap-3 ml-4">
              {editId === t.id ? (
                <Check
                  onClick={() => saveEdit(t.id)}
                  className="cursor-pointer text-green-500"
                />
              ) : (
                <Pencil
                  onClick={() => startEdit(t)}
                  className="cursor-pointer text-blue-500"
                />
              )}

              <Trash2
                onClick={() => deleteTask(t.id)}
                className="cursor-pointer text-red-500"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Store;
