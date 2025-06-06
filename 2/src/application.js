import axios from 'axios';

const apiEndpoints = {
  getTasks: () => '/api/tasks',
};

// BEGIN
export default async () => {
  const taskForm = document.querySelector('form');
  const taskInput = taskForm.querySelector('input[name="name"]');
  const listContainer = document.getElementById('tasks');

  async function fetchTasks() {
    try {
      const response = await axios.get(apiEndpoints.getTasks());
      listContainer.innerHTML = '';

      const tasks = response.data.items.slice().reverse();
      tasks.forEach(({ name }) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = name;
        listContainer.prepend(listItem);
      });
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  }

  async function onFormSubmit(event) {
    event.preventDefault();

    const newTaskName = taskInput.value.trim();
    if (!newTaskName) return;

    try {
      const postResponse = await axios.post(apiEndpoints.getTasks(), { name: newTaskName });
      if (postResponse.status === 201) {
        const newListItem = document.createElement('li');
        newListItem.className = 'list-group-item';
        newListItem.textContent = newTaskName;
        listContainer.prepend(newListItem);

        taskInput.value = '';
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  }

  taskForm.addEventListener('submit', onFormSubmit);

  await fetchTasks();
  taskInput.focus();
};
// END
