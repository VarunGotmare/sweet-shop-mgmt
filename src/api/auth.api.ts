import api from "./axios";


export type LoginResponse = {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: "USER" | "ADMIN";
    };
};

type LoginPayload = {
    email: string;
    password: string;
};

type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

//login user
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>("/api/auth/login", payload);
    return res.data;
}

//register user
export async function registerUser(
    payload: RegisterPayload
    ): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>("/api/auth/register", payload);
    return res.data;
}
