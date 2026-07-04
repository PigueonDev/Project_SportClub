const API_URL = "http://localhost:3000/api/member";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getMemberDashboard = async () => {
  const response = await fetch(`${API_URL}/dashboard`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener el dashboard");
  return response.json();
};

export const getAvailableClasses = async () => {
  const response = await fetch(`${API_URL}/classes`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener las clases disponibles");
  return response.json();
};

export const getClassDetail = async (id) => {
  const response = await fetch(`${API_URL}/classes/${id}`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener el detalle de la clase");
  return response.json();
};

export const getMemberSports = async () => {
  const response = await fetch(`${API_URL}/sports`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener los deportes");
  return response.json();
};

export const getMemberRooms = async () => {
  const response = await fetch(`${API_URL}/rooms`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener las salas");
  return response.json();
};
