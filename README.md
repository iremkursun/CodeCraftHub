# CodeCraftHub API

A RESTful Course Management API built with **Node.js** and **Express.js**.

CodeCraftHub provides a lightweight backend for managing learning courses through CRUD operations. Course data is persisted in a local JSON file, making the project easy to run and demonstrate locally.

## Features

- Create, read, update, and delete courses
- Retrieve a course by ID
- Course statistics by status
- JSON file persistence
- Input validation
- HTTP status code handling
- Swagger / OpenAPI 3.0 documentation
- Clean separation between the Express application and server entry point

## Tech Stack

- Node.js
- Express.js
- JavaScript
- REST API
- JSON
- Swagger / OpenAPI
- Git & GitHub

## Project Structure

```text
CodeCraftHub/
├── app.js          # Express application, routes and Swagger configuration
├── server.js       # Application entry point
├── courses.json    # Local course data
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
| GET | `/` | API information |
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

The API will be available at:

```text
http://localhost:5000
```

Swagger documentation:

```text
http://localhost:5000/api/docs
```

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

## Data Persistence

Course data is stored in `courses.json`.

Creating, updating, or deleting a course writes the current collection back to this file. This is intentionally simple for a portfolio/demo project; a production application would normally use a database such as PostgreSQL, MySQL, or MongoDB.

## Portfolio Context

This project demonstrates practical backend concepts including:

- RESTful API design
- CRUD operations
- Express.js routing
- Request validation
- JSON data persistence
- HTTP status codes
- OpenAPI / Swagger documentation
- Basic error handling
- Git/GitHub workflow

## License

This project is intended as a learning and portfolio project.
