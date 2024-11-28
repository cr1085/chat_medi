import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"; 
import { getFirestore, doc, setDoc } from "firebase/firestore"; // Importa Firestore
import routes from "../helpers/routes";

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const auth = getAuth(); // Obtén la instancia de autenticación
  const db = getFirestore(); // Instancia de Firestore

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validación del dominio del correo
    if (!email.endsWith('@cecar.edu.co')) {
      setErrorMessage('El correo debe ser institucional (@cecar.edu.co)');
      return;
    }

    // Aquí crear el usuario en Firebase Auth
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Información del usuario registrado

      // Después de crear el usuario, guardar sus datos en Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        email: user.email, // Guardar el correo
        idNumber,
        role: "regular", // Si necesitas guardar un rol o alguna otra información
      });

      alert('Registro exitoso');
      navigate(routes.monitorias); // Redirigir al usuario después del registro
    } catch (error) {
      console.error("Error en el registro:", error.message);
      setErrorMessage('Error en el registro, por favor intenta nuevamente');
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#282c34',
    flexDirection: 'column',
    padding: '20px',
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  const labelStyle = {
    display: 'block',
    textAlign: 'left',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  };

  const logoStyle = {
    marginBottom: '20px',
  };

  const errorStyle = {
    color: 'red',
    marginBottom: '10px',
  };

  return (
    <div style={containerStyle}>
      <img src="/img/imglogin.png" alt="Logo" style={logoStyle} />
      <form style={formStyle} onSubmit={handleSubmit}>
        <h1>Registro</h1>
        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
        <div>
          <label style={labelStyle}>Nombre</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Apellido</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Correo institucional</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Identificación</label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Registrarse</button>
      </form>
    </div>
  );
}
