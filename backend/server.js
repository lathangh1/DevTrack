
const express = require("express");

const app = express();

app.use(express.json());

const PORT = 5000;

let projects = [];

// Home API
app.get("/", (req, res) => {
    res.send("Welcome to DevTrack Backend!");
});

app.post("/api/projects", (req, res) => {

    const project = {
        id: Date.now(),
        name: req.body.name,
        description: req.body.description,
        status: req.body.status
    };

    projects.push(project);

    res.status(201).json({
        message: "Project created successfully!",
        data: project
    });

});

// GET API - Retrieve All Projects
app.get("/api/projects", (req, res) => {

    res.json({
        message: "Projects retrieved successfully!",
        data: projects
    });

});



app.get("/api/projects/:id", (req, res) => {

    const projectId = Number(req.params.id);

    const project = projects.find(
        (p) => p.id === projectId
    );

    if (!project) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    res.json({
        message: "Project retrieved successfully!",
        data: project
    });

});



app.put("/api/projects/:id", (req, res) => {

    const projectId = Number(req.params.id);

    const project = projects.find(
        (p) => p.id === projectId
    );

    if (!project) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    project.name = req.body.name;
    project.description = req.body.description;
    project.status = req.body.status;

    res.json({
        message: "Project updated successfully!",
        data: project
    });

});

// DELETE API - Delete a project
app.delete("/api/projects/:id", (req, res) => {

    // Get project ID from URL
    const projectId = Number(req.params.id);

    // Find the project index
    const projectIndex = projects.findIndex(
        (p) => p.id === projectId
    );

    // Check whether project exists
    if (projectIndex === -1) {
        return res.status(404).json({
            message: "Project not found"
        });
    }

    // Delete the project
    const deletedProject = projects.splice(projectIndex, 1);

    // Send response
    res.json({
        message: "Project deleted successfully!",
        data: deletedProject[0]
    });
});



// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



