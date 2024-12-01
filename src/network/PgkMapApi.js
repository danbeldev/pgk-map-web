import axios from 'axios';


const BASE_URL = 'https://api.danbel.ru:30/pgk/map/v1.0';

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
// Получение списка всех полей с параметрами поиска, смещения и лимита
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
