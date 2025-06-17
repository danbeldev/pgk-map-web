import axios from 'axios';


const BASE_URL = 'https://map.matstart.ru:30/pgk/map/v1.0';

// Настройка axios с базовым URL
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Получение информации по полю по ID
export const getFieldById = async (id) => {
    try {
        const response = await api.get(`/fields/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching field by ID:', error);
        throw error;
    }
};

// Обновление информации по полю по ID
export const updateFieldById = async (id, name, date) => {
    try {
        const response = await api.put(`/fields/${id}`, null, {
            params: {
                name: name,
                date: date
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating field by ID:', error);
        throw error;
    }
};

// Удаление поля по ID
export const deleteFieldById = async (id) => {
    try {
        const response = await api.delete(`/fields/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting field by ID:', error);
        throw error;
    }
};

// Загрузка zip-файла с параметрами
export const uploadZipFile = async (name, date, borders, file, setProgress) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name);
        formData.append('date', date);

        // Преобразуем массив borders в строку с нужным форматом
        const bordersString = borders.join(',');

        formData.append('borders', bordersString);

        const response = await api.post('/fields/upload-zip-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                // Рассчитываем прогресс загрузки
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percent);  // Обновляем состояние с прогрессом
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading zip file:', error);
        throw error;
    }
};
//
export const getAllFields = async (search = '', offset = 0, limit = 20) => {
    try {
        const response = await api.get('/fields', {
            params: { search, offset, limit },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching all fields:', error);
        throw error;
    }
};

// Mock пользователи (в реальном приложении это будет запрос к серверу)
const mockUsers = [
    { id: 1, name: 'Тестовый пользователь', email: 'test', password: 'test' }
];

// Имитация задержки сети
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 500));

export const AuthAPI = {
    // Вход пользователя
    signIn: async (credentials) => {
        const response = await api.post('/users/security/sign-in', credentials);
        const { accessToken, isAdmin, userId } = response.data; // Предполагаем, что токен возвращается в поле accessToken
        localStorage.setItem('token', accessToken); // Сохраняем токен в localStorage
        localStorage.setItem('isAdmin', isAdmin); // Сохраняем токен в localStorage
        localStorage.setItem('userId', userId); // Сохраняем токен в localStorage
        return response.data; // Возвращаем данные ответа
    },

    signUp: async (data) => {
        const response = await api.post('/users/security/sign-up', data);
        const { accessToken, isAdmin, userId } = response.data; // Предполагаем, что токен возвращается в поле accessToken
        localStorage.setItem('token', accessToken); // Сохраняем токен в localStorage
        localStorage.setItem('isAdmin', isAdmin); // Сохраняем токен в localStorage
        localStorage.setItem('userId', userId); // Сохраняем токен в localStorage
        return response.data; // Возвращаем данные ответа
    },

    // Выход пользователя
    signOut: () => {
        localStorage.removeItem('token'); // Удаляем токен из localStorage
    },
};

// Проверка авторизации (для защищенных роутов)
export const checkAuth = async () => {
    await simulateNetworkDelay();
    const token = localStorage.getItem('token');
    return { isAuthenticated: !!token };
};

// Выход из системы
export const logout = async () => {
    await simulateNetworkDelay();
    localStorage.removeItem('token');
    return { success: true };
};

export class register {
}