import uniqueId from 'lodash/uniqueId.js';

// BEGIN
export default function createTaskApp() {
    const containerLists = document.querySelector('[data-container="lists"]');
    const containerTasks = document.querySelector('[data-container="tasks"]');
    const formNewList = document.querySelector('[data-container="new-list-form"]');
    const formNewTask = document.querySelector('[data-container="new-task-form"]');

    const appState = {
        boards: {
            [uniqueId('board_')]: {
                title: 'General',
                items: []
            }
        },
        activeBoardId: null
    };

    appState.activeBoardId = Object.keys(appState.boards)[0];

    function renderBoards() {
        const listElement = document.createElement('ul');

        for (const [boardId, board] of Object.entries(appState.boards)) {
            const listItem = document.createElement('li');

            if (boardId === appState.activeBoardId) {
                listItem.innerHTML = `<strong>${board.title}</strong>`;
            } else {
                listItem.innerHTML = `<a href="#" data-board-id="${boardId}">${board.title}</a>`;
            }

            listElement.appendChild(listItem);
        }

        containerLists.innerHTML = '';
        containerLists.appendChild(listElement);
    }

    function renderTasks() {
        containerTasks.innerHTML = '';

        const activeBoard = appState.boards[appState.activeBoardId];
        if (!activeBoard.items.length) return;

        const taskList = document.createElement('ul');

        activeBoard.items.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.textContent = task;
            taskList.appendChild(taskItem);
        });

        containerTasks.appendChild(taskList);
    }

    function addNewBoard(boardName) {
        const cleanName = boardName.trim();
        if (!cleanName) return;

        const duplicate = Object.values(appState.boards).some(
            board => board.title.toLowerCase() === cleanName.toLowerCase()
        );

        if (!duplicate) {
            const newBoardId = uniqueId('board_');
            appState.boards[newBoardId] = {
                title: cleanName,
                items: []
            };
            renderBoards();
        }
    }

    function addNewTask(taskName) {
        const cleanTask = taskName.trim();
        if (!cleanTask) return;

        appState.boards[appState.activeBoardId].items.push(cleanTask);
        renderTasks();
    }

    formNewList.addEventListener('submit', event => {
        event.preventDefault();
        const inputField = event.target.querySelector('input[name="name"]');
        addNewBoard(inputField.value);
        inputField.value = '';
    });

    formNewTask.addEventListener('submit', event => {
        event.preventDefault();
        const inputField = event.target.querySelector('input[name="name"]');
        addNewTask(inputField.value);
        inputField.value = '';
    });

    containerLists.addEventListener('click', event => {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            appState.activeBoardId = event.target.dataset.boardId;
            renderBoards();
            renderTasks();
        }
    });

    renderBoards();
    renderTasks();
}
// END
