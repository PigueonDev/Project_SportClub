const API_URL = "http://localhost:3000/api/coach";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getCoachDashboard = async () => {
  const response = await fetch(`${API_URL}/dashboard`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener el dashboard del coach");
  return response.json();
};

export const getMyClasses = async () => {
  const response = await fetch(`${API_URL}/my-classes`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener mis clases");
  return response.json();
};

export const getMySchedules = async () => {
  const response = await fetch(`${API_URL}/my-schedules`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener mi horario");
  return response.json();
};

export const getMyRooms = async () => {
  const response = await fetch(`${API_URL}/my-rooms`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener mis salas");
  return response.json();
};
