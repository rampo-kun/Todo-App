"use client";

import Todo from "@/components/Todo";
import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [toDoData, setToDoData] = useState([]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    console.log("Submitting form data:", formData);

    try {
      // API
      const response = await axios.post("/api", formData);

      console.log("API response:", response);
      toast.success(response.data.msg);
      setFormData({
        title: "",
        description: "",
      });

      // Fetch updated todos after submission
      fetchTodos();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form");
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios("/api");
      setToDoData(response.data.todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const deleteTodos = async (id) => {
    try {
      const response = await axios.delete("/api", { params: {
        mongoId: id
      } });
      toast.success(response.data.msg);
      // Fetch updated todos after deletion
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Error deleting todo");
    }
  };

  const completeTodos = async (id) =>{
    const response = await axios.put("/api",{},{
      params: {
        mongoId: id,
      }
    })
    toast.success(response.data.msg);
    fetchTodos();
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <ToastContainer theme="dark" />
      <form
        className="flex flex-col items-start gap-2 w-[80%] max-w-[600px] mt-24 px-2 mx-auto"
        onSubmit={onSubmitHandler}
      >
        <input
          type="text"
          value={formData.title}
          onChange={onChangeHandler}
          placeholder="Enter Title"
          name="title"
          className="px-3 py-2 w-full border-2 rounded-lg outline-none focus:border-3 focus:border-black transition-all duration-300"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={onChangeHandler}
          placeholder="Description"
          className="px-3 py-2 w-full border-2 rounded-lg outline-none focus:border-3 focus:border-black transition-all duration-300"
        ></textarea>
        <button
          type="submit"
          className="bg-black py-3 px-11 font-semibold text-white hover:text-black hover:bg-white transition-all duration-500"
        >
          Add Todo
        </button>
      </form>

      <div className="relative overflow-x-auto mt-24 w-[60%] mx-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {toDoData.map((item, index) => (
              <Todo
                key={index}
                id={index}
                title={item.title}
                description={item.description}
                complete={item.isCompleted}
                mongoId={item._id}
                deleteTodos={deleteTodos}
                completeTodos={completeTodos}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
