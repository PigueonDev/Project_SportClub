import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/sport-rooms`;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getSportRooms = async () => {
  const response = await fetch(API_URL, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener las asignaciones");
  return response.json();
};

export const getSportRoom = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener la asignación");
  return response.json();
};

export const createSportRoom = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Error al crear la asignación");
  return response.json();
};

export const updateSportRoom = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Error al actualizar la asignación");
  return response.json();
};

export const deleteSportRoom = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!response.ok) throw new Error("Error al eliminar la asignación");
  return response.json();
};
