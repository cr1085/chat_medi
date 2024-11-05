import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Navigate } from 'react-router-dom';
import app from './firebaseConfig';

const ValidacionRol = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const db = getFirestore(app);

  const manejarInicioSesion = async (e) => {
    e.preventDefault();

    if (!email.endsWith("@cecar.edu.co")) {
      alert("Solo se permiten correos de la institución @cecar.edu.co");
      return;
    }

    try {
      const credencialUsuario = await signInWithEmailAndPassword(auth, email, password);
      const userId = credencialUsuario.user.uid;

      if (email === "jose.garciamej@cecar.edu.co" && password === "123456789") {
        window.location.href = '/superadmin-dashboard';
        return;
      }

      const documentoUsuario = await getDoc(doc(db, "users", userId));
      if (documentoUsuario.exists()) {
        const rolUsuario = documentoUsuario.data().role;

        switch (rolUsuario) {
          case 'Administrador de Monitorias Académicas':       ///esto es de ejemplo, pero se entiende la lógica
            window.location.href = '/admin-monitorias-dashboard';
            break;
          case 'Coordinador':
            window.location.href = '/coordinador-dashboard';
            break;
          case 'Estudiante':
            window.location.href = '/estudiante-dashboard'; 
            break;
          case 'Monitor de Monitorías Academicas':
            window.location.href = '/monitor-dashboard';
            break;
          default:
            window.location.href = '/';
        }
      } else {
        console.log("No se encontró el rol del usuario");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
    }
  };

  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, async (usuario) => {
      if (usuario) {
        const documentoUsuario = await getDoc(doc(db, "users", usuario.uid));
        if (documentoUsuario.exists()) {
          setUserRole(documentoUsuario.data().role);
        }
      }
      setLoading(false);
    });

    return () => desuscribir();
  }, [auth, db]);

  const RequerirRol = ({ rol, children }) => {
    if (loading) return <div>Cargando...</div>;
    if (userRole !== rol) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <>
      <form onSubmit={manejarInicioSesion}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo Electrónico" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
        <button type="submit">Iniciar Sesión</button>
      </form>

      <RequerirRol rol="Administrador de Monitorias Académicas">
        <div>Contenido exclusivo para Administradores de Monitorias</div>
      </RequerirRol>
    </>
  );
};

export default ValidacionRol;