import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Card, Button, Table, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

export default function Monitorias() {
    const [notifications, setNotifications] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [activeSection, setActiveSection] = useState('calendar-container');
    const [report, setReport] = useState('');
    const [students, setStudents] = useState([]);
    const [studentData, setStudentData] = useState({
        name: '',
        program: '',
        semester: '',
        course: '',
        schedule: '',
        classroom: ''
    });
    const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
    const [showStudentModal, setShowStudentModal] = useState(false);

    // Estado para convocatorias
    const [convocatorias, setConvocatorias] = useState([]);
    const [convocatoriaData, setConvocatoriaData] = useState({
        title: '',
        date: '',
        monitor: '',
        status: 'Abierta'
    });
    const [selectedConvocatoriaIndex, setSelectedConvocatoriaIndex] = useState(null);
    const [showConvocatoriaModal, setShowConvocatoriaModal] = useState(false);

    useEffect(() => {
        const initialNotifications = [
            { id: 1, student: 'Juan Pérez', course: 'Matemáticas', date: '2024-10-01', reason: 'No asistió a la monitoría', read: false },
            { id: 2, student: 'María López', course: 'Historia', date: '2024-10-02', reason: 'Cita médica', read: false },
            { id: 3, student: 'Carlos Sánchez', course: 'Física', date: '2024-10-03', reason: 'Problemas personales', read: false },
            { id: 4, student: 'Ana García', course: 'Biología', date: '2024-10-04', reason: 'Enfermedad', read: false },
        ];
        setNotifications(initialNotifications);

        // Datos de juguete para convocatorias
        const initialConvocatorias = [
            { id: 1, title: 'Convocatoria de Monitoría', date: '2024-10-20', monitor: 'Dr. Martínez', status: 'Abierta' },
            { id: 2, title: 'Convocatoria para Exposición', date: '2024-10-22', monitor: 'Prof. Gómez', status: 'Cerrada' },
            { id: 3, title: 'Convocatoria de Ayuda Académica', date: '2024-10-25', monitor: 'Lic. López', status: 'Abierta' },
        ];
        setConvocatorias(initialConvocatorias);
    }, []);

    const handleDateClick = (arg) => {
        const title = prompt('Ingrese el título de la monitoría:');
        const location = prompt('Ingrese el aula de la monitoría:');
        if (title && location) {
            const newEvent = {
                title: `${title} - ${location}`,
                start: arg.dateStr,
                end: new Date(new Date(arg.dateStr).setHours(new Date(arg.dateStr).getHours() + 1)),
                allDay: false,
                extendedProps: {
                    asistencia: 0,
                    inasistencia: 0,
                },
            };
            setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
        }
    };

    const showSection = (section) => {
        setActiveSection(section);
    };

    const addStudent = () => {
        if (selectedStudentIndex !== null) {
            const updatedStudents = [...students];
            updatedStudents[selectedStudentIndex] = studentData;
            setStudents(updatedStudents);
        } else {
            setStudents([...students, studentData]);
        }
        setStudentData({ name: '', program: '', semester: '', course: '', schedule: '', classroom: '' });
        setShowStudentModal(false);
        setSelectedStudentIndex(null);
    };

    const editStudent = (index) => {
        setStudentData(students[index]);
        setSelectedStudentIndex(index);
        setShowStudentModal(true);
    };

    const deleteStudent = (index) => {
        const updatedStudents = students.filter((_, i) => i !== index);
        setStudents(updatedStudents);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudentData(prev => ({ ...prev, [name]: value }));
    };

    const markAsRead = (id) => {
        const updatedNotifications = notifications.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
        );
        setNotifications(updatedNotifications);
    };

    const closeAllEvents = () => {
        if (window.confirm('¿Estás seguro de que deseas cerrar todos los eventos?')) {
            setCalendarEvents([]); // Cierra todos los eventos
            alert('Todos los eventos han sido cerrados.');
        }
    };

    const generateReport = () => {
        // Implementar la lógica para generar un reporte
        setReport('Reporte generado con éxito.'); // Mensaje de éxito
    };

    const openConvocatoriaModal = () => {
        setConvocatoriaData({ title: '', date: '', monitor: '', status: 'Abierta' });
        setSelectedConvocatoriaIndex(null);
        setShowConvocatoriaModal(true);
    };

    const addConvocatoria = () => {
        if (selectedConvocatoriaIndex !== null) {
            const updatedConvocatorias = [...convocatorias];
            updatedConvocatorias[selectedConvocatoriaIndex] = convocatoriaData;
            setConvocatorias(updatedConvocatorias);
        } else {
            setConvocatorias([...convocatorias, { id: convocatorias.length + 1, ...convocatoriaData }]);
        }
        setShowConvocatoriaModal(false);
        setSelectedConvocatoriaIndex(null);
    };

    const editConvocatoria = (index) => {
        setConvocatoriaData(convocatorias[index]);
        setSelectedConvocatoriaIndex(index);
        setShowConvocatoriaModal(true);
    };

    const deleteConvocatoria = (index) => {
        const updatedConvocatorias = convocatorias.filter((_, i) => i !== index);
        setConvocatorias(updatedConvocatorias);
    };

    // Estilos en línea
    const styles = {
        container: {
            display: 'flex',
            height: '100vh',
        },
        sidebar: {
            width: '250px',
            backgroundColor: '#343a40',
            color: 'white',
            position: 'fixed',
            height: '100%',
            padding: '20px',
            boxShadow: '2px 0 5px rgba(0, 0, 0, 0.3)',
        },
        sidebarTitle: {
            color: '#61dafb',
            fontSize: '1.5em',
            marginBottom: '20px',
        },
        menuItem: {
            color: 'white',
            textDecoration: 'none',
            display: 'block',
            padding: '10px',
            borderRadius: '5px',
            transition: 'background 0.3s',
        },
        mainContent: {
            marginLeft: '260px',
            padding: '20px',
            width: 'calc(100% - 260px)',
            overflowY: 'auto',
        },
        calendar: {
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            backgroundColor: '#fff',
        },
        addButton: {
            backgroundColor: '#61dafb',
            color: 'black',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background 0.3s',
        },
        report: {
            marginTop: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9',
        },
        buttonMargin: {
            marginRight: '10px',
        },
    };

    return (
        <div style={styles.container}>
            <aside style={styles.sidebar}>
                <h2 style={styles.sidebarTitle}>Gestión de Monitorías</h2>
                <nav>
                    <a href="#" onClick={() => showSection('calendar-container')} style={styles.menuItem}>
                        <i className="fa fa-calendar-alt"></i> Calendario
                    </a>
                    <a href="#" onClick={() => showSection('dashboard-container')} style={styles.menuItem}>
                        <i className="fa fa-user-graduate"></i> Dashboard de Estudiantes
                    </a>
                    <a href="#" onClick={() => showSection('notifications-container')} style={styles.menuItem}>
                        <i className="fa fa-bell"></i> Notificaciones
                    </a>
                    <a href="#" onClick={() => showSection('reportes')} style={styles.menuItem}>
                        <i className="fa fa-file-alt"></i> Reportes
                    </a>
                    <a href="#" onClick={() => showSection('cerrar-eventos')} style={styles.menuItem}>
                        <i className="fa fa-times-circle"></i> Cerrar Eventos
                    </a>
                    <a href="#" onClick={() => showSection('form-container')} style={styles.menuItem}>
                        <i className="fa fa-list-alt"></i> Convocatorias
                    </a>
                </nav>
            </aside>
            <main style={styles.mainContent}>
                {activeSection === 'calendar-container' && (
                    <div style={styles.calendar}>
                        <FullCalendar
                            plugins={[timeGridPlugin]}
                            initialView="timeGridWeek"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'timeGridWeek,timeGridDay',
                            }}
                            events={calendarEvents}
                            dateClick={handleDateClick}
                        />
                    </div>
                )}

                {activeSection === 'dashboard-container' && (
                    <div>
                        <h2>Dashboard de Estudiantes</h2>
                        <Button variant="primary" onClick={() => setShowStudentModal(true)}>Agregar Estudiante</Button>
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Programa</th>
                                    <th>Semestre</th>
                                    <th>Curso</th>
                                    <th>Horario</th>
                                    <th>Aula Asignada</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={index}>
                                        <td>{student.name}</td>
                                        <td>{student.program}</td>
                                        <td>
                                            <Form.Control
                                                as="select"
                                                name="semester"
                                                value={student.semester}
                                                onChange={handleChange}
                                                required
                                            >
                                                {[...Array(11).keys()].slice(1).map((sem) => (
                                                    <option key={sem} value={sem}>
                                                        {sem}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </td>
                                        <td>{student.course}</td>
                                        <td>{student.schedule}</td>
                                        <td>{student.classroom}</td>
                                        <td>
                                            <Button variant="warning" onClick={() => editStudent(index)} style={styles.buttonMargin}>
                                                Editar
                                            </Button>
                                            <Button variant="danger" onClick={() => deleteStudent(index)}>
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Modal para agregar o editar estudiante */}
                        <Modal show={showStudentModal} onHide={() => setShowStudentModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>{selectedStudentIndex !== null ? 'Editar Estudiante' : 'Agregar Estudiante'}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group controlId="formName">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control type="text" name="name" value={studentData.name} onChange={handleChange} placeholder="Nombre del Estudiante" required />
                                    </Form.Group>
                                    <Form.Group controlId="formProgram">
                                        <Form.Label>Programa</Form.Label>
                                        <Form.Control type="text" name="program" value={studentData.program} onChange={handleChange} placeholder="Programa" required />
                                    </Form.Group>
                                    <Form.Group controlId="formSemester">
                                        <Form.Label>Semestre</Form.Label>
                                        <Form.Control as="select" name="semester" value={studentData.semester} onChange={handleChange} required>
                                            {[...Array(11).keys()].slice(1).map((sem) => (
                                                <option key={sem} value={sem}>
                                                    {sem}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="formCourse">
                                        <Form.Label>Curso</Form.Label>
                                        <Form.Control type="text" name="course" value={studentData.course} onChange={handleChange} placeholder="Curso" required />
                                    </Form.Group>
                                    <Form.Group controlId="formSchedule">
                                        <Form.Label>Horario</Form.Label>
                                        <Form.Control type="text" name="schedule" value={studentData.schedule} onChange={handleChange} placeholder="Horario" required />
                                    </Form.Group>
                                    <Form.Group controlId="formClassroom">
                                        <Form.Label>Aula Asignada</Form.Label>
                                        <Form.Control type="text" name="classroom" value={studentData.classroom} onChange={handleChange} placeholder="Aula Asignada" required />
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowStudentModal(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={addStudent}>
                                    {selectedStudentIndex !== null ? 'Guardar Cambios' : 'Agregar Estudiante'}
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                )}

                {activeSection === 'notifications-container' && (
                    <div>
                        <h2>Notificaciones</h2>
                        <ul>
                            {notifications.map((notification) => (
                                <li key={notification.id} style={{ textDecoration: notification.read ? 'line-through' : 'none' }}>
                                    {notification.student} en {notification.course} - {notification.reason} ({notification.date})
                                    <button onClick={() => markAsRead(notification.id)} style={{ marginLeft: '10px' }}>
                                        {notification.read ? 'Leída' : 'Marcar como leída'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {activeSection === 'reportes' && (
                    <div>
                        <h2>Reportes</h2>
                        <Button onClick={generateReport} style={styles.addButton}>Generar Reporte</Button>
                        <div style={styles.report}>{report}</div>
                    </div>
                )}

                {activeSection === 'cerrar-eventos' && (
                    <div>
                        <h2>Cerrar Eventos</h2>
                        <Button variant="danger" onClick={closeAllEvents}>Cerrar Todos los Eventos</Button>
                    </div>
                )}

                {activeSection === 'form-container' && (
                    <div>
                        <h2>Convocatorias</h2>
                        <Button variant="primary" onClick={openConvocatoriaModal}>Nueva Convocatoria</Button>
                        <Table striped bordered hover className="mt-3">
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Fecha</th>
                                    <th>Monitor</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {convocatorias.map((convocatoria, index) => (
                                    <tr key={convocatoria.id}>
                                        <td>{convocatoria.title}</td>
                                        <td>{convocatoria.date}</td>
                                        <td>{convocatoria.monitor}</td>
                                        <td>{convocatoria.status}</td>
                                        <td>
                                            <Button variant="warning" onClick={() => editConvocatoria(index)} style={styles.buttonMargin}>
                                                Editar
                                            </Button>
                                            <Button variant="danger" onClick={() => deleteConvocatoria(index)}>
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Modal para agregar o editar convocatoria */}
                        <Modal show={showConvocatoriaModal} onHide={() => setShowConvocatoriaModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>{selectedConvocatoriaIndex !== null ? 'Editar Convocatoria' : 'Nueva Convocatoria'}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group controlId="formTitle">
                                        <Form.Label>Título</Form.Label>
                                        <Form.Control type="text" name="title" value={convocatoriaData.title} onChange={(e) => setConvocatoriaData({ ...convocatoriaData, title: e.target.value })} placeholder="Título de la Convocatoria" required />
                                    </Form.Group>
                                    <Form.Group controlId="formDate">
                                        <Form.Label>Fecha</Form.Label>
                                        <Form.Control type="date" name="date" value={convocatoriaData.date} onChange={(e) => setConvocatoriaData({ ...convocatoriaData, date: e.target.value })} required />
                                    </Form.Group>
                                    <Form.Group controlId="formMonitor">
                                        <Form.Label>Monitor</Form.Label>
                                        <Form.Control type="text" name="monitor" value={convocatoriaData.monitor} onChange={(e) => setConvocatoriaData({ ...convocatoriaData, monitor: e.target.value })} placeholder="Nombre del Monitor" required />
                                    </Form.Group>
                                    <Form.Group controlId="formStatus">
                                        <Form.Label>Estado</Form.Label>
                                        <Form.Control as="select" name="status" value={convocatoriaData.status} onChange={(e) => setConvocatoriaData({ ...convocatoriaData, status: e.target.value })}>
                                            <option value="Abierta">Abierta</option>
                                            <option value="Cerrada">Cerrada</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowConvocatoriaModal(false)}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" onClick={addConvocatoria}>
                                    {selectedConvocatoriaIndex !== null ? 'Guardar Cambios' : 'Crear Convocatoria'}
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                )}
            </main>
        </div>
    );
}
