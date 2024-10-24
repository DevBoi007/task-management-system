document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('deadline').setAttribute('min', formattedDate);
    document.getElementById('editDeadline').setAttribute('min', formattedDate);
});

document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const taskInput = document.getElementById('task');
    const deadlineInput = document.getElementById('deadline');
    const priorityInput = document.getElementById('priority');

    const task = taskInput.value;
    const deadline = deadlineInput.value;
    const priority = priorityInput.value;

    addTask(task, deadline, priority);
    
    taskInput.value = '';
    deadlineInput.value = '';
    priorityInput.value = 'Normal'; // Reset priority
});


let tasks = [];

function addTask(task, deadline, priority) {
    const taskId = tasks.length;
    tasks.push({ id: taskId, task, deadline, status: 'Pending', priority });
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    
    tasks.forEach(({ id, task, deadline, status, priority }) => {
        const row = document.createElement('tr');
        const taskClass = status === 'Completed' ? 'completed' : '';
        
        row.innerHTML = `
            <td class="${taskClass}">${task}</td>
            <td class="${taskClass}">${deadline}</td>
            <td>${status}</td>
            <td class="${taskClass}" id="priority-${id}">${priority}</td>
            <td>
                <button class="update" onclick="updateStatus(${id})">Update Task Status</button>
                <button class="edit" onclick="openEditModal(${id})">Edit</button>
                <button class="delete" onclick="deleteTask(${id})">Delete</button>
            </td>
        `;
        
        taskList.appendChild(row);
    });
}

function updatePriority(id, newPriority) {
    const task = tasks[id];
    task.priority = newPriority;
    renderTasks();
}

function updateStatus(id) {
    const task = tasks[id];
    task.status = task.status === 'In Progress' ? 'Completed' : 'In Progress';
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
}

let editTaskId = null;

function openEditModal(id) {
    const task = tasks[id];
    editTaskId = id;
    document.getElementById('editTask').value = task.task;
    document.getElementById('editDeadline').value = task.deadline;
    document.getElementById('editPriority').value = task.priority;
    document.getElementById('editModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

document.getElementById('saveChanges').addEventListener('click', function() {
    const editedTask = document.getElementById('editTask').value;
    const editedDeadline = document.getElementById('editDeadline').value;
    const editedPriority = document.getElementById('editPriority').value;
    
    if (editTaskId !== null) {
        tasks[editTaskId].task = editedTask;
        tasks[editTaskId].deadline = editedDeadline;
        tasks[editTaskId].priority = editedPriority;
        renderTasks();
        closeModal();
    }
});
