import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import routes from "../helpers/routes";

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth(); // Asumiendo que tienes un hook de registro

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validación del dominio del correo
    if (!email.endsWith('@cecar.edu.co')) {
      setErrorMessage('El correo debe ser institucional (@cecar.edu.co)');
      return;
    }

    // Aquí podrías agregar la lógica para registrar al usuario
    try {
      await register(firstName, lastName, email, password, idNumber);
      alert('Registro exitoso');
      navigate(routes.monitorias); // Redirigir a otra página después del registro
    } catch (error) {
      setErrorMessage('Error en el registro, por favor intenta nuevamente');
    }
  };

  // Estilos para la presentación
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

  const errorStyle = {
    color: 'red',
    marginBottom: '10px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ color: 'white' }}>Registro</h1>
      <form style={formStyle} onSubmit={handleSubmit}>
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
