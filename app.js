const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

// courses.json dosyasının tam yolu
const DATA_FILE = path.join(__dirname, "courses.json");

// Express'in JSON request body'lerini okuyabilmesini sağlar
app.use(express.json());

// İzin verilen status değerleri
const VALID_STATUSES = [
  "Not Started",
  "In Progress",
  "Completed"
];

/*
 * courses.json dosyasını oluşturur.
 * Dosya yoksa otomatik olarak boş bir array oluşturulur.
 */
function initializeDataFile() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, "[]", "utf8");
      console.log("Created courses.json automatically.");
    }
  } catch (error) {
    console.error("Error creating courses.json:", error.message);
    process.exit(1);
  }
}

/*
 * courses.json dosyasındaki kursları okur.
 */
function readCourses() {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading courses.json: ${error.message}`);
  }
}

/*
 * Kurs listesini courses.json dosyasına kaydeder.
 */
function writeCourses(courses) {
  try {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(courses, null, 2),
      "utf8"
    );
  } catch (error) {
    throw new Error(`Error writing courses.json: ${error.message}`);
  }
}

/*
 * Yeni kurs için otomatik ID oluşturur.
 * İlk kursun ID'si 1 olur.
 */
function getNextId(courses) {
  if (courses.length === 0) {
    return 1;
  }

  return Math.max(...courses.map(course => course.id)) + 1;
}

/*
 * Root endpoint
 */
app.get("/", (req, res) => {
  res.json({
    message: "CodeCraftHub API is running!",
    endpoints: {
      getAllCourses: "GET /api/courses",
      getCourse: "GET /api/courses/:id",
      getCourseStats: "GET /api/courses/stats",
      createCourse: "POST /api/courses",
      updateCourse: "PUT /api/courses/:id",
      deleteCourse: "DELETE /api/courses/:id"
    }
  });
});

/*
 * GET /api/courses
 * Tüm kursları getirir.
 */
app.get("/api/courses", (req, res) => {
  try {
    const courses = readCourses();

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/*
 * GET /api/courses/stats
 *
 * Kursların istatistiklerini döndürür:
 * - Toplam kurs sayısı
 * - Not Started kurs sayısı
 * - In Progress kurs sayısı
 * - Completed kurs sayısı
 *
 * ÖNEMLİ:
 * Bu endpoint /api/courses/:id endpoint'inden ÖNCE
 * tanımlanmalıdır.
 */
app.get("/api/courses/stats", (req, res) => {
  try {
    const courses = readCourses();

    const stats = {
      total: courses.length,
      by_status: {
        "Not Started": 0,
        "In Progress": 0,
        "Completed": 0
      }
    };

    courses.forEach(course => {
      if (VALID_STATUSES.includes(course.status)) {
        stats.by_status[course.status]++;
      }
    });

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/*
 * GET /api/courses/:id
 * Belirli bir kursu getirir.
 */
app.get("/api/courses/:id", (req, res) => {
  try {
    const courses = readCourses();

    const id = Number(req.params.id);

    const course = courses.find(course => course.id === id);

    if (!course) {
      return res.status(404).json({
        error: "Course not found"
      });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/*
 * POST /api/courses
 * Yeni kurs oluşturur.
 */
app.post("/api/courses", (req, res) => {
  try {
    const {
      name,
      description,
      target_date,
      status
    } = req.body;

    // Zorunlu alanları kontrol ediyoruz
    if (!name || !description || !target_date || !status) {
      return res.status(400).json({
        error:
          "Missing required fields. Required fields: name, description, target_date, status"
      });
    }

    // Tarih formatını kontrol ediyoruz: YYYY-MM-DD
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(target_date)) {
      return res.status(400).json({
        error: "target_date must use YYYY-MM-DD format"
      });
    }

    // Status değerinin geçerli olup olmadığını kontrol ediyoruz
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error:
          'Invalid status. Status must be "Not Started", "In Progress", or "Completed"'
      });
    }

    const courses = readCourses();

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

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/*
 * PUT /api/courses/:id
 * Mevcut bir kursu günceller.
 */
app.put("/api/courses/:id", (req, res) => {
  try {
    const courses = readCourses();

    const id = Number(req.params.id);

    const courseIndex = courses.findIndex(
      course => course.id === id
    );

    if (courseIndex === -1) {
      return res.status(404).json({
        error: "Course not found"
      });
    }

    const {
      name,
      description,
      target_date,
      status
    } = req.body;

    // Gönderilen status varsa kontrol et
    if (
      status !== undefined &&
      !VALID_STATUSES.includes(status)
    ) {
      return res.status(400).json({
        error:
          'Invalid status. Status must be "Not Started", "In Progress", or "Completed"'
      });
    }

    // Gönderilen target_date varsa formatını kontrol et
    if (target_date !== undefined) {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;

      if (!datePattern.test(target_date)) {
        return res.status(400).json({
          error: "target_date must use YYYY-MM-DD format"
        });
      }
    }

    // Sadece gönderilen alanları güncelliyoruz
    if (name !== undefined) {
      courses[courseIndex].name = name;
    }

    if (description !== undefined) {
      courses[courseIndex].description = description;
    }

    if (target_date !== undefined) {
      courses[courseIndex].target_date = target_date;
    }

    if (status !== undefined) {
      courses[courseIndex].status = status;
    }

    writeCourses(courses);

    res.status(200).json(courses[courseIndex]);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/*
 * DELETE /api/courses/:id
 * Bir kursu siler.
 */
app.delete("/api/courses/:id", (req, res) => {
  try {
    const courses = readCourses();

    const id = Number(req.params.id);

    const courseIndex = courses.findIndex(
      course => course.id === id
    );

    if (courseIndex === -1) {
      return res.status(404).json({
        error: "Course not found"
      });
    }

    const deletedCourse = courses.splice(courseIndex, 1)[0];

    writeCourses(courses);

    res.status(200).json({
      message: "Course deleted successfully",
      course: deletedCourse
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

/*
 * Express dışındaki hataları yakalayan genel middleware
 */
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    error: "Internal server error"
  });
});

// courses.json yoksa oluştur
initializeDataFile();

// Server'ı başlat
app.listen(PORT, () => {
  console.log("CodeCraftHub API is starting...");
  console.log(`Data will be stored in: ${DATA_FILE}`);
  console.log(`API is available at: http://localhost:${PORT}`);
});