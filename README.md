\# CodeCraftHub



A RESTful Course Management API built with Node.js and Express.js.



CodeCraftHub is a backend project designed to manage learning courses through a simple and structured REST API. Course data is stored in a JSON file, making the project lightweight and easy to run locally.



\## Features



\- Create a new course

\- Get all courses

\- Get a course by ID

\- Update an existing course

\- Delete a course

\- Get course statistics

\- JSON-based data persistence

\- Input validation for course status

\- RESTful API architecture



\## Technologies



\- Node.js

\- Express.js

\- JavaScript

\- REST API

\- JSON

\- Git \& GitHub



\## Course Structure



Each course contains:



\- `id` – Unique course identifier

\- `name` – Course name

\- `description` – Course description

\- `target\_date` – Target completion date

\- `status` – Course progress status

\- `created\_at` – Creation timestamp



\### Available Statuses



\- `Not Started`

\- `In Progress`

\- `Completed`



\## API Endpoints



| Method | Endpoint | Description |

|--------|----------|-------------|

| GET | `/api/courses` | Get all courses |

| GET | `/api/courses/:id` | Get a course by ID |

| GET | `/api/courses/stats` | Get course statistics |

| POST | `/api/courses` | Create a new course |

| PUT | `/api/courses/:id` | Update a course |

| DELETE | `/api/courses/:id` | Delete a course |



\## Installation



Clone the repository:



```bash

git clone https://github.com/iremkursun/CodeCraftHub.git

