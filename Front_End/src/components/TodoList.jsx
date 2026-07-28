import TodoItem from "./TodoItem";

const TodoList = ({ todos, removeTodo, updateTodo }) => {
  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      {/* Heading */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          All Todos
        </h2>

        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full font-semibold">
          Total: {todos.length}
        </span>
      </div>

      {/* Empty State */}
      {todos.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-md rounded-xl p-10 text-center">
          <h3 className="text-2xl font-semibold text-gray-700 dark:text-white">
            📭 No Todos Found
          </h3>

          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Add your first todo to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              removeTodo={removeTodo}
              updateTodo={updateTodo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;