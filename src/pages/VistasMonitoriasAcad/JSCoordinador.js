import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

export default function Monitorias() {
    const [informes, setInformes] = useState([]);
    const [asistenciaResultados, setAsistenciaResultados] = useState([]);
    const [retroalimentacionResultados, setRetroalimentacionResultados] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [tarea, setTarea] = useState("");
    const [tareasEnviadas, setTareasEnviadas] = useState([]);

    const miembros = [
        { id: 1, nombre: 'Juan', apellido: 'Pérez' },
        { id: 2, nombre: 'María', apellido: 'Gómez' },
        { id: 3, nombre: 'Carlos', apellido: 'Sánchez' },
        { id: 4, nombre: 'Laura', apellido: 'Fernández' },
    ];

    const handleGenerarInformes = () => {
        const nuevosInformes = [
            { nombre: 'Informe de Inasistencias - Reporte 1', archivo: 'informe1.pdf' },
            { nombre: 'Informe de Inasistencias - Reporte 2', archivo: 'informe2.pdf' },
        ];
        setInformes(nuevosInformes);
    };

    const handleFiltrarAsistencia = () => {
        const fecha = document.getElementById('filtroFecha').value;
        const asistencia = [
            { fecha: '2023-09-01', estudiante: 'Estudiante 1', estado: 'Asistió' },
            { fecha: '2023-09-01', estudiante: 'Estudiante 2', estado: 'No Asistió' },
            { fecha: '2023-09-02', estudiante: 'Estudiante 1', estado: 'Asistió' },
            { fecha: '2023-09-02', estudiante: 'Estudiante 3', estado: 'No Asistió' },
        ];
        const filtrados = asistencia.filter(item => item.fecha === fecha);
        setAsistenciaResultados(filtrados.length ? filtrados : 'No hay asistencia registrada para esta fecha.');
    };

    const handleRevisarRetroalimentacion = () => {
        const retroalimentacion = [
            { estudiante: 'Estudiante 1', comentario: 'La monitoría fue excelente.' },
            { estudiante: 'Estudiante 2', comentario: 'Me gustaría más tiempo para practicar.' },
            { estudiante: 'Estudiante 3', comentario: 'Satisfecho con el apoyo recibido.' },
        ];
        setRetroalimentacionResultados(retroalimentacion);
    };

    const handleAsignarRoles = () => {
        if (selectedStaff && selectedRole) {
            alert(`Rol ${selectedRole} asignado a: ${selectedStaff}`);
        } else {
            alert('Por favor, selecciona un miembro del staff y un rol.');
        }
    };

    const handleEnviarTarea = () => {
        if (tarea && selectedRole) {
            setTareasEnviadas([...tareasEnviadas, { tarea, rol: selectedRole }]);
            alert(`Tarea enviada a ${selectedRole} con éxito.`);
            setTarea("");
        } else {
            alert('Por favor, escribe una tarea y selecciona un rol.');
        }
    };

    return (
        <div className="container mt-5">
            <style>{`
                body {
                    background-color: #f8f9fa;
                }
                h1 {
                    font-size: 2.5rem;
                    color: #343a40;
                    margin-bottom: 30px;
                }
                .btn-custom {
                    background-color: #007bff;
                    color: white;
                }
                .btn-custom:hover {
                    background-color: #0056b3;
                }
                .card {
                    margin-bottom: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .card-title {
                    font-weight: bold;
                    color: #343a40;
                }
                .card-body {
                    background-color: #ffffff;
                    border-radius: 10px;
                }
                .input-group {
                    position: relative;
                }
                .input-group-text {
                    background-color: #e9ecef;
                }
                .text-primary {
                    text-decoration: none;
                }
                .text-primary:hover {
                    text-decoration: underline;
                }
            `}</style>

            <h1 className="text-center">Sistema de Gestión de Monitorías Académicas</h1>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title"><i className="fa fa-file-alt"></i> Generar Informes</h5>
                            <button className="btn btn-custom" onClick={handleGenerarInformes}>Generar Informes</button>
                            <div className="mt-2">
                                {informes.length > 0 ? informes.map((informe, index) => (
                                    <a 
                                        key={index} 
                                        href={informe.archivo} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        download
                                        className="d-block text-primary"
                                    >
                                        {informe.nombre}
                                    </a>
                                )) : <p>No se han generado informes aún.</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title"><i className="fa fa-users"></i> Revisar Asistencia</h5>
                            <label htmlFor="filtroFecha">Filtrar por Fecha:</label>
                            <input type="date" id="filtroFecha" className="form-control mb-2" />
                            <button className="btn btn-custom" onClick={handleFiltrarAsistencia}>Filtrar</button>
                            <div className="mt-2">
                                {Array.isArray(asistenciaResultados) ? asistenciaResultados.map((item, index) => (
                                    <p key={index}>Fecha: {item.fecha}, Estudiante: {item.estudiante}, Estado: {item.estado}</p>
                                )) : <p>{asistenciaResultados}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title"><i className="fa fa-comments"></i> Revisar Retroalimentación</h5>
                            <button className="btn btn-custom" onClick={handleRevisarRetroalimentacion}>Ver Retroalimentación</button>
                            <div className="mt-2">
                                {retroalimentacionResultados.length > 0 ? retroalimentacionResultados.map((item, index) => (
                                    <p key={index}>Estudiante: {item.estudiante}, Comentario: {item.comentario}</p>
                                )) : <p>No hay retroalimentación registrada.</p>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title"><i className="fa fa-user-plus"></i> Asignar Roles</h5>
                            <select className="form-control mb-2" onChange={(e) => setSelectedStaff(e.target.value)}>
                                <option value="">Selecciona un miembro del staff</option>
                                {miembros.map(miembro => (
                                    <option key={miembro.id} value={`${miembro.nombre} ${miembro.apellido}`}>
                                        {miembro.nombre} {miembro.apellido}
                                    </option>
                                ))}
                            </select>
                            <select className="form-control mb-2" onChange={(e) => setSelectedRole(e.target.value)}>
                                <option value="">Selecciona un rol</option>
                                <option value="Administrador de Monitorías Académicas">Administrador de Monitorías Académicas</option>
                                <option value="Monitor">Monitor</option>
                            </select>
                            <button className="btn btn-custom" onClick={handleAsignarRoles}>Asignar Rol</button>

                            <div className="mt-3">
                                <textarea
                                    rows="3"
                                    className="form-control mb-2"
                                    placeholder="Escribe la tarea aquí..."
                                    value={tarea}
                                    onChange={(e) => setTarea(e.target.value)}
                                />
                                <button className="btn btn-custom" onClick={handleEnviarTarea}>Enviar Tarea</button>
                            </div>

                            <div className="mt-3">
                                <h6>Tareas Enviadas:</h6>
                                {tareasEnviadas.length > 0 ? tareasEnviadas.map((item, index) => (
                                    <p key={index}>Tarea: {item.tarea} | Rol: {item.rol}</p>
                                )) : <p>No se han enviado tareas aún.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
