
import { KanbanItem } from './modules/KanbanItem';
"use strict";

//Model
let kanbanItems = [];

//View
let itemField = document.getElementById("itemfield");
let selectedItem = null;
let todo;
let doing;
let done;

window.onload = function () {
    initializeView();
    initializeItems();
    updateView();
}


function initializeView() {
    todo = document.getElementById("todo", 1);
    todo.onclick = function (event) {
        moveItem(event);
    }

    doing = document.getElementById("doing");
    doing.onclick = function (event) {
        moveItem(event);
    }

    done = document.getElementById("done");
    done.onclick = function (event) {
        moveItem(event);
    }

    let addItemButton = document.getElementById("additem");
    addItemButton.onclick = function (event) {
        event.preventDefault();

        if (selectedItem === null) {
            kanbanItems.push(new KanbanItem(getNextId(), itemField.value, 1));
            updateView();
        }
        else {
            updateItemContent(selectedItem.id, itemField.value)
        }
        itemField.value = "";
        updateView();
    }
}

function initializeItems() {
    //TODO: Code for retrieving items from API
    let item1 = new KanbanItem(1, "Testi1", 1);
    kanbanItems.push(item1);
    let item2 = new KanbanItem(2, "Testi2", 3);
    kanbanItems.push(item2);
}

function updateView() {
    removeOldItemsFromView();
    kanbanItems.forEach(function (item) {
        let visiblItem = createKanbanItem(item.id, item.content);

        switch (item.status) {
            case 1:
                todo.appendChild(visiblItem);
                break;
            case 2:
                doing.appendChild(visiblItem);
                break;
            case 3:
                done.appendChild(visiblItem);
                break;
        }
    });
}

function removeOldItemsFromView() {
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

function createKanbanItem(id, text) {
    let kanbanItem = document.createElement('div');
    kanbanItem.className = "kanban-item";
    kanbanItem.id = id;

    let content = document.createElement("p");
    content.textContent = text;
    kanbanItem.appendChild(content);

    let remove = document.createElement("button");
    remove.textContent = "Delete";
    kanbanItem.appendChild(remove);
    remove.onclick = function (event) {
        selectedItem = null;
        itemField.value = "";
        removeItem(event.target.parentNode.id);
        updateView();
    }

    kanbanItem.onclick = function (event) {
        if (event.target.classList.contains("kanban-item")) {

            if (selectedItem != null) {
                selectedItem.classList.remove("kanban-item-selected");
            }

            if (selectedItem !== event.target) {
                selectedItem = event.target;
                itemField.value = selectedItem.firstChild.textContent;
                event.target.classList.add("kanban-item-selected");
            }
            else {
                selectedItem = null;
                itemField.value = "";
            }
        }
    }

    return kanbanItem;
}

function moveItem(event) {
    if (selectedItem !== null) {
        if (event.target.id === "todo" || event.target.id === "doing" || event.target.id === "done") {
            itemField.value = "";
            updateItemStatus(selectedItem.id, event.target.id);
            selectedItem = null;
            updateView();
        }
    }
}

function updateItemContent(itemId, content) {
    for (let i = 0; i < kanbanItems.length; i++) {
        if (kanbanItems[i].id + "" === itemId) {
            kanbanItems[i].content = content;
        }
    }
}

function getNextId() {
    let maxId = 0;

    for (let i = 0; i < kanbanItems.length; i++) {
        if (kanbanItems[i].id > maxId) {
            maxId = kanbanItems[i].id;
        }
    }
    return maxId + 1;
}

function removeItem(itemId) {
    for (let i = 0; i < kanbanItems.length; i++) {
        if (kanbanItems[i].id + "" === itemId) {
            kanbanItems.splice(i, 1);
            break;
        }
    }
}

function updateItemStatus(itemId, targetId) {

    for (let i = 0; i < kanbanItems.length; i++) {
        if (kanbanItems[i].id + "" === itemId) {
            switch (targetId) {
                case "todo":
                    kanbanItems[i].status = 1;
                    break;
                case "doing":
                    kanbanItems[i].status = 2;
                    break;
                case "done":
                    kanbanItems[i].status = 3;
                    break;
                default:
                    break;
            }
        }
    }
}