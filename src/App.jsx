import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const baseURL = "http://localhost:3000";

  async function addTask(event) {
    event.preventDefault();
    if (!newTask) {
      return;
    }
    const res = await axios.post(`${baseURL}/add`, {
      title: newTask,
    });
    const newTasks = [...tasks];
    newTasks.push({
      id: res.data.insertId,
      text: newTask,
      isEditing: false,
      completed: false,
    });
    setTasks(newTasks);
    setNewTask("");
  }

  async function getTasks() {
    const response = await axios.get(`${baseURL}/todos`);
    const newTasks = response.data.map((task) => ({
      id: task.id,
      text: task.title,
      isEditing: false,
      completed: task.completed,
    }));
    setTasks(newTasks);
  }

  useEffect(() => {
    getTasks();
  }, []);

  async function updateStatus(id, completed) {
    await axios.put(`${baseURL}/updateStatus`, {
      id: id,
      completed: completed,
    });
    const newTasks = [...tasks];
    const index = newTasks.findIndex((task) => task.id === id);
    newTasks[index].completed = completed;
    setTasks(newTasks);
  }

  async function deleteTask(id) {
    await axios.delete(`${baseURL}/delete`, {
      data: {
        id: id,
      },
    });
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  return (
    <div>
      <h1>To-Do App</h1>
      <div className="container">
        <div className="addTask">
          <form>
            <input
              type="text"
              className="input"
              value={newTask}
              placeholder="Add a task"
              onChange={(e) => {
                setNewTask(e.target.value);
              }}
            />
            <button className="addTaskBtn" onClick={(event) => addTask(event)}>
              Add Task
            </button>
          </form>
        </div>
        <div className="taskList">
          {tasks.map((task, index) => (
            <div key={index} className="task">
              <input
                type="checkbox"
                className="taskCheckbox"
                checked={task.completed}
                onChange={(e) => {
                  updateStatus(task.id, e.target.checked);
                }}
              />
              {task.isEditing ? (
                <>
                  <input
                    type="text"
                    className="editInput"
                    defaultValue={task.text}
                    id={`edit-${index}`}
                  />
                  <button
                    className="save"
                    onClick={async () => {
                      const editedTitle = document.getElementById(
                        `edit-${index}`
                      ).value;
                      await axios.put(`${baseURL}/update`, {
                        id: task.id,
                        title: editedTitle,
                      });
                      const newTasks = [...tasks];
                      newTasks[index].text = editedTitle;
                      newTasks[index].isEditing = false;
                      setTasks(newTasks);
                    }}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <label className="classLabel" htmlFor={`task-${index}`}>
                    {task.text}
                  </label>
                  <button
                    onClick={() => {
                      const newTasks = [...tasks];
                      newTasks[index].isEditing = true;
                      setTasks(newTasks);
                    }}
                    className="edit"
                  >
                    Edit
                  </button>
                </>
              )}
              {!task.isEditing && (
                <button
                  className="del"
                  onClick={() => {
                    deleteTask(task.id);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
