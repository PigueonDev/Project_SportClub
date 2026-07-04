const API_URL = "http://localhost:3000/api/rooms";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getRooms = async () => {
  const response = await fetch(API_URL, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener las salas");
  return response.json();
};

export const getRoom = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener la sala");
  return response.json();
};

export const createRoom = async (roomData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(roomData)
  });
  if (!response.ok) throw new Error("Error al crear la sala");
  return response.json();
};

export const updateRoom = async (id, roomData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(roomData)
  });
  if (!response.ok) throw new Error("Error al actualizar la sala");
  return response.json();
};

export const deleteRoom = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!response.ok) throw new Error("Error al eliminar la sala");
  return response.json();
};
