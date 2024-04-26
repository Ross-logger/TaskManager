document.getElementById('taskForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this); // Get form data
    const taskName = formData.get("taskName");
    const taskStatus = formData.get("taskStatus");
    try {
        const response = await fetch('/api/v1/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            },
            body: JSON.stringify({"taskName": taskName, "taskStatus": taskStatus}) // Convert to JSON string
        });
        if (!response.ok) {
            throw new Error('Failed to add task');
        }

        // Create a success message element
        const successMessage = document.createElement('p');
        successMessage.textContent = 'Task added successfully!';
        successMessage.style.color = 'green';

        // Append the success message to a suitable container
        const formContainer = document.getElementById('form-container');
        formContainer.appendChild(successMessage);

        // Clear the form after successful submission
        this.reset();

        // Fetch tasks again after adding a new one
        fetchTasks();
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add task. Please try again.');
    }
});


// Fetch all tasks and populate the table
async function fetchTasks() {
    try {
        const response = await fetch('/api/v1/tasks/all_tasks');
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const tasks = await response.json();
        const taskTableBody = document.getElementById('taskTableBody');
        taskTableBody.innerHTML = ''; // Clear previous tasks

        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td class="task-name ${task.completed ? 'completed-task' : ''}">${task.name}</td>
        <td>${task.completed ? '✅ Completed' : '⏳ In Progress'}</td>
        <td class="button-group">
            <button class="complete-button" data-task-id="${task._id}">✅</button>
            <button class="delete-button" data-task-id="${task._id}">❌</button>
        </td>
    `;
            taskTableBody.appendChild(row);
        });


        // Add event listener to all buttons with class "complete-button"
        document.querySelectorAll('.complete-button').forEach(button => {
            button.addEventListener('click', () => {
                const taskId = button.getAttribute("data-task-id"); // Get the task ID from the data-task-id attribute
                taskCompleted(taskId); // Call the taskCompleted function with the task ID
            });
        });
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', () => {
                const taskId = button.getAttribute("data-task-id"); // Get the task ID from the data-task-id attribute
                taskDelete(taskId); // Call the taskCompleted function with the task ID
            });
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Fetch tasks when the page loads
fetchTasks();

// Fetch random quote and author from an external API
async function fetchQuote() {
    try {
        const response = await fetch("https://api.quotable.io/random");
        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }
        const data = await response.json();
        document.getElementById('quote').textContent = data.content;
        document.getElementById('author').textContent = `— ${data.author}`;
    } catch (error) {
        console.error('Error fetching quote:', error);
    }
}

fetchQuote(); // Fetch a quote when the page loads

async function taskCompleted(taskId) {
    try {
        const response = await fetch(`/api/v1/tasks/task_completed/${taskId}`, {method: 'PATCH'});
        if (!response.ok) {
            throw new Error('Failed to fetch a task');
        }
        fetchTasks();
    } catch (error) {
        console.error('Error fetching task:', error);
    }

}

async function taskDelete(taskId) {
    try {
        const response = await fetch(`/api/v1/tasks/${taskId}`, {method: 'DELETE'});
        if (!response.ok) {
            throw new Error('Failed to fetch a task');
        }
        fetchTasks();
    } catch (error) {
        console.error('Error fetching task:', error);
    }

}