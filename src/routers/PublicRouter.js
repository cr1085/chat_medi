import { Navigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function PublicRouter({ element }) {
    let { isLogged } = useAuth();
    // Si el usuario está autenticado, redirige a "/monitorias"
    if (isLogged) return <Navigate to="/monitorias" />;
    
    // Si no está autenticado, renderiza el componente público
    return element;
}