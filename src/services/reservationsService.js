import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/reservations`;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getReservations = async () => {
  const response = await fetch(API_URL, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener las reservas");
  return response.json();
};

export const getMyReservations = async () => {
  const response = await fetch(`${API_URL}/my-reservations`, { headers: getHeaders() });
  if (!response.ok) throw new Error("Error al obtener mis reservas");
  return response.json();
};

export const createReservation = async (classScheduleId) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ class_schedule_id: classScheduleId })
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al crear la reserva");
  }
  return response.json();
};

export const cancelReservation = async (id) => {
  const response = await fetch(`${API_URL}/${id}/cancel`, {
    method: "PATCH",
    headers: getHeaders()
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al cancelar la reserva");
  }
  return response.json();
};
