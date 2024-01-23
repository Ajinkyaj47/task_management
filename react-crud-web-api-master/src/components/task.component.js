import React, { Component } from "react";
import TaskDataService from "../services/task.service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { withRouter } from '../common/with-router';

class Task extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeDue_date = this.onChangeDue_date.bind(this);

    this.getTask = this.getTask.bind(this);
    this.updateTask = this.updateTask.bind(this);

    this.state = {
      currentTask: {
        title: "",
        description: "",
        status: "",
        due_date: "",
      },
      submitted: false,
      errors: {}, // Object to store validation errors
      message: "",
    };
  }
  

  componentDidMount() {
    this.getTask(this.props.router.params.id);
  }

  onChangeTitle(e) {
    const title = e.target.value;
    this.setState((prevState) => ({
      currentTask: {
        ...prevState.currentTask,
        title: title,
      },
      errors: {
        ...prevState.errors,
        title: title ? "" : "Title is required",
      },
    }));
  }

  onChangeDescription(e) {
    const description = e.target.value;

    this.setState((prevState) => ({
      currentTask: {
        ...prevState.currentTask,
        description: description,
      },
      errors: {
        ...prevState.errors,
        description: description ? "" : "Description is required",
      },
    }));
  }

  onChangeStatus(e) {
    const status = e.target.value;

    this.setState((prevState) => ({
      currentTask: {
        ...prevState.currentTask,
        status: status,
      },
      errors: {
        ...prevState.errors,
        status: status ? "" : "Status is required",
      },
    }));
  }

  onChangeDue_date(e) {
    const due_date = e.target.value;

    this.setState((prevState) => ({
      currentTask: {
        ...prevState.currentTask,
        due_date: due_date,
      },
      errors: {
        ...prevState.errors,
        due_date: due_date ? "" : "Due Date is required",
      },
    }));
  }

  getTask(id) {
    TaskDataService.get(id)
      .then((response) => {
        this.setState({
          currentTask: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateTask() {
    const { title, description, status, due_date } = this.state.currentTask;
    const errors = {
      title: title ? "" : "Title is required",
      description: description ? "" : "Description is required",
      status: status ? "" : "Status is required",
      due_date: due_date ? "" : "Due Date is required",
    };

    if (Object.values(errors).every((error) => !error)) {
      // No validation errors, proceed with the update
      TaskDataService.update(this.state.currentTask.id, this.state.currentTask)
        .then((response) => {
          console.log(response.data);
          this.setState({
            message: "The task was updated successfully!",
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      // Validation errors, update the errors state
      this.setState({
        errors: { ...errors },
      });
    }
  }
  

  render() {
    const { currentTask, errors } = this.state;

    return (
      <div>
        <div className="edit-form">
          <h4>Task</h4>
          <form>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                id="title"
                value={currentTask.title}
                onChange={this.onChangeTitle}
              />
              <div className="invalid-feedback">{errors.title}</div>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                id="description"
                value={currentTask.description}
                onChange={this.onChangeDescription}
              />
              <div className="invalid-feedback">{errors.description}</div>
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                className={`form-control ${errors.status ? "is-invalid" : ""}`}
                id="status"
                required
                value={currentTask.status}
                onChange={this.onChangeStatus.bind(this)}
                name="status"
              >
                <option value="">Select Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <div className="invalid-feedback">{errors.status}</div>
            </div>
            
          <div className="form-group">
          <label htmlFor="due_date">Due Date</label>
          <DatePicker
              className={`form-control ${errors.due_date ? "is-invalid" : ""}`}
              id="due_date"
              selected={currentTask.due_date ? new Date(currentTask.due_date) : null}
              onChange={date => {
                const formattedDate = date.toISOString(); // Convert selected date to ISO string
                this.setState({ currentTask: { ...currentTask, due_date: formattedDate } })
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              timeCaption="Time"
              
            />

          <div className="invalid-feedback">{this.state.errors.due_date}</div>
        </div>
          </form>

          <button
            type="button"
            className="btn btn-success"
            onClick={this.updateTask}
          >
            Update
          </button>
          <p>{this.state.message}</p>
        </div>
      </div>
    );
  }
}

export default withRouter(Task);
