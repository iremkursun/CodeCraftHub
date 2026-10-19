# CodeCraftHub

A RESTful Course Management API built with **Node.js** and **Express.js**, together with a browser-based course management dashboard.

CodeCraftHub provides a lightweight backend for managing learning courses through CRUD operations. Course data is persisted in a local JSON file, making the project easy to run and demonstrate locally. The included dashboard lets users create, view, edit, and delete courses directly from the browser.

## Features

- Create, read, update, and delete courses
- Retrieve a course by ID
- Course statistics by status
- JSON file persistence
- Input validation
- HTTP status code handling
- Swagger / OpenAPI 3.0 documentation
- Clean separation between the Express application and server entry point
- Responsive single-page course management dashboard

## Tech Stack

- Node.js
- Express.js
- JavaScript
- HTML & CSS
- REST API
- JSON
- Swagger / OpenAPI
- Bolt.new (AI-assisted UI generation)
- Git & GitHub

## Project Structure

```text
CodeCraftHub/
├── app.js            # Express application, routes, static files and Swagger configuration
├── server.js         # Application entry point
├── courses.json      # Local course data
├── public/
│   └── index.html    # Course management dashboard (HTML, CSS and JavaScript)
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Course Model

Each course contains:

| Field | Type | Description |
|---|---|---|
| `id` | Integer | Unique course identifier |
| `name` | String | Course name |
| `description` | String | Course description |
| `target_date` | Date | Target completion date |
| `status` | String | Current course status |
| `created_at` | DateTime | Creation timestamp |

### Available statuses

- `Not Started`
- `In Progress`
- `Completed`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Course management dashboard |
| GET | `/api/courses` | Get all courses |
| POST | `/api/courses` | Create a course |
| GET | `/api/courses/:id` | Get a course by ID |
| PUT | `/api/courses/:id` | Update a course |
| DELETE | `/api/courses/:id` | Delete a course |
| GET | `/api/courses/stats` | Get course statistics |
| GET | `/api/docs` | Swagger UI |

> The `/api/courses/stats` route is intentionally defined before `/api/courses/:id` so `stats` is not interpreted as a course ID.

## Example Request

### Create a course

```json
{
  "name": "AI Engineering",
  "description": "Learn AI engineering and API development",
  "target_date": "2027-06-30",
  "status": "Not Started"
}
```

### Update a course

```json
{
  "name": "AI Engineering Updated",
  "description": "Advanced AI engineering and API development",
  "target_date": "2027-07-31",
  "status": "In Progress"
}
```

## Example Statistics Response

```json
{
  "total": 5,
  "by_status": {
    "Not Started": 2,
    "In Progress": 1,
    "Completed": 2
  }
}
```

## HTTP Status Codes

| Code | Meaning |
|---|---|
| `200` | Request successful |
| `201` | Resource created |
| `400` | Invalid request or ID |
| `404` | Resource or route not found |
| `500` | Internal server error |

## Installation

Clone the repository:

```bash
git clone https://github.com/iremkursun/CodeCraftHub.git
cd CodeCraftHub
```

Install dependencies:

```bash
npm install
```

Start the API:

```bash
npm start
```

The dashboard will be available at:

```text
http://localhost:5000
```

Swagger documentation:

```text
http://localhost:5000/api/docs
```

## Dashboard

The course management dashboard is a single HTML file (`public/index.html`) with embedded CSS and vanilla JavaScript. No frameworks are used. It was generated with **Bolt.new** from a single detailed prompt and then integrated into this project.

### Dashboard features

- Lists all courses in a responsive card layout
- Add Course form with validation for all required fields
- Edit courses in a modal pre-filled with the current values
- Remove courses with a confirmation prompt
- Loading spinners, success/error notifications and an empty state
- Formatted target and creation dates
- Purple/amber theme (`#8B5CF6` primary, `#F59E0B` success, `#EF4444` delete)

### How it connects to the API

Express serves the dashboard from the `public/` folder:

```js
app.use(express.static(path.join(__dirname, "public")));
```

The dashboard calls the API with a relative base URL:

```js
const API_URL = '/api/courses';
```

Because the page and the API are served from the same origin, no CORS configuration is needed. The same setup also works in cloud IDEs where `localhost` in the browser does not point to the server.

## Development

The project currently uses Node.js directly for local development:

```bash
npm run dev
```

## Testing the API

Swagger UI can be used to test every endpoint interactively.

Recommended CRUD test sequence:

1. `GET /api/courses`
2. `POST /api/courses`
3. `GET /api/courses/{id}`
4. `PUT /api/courses/{id}`
5. `GET /api/courses/stats`
6. `DELETE /api/courses/{id}`
7. Confirm the deleted course returns `404`

The same create, update and delete flow can also be tested from the dashboard at `http://localhost:5000`.

## Data Persistence

Course data is stored in `courses.json`.

Creating, updating, or deleting a course writes the current collection back to this file. This is intentionally simple for a portfolio/demo project; a production application would normally use a database such as PostgreSQL, MySQL, or MongoDB.

## Portfolio Context

This project demonstrates practical full-stack concepts including:

- RESTful API design
- CRUD operations
- Express.js routing
- Request validation
- JSON data persistence
- HTTP status codes
- OpenAPI / Swagger documentation
- Basic error handling
- Frontend-to-API integration with `fetch()`
- AI-assisted UI generation with Bolt.new
- Git/GitHub workflow

## License

This project is intended as a learning and portfolio project.
