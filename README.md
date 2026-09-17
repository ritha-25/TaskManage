Task Management System

A simple full-stack task manager — Spring Boot API on the backend, React on the frontend, Postgres for storage.
Built to cover the core operations: create, view, edit, delete tasks, mark them done

Stack
Backend: Java 17, Spring Boot (Web, Data JPA, Validation), Maven
Database: PostgreSQL
Frontend: React (Vite), plain CSS, native fetch
Getting started
1. Database queries

sql
CREATE TABLE tasks (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(25) NOT NULL,
    description TEXT,
    status      VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'COMPLETED')),
    priority    VARCHAR(20) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

2. Backend
cd task-manager-backend
mvn spring-boot:run

Runs on http://localhost:8082.

3. Frontend
cd task-manager-frontend
npm install
npm run dev

Runs on http://localhost:5173.

API Endpoint
GET	/tasks	List all tasks
GET	/tasks/{id}	Get one task
POST	/tasks	Create a task
PUT	/tasks/{id}	Update a task 
DELETE	/tasks/{id}	Delete a task
A few decisions worth knowing about
No DTOs > the Task entity is returned straight from the controller. I Kept things simple for now so i didnt user mappers or dtos; 
CORS is wide open (@CrossOrigin(origins = "*") on the controller) so the React dev server can talk to the API without friction. 
id and createdAt are always set server-side, never trusted from the client.
Status/priority are enums, stored as readable strings in Postgres rather than numeric codes.
