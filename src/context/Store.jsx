import React, { useReducer, useEffect, useState } from "react";
import appReducer, { initialState } from "./appReducer";
import { Trash2, Pencil, Plus } from "lucide-react";
import axios from "axios";

const Store = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [text, setText] = useState("");

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


  function filter(e)
  {
    dispatch({type:"FilterData",payload:e})
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-white mb-6">Task Pro 🚀</h1>

      {/* Add Task */}
      <div className="flex w-full max-w-xl mb-6">
        <input
          type="text"
          placeholder="Enter new task..."
          value={text}
          onChange={(e) => filter(e.target.value)}
          
          className="flex-1 p-3 rounded-l-xl outline-none bg-gray-300 text-black"
        />
        <button className="bg-blue-500 px-4 rounded-r-xl text-white hover:bg-blue-600 flex items-center gap-2">
          <Plus size={18} />
          Add
        </button>
      </div>

      {/* Task List */}
      <ul className="w-full max-w-xl space-y-4">
        {state.tasks.map((t) => (
          <li
            key={t.id}
            className="bg-white rounded-2xl shadow-lg p-4 flex justify-between items-center"
          >
            {/* Task Info */}
            <div className="flex-5">
              <p className="text-sm text-gray-500">ID: {t.id}</p>
              <p className="font-semibold text-gray-800">{t.text}</p>
            </div>

            {/* Status */}
            <div
              className={`p-2 rounded-full text-center flex-3 text-sm font-semibold ${
                t.completed
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <p>{t.completed ? "Completed" : "Pending"}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-3 justify-center gap-3 text-gray-500">
              <Pencil
                className="cursor-pointer hover:text-blue-500"
                size={18}
              />
              <Trash2 className="cursor-pointer hover:text-red-500" size={18} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Store;
