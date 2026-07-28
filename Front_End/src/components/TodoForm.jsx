import { useState } from "react";

const TodoForm = ({ addTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill all fields");
      return;
    }

    addTodo({
      title,
      description,
    });

    setTitle("");
    setDescription("");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6 mt-8 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
        Add New Todo
      </h2>

      <form onSubmit={submitHandler} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Title
          </label>

          <input
            type="text"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border
                       border-gray-300 dark:border-slate-600
                       bg-white dark:bg-slate-700
                       text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Description
          </label>

          <textarea
            rows="4"
            placeholder="Enter description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-lg resize-none border
                       border-gray-300 dark:border-slate-600
                       bg-white dark:bg-slate-700
                       text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold
                     bg-blue-600 hover:bg-blue-700
                     text-white transition-all duration-300 cursor-pointer"
        >
          Add Todo
        </button>
      </form>
    </div>
  );
};

export default TodoForm;