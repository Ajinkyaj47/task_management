import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import TaskDataService from "../services/task.service";

export default class AddTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      status: "",
      due_date: "",
      submitted: false,
      errors: {} // Object to store validation errors
    };
  }

  validateForm() {
    const errors = {};
    if (!this.state.title.trim()) {
      errors.title = "Title cannot be empty";
    }
    if (!this.state.description.trim()) {
      errors.description = "Description cannot be empty";
    }
    if (!this.state.status) {
      errors.status = "Please select a status";
    }
    if (!this.state.due_date) {
      errors.due_date = "Due Date cannot be empty";
    } 
    

    this.setState({ errors });
    return Object.keys(errors).length === 0; // Form is valid if there are no errors
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangeStatus(e) {
    this.setState({
      status: e.target.value
    });
  }

  onChangeDue_date(e) {
    this.setState({
      due_date: e.target.value
    });
  }

  saveTask() {
    if (!this.validateForm()) {
      return; // Exit function if form is not valid
    }

    const data = {
      title: this.state.title,
      description: this.state.description,
      status: this.state.status,
      due_date: this.state.due_date
    };

    TaskDataService.create(data)
      .then(response => {
        this.setState({
          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newTask() {
    this.setState({
      title: "",
      description: "",
      status: "",
      due_date: "",
      submitted: false,
      errors: {} // Clear validation errors when starting a new task
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={this.newTask}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className={`form-control ${this.state.errors.title ? "is-invalid" : ""}`}
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeTitle.bind(this)}
                name="title"
              />
              <div className="invalid-feedback">{this.state.errors.title}</div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                className={`form-control ${this.state.errors.description ? "is-invalid" : ""}`}
                id="description"
                required
                value={this.state.description}
                onChange={this.onChangeDescription.bind(this)}
                name="description"
              />
              <div className="invalid-feedback">{this.state.errors.description}</div>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                className={`form-control ${this.state.errors.status ? "is-invalid" : ""}`}
                id="status"
                required
                value={this.state.status}
                onChange={this.onChangeStatus.bind(this)}
                name="status"
              >
                <option value="">Select Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <div className="invalid-feedback">{this.state.errors.status}</div>
            </div>

            <div className="form-group">
          <label htmlFor="due_date">Due Date</label>
          <DatePicker
            className={`form-control ${this.state.errors.due_date ? "is-invalid" : ""}`}
            id="due_date"
            selected={this.state.due_date}
            onChange={date => this.setState({ due_date: date })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm:ss"
            timeCaption="Time"
          />
          <div className="invalid-feedback">{this.state.errors.due_date}</div>
        </div>

            <button onClick={this.saveTask.bind(this)} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}
