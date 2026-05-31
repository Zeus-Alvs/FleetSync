import React, { createContext, useState, useEffect } from 'react';
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const storedToken = localStorage.getItem('@FleetSync:token');
        const storedUser = localStorage.getItem('@FleetSync:user');
        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);
    const login = (token, userData) => {
        localStorage.setItem('@FleetSync:token', token);
        localStorage.setItem('@FleetSync:user', JSON.stringify(userData));
        setUser(userData);
    };
    const logout = () => {
        localStorage.removeItem('@FleetSync:token');
        localStorage.removeItem('@FleetSync:user');
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};