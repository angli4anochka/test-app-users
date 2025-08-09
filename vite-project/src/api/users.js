
import axios from "axios";

const BASE_URL = "https://689650e7039a1a2b28920d23.mockapi.io/users/users";

export const getUserById = async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const updateUser = async (id, updatedData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, updatedData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
};

export const createUser = async (newUserData) => {
    const response = await axios.post(BASE_URL, newUserData);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
};

export const getUsersPage = async (page = 1, limit = 10) => {
    const response = await axios.get(BASE_URL, {
        params: { page, limit }
    });

    // пытаемся взять общее количество с сервера
    let total = Number(response.headers['x-total-count']);

    // если сервер не прислал — фейково считаем
    if (!Number.isFinite(total)) {
        const all = await axios.get(BASE_URL);
        total = all.data.length;
    }

    return {
        data: response.data,
        total
    };
};
