
import { Task } from './modules/Task';
import { ColorChanger } from './modules/ColorChanger';
"use strict";

//Model
let tasks = [];
let selectedTask = null;
let apiUrl = "/api/task/"; //"http://localhost/api/task/"; When using Parcel dev server

//View
let taskField;
let addTaskButton;
let todo;
let doing;
let done;

window.onload = function () {
    initializeView();
    initializeTasks();
}

function initializeView() {
    let colorChanger = new ColorChanger([91, 149, 183], document.body);
    colorChanger.setTimeColorToTarget();

    taskField = document.getElementById("taskfield");
    addTaskButton = document.getElementById("addtask");

    todo = document.getElementById("todo");
    doing = document.getElementById("doing");
    done = document.getElementById("done");

    todo.onclick = function (event) {
        moveTask(event);
    }

    doing.onclick = function (event) {
        moveTask(event);
    }

    done.onclick = function (event) {
        moveTask(event);
    }

    addTaskButton.onclick = function (event) {
        event.preventDefault();

        if (selectedTask === null) {
            getJson(apiUrl + "create.php", "POST", JSON.stringify({ content: taskField.value, status: 1 }))
                .then(function (data) {
                    tasks.push(new Task(data.id, taskField.value, 1));
                    clearTaskField();
                    updateView();
                })
        }
        else {
            updateTaskContent(selectedTask.id, taskField.value);
            selectedTask = null;
            clearTaskField();
            switchAddTaskButtonStatus();
            updateView();
        }
    }
}

function initializeTasks() {
    getJson(apiUrl + "read.php", "GET", null)
        .then(function (data) {
            data.records.forEach(function (taskRecord) {
                tasks.push(new Task(taskRecord.id, taskRecord.content, taskRecord.status));
            });
            updateView();
        })
}

function updateView() {
    removeOldTasksFromView();
    tasks.forEach(function (task) {
        let taskDiv = createTaskDiv(task.id, task.content);

        switch (task.status) {
            case 1:
                todo.appendChild(taskDiv);
                break;
            case 2:
                doing.appendChild(taskDiv);
                break;
            case 3:
                done.appendChild(taskDiv);
                break;
        }
    });
}

function removeOldTasksFromView() {
    while (todo.firstChild.nextSibling.nextSibling) {
        todo.removeChild(todo.firstChild.nextSibling.nextSibling);
    }
    while (doing.firstChild.nextSibling.nextSibling) {
        doing.removeChild(doing.firstChild.nextSibling.nextSibling);
    }
    while (done.firstChild.nextSibling.nextSibling) {
        done.removeChild(done.firstChild.nextSibling.nextSibling);
    }
}

function createTaskDiv(id, text) {
    let taskDiv = document.createElement('div');
    taskDiv.className = "task";
    taskDiv.id = id;

    let content = document.createElement("p");
    content.textContent = text;
    taskDiv.appendChild(content);

    let remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.onclick = function (event) {
        selectedTask = null;
        removeTask(event.target.parentNode.id);
        clearTaskField();
        switchAddTaskButtonStatus();
        updateView();
    }
    taskDiv.appendChild(remove);

    taskDiv.onclick = function (event) {
        if (event.target.classList.contains("task")) {
            if (selectedTask != null) {
                selectedTask.classList.remove("task-selected");
            }
            if (selectedTask !== event.target) {
                selectedTask = event.target;
                taskField.value = selectedTask.firstChild.textContent;
                event.target.classList.add("task-selected");
                switchAddTaskButtonStatus();
            }
            else {
                selectedTask = null;
                clearTaskField();
                switchAddTaskButtonStatus();
            }
        }
    }
    return taskDiv;
}

function moveTask(event) {
    if (selectedTask !== null) {
        if (event.target.id === "todo" || event.target.id === "doing" || event.target.id === "done") {
            clearTaskField();
            switchAddTaskButtonStatus();
            updateTaskStatus(selectedTask.id, event.target.id);
            selectedTask = null;
            updateView();
        }
    }
}

function updateTaskContent(taskId, content) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id + "" === taskId) {
            tasks[i].content = content;
            sendUpdatedTask(tasks[i]);
            break;
        }
    }
}

function removeTask(taskId) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id + "" === taskId) {
            getJson(apiUrl + "delete.php", "POST", JSON.stringify({ id: tasks[i].id }))
                .then(function (data) {
                    console.log('Request success: ', data);
                })
                .catch(function (error) {
                    console.log('Request failure: ', error);
                });
            tasks.splice(i, 1);
            break;
        }
    }
}

function updateTaskStatus(taskId, targetId) {

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id + "" === taskId) {
            switch (targetId) {
                case "todo":
                    tasks[i].status = 1;
                    break;
                case "doing":
                    tasks[i].status = 2;
                    break;
                case "done":
                    tasks[i].status = 3;
                    break;
                default:
                    break;
            }
            sendUpdatedTask(tasks[i]);
        }
    }
}

function sendUpdatedTask(task) {
    getJson(apiUrl + "update.php", "POST", JSON.stringify(task))
        .then(function (data) {
            console.log('Request success: ', data);
        })
        .catch(function (error) {
            console.log('Request failure: ', error);
        });
}

function switchAddTaskButtonStatus() {
    if (addTaskButton.textContent === "Add Task") {
        addTaskButton.textContent = "Edit Task"
    }
    else {
        addTaskButton.textContent = "Add Task"
    }
}

function getJson(url, method, body) {
    return fetch(url, {
        method: method,
        body: body
    })
        .then(function (response) {
            return response.json();
        })
}

function clearTaskField() {
    taskField.value = "";
}