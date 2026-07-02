const BASE_URL = "https://jsonplaceholder.typicode.com/users";

async function handleResponse(res) {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function fetchUsers() {
  const res = await fetch(BASE_URL);
  return handleResponse(res);
}

export async function createUser(user) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return handleResponse(res);
}

export async function updateUser(id, user) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return handleResponse(res);
}

export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
