
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
let refreshButton;
let autoRefreshEnabled = false;
let todo;
let doing;
let done;
let refreshInterval = 12000;

window.onload = () => {
    initializeView();
    initializeTasks();
}

const initializeView = () => {
    let colorChanger = new ColorChanger([91, 149, 183], document.body);
    colorChanger.setTimeColorToTarget();

    taskField = document.getElementById("taskfield");

    todo = document.getElementById("todo");
    doing = document.getElementById("doing");
    done = document.getElementById("done");

    todo.onclick = (event) => moveTask(event);
    doing.onclick = (event) => moveTask(event);
    done.onclick = (event) => moveTask(event);


    refreshButton = document.getElementById("refresh");
    refreshButton.onclick = () => {
        autoRefreshEnabled = !autoRefreshEnabled;
        refreshButton.textContent = autoRefreshEnabled ? "Disable Refresh" : "Enable Refresh";
    }

    setInterval(() => {
        if (autoRefreshEnabled) {
            initializeTasks();
        }

    }, refreshInterval);


    addTaskButton = document.getElementById("addtask");

    addTaskButton.onclick = (event) => {
        event.preventDefault();
        if (selectedTask === null) {
            getJson(apiUrl + "create.php", "POST", JSON.stringify({ content: taskField.value, status: 1 }))
                .then((data) => {
                    tasks.push(new Task(data.id, taskField.value, 1));
                    clearTaskField();
                    updateView();
                })
        }
        else {
            updateTaskContent(selectedTask.id, taskField.value);
            switchAddTaskButtonStatus();
            updateView();
        }
    }
}

const initializeTasks = () => {
    tasks = [];
    getJson(apiUrl + "read.php", "GET", null)
        .then((data) => {
            data.records.forEach(taskRecord => {
                tasks.push(new Task(taskRecord.id, taskRecord.content, taskRecord.status));
            });
            updateView();
        })
}

const updateView = () => {
    removeOldTasksFromView();
    tasks.forEach((task) => {
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
    if (selectedTask) {
        let newDiv = document.getElementById(selectedTask.id);
        if (newDiv && (newDiv.classList.contains("task"))) {
            newDiv.classList.add("task-selected");
            selectedTask = newDiv;
        }
        else {
            switchAddTaskButtonStatus();
        }
    }
}

const removeOldTasksFromView = () => {
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

const createTaskDiv = (id, text) => {
    let taskDiv = document.createElement('div');
    taskDiv.className = "task";
    taskDiv.id = id;

    let content = document.createElement("p");
    content.textContent = text;
    taskDiv.appendChild(content);

    let remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.onclick = (event) => {
        removeTask(event.target.parentNode.id);
        switchAddTaskButtonStatus();
        updateView();
    }
    taskDiv.appendChild(remove);

    taskDiv.onclick = (event) => {
        if (event.target.classList.contains("task")) {
            if (selectedTask != null) {
                selectedTask.classList.remove("task-selected");
            }
            if (selectedTask !== event.target) {
                if (selectedTask === null) {
                    switchAddTaskButtonStatus();
                }
                selectedTask = event.target;
                taskField.value = selectedTask.firstChild.textContent;
                event.target.classList.add("task-selected");
            }
            else {
                switchAddTaskButtonStatus();
            }
        }
    }
    return taskDiv;
}

const moveTask = (event) => {
    if (selectedTask !== null) {
        if (event.target.id === "todo" || event.target.id === "doing" || event.target.id === "done") {
            updateTaskStatus(selectedTask.id, event.target.id);
            switchAddTaskButtonStatus();
            updateView();
        }
    }
}

const updateTaskContent = (taskId, content) => {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id + "" === taskId) {
            tasks[i].content = content;
            sendUpdatedTask(tasks[i]);
            break;
        }
    }
}

const removeTask = (taskId) => {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id + "" === taskId) {
            getJson(apiUrl + "delete.php", "POST", JSON.stringify({ id: tasks[i].id }))
                .then((data) => {
                    console.log('Request success: ', data);
                })
                .catch((error) => {
                    console.log('Request failure: ', error);
                });
            tasks.splice(i, 1);
            break;
        }
    }
}

const updateTaskStatus = (taskId, targetId) => {

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

const sendUpdatedTask = (task) => {
    getJson(apiUrl + "update.php", "POST", JSON.stringify(task))
        .then((data) => {
            console.log('Request success: ', data);
        })
        .catch((error) => {
            console.log('Request failure: ', error);
        });
}

const switchAddTaskButtonStatus = () => {
    selectedTask = null;
    clearTaskField();
    if (addTaskButton.textContent === "Add Task") {
        addTaskButton.textContent = "Edit Task"
    }
    else {
        addTaskButton.textContent = "Add Task"
    }
}

const getJson = (url, method, body) => {
    return fetch(url, {
        method: method,
        body: body
    })
        .then((response) => {
            return response.json();
        })
}

const clearTaskField = () => taskField.value = "";