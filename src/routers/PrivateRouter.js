import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../auth/useAuth";
import routes from "../helpers/routes";

export default function PrivateRouter({ element, rolesAllowed }) {
    const location= useLocation()
    // console.log(location);
    let { hasRole, isLogged} = useAuth();

    
    // Redirigir si el rol no está permitido
    if (rolesAllowed && rolesAllowed.length > 0 && !rolesAllowed.some(role => hasRole(role))) {
        return <Navigate to={routes.home} />;
    }
    // Redirigir a login si no hay usuario
    if (!isLogged) {
        return <Navigate to={routes.login} state={{from:location}} />;
    }

    // Si todo está bien, retorna el elemento
    return element;
}
