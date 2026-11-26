
// 1. Get projects from localStorage
let projects = [];
// 2. Track which project is being edited
let editingProjectId = null;


// 3. Connect HTML elements
const projectForm = document.getElementById("projectForm");
const projectNameInput = document.getElementById("projectName");
const projectDescriptionInput = document.getElementById("projectDescription");
const projectStatusInput = document.getElementById("projectStatus");
const projectList = document.getElementById("projectList");
const createProjectBtn = document.getElementById("createProjectBtn");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const sortProjects = document.getElementById("sortProjects");

// Dashboard elements
const totalProjects = document.getElementById("totalProjects");
const pendingProjects = document.getElementById("pendingProjects");
const inProgressProjects = document.getElementById("inProgressProjects");
const completedProjects = document.getElementById("completedProjects");


// 4. Create and update projects
projectForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const projectName = projectNameInput.value.trim();
    const projectDescription = projectDescriptionInput.value.trim();
    const projectStatus = projectStatusInput.value;

    if (editingProjectId !== null) {

        // Update existing project
        projects = projects.map(project => {

            if (project.id === editingProjectId) {

                return {
                    ...project,
                    name: projectName,
                    description: projectDescription,
                    status: projectStatus
                };

            }

            return project;
        });

        editingProjectId = null;

    } else {

        // Create new project
        const newProject = {
            id: Date.now(),
            name: projectName,
            description: projectDescription,
            status: projectStatus
        };

        projects.push(newProject);

    }

    // Save projects
    localStorage.setItem("projects", JSON.stringify(projects));

    // Refresh project list and dashboard
    displayProjects();

    // Clear form
    projectForm.reset();

    // Reset button
    createProjectBtn.textContent = "Create Project";

});


// 5. Display projects with search, filter and sorting
function displayProjects() {

    // Clear previous project cards
    projectList.innerHTML = "";

    // Update dashboard
    updateDashboard();

    // Get search and filter values
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedStatus = filterStatus.value;

    // Filter projects
    const filteredProjects = projects.filter(function(project) {

        const matchesName = project.name.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            project.status === selectedStatus;

        return matchesName && matchesStatus;

    });

    // Sort filtered projects
    const sortedProjects = [...filteredProjects];

    if (sortProjects.value === "name-asc") {

        sortedProjects.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    } else if (sortProjects.value === "name-desc") {

        sortedProjects.sort((a, b) =>
            b.name.localeCompare(a.name)
        );

    } else if (sortProjects.value === "newest") {

        sortedProjects.sort((a, b) => b.id - a.id);

    } else if (sortProjects.value === "oldest") {

        sortedProjects.sort((a, b) => a.id - b.id);

    }

    // Display sorted projects
    sortedProjects.forEach(function(project) {

        const card = document.createElement("div");

        // Project name
        const heading = document.createElement("h3");
        heading.textContent = project.name;

        // Project description
        const description = document.createElement("p");
        description.textContent = project.description;

        // Project status
        const status = document.createElement("span");
        status.textContent = project.status;

        status.classList.add("status-badge");

        status.classList.add(
            project.status.toLowerCase().replace(" ", "-")
        );

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {
            editProject(project.id);
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            deleteProject(project.id);
        });

        // Add elements to card
        card.appendChild(heading);
        card.appendChild(description);
        card.appendChild(status);
        card.appendChild(editButton);
        card.appendChild(deleteButton);

        // Add card to project list
        projectList.appendChild(card);

    });

    // Show message if no projects match
    if (filteredProjects.length === 0) {

        const message = document.createElement("p");
        message.textContent = "No projects found.";

        projectList.appendChild(message);

    }

}


// 6. Update dashboard counts
function updateDashboard() {

    // Total projects
    totalProjects.textContent = projects.length;

    // Pending projects
    pendingProjects.textContent = projects.filter(function(project) {
        return project.status === "Pending";
    }).length;

    // In Progress projects
    inProgressProjects.textContent = projects.filter(function(project) {
        return project.status === "In Progress";
    }).length;

    // Completed projects
    completedProjects.textContent = projects.filter(function(project) {
        return project.status === "Completed";
    }).length;

}


// 7. Search projects when typing
searchInput.addEventListener("input", displayProjects);


// 8. Filter projects when status changes
filterStatus.addEventListener("change", displayProjects);


// 9. Sort projects when sorting option changes
sortProjects.addEventListener("change", displayProjects);


// 10. Edit project
function editProject(id) {

    const project = projects.find(p => p.id === id);

    if (!project) return;

    projectNameInput.value = project.name;
    projectDescriptionInput.value = project.description;
    projectStatusInput.value = project.status;

    editingProjectId = id;

    createProjectBtn.textContent = "Update Project";

}


// 11. Delete project
function deleteProject(id) {

    projects = projects.filter(project => project.id !== id);

    localStorage.setItem("projects", JSON.stringify(projects));

    displayProjects();

    if (editingProjectId === id) {

        editingProjectId = null;

        projectForm.reset();

        createProjectBtn.textContent = "Create Project";

    }

}


// 12. Load saved projects when page opens
displayProjects();
