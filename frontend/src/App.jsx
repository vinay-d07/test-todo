import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import './App.css'

function App() {
  const { register, handleSubmit, reset } = useForm()
  const [todos, setTodos] = useState([])

  const url = import.meta.env.VITE_API_URL || "http://localhost:5000/todos"

  const fetchTodos = async () => {
    const response = await fetch(`${url}/todos`)
    const data = await response.json()
    setTodos(data)
  }

  const onSubmit = async (data) => {
    if (data.todo && data.todo.trim() !== '') {
      setTodos([{ title: data.todo, completed: false }, ...todos])
      try {
        const response = await fetch(`${url}/todos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          throw new Error("Failed to add todo")
        }
        const newTodo = await response.json()
        setTodos([newTodo, ...todos])
        reset()
      } catch (error) {
        console.error("Error adding todo:", error)
        alert("Failed to add todo. Please try again.")
      }
      reset()
    }
  }
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${url}/todos/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Failed to delete todo")
      }
      setTodos(todos.filter((todo) => todo._id !== id))
    } catch (error) {
      console.error("Error deleting todo:", error)
      alert("Failed to delete todo. Please try again.")
    }
  }

  const updateTodo = async (id, data) => {
    try {
      const response = await fetch(`${url}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error("Failed to update todo")
      }
      const updatedTodo = await response.json()
      setTodos(todos.map((todo) => todo._id === id ? updatedTodo : todo))
    } catch (error) {
      console.error("Error updating todo:", error)
      alert("Failed to update todo. Please try again.")
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-white to-black p-4 w-screen">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-black mb-6 text-center drop-shadow">Todo App</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mb-6">
          <input
            {...register('todo', { required: true })}
            className="flex-1 px-4 py-2 rounded-md border-none focus:ring-2 focus:ring-pink-400 outline-none text-gray-900"
            placeholder="Add a new todo..."
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-md font-semibold shadow hover:from-pink-600 hover:to-purple-600 transition"
          >
            Add
          </button>
        </form>
        <ul className="space-y-3">
          {todos.length === 0 && (
            <li className="text-black text-center opacity-70">No todos yet. Add one!</li>
          )}
          {todos.map((todo, idx) => (
            <div>
              <li
                key={idx}
                className="flex items-center justify-between bg-white bg-opacity-20 rounded-md px-4 py-2 text-black shadow"
              >
                <span className={todo.completed ? 'line-through opacity-60' : ''}>{todo.title}</span>
              </li>
              <button onClick={() => deleteTodo(todo._id)} className="text-red-500">Delete</button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
