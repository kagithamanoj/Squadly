import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

interface User {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    googleLogin: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    setUser(data);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkLoggedIn();
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
    };

    const signup = async (name: string, email: string, password: string) => {
        const { data } = await api.post('/auth/signup', { name, email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
    };

    const googleLogin = async (token: string) => {
        // This will be implemented once we have the backend endpoint
        // const { data } = await api.post('/auth/google', { token });
        // localStorage.setItem('token', data.token);
        // setUser(data);
        console.log('Google Token received:', token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        googleLogout();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
