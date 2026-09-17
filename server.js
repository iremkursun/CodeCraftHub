const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// JSON request body'lerini okuyabilmek için
app.use(express.json());

// courses.json dosyasının yolu
const coursesFile = path.join(__dirname, "courses.json");

// ------------------------------------
// courses.json'dan kursları oku
// ------------------------------------
function readCourses() {
    try {
        const data = fs.readFileSync(coursesFile, "utf8");

        if (!data.trim()) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading courses.json:", error);
        return [];
    }
}

// ------------------------------------
// courses.json'a kursları kaydet
// ------------------------------------
function writeCourses(courses) {
    fs.writeFileSync(
        coursesFile,
        JSON.stringify(courses, null, 2),
        "utf8"
    );
}

// ------------------------------------
// Ana sayfa
// ------------------------------------
app.get("/", (req, res) => {
    res.send("CodeCraftHub API is running!");
});

// ------------------------------------
// GET /courses
// Tüm kursları getir
// ------------------------------------
app.get("/courses", (req, res) => {
    const courses = readCourses();

    res.json(courses);
});

// ------------------------------------
// GET /courses/:id
// ID'ye göre tek kurs getir
// ------------------------------------
app.get("/courses/:id", (req, res) => {
    const courses = readCourses();

    const id = Number(req.params.id);

    const course = courses.find((course) => course.id === id);

    if (!course) {
        return res.status(404).json({
            message: "Course not found"
        });
    }

    res.json(course);
});

// ------------------------------------
// POST /courses
// Yeni kurs ekle
// ------------------------------------
app.post("/courses", (req, res) => {
    const courses = readCourses();

    const {
        title,
        description,
        instructor,
        duration,
        level
    } = req.body;

    // Gerekli alanları kontrol et
    if (
        !title ||
        !description ||
        !instructor ||
        duration === undefined ||
        !level
    ) {
        return res.status(400).json({
            message:
                "title, description, instructor, duration and level are required"
        });
    }

    // Yeni ID oluştur
    const newId =
        courses.length > 0
            ? Math.max(...courses.map((course) => course.id)) + 1
            : 1;

    const newCourse = {
        id: newId,
        title: title,
        description: description,
        instructor: instructor,
        duration: Number(duration),
        level: level
    };

    courses.push(newCourse);

    writeCourses(courses);

    res.status(201).json(newCourse);
});

// ------------------------------------
// PUT /courses/:id
// Var olan kursu güncelle
// ------------------------------------
app.put("/courses/:id", (req, res) => {
    const courses = readCourses();

    const id = Number(req.params.id);

    const courseIndex = courses.findIndex(
        (course) => course.id === id
    );

    if (courseIndex === -1) {
        return res.status(404).json({
            message: "Course not found"
        });
    }

    const {
        title,
        description,
        instructor,
        duration,
        level
    } = req.body;

    // Güncellenen kurs
    const updatedCourse = {
        id: id,
        title: title || courses[courseIndex].title,
        description:
            description || courses[courseIndex].description,
        instructor:
            instructor || courses[courseIndex].instructor,
        duration:
            duration !== undefined
                ? Number(duration)
                : courses[courseIndex].duration,
        level: level || courses[courseIndex].level
    };

    courses[courseIndex] = updatedCourse;

    writeCourses(courses);

    res.json(updatedCourse);
});

// ------------------------------------
// DELETE /courses/:id
// Kurs sil
// ------------------------------------
app.delete("/courses/:id", (req, res) => {
    const courses = readCourses();

    const id = Number(req.params.id);

    const courseIndex = courses.findIndex(
        (course) => course.id === id
    );

    if (courseIndex === -1) {
        return res.status(404).json({
            message: "Course not found"
        });
    }

    const deletedCourse = courses[courseIndex];

    courses.splice(courseIndex, 1);

    writeCourses(courses);

    res.json({
        message: "Course deleted successfully",
        course: deletedCourse
    });
});

// ------------------------------------
// 404 - Tanımlanmamış endpoint
// ------------------------------------
app.use((req, res) => {
    res.status(404).json({
        message: "Endpoint not found"
    });
});

// ------------------------------------
// Server'ı başlat
// ------------------------------------
app.listen(PORT, () => {
    console.log(
        `CodeCraftHub API is running on http://localhost:${PORT}`
    );
});