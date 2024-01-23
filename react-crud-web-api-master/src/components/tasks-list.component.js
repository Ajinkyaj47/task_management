import React, { Component } from "react";
import TaskDataService from "../services/task.service";
import { Link } from "react-router-dom";

export default class TasksList extends Component {
  constructor(props) {
    super(props);
    this.retrieveTasks = this.retrieveTasks.bind(this);
    this.refreshList = this.refreshList.bind(this);

    this.state = {
      tasks: [],
    };
  }

  componentDidMount() {
    this.retrieveTasks();
  }

  retrieveTasks() {
    TaskDataService.getAll()
      .then((response) => {
        this.setState({
          tasks: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveTasks();
    this.setState({
      currentTask: null,
      currentIndex: -1,
    });
  }
  removeTask(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    
    if (confirmDelete) {
      TaskDataService.delete(id)
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  render() {
    const { tasks } = this.state;

    return (
      <div>
        {tasks.length > 0 ? (
          <div className="list row">
            <div className="col-md-12">
              <h4>Task List</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={index}>
                      <td>{task.title}</td>
                      <td>{task.description}</td>
                      <td>{task.status}</td>
                      <td>
                      {new Date(task.due_date).toLocaleString()}
                      </td>
                      <td>
                        <Link
                          to={"/tasks/" + task.id}
                          className="btn btn-warning mr-2"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() => this.removeTask(task.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <h1>No records found</h1>
        )}
      </div>
    );
  }
}
