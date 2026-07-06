// Configuración central de la API.
// El valor viene de la variable de entorno VITE_API_URL (ver archivo .env).
// Si no existe, cae por defecto a localhost:3000 (para desarrollo local con backend local).
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
