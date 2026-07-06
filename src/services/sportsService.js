import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/sports`;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getSports = async () => {
  const response = await fetch(API_URL, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener los deportes");
  return response.json();
};

export const createSport = async (sportData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(sportData)
  });
  if (!response.ok) throw new Error("Error al crear el deporte");
  return response.json();
};

export const updateSport = async (id, sportData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(sportData)
  });
  if (!response.ok) throw new Error("Error al actualizar el deporte");
  return response.json();
};

export const deleteSport = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!response.ok) throw new Error("Error al eliminar el deporte");
  return response.json();
};

export const changeSportStatus = async (id, status) => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error("Error al cambiar el estado");
  return response.json();
};