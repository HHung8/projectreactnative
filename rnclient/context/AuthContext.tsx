import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  login: (tokens: { accessToken: string; refreshToken: string; fullName: string; email: string }) => Promise<void>;
  logout: () => Promise<void>;
};


const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({children, initialLoggedIn} : {children: React.ReactNode; initialLoggedIn: boolean}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(initialLoggedIn);
    
    const login = async (data: { accessToken: string; refreshToken: string; fullName: string; email: string }) => {
        await SecureStore.setItemAsync("accessToken", data.accessToken);
        await SecureStore.setItemAsync("refreshToken", data.refreshToken);
        await SecureStore.setItemAsync("fullName", data.fullName);
        await SecureStore.setItemAsync("email", data.email);
        setIsLoggedIn(true);
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        await SecureStore.deleteItemAsync("fullName");
        await SecureStore.deleteItemAsync("email");
        setIsLoggedIn(false);
    }

    return (
        <AuthContext.Provider value={{isLoggedIn, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);