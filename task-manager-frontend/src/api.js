const BASE_URL = "http://localhost:8082";

async function handleResponse(res) {
  if (res.status === 204) return null;

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = body?.message || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.fieldErrors = body?.fieldErrors || null;
    throw error;
  }
  return body;
}

export async function fetchTasks(status) {
  const url = status ? `${BASE_URL}/tasks?status=${status}` : `${BASE_URL}/tasks`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`);
  return handleResponse(res);
}

export async function createTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return handleResponse(res);
}

export async function updateTask(id, task) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
  return handleResponse(res);
}
