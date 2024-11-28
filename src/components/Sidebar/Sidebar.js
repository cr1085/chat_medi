import React from 'react';
import { Button } from "react-bootstrap";
import useAuth from '../../auth/useAuth';

const Sidebar = ({ toggleContent }) => {
    const { user } = useAuth();
    const buttonStyle = {
        marginTop: '20px',
        backgroundColor: '#444',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        width: '100%',
        textAlign: 'center'
    };
    
    return (
        <div style={{ width: '100%', maxWidth: '250px', backgroundColor: '#212529', color: '#fff', height: '100%', padding: '30px', boxShadow: '2px 0 5px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ textAlign: 'center', borderBottom: '1px solid #444', paddingBottom: '10px', width: '100%' }}>Mi Cuenta</h2>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img src="/img/male_avatar.svg" alt="Profile" style={{ borderRadius: '50%', width: '100px', height: '100px', border: '2px solid #fff', marginBottom: '10px' }} />
                <p style={{ fontWeight: 'bold', fontSize: '1.3em' }}>{user.name}</p>
                <Button onClick={() => toggleContent('editProfile')} style={buttonStyle}>
                    Editar Perfil
                </Button>
                <h3 style={{ fontWeight: 'bold', marginBottom: '20px', paddingTop: '25px' }}>Información Personal</h3>
                <div style={{ textAlign: 'left', width: '100%', padding: '0 10px' }}>
                    <p style={{ fontSize: '0.9em', marginBottom: '5px' }}><strong>Email:</strong> {user.email}</p>
                    <p style={{ fontSize: '0.9em', marginBottom: '5px' }}><strong>Rol:</strong> {user.role}</p>
                    <p style={{ fontSize: '0.9em', marginBottom: '5px' }}><strong>País:</strong> {user.pais}</p>
                    <p style={{ fontSize: '0.9em', marginBottom: '5px' }}><strong>Ciudad:</strong> {user.ciudad}</p>
                </div>
            </div>
            <Button onClick={() => toggleContent('changePassword')} style={buttonStyle}>
                Cambiar Contraseña
            </Button>
            <Button onClick={() => toggleContent('calendario')} style={buttonStyle}>
                Calendario
            </Button>
            <Button onClick={() => toggleContent('notificaciones')} style={buttonStyle}>
                Notificaciones
            </Button>
            <Button onClick={() => toggleContent('mostrarContenido')} style={buttonStyle}>
                Mostrar Contenido
            </Button>
        </div>
    );
};

export default Sidebar;
