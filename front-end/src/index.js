
import { Task } from './modules/Task';
"use strict";

//Model
let tasks = [];
let apiUrl = "http://localhost/api/task/";

//View
let taskField = document.getElementById("taskfield");
let selectedTask = null;
let todo;
let doing;
let done;

window.onload = function () {
    getJson()
        .then(function (data) {
            console.log(data);
        })
    initializeView();
    initializeTasks();
}


function initializeView() {
    todo = document.getElementById("todo", 1);
    todo.onclick = function (event) {
        moveTask(event);
    }

    doing = document.getElementById("doing");
    doing.onclick = function (event) {
        moveTask(event);
    }

    done = document.getElementById("done");
    done.onclick = function (event) {
        moveTask(event);
    }

    let addTaskButton = document.getElementById("addtask");
    addTaskButton.onclick = function (event) {
        event.preventDefault();

        if (selectedTask === null) {
            getJson(apiUrl + "create.php", "POST", JSON.stringify({ content: taskField.value, status: 1 }))
                .then(function (data) {
                    tasks.push(new Task(data.id, taskField.value, 1));
                    taskField.value = "";
                    updateView();
                })
        }
        else {
            updateTaskContent(selectedTask.id, taskField.value)
            taskField.value = "";
            updateView();
        }

    }
}

function initializeTasks() {

    getJson(apiUrl + "read.php", "GET", null)
        .then(function (data) {
            let taskRecords = data.records;

            taskRecords.forEach(function (taskRecord) {
                let task = new Task(taskRecord.id, taskRecord.content, taskRecord.status);
                tasks.push(task);
            });
            updateView();
        })
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

function updateView() {
    removeOldTasksFromView();
    tasks.forEach(function (task) {
        let visibleTask = createTask(task.id, task.content);

        switch (task.status) {
            case 1:
                todo.appendChild(visibleTask);
                break;
            case 2:
                doing.appendChild(visibleTask);
                break;
            case 3:
                done.appendChild(visibleTask);
                break;
        }
    });
}

function removeOldTasksFromView() {
    console.log(todo.firstChild);
    while (todo.firstChild.nextSibling) {
        todo.removeChild(todo.firstChild.nextSibling);
    }
    while (doing.firstChild.nextSibling) {
        doing.removeChild(doing.firstChild.nextSibling);
    }
    while (done.firstChild.nextSibling) {
        done.removeChild(done.firstChild.nextSibling);
    }
}

function createTask(id, text) {
    let task = document.createElement('div');
    task.className = "task";
    task.id = id;

    let content = document.createElement("p");
    content.textContent = text;
    task.appendChild(content);

    let remove = document.createElement("button");
    remove.textContent = "Delete";
    task.appendChild(remove);
    remove.onclick = function (event) {
        selectedTask = null;
        taskField.value = "";
        removeTask(event.target.parentNode.id);
        updateView();
    }

    task.onclick = function (event) {
        if (event.target.classList.contains("task")) {

            if (selectedTask != null) {
                selectedTask.classList.remove("task-selected");
            }

            if (selectedTask !== event.target) {
                selectedTask = event.target;
                taskField.value = selectedTask.firstChild.textContent;
                event.target.classList.add("task-selected");
            }
            else {
                selectedTask = null;
                taskField.value = "";
            }
        }
    }

    return task;
}

function moveTask(event) {
    if (selectedTask !== null) {
        if (event.target.id === "todo" || event.target.id === "doing" || event.target.id === "done") {
            taskField.value = "";
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