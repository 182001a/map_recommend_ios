/**
 * 認証関連のAPIを扱うモジュール
 */

import axios from "axios";
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// APIのユーザーモデルに対応する型定義
export type User = {
    id: number;
    username: string;
    email: string;
};

// ログインAPIのレスポンス型定義
export type LoginResponse = {
    user: User;
    token: string;
};

// ログインAPIの実装
export async function login(
    username: string,
    password: string
): Promise<LoginResponse> {
    try {
        const response = await api.post<LoginResponse>('/auth/login/', {
            username,
            password,
        });
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.detail || 'ログインに失敗しました';
        throw new Error(message);
    }
}