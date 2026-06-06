const API_URL = 'http://localhost:3000/api/auth';

// Login contra el backend
export async function loginUser(credentials) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (response.ok) {
        throw new Error(data.message || "Error al inciar sesión");
    }

    return data;
}

// Guardar sesion en el navegador
export function saveSession(token, user) {
    LocalStorage.setItem('token', token);
    LocalStorage.setItem('user', JSON.stringify(user));
}

// obtener token
export function getToken() {
    return LocalStorage.getItem('token');
}

// obtener usuario
export function getUser() {
    const user = LocalStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Verificar si existe sesion
export function isAuthenticated() {
    return Boolean(getToken());
}

// Cerrar sesion
export function logout() {
    LocalStorage.removeItem('token');
    LocalStorage.removeItem('user');
}