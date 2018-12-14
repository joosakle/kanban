"use strict";


//TODO: Korvaa tämä sekasotku järkevällä tietorakenteella (taulukolla), jossa kaikki itemit ovat. Luo kanbanitemille oma luokka. 
//Matki elmin model update view -rakennetta. 

let itemField = document.getElementById("itemfield");
let selectedItem = null;
let todo;
let doing;
let done;

window.onload = function () {
    todo = document.getElementById("todo", 1);

    todo.onclick = function (event) {
        moveItem(event);
    }

    todo.appendChild(createKanbanItem("Osta paljon kaljaa", 1));
    todo.appendChild(createKanbanItem("Osta paljon VIINAA", 2));

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
            todo.appendChild(createKanbanItem(itemField.value));
            itemfield.value = "";
        }
        else {
            selectedItem.firstChild.textContent = itemField.value;
            itemField.value = "";
        }
    }


}

function createKanbanItem(text, id) {
    let kanbanItem = document.createElement('div');
    kanbanItem.className = "kanban-item";
    kanbanItem.id = id;

    let content = document.createElement("p");
    content.textContent = text;
    kanbanItem.appendChild(content);

    let remove = document.createElement("button");
    remove.textContent = "Delete";
    kanbanItem.appendChild(remove);


    kanbanItem.onclick = function (event) {
        if (event.target.classList.contains("kanban-item")) {
            if (selectedItem !== null) {
                selectedItem.classList.remove("kanban-item-selected");
                if (selectedItem.id === event.target.id) {
                    selectedItem = null;
                    itemField.value = "";
                    return;
                }
                else {
                    console.log(event.target.parentNode);
                    let parentNode = event.target.parentNode;
                    event.target.parentNode.insertBefore(selectedItem, event.target);
                    selectedItem.classList.remove("kanban-item-selected");
                    selectedItem = null;

                }

            }
            else {
                selectedItem = event.target;
                itemField.value = selectedItem.firstChild.textContent;
                selectedItem.classList.add("kanban-item-selected");
            }
        }
    }

    return kanbanItem;
}



function moveItem(event) {
    if (selectedItem !== null) {
        if (event.target.id === "todo" || event.target.id === "doing" || event.target.id === "done") {
            event.target.appendChild(selectedItem);
            selectedItem.classList.remove("kanban-item-selected");
            itemField.value = "";
            selectedItem = null;
        }
    }
}