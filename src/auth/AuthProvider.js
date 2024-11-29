import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import roles from "../helpers/roles";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    let [isLogged, setIsLogged] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    id: user.uid,
                    name: user.displayName || "Usuario",
                    email: user.email,
                    pais: "Colombia", // Puedes personalizar esto según tus necesidades
                    ciudad: "Sincelejo", // Puedes personalizar esto según tus necesidades
                    role: roles.regular
                });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, [auth]);

    const login = async (email, password, fromLocation) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setIsLogged(true);
            if (fromLocation) {
                navigate(fromLocation, { replace: true });
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error.message);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setIsLogged(false);
        } catch (error) {
            console.error("Error al cerrar sesión:", error.message);
        }
    };

     isLogged = !!user;
    const hasRole = (role) => user?.role === role;

    const contextValue = {
        user,
        isLogged,
        hasRole,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}
