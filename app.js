const express = require("express");
const fs = require("fs");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const app = express();

const DATA_FILE = path.join(__dirname, "courses.json");

const VALID_STATUSES = [
    "Not Started",
    "In Progress",
    "Completed"
];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function initializeDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, "[]", "utf8");
    }
}

function readCourses() {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return data.trim() ? JSON.parse(data) : [];
}

function writeCourses(courses) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(courses, null, 2), "utf8");
}

function getNextId(courses) {
    return courses.length
        ? Math.max(...courses.map(course => course.id)) + 1
        : 1;
}

function parseCourseId(value) {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
}

function validateCourseInput(body, { partial = false } = {}) {
    const { name, description, target_date, status } = body;

    if (!partial && (!name || !description || !target_date || !status)) {
        return "name, description, target_date and status are required";
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
        return "Invalid status. Allowed values: Not Started, In Progress, Completed";
    }

    return null;
}

const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "CodeCraftHub API",
        version: "1.0.0",
        description: "RESTful Course Management API built with Node.js and Express.js."
    },
    servers: [
        {
            url: "http://localhost:5000",
            description: "Local development server"
        }
    ],
    paths: {
        "/": {
            get: {
                summary: "API information",
                responses: {
                    200: {
                        description: "API information and available endpoints"
                    }
                }
            }
        },
        "/api/courses": {
            get: {
                summary: "Get all courses",
                responses: {
                    200: {
                        description: "List of all courses",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: { $ref: "#/components/schemas/Course" }
                                }
                            }
                        }
                    },
                    500: { description: "Server error" }
                }
            },
            post: {
                summary: "Create a new course",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CourseInput" }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Course created successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Course" }
                            }
                        }
                    },
                    400: { description: "Invalid course data" },
                    500: { description: "Server error" }
                }
            }
        },
        "/api/courses/stats": {
            get: {
                summary: "Get course statistics",
                description: "Returns the total number of courses and counts by status.",
                responses: {
                    200: {
                        description: "Course statistics",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/CourseStats" }
                            }
                        }
                    },
                    500: { description: "Server error" }
                }
            }
        },
        "/api/courses/{id}": {
            parameters: [
                {
                    name: "id",
                    in: "path",
                    required: true,
                    description: "Course ID",
                    schema: { type: "integer", minimum: 1 }
                }
            ],
            get: {
                summary: "Get a course by ID",
                responses: {
                    200: {
                        description: "Course found",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Course" }
                            }
                        }
                    },
                    400: { description: "Invalid course ID" },
                    404: { description: "Course not found" },
                    500: { description: "Server error" }
                }
            },
            put: {
                summary: "Update a course",
                description: "Updates one or more course fields. Existing fields are preserved when omitted.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CourseUpdate" }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Course updated successfully",
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/Course" }
                            }
                        }
                    },
                    400: { description: "Invalid course ID or course data" },
                    404: { description: "Course not found" },
                    500: { description: "Server error" }
                }
            },
            delete: {
                summary: "Delete a course",
                responses: {
                    200: {
                        description: "Course deleted successfully"
                    },
                    400: { description: "Invalid course ID" },
                    404: { description: "Course not found" },
                    500: { description: "Server error" }
                }
            }
        }
    },
    components: {
        schemas: {
            Course: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Python Basics" },
                    description: { type: "string", example: "Learn Python fundamentals" },
                    target_date: { type: "string", format: "date", example: "2026-12-31" },
                    status: {
                        type: "string",
                        enum: VALID_STATUSES,
                        example: "Not Started"
                    },
                    created_at: {
                        type: "string",
                        format: "date-time",
                        example: "2026-09-17T13:42:07.398Z"
                    }
                }
            },
            CourseInput: {
                type: "object",
                required: ["name", "description", "target_date", "status"],
                properties: {
                    name: { type: "string", example: "Python Advanced" },
                    description: { type: "string", example: "Advanced Python programming" },
                    target_date: { type: "string", format: "date", example: "2027-03-31" },
                    status: {
                        type: "string",
                        enum: VALID_STATUSES,
                        example: "Not Started"
                    }
                }
            },
            CourseUpdate: {
                type: "object",
                properties: {
                    name: { type: "string", example: "Python Advanced Updated" },
                    description: { type: "string", example: "Advanced Python programming and API development" },
                    target_date: { type: "string", format: "date", example: "2027-04-30" },
                    status: {
                        type: "string",
                        enum: VALID_STATUSES,
                        example: "In Progress"
                    }
                }
            },
            CourseStats: {
                type: "object",
                properties: {
                    total: { type: "integer", example: 5 },
                    by_status: {
                        type: "object",
                        additionalProperties: { type: "integer" },
                        example: {
                            "Not Started": 2,
                            "In Progress": 1,
                            "Completed": 2
                        }
                    }
                }
            },
            Error: {
                type: "object",
                properties: {
                    error: { type: "string", example: "Course not found" }
                }
            }
        }
    }
};

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.status(200).json({
        name: "CodeCraftHub API",
        version: "1.1.0",
        description: "Course Management REST API",
        endpoints: {
            courses: "/api/courses",
            course_by_id: "/api/courses/:id",
            statistics: "/api/courses/stats",
            documentation: "/api/docs"
        }
    });
});

app.get("/api/courses", (req, res) => {
    try {
        res.status(200).json(readCourses());
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/courses/stats", (req, res) => {
    try {
        const courses = readCourses();
        const by_status = {
            "Not Started": 0,
            "In Progress": 0,
            "Completed": 0
        };

        courses.forEach(course => {
            if (Object.prototype.hasOwnProperty.call(by_status, course.status)) {
                by_status[course.status]++;
            }
        });

        res.status(200).json({
            total: courses.length,
            by_status
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/courses", (req, res) => {
    try {
        const validationError = validateCourseInput(req.body);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const courses = readCourses();
        const { name, description, target_date, status } = req.body;

        const newCourse = {
            id: getNextId(courses),
            name,
            description,
            target_date,
            status,
            created_at: new Date().toISOString()
        };

        courses.push(newCourse);
        writeCourses(courses);

        return res.status(201).json(newCourse);
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});

app.get("/api/courses/:id", (req, res) => {
    try {
        const id = parseCourseId(req.params.id);

        if (id === null) {
            return res.status(400).json({ error: "Invalid course ID" });
        }

        const course = readCourses().find(item => item.id === id);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        return res.status(200).json(course);
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});

app.put("/api/courses/:id", (req, res) => {
    try {
        const id = parseCourseId(req.params.id);

        if (id === null) {
            return res.status(400).json({ error: "Invalid course ID" });
        }

        const validationError = validateCourseInput(req.body, { partial: true });
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }

        const courses = readCourses();
        const courseIndex = courses.findIndex(course => course.id === id);

        if (courseIndex === -1) {
            return res.status(404).json({ error: "Course not found" });
        }

        const allowedFields = ["name", "description", "target_date", "status"];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                courses[courseIndex][field] = req.body[field];
            }
        });

        writeCourses(courses);

        return res.status(200).json(courses[courseIndex]);
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});

app.delete("/api/courses/:id", (req, res) => {
    try {
        const id = parseCourseId(req.params.id);

        if (id === null) {
            return res.status(400).json({ error: "Invalid course ID" });
        }

        const courses = readCourses();
        const courseIndex = courses.findIndex(course => course.id === id);

        if (courseIndex === -1) {
            return res.status(404).json({ error: "Course not found" });
        }

        const [deletedCourse] = courses.splice(courseIndex, 1);
        writeCourses(courses);

        return res.status(200).json({
            message: "Course deleted successfully",
            course: deletedCourse
        });
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: "Server error" });
});

initializeDataFile();

module.exports = app;
