const API_URL = "http://localhost:3000/api/class-schedules";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getClassSchedules = async () => {
  const response = await fetch(API_URL, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener los horarios");
  return response.json();
};

export const getClassSchedule = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener el horario");
  return response.json();
};

export const createClassSchedule = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Error al crear el horario");
  return response.json();
};

export const updateClassSchedule = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Error al actualizar el horario");
  return response.json();
};

export const deleteClassSchedule = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!response.ok) throw new Error("Error al eliminar el horario");
  return response.json();
};
