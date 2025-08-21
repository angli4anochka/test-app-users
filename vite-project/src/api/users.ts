
import axios from "axios";
import { User } from "../types";

const BASE_URL = "https://689650e7039a1a2b28920d23.mockapi.io/users/users";

export const getUserById = async (id: string | number): Promise<User> => {
    const response = await axios.get<User>(`${BASE_URL}/${id}`);
    return response.data;
};

export const updateUser = async (id: string | number, updatedData: Partial<User>): Promise<User> => {
    const response = await axios.put<User>(`${BASE_URL}/${id}`, updatedData);
    return response.data;
};

export const deleteUser = async (id: string | number): Promise<User> => {
    const response = await axios.delete<User>(`${BASE_URL}/${id}`);
    return response.data;
};

export const createUser = async (newUserData: Omit<User, "id">): Promise<User> => {
    const response = await axios.post<User>(BASE_URL, newUserData);
    return response.data;
};

export const getAllUsers = async (): Promise<User[]> => {
    const response = await axios.get<User[]>(BASE_URL);
    return response.data;
};

export const getUsersPage = async (page: number = 1, limit: number = 10): Promise<{ data: User[]; total: number }> => {
    const response = await axios.get<User[]>(BASE_URL, {
        params: { page, limit }
    });

    // пытаемся взять общее количество с сервера
    let total = Number(response.headers['x-total-count']);

    // если сервер не прислал — фейково считаем
    if (!Number.isFinite(total)) {
        const all = await axios.get<User[]>(BASE_URL);
        total = all.data.length;
    }

    return {
        data: response.data,
        total
    };
};
