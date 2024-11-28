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
    startDate: '',
    endDate: '',
    classroom: '',
    monitor: '',
    title: '',
    startTime: '',
    endTime: '',
    subject: '',
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    otherDays: '',
    weekdays: [] // Inicializado como un array vacío
});




// Función para verificar y formatear fechas
const formatDate = (date) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
      return 'Fecha no válida';  // Si la fecha es inválida
  }
  return parsedDate.toLocaleString();  // Formato de la fecha
};

// Validación para que la fecha de inicio sea anterior a la fecha final
const validateStartDateBeforeEndDate = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start >= end) {
      return 'La fecha de inicio no puede ser posterior a la fecha de fin.';
  }
  return null;
};


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
  const [notification, setNotification] = useState('');
  const [monitoresInscritos, setMonitoresInscritos] = useState([]);

  
  // Estado para manejar la monitoría seleccionada y la acción a realizar
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionInput, setActionInput] = useState('');
  
  // useEffect para inicializar las notificaciones y convocatorias
  useEffect(() => {
      const initialNotifications = [
          { id: 1, student: 'Juan Pérez', course: 'Matemáticas', date: '2024-10-01', reason: 'No asistió a la monitoría', read: false },
          { id: 2, student: 'María López', course: 'Historia', date: '2024-10-02', reason: 'Cita médica', read: false },
          { id: 3, student: 'Carlos Sánchez', course: 'Física', date: '2024-10-03', reason: 'Problemas personales', read: false },
          { id: 4, student: 'Ana García', course: 'Biología', date: '2024-10-04', reason: 'Enfermedad', read: false },
      ];
      setNotifications(initialNotifications);
  
      const initialConvocatorias = [
          { id: 1, title: 'Convocatoria de Monitoría', date: '2024-10-20', monitor: 'Dr. Martínez', status: 'Abierta' },
          { id: 2, title: 'Convocatoria para Exposición', date: '2024-10-22', monitor: 'Prof. Gómez', status: 'Cerrada' },
          { id: 3, title: 'Convocatoria de Ayuda Académica', date: '2024-10-25', monitor: 'Lic. López', status: 'Abierta' },
      ];
      setConvocatorias(initialConvocatorias);
  }, []);
  
  const handleAddEvent = () => {
    const newEvent = {
        id: Date.now(),
        title: studentData.subject,
        start: `${studentData.date}T${studentData.startTime}`,
        end: `${studentData.date}T${studentData.endTime}`,
        allDay: false,
        extendedProps: {
            asignatura: studentData.subject,
            monitorAsignado: studentData.monitor,
            programa: studentData.program,
            classroom: studentData.classroom,
            asistencia: 0,
            inasistencia: 0,
        },
    };
  
    // Validar si las fechas son correctas
    const startDate = new Date(newEvent.start);
    const endDate = new Date(newEvent.end);
  
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert("Las fechas de inicio o fin no son válidas.");
        return;
    }
  
    if (startDate >= endDate) {
        alert("La hora de inicio debe ser menor que la hora de finalización.");
        return;
    }
  
    // Verificar si ya existe un evento en el mismo horario (evitar agendar dos veces el mismo evento)
    const eventExists = calendarEvents.some(event => 
        new Date(event.start).toISOString() === newEvent.start &&
        new Date(event.end).toISOString() === newEvent.end
    );
  
    if (eventExists) {
        alert("Ya existe una monitoría programada en ese horario.");
        return;
    }
  
    // Verificar solapamiento con otros eventos
    if (checkOverlap(newEvent, calendarEvents)) {
        alert("Ya existe una monitoría programada en esa hora.");
        return;
    }
  
    // Si pasa todas las validaciones, agregar el nuevo evento
    setCalendarEvents([...calendarEvents, newEvent]);
    setStudentData({
        program: '',
        subject: '',
        date: '',
        weekdays: [],
        startTime: '',
        endTime: '',
        monitor: '',
        classroom: '',
    });
    setNotification("Monitoría agregada con éxito en el calendario semestral.");
  };

const checkOverlap = (newEvent, events) => {
    return events.some(event => 
        (new Date(event.start) < new Date(newEvent.end) &&
         new Date(event.end) > new Date(newEvent.start))
    );
};



const generateWeeklyEvents = (startDate, endDate, dayOfWeek, eventData) => {
  const events = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  const dayMap = {
      lunes: 1,
      martes: 2,
      miércoles: 3,
      jueves: 4,
      viernes: 5,
      saturday: 6,
      sunday: 0,
  };

  const targetDay = dayMap[dayOfWeek.toLowerCase()] ?? -1; // Manejo de errores
  if (targetDay === -1) {
      console.error("Día de la semana no válido:", dayOfWeek);
      return events;
  }

  let currentDate = new Date(start);

  while (currentDate <= end) {
      if (currentDate.getDay() === targetDay) {
          const uniqueId = `${currentDate.getTime()}-${Math.random()}`;
          events.push({
              id: uniqueId,
              title: eventData.title,
              start: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate(),
                  new Date(eventData.schedule).getHours(),
                  new Date(eventData.schedule).getMinutes()
              ).toISOString(),
              end: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  currentDate.getDate(),
                  new Date(eventData.endSchedule).getHours(),
                  new Date(eventData.endSchedule).getMinutes()
              ).toISOString(),
              classroom: eventData.classroom,
              allDay: false,
              extendedProps: {
                  asistencia: 0,
                  inasistencia: 0,
                  asignatura: eventData.subject,
                  monitorAsignado: eventData.monitor,
                  programa: eventData.program,
              },
          });
      }

      currentDate.setDate(currentDate.getDate() + 1);
  }

  return events;
};


const handleGenerateWeeklyEvents = () => {
  const weeklyEvents = [];

  studentData.weekdays.forEach((day) => {
      const newEvents = generateWeeklyEvents(
          studentData.startDate, 
          studentData.endDate, 
          day, 
          studentData
      );

      newEvents.forEach((event) => {
          if (!checkOverlap(event, [...calendarEvents, ...weeklyEvents])) {
              weeklyEvents.push(event);
          } else {
              console.warn(`Evento solapado: ${event.title} el ${event.start}`);
          }
      });
  });

  setCalendarEvents([...calendarEvents, ...weeklyEvents]);
  setNotification("Eventos semanales generados con éxito.");
};





const isOverlapping = calendarEvents.some(event => 
    (new Date(event.start) < new Date(studentData.endSchedule) &&
     new Date(event.end) > new Date(studentData.schedule))
);

const monitores = [
    {
        id: 1,
        nombre: "Juan Pérez",
        horarios: [
            { dia: "Lunes", inicio: "10:00", fin: "12:00" },
            { dia: "Martes", inicio: "14:00", fin: "16:00" },
        ],
    },
    {
        id: 2,
        nombre: "María López",
        horarios: [
            { dia: "Lunes", inicio: "08:00", fin: "10:00" },
            { dia: "Miércoles", inicio: "12:00", fin: "14:00" },
        ],
    },
];






const handleReschedule = (event) => {
  if (!event || !event.extendedProps) {
    alert("El evento seleccionado no tiene datos completos.");
    return;
  }

  const startDate = new Date(event.start); // Fecha de inicio
  const endDate = new Date(event.end); // Fecha de fin

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    alert("Las fechas del evento no son válidas.");
    return;
  }

  setStudentData({
    subject: event.extendedProps.asignatura || '',
    schedule: startDate.toISOString().slice(0, 16), // Formato 'YYYY-MM-DDTHH:mm'
    endSchedule: endDate.toISOString().slice(0, 16), // Formato 'YYYY-MM-DDTHH:mm'
    classroom: event.extendedProps.classroom || '',
    monitor: event.extendedProps.monitorAsignado || '',
    program: event.extendedProps.programa || '',
    weekdays: Array.isArray(event.extendedProps.weekdays) ? event.extendedProps.weekdays : [],
  });

  setSelectedEvent(event);
  setShowStudentModal(true);
};

const handleSaveReschedule = () => {
  const newStartDate = new Date(studentData.schedule);
  const newEndDate = new Date(studentData.endSchedule);


  if (newEndDate <= newStartDate) {
      alert("La fecha de cierre debe ser posterior a la fecha de inicio.");
      return;
  }

  // Crear un nuevo evento con los datos reprogramados
  const newEvent = {
      id: Date.now(), // Nuevo ID único para el evento reprogramado
      title: studentData.subject,
      start: newStartDate.toISOString(),
      end: newEndDate.toISOString(),
      extendedProps: {
          asignatura: studentData.subject,
          monitorAsignado: studentData.monitor || 'No especificado', // Usar 'No especificado' si no se proporciona monitor
          programa: studentData.program,
          classroom: studentData.classroom || 'No especificado',
          startTime: studentData.startTime || 'No especificado',
          endTime: studentData.endTime || 'No especificado',
      }
  };

  // Verificar que no exista un evento con la misma asignatura, monitor y en el mismo horario
  const eventExists = calendarEvents.some(event => 
      event.extendedProps.asignatura === newEvent.extendedProps.asignatura &&
      event.extendedProps.monitorAsignado === newEvent.extendedProps.monitorAsignado &&
      new Date(event.start).toISOString() === newEvent.start &&
      new Date(event.end).toISOString() === newEvent.end
  );

  if (eventExists) {
      alert("Ya existe una monitoría reprogramada con los mismos detalles.");
      return;
  }

  // Verificar si ya existe un evento en el mismo horario (validación de solapamiento)
  if (checkOverlap(newEvent, calendarEvents)) {
      alert("Ya existe una monitoría programada en esa hora.");
      return;
  }

  // Actualizar el evento seleccionado
  const updatedEvents = calendarEvents.map((event) =>
      event.id === selectedEvent.id
          ? {
              ...event,
              start: newStartDate.toISOString(),
              end: newEndDate.toISOString(),
              extendedProps: {
                  ...event.extendedProps,
                  asignatura: studentData.subject,
                  monitorAsignado: studentData.monitor,
                  programa: studentData.program,
                  classroom: studentData.classroom,
              },
          }
          : event
  );

  setCalendarEvents(updatedEvents);
  setShowStudentModal(false);
  setNotification("Monitoría reprogramada con éxito en el calendario.");
};


// Componente para mostrar la información de la monitoría
const Monitoria = ({ event }) => {
    const formatTime = (time) => {
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        return new Date(time).toLocaleTimeString(undefined, options);
    };

    return (
        <div>
            <p>Programa: {event.extendedProps.programa || 'No especificado'}</p>
            <p>Asignatura: {event.extendedProps.asignatura || 'No especificado'}</p>
            <p>Fecha: {new Date(event.start).toLocaleDateString()}</p>
            <p>Hora de Inicio: {formatTime(event.start)}</p>
            <p>Hora de Cierre: {formatTime(event.end)}</p>
            <p>Monitor: {event.extendedProps.monitorAsignado || 'No especificado'}</p>
            <p>Aula: {event.extendedProps.classroom || 'No especificado'}</p>
        </div>
    );
};

  // Mostrar notificación
  {notification && (
      <div style={{ color: 'green', margin: '10px 0' }}>
          {notification}
      </div>
  )}
  
  // Maneja el clic en el evento del calendario
  const handleEventClick = (eventClickInfo) => {
      const event = eventClickInfo.event;
      setSelectedEvent(event); // Al hacer clic, seleccionamos el evento
  };
  
  // Maneja las acciones sobre el evento (reprogramar o eliminar)
  const handleEventAction = () => {
      if (actionInput.toUpperCase() === 'R') {
          const newDate = prompt('Ingrese la nueva fecha para la monitoría (YYYY-MM-DD HH:MM):');
          if (newDate) {
              const updatedEvent = { ...selectedEvent, start: new Date(newDate), end: new Date(new Date(newDate).setHours(new Date(newDate).getHours() + 1)) };
              setCalendarEvents((prevEvents) =>
                  prevEvents.map((event) => (event.id === selectedEvent.id ? updatedEvent : event))
              );
          }
      } else if (actionInput.toUpperCase() === 'E') {
          setCalendarEvents((prevEvents) =>
              prevEvents.filter((event) => event.id !== selectedEvent.id)
          );
      }
      setActionInput(''); 
      setSelectedEvent(null); 
  };
  
  // Mostrar la sección seleccionada
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

    // Manejo de cambios en el formulario
const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
        // Manejar checkboxes específicamente para `weekdays`
        setStudentData((prev) => ({
            ...prev,
            weekdays: checked
                ? [...prev.weekdays, value] // Agregar día si está seleccionado
                : prev.weekdays.filter((day) => day !== value) // Quitar día si se desmarca
        }));
    } else {
        // Manejar otros inputs
        setStudentData((prev) => ({
            ...prev,
            [name]: value
        }));
    }
};

// Verificar si un día específico está seleccionado en weekdays
const isMondaySelected = studentData.weekdays.includes('monday');

    const markAsRead = (id) => {
        const updatedNotifications = notifications.map(notification => 
            notification.id === id ? { ...notification, read: true } : notification
        );
        setNotifications(updatedNotifications);
    };

    const closeAllEvents = () => {
        if (window.confirm('¿Estás seguro de que deseas cerrar todos los eventos?')) {
            setCalendarEvents([]); 
            alert('Todos los eventos han sido cerrados.');
        }
    };

    const generateReport = () => {
        setReport('Reporte generado con éxito.');
    };
    const handleRescheduleEvent = () => {
      // Construir las fechas locales con la fecha y la hora introducidas
      const newStartDate = new Date(`${studentData.date}T${studentData.schedule}`);
      const newEndDate = new Date(`${studentData.date}T${studentData.endSchedule}`);
  
      // Validar si las fechas son válidas
      if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime())) {
          alert("Las fechas ingresadas no son válidas.");
          return;
      }
  
      // Validar que la fecha de cierre sea posterior a la de inicio
      if (newEndDate <= newStartDate) {
          alert("La fecha de cierre debe ser posterior a la fecha de inicio.");
          return;
      }
  
      // Ajustar la hora de inicio sumando 1 hora
      newStartDate.setHours(newStartDate.getHours() + 1);
  
      // Asegurar que las fechas permanezcan en la zona horaria local
      const startLocalDate = new Date(
          newStartDate.getFullYear(),
          newStartDate.getMonth(),
          newStartDate.getDate(),
          newStartDate.getHours(),
          newStartDate.getMinutes()
      );
  
      const endLocalDate = new Date(
          newEndDate.getFullYear(),
          newEndDate.getMonth(),
          newEndDate.getDate(),
          newEndDate.getHours(),
          newEndDate.getMinutes()
      );
  
      // Actualizar el evento en el calendario
      const updatedEvents = calendarEvents.map(event =>
          event.id === studentData.id
              ? {
                    ...event,
                    start: startLocalDate.toISOString(), // Asegura que la hora sea precisa
                    end: endLocalDate.toISOString(),
                    extendedProps: {
                        ...event.extendedProps,
                        asignatura: studentData.subject || event.extendedProps.asignatura,
                        monitorAsignado: studentData.monitor || event.extendedProps.monitorAsignado,
                        programa: studentData.program || event.extendedProps.programa,
                        classroom: studentData.classroom || event.extendedProps.classroom,
                    },
                }
              : event
      );
  
      // Actualizar los eventos en el estado
      setCalendarEvents(updatedEvents);
      setShowStudentModal(false); // Ocultar el modal después de guardar
      alert("Monitoría reprogramada con éxito.");
  };
      
  

  
  // Eliminar una monitoría
const handleDelete = (id) => {
    // Confirmar antes de eliminar
    const confirmation = window.confirm("¿Estás seguro de que deseas eliminar esta monitoría del sistema?");
    if (confirmation) {
        // Filtramos el evento por su ID y lo eliminamos
        const updatedEvents = calendarEvents.filter(event => event.id !== id);
        
        // Actualizamos el estado del calendario
        setCalendarEvents(updatedEvents);
        
        // Mostramos una notificación de éxito
        setNotification('Monitoría Eliminada del calendario del Semestre.');
    }
};





// Modal para crear/editar convocatoria
const openConvocatoriaModal = () => {
    setConvocatoriaData({ 
        title: '', 
        startDate: '', 
        endDate: '', 
        description: '', 
        monitor: '', 
        status: 'Abierta' 
    });
    setSelectedConvocatoriaIndex(null);
    setShowConvocatoriaModal(true);
};

// Agregar o editar una convocatoria
const addConvocatoria = () => {
    // Validación simple de campos obligatorios
    if (!convocatoriaData.title || !convocatoriaData.startDate || !convocatoriaData.endDate) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    if (selectedConvocatoriaIndex !== null) {
        const updatedConvocatorias = [...convocatorias];
        updatedConvocatorias[selectedConvocatoriaIndex] = convocatoriaData;
        setConvocatorias(updatedConvocatorias);
    } else {
        setConvocatorias([ 
            ...convocatorias, 
            { id: convocatorias.length + 1, ...convocatoriaData }
        ]);
    }
    setShowConvocatoriaModal(false);
    setSelectedConvocatoriaIndex(null);
};

// Editar convocatoria seleccionada
const editConvocatoria = (index) => {
    setConvocatoriaData(convocatorias[index]);
    setSelectedConvocatoriaIndex(index);
    setShowConvocatoriaModal(true);
};

// Filtrar convocatorias por programa de pregrado
const [pregradoFilter, setPregradoFilter] = useState('');

// Eliminar convocatoria
const deleteConvocatoria = (index) => {
    const updatedConvocatorias = convocatorias.filter((_, i) => i !== index);
    setConvocatorias(updatedConvocatorias);
};

// Constantes para manejar los estados
const [seccionActiva, setSeccionActiva] = useState('dashboard-container');
const [listaEstudiantes, setListaEstudiantes] = useState([]);
const [mostrarModal, setMostrarModal] = useState(false);
const [datosEstudiante, setDatosEstudiante] = useState({
    nombre: '',
    programa: '',
    semestre: '',
    curso: '',
    horario: '',
    aulaAsignada: ''
});
const [indiceEstudianteSeleccionado, setIndiceEstudianteSeleccionado] = useState(null);

// Estilos
const estilos = {
    botonMargen: {
        marginRight: '10px'
    }
};

// Funciones
const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosEstudiante((prevState) => ({
        ...prevState,
        [name]: value
    }));
};

const agregarEstudiante = () => {
    if (indiceEstudianteSeleccionado !== null) {
        // Actualizar estudiante
        const estudiantesActualizados = [...listaEstudiantes];
        estudiantesActualizados[indiceEstudianteSeleccionado] = datosEstudiante;
        setListaEstudiantes(estudiantesActualizados);
    } else {
        // Agregar nuevo estudiante
        setListaEstudiantes([...listaEstudiantes, datosEstudiante]);
    }
    setMostrarModal(false);
    setDatosEstudiante({
        nombre: '',
        programa: '',
        semestre: '',
        curso: '',
        horario: '',
        aulaAsignada: ''
    });
    setIndiceEstudianteSeleccionado(null);
};

const editarEstudiante = (indice) => {
    setIndiceEstudianteSeleccionado(indice);
    setDatosEstudiante(listaEstudiantes[indice]);
    setMostrarModal(true);
};

const eliminarEstudiante = (indice) => {
    const estudiantesRestantes = listaEstudiantes.filter((_, i) => i !== indice);
    setListaEstudiantes(estudiantesRestantes);
};

const mostrarModalEstudiante = (estado) => {
    setMostrarModal(estado);
};



// Función para cerrar una convocatoria e inscribir al monitor
const closeConvocatoriaAndEnrollMonitor = (convocatoriaId) => {
    const convocatoria = convocatorias.find(c => c.id === convocatoriaId);
    
    if (convocatoria && convocatoria.status === 'Abierta') {
        // Cerrar la convocatoria
        const updatedConvocatorias = convocatorias.map(c =>
            c.id === convocatoriaId ? { ...c, status: 'Cerrada' } : c
        );
        setConvocatorias(updatedConvocatorias);

        // Inscribir al monitor
        const monitorInscrito = {
            id: convocatoria.id,
            nombre: convocatoria.monitor,
            horarios: monitores.find(m => m.nombre === convocatoria.monitor)?.horarios || [],
        };

        setMonitoresInscritos(prev => [...prev, monitorInscrito]);
        setNotification('Monitor inscrito exitosamente en la convocatoria.');
    } else {
        alert('La convocatoria ya está cerrada o no existe.');
    }
};

// Mostrar la sección de monitores inscritos
const HorariosMonitoresInscritos = () => {
    return (
        <div>
            <h3>Horarios de Monitores Inscritos</h3>
            <Table striped bordered hover className="mt-3">
                <thead>
                    <tr>
                        <th>Nombre del Monitor</th>
                        <th>Horario de Clases</th>
                        <th>Espacios Disponibles</th>
                    </tr>
                </thead>
                <tbody>
                    {monitoresInscritos.map((monitor) => {
                        const horarios = monitor.horarios; // Array con los horarios de clases del monitor
                        const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

                        // Cálculo de espacios disponibles
                        const espaciosDisponibles = diasSemana.map(dia => {
                            const horariosDia = horarios.filter(horario => horario.dia === dia);
                            if (horariosDia.length === 0) {
                                return `${dia}: Todo el día disponible`;
                            } else {
                                const antes = horariosDia[0].inicio !== "08:00" 
                                    ? `Antes de ${horariosDia[0].inicio}` 
                                    : null;
                                const despues = horariosDia[horariosDia.length - 1].fin !== "18:00" 
                                    ? `Después de ${horariosDia[horariosDia.length - 1].fin}` 
                                    : null;
                                return `${dia}: ${antes || ""} ${antes && despues ? "y" : ""} ${despues || ""}`.trim();
                            }
                        }).join(", ");

                        return (
                            <tr key={monitor.id}>
                                <td>{monitor.nombre}</td> {/* Nombre del monitor */}
                                <td>
                                    {horarios.map((horario, i) => (
                                        <div key={i}>
                                            {`${horario.dia}: ${horario.inicio} - ${horario.fin}`}
                                        </div>
                                    ))}
                                </td>
                                <td>{espaciosDisponibles}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};


    {calendarEvents.map(event => {
      const eventDate = new Date(event.schedule);
      const formattedDate = isNaN(eventDate) ? 'Fecha inválida' : eventDate.toLocaleString(); // Verifica si la fecha es válida
      return (
        <div key={event.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div>
            <strong>{event.title}</strong> - {formattedDate} - {event.classroom}
          </div>
          <div>
            <Button
              variant="warning"
              onClick={() => handleReschedule(event)}
              style={{ marginRight: '10px' }}
            >
              Reprogramar
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(event.id)}
            >
              Eliminar
            </Button>
          </div>
        </div>
      );
    })}
    

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
            fontSize: '1.5rem',
            marginBottom: '20px',
        },
        menuItem: {
            display: 'block',
            color: '#fff',
            textDecoration: 'none',
            margin: '10px 0',
            fontSize: '1rem',
            padding: '5px 0',
            borderBottom: '1px solid #444',
        },
        mainContent: {
            marginLeft: '250px',
            padding: '20px',
            flex: 1,
        },
        calendar: {
            width: '100%',
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '10px',
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
  
      <main style={{...styles.mainContent, padding: '20px', backgroundColor: '#f9f9f9'}}>
  {activeSection === 'calendar-container' && (
    <>
      <div style={{...styles.calendar, marginBottom: '30px'}}>
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay',
          }}
          events={calendarEvents}
        />
      </div>

      <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', marginBottom: '30px' }}>
    <h2 style={{ marginBottom: '20px' }}>Agregar Monitoría</h2>
    <Form>
        <Form.Group controlId="formProgram" style={{ marginBottom: '15px' }}>
            <Form.Label style={{ fontWeight: 'bold' }}>Programa</Form.Label>
            <Form.Control
                type="text"
                name="program"
                value={studentData.program}
                onChange={handleChange}
                placeholder="Programa"
                required
                style={{ padding: '10px', borderRadius: '4px', boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)' }}
            />
        </Form.Group>

        <Form.Group controlId="formSubject" style={{ marginBottom: '15px' }}>
            <Form.Label style={{ fontWeight: 'bold' }}>Asignatura</Form.Label>
            <Form.Control
                type="text"
                name="subject"
                value={studentData.subject}
                onChange={handleChange}
                placeholder="Asignatura"
                required
                style={{ padding: '10px', borderRadius: '4px', boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)' }}
            />
        </Form.Group>

        <Form.Group controlId="formDate" style={{ marginBottom: '15px' }}>
            <Form.Label style={{ fontWeight: 'bold' }}>Fecha</Form.Label>
            <Form.Control
                type="date"
                name="date"
                value={studentData.date}
                onChange={handleChange}
                required
                style={{ padding: '10px', borderRadius: '4px', boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)' }}
            />
        </Form.Group>

        <Form.Group controlId="formWeekday">
    <Form.Label>Seleccionar Día de la Semana</Form.Label>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day) => (
            <Form.Check
                key={day}
                type="checkbox"
                name="weekdays"
                value={day}
                label={day}
                checked={studentData.weekdays.includes(day)}
                onChange={handleChange}
                style={{ marginRight: '10px' }}
            />
        ))}
    </div>
</Form.Group>


        <Form.Group controlId="formStartTime" style={{ marginBottom: '15px' }}>
            <Form.Label style={{ fontWeight: 'bold' }}>Hora de Inicio</Form.Label>
            <Form.Control
                type="time"
                name="startTime"
                value={studentData.startTime}
                onChange={handleChange}
                required
                style={{ padding: '10px', borderRadius: '4px', boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)' }}
            />
        </Form.Group>

        <Form.Group controlId="formEndTime" style={{ marginBottom: '15px' }}>
            <Form.Label style={{ fontWeight: 'bold' }}>Hora de Cierre</Form.Label>
            <Form.Control
                type="time"
                name="endTime"
                value={studentData.endTime}
                onChange={handleChange}
                required
                style={{ padding: '10px', borderRadius: '4px', boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)' }}
            />
        </Form.Group>

        <Form.Group controlId="formMonitor" style={{ marginBottom: '15px' }}>
            <Form.Label style={{ fontWeight: 'bold' }}>Monitor</Form.Label>
            <Form.Control
                type="text"
                name="monitor"
                value={studentData.monitor}
                onChange={handleChange}
                placeholder="Monitor"
                required
                style={{ padding: '10px', borderRadius: '4px', boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)' }}
            />
        </Form.Group>

        <Form.Group controlId="formClassroom" style={{ marginBottom: '20px' }}>
            <Form.Label style={{ fontWeight: 'bold' }}>Aula</Form.Label>
            <Form.Control
                type="text"
                name="classroom"
                value={studentData.classroom}
                onChange={handleChange}
                placeholder="Aula"
                required
                style={{ padding: '10px', borderRadius: '4px', boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)' }}
            />
        </Form.Group>

        <Button
            style={{ width: '100%', padding: '12px', fontSize: '16px', backgroundColor: '#007bff', borderColor: '#007bff' }}
            onClick={handleAddEvent}
        >
            Agendar Monitoría
        </Button>
    </Form>

    <Modal show={showStudentModal} onHide={() => setShowStudentModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Reprogramar Monitoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="formProgram">
                    <Form.Label>Programa</Form.Label>
                    <Form.Control
                        type="text"
                        name="program"
                        value={studentData.program}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formSubject">
                    <Form.Label>Asignatura</Form.Label>
                    <Form.Control
                        type="text"
                        name="subject"
                        value={studentData.subject}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formDate">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                        type="date"
                        name="date"
                        value={studentData.date}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formWeekday">
                    <Form.Label>Seleccionar Día de la Semana</Form.Label>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day) => (
                            <Form.Check
                                key={day}
                                type="checkbox"
                                name="weekdays"
                                value={day}
                                label={day}
                                checked={studentData.weekdays.includes(day)}
                                onChange={handleChange}
                                style={{ marginRight: '10px' }}
                            />
                        ))}
                    </div>
                </Form.Group>

                <Form.Group controlId="formStartTime">
                    <Form.Label>Hora de Inicio</Form.Label>
                    <Form.Control
                        type="time"
                        name="startTime"
                        value={studentData.startTime}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formEndTime">
                    <Form.Label>Hora de Cierre</Form.Label>
                    <Form.Control
                        type="time"
                        name="endTime"
                        value={studentData.endTime}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formClassroom">
                    <Form.Label>Aula</Form.Label>
                    <Form.Control
                        type="text"
                        name="classroom"
                        value={studentData.classroom}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formMonitor">
                    <Form.Label>Monitor</Form.Label>
                    <Form.Control
                        type="text"
                        name="monitor"
                        value={studentData.monitor}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" onClick={handleSaveReschedule}>
                    Guardar cambios
                </Button>
            </Form>
        </Modal.Body>
    </Modal>



                      {/* Mostrar notificación */}
                      {notification && (
                          <div style={{ color: 'green', margin: '10px 0' }}>
                              {notification}
                          </div>
                      )}

                      
<div style={{ marginTop: "30px" }}>
    <h3>Monitorías Agendadas</h3>
    {calendarEvents.map(event => (
        <div key={event.id} style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
            <div style={{ marginBottom: '10px' }}>
                <strong>Programa: </strong> {event.extendedProps.programa || "No especificado"}  {/* Programa */}
            </div>
            <div style={{ marginBottom: '5px' }}>
                <strong>Asignatura: </strong> {event.extendedProps.asignatura || "No especificado"}  {/* Asignatura */}
            </div>
            <div style={{ marginBottom: '5px' }}>
                <strong>Fecha: </strong> {new Date(event.start).toLocaleDateString()}  {/* Fecha de inicio */}
            </div>
            <div style={{ marginBottom: '5px' }}>
                <strong>Hora de Inicio: </strong> 
                {event.extendedProps.startTime || new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}  {/* Hora de inicio */}
            </div>
            <div style={{ marginBottom: '5px' }}>
                <strong>Hora de Cierre: </strong> 
                {event.extendedProps.endTime || new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}  {/* Hora de cierre */}
            </div>
            <div style={{ marginBottom: '5px' }}>
    <strong>Monitor: </strong> {event.extendedProps.monitorAsignado || "No especificado"}  {/* Monitor */}
</div>
<div style={{ marginBottom: '10px' }}>
    <strong>Aula: </strong> {event.extendedProps.classroom || "No especificado"}  {/* Aula */}
</div>
<div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <Button 
        variant="warning" 
        onClick={() => handleReschedule(event)} 
        style={{ marginRight: '10px' }}
    >

                    Reprogramar
                </Button>
                <Button 
                    variant="danger" 
                    onClick={() => handleDelete(event.id)} 
                >
                    Eliminar
                </Button>
            </div>
        </div>
    ))}
</div>


                  </div>
              </>
          )}
                {activeSection === 'dashboard-container' && (
    <div>
        <h2>Dashboard de Estudiantes</h2>
        <Button variant="primary" onClick={() => mostrarModalEstudiante(true)}>Agregar Estudiante</Button>
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
                {listaEstudiantes.map((estudiante, indice) => (
                    <tr key={indice}>
                        <td>{estudiante.nombre}</td>
                        <td>{estudiante.programa}</td>
                        <td>{estudiante.semestre}</td>
                        <td>{estudiante.curso}</td>
                        <td>{estudiante.horario}</td>
                        <td>{estudiante.aulaAsignada}</td>
                        <td>
                            <Button variant="warning" onClick={() => editarEstudiante(indice)} style={estilos.botonMargen}>
                                Editar
                            </Button>
                            <Button variant="danger" onClick={() => eliminarEstudiante(indice)}>
                                Eliminar
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>

        <Modal show={mostrarModal} onHide={() => mostrarModalEstudiante(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{indiceEstudianteSeleccionado !== null ? 'Editar Estudiante' : 'Agregar Estudiante'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" name="nombre" value={datosEstudiante.nombre} onChange={manejarCambio} placeholder="Nombre del Estudiante" required />
                    </Form.Group>
                    <Form.Group controlId="formPrograma">
                        <Form.Label>Programa</Form.Label>
                        <Form.Control type="text" name="programa" value={datosEstudiante.programa} onChange={manejarCambio} placeholder="Programa" required />
                    </Form.Group>
                    <Form.Group controlId="formSemestre">
                        <Form.Label>Semestre</Form.Label>
                        <Form.Control as="select" name="semestre" value={datosEstudiante.semestre} onChange={manejarCambio} required>
                            {[...Array(11).keys()].slice(1).map((sem) => (
                                <option key={sem} value={sem}>
                                    {sem}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formCurso">
                        <Form.Label>Curso</Form.Label>
                        <Form.Control type="text" name="curso" value={datosEstudiante.curso} onChange={manejarCambio} placeholder="Curso" required />
                    </Form.Group>
                    <Form.Group controlId="formHorario">
                        <Form.Label>Horario</Form.Label>
                        <Form.Control type="text" name="horario" value={datosEstudiante.horario} onChange={manejarCambio} placeholder="Horario" required />
                    </Form.Group>
                    <Form.Group controlId="formAulaAsignada">
                        <Form.Label>Aula Asignada</Form.Label>
                        <Form.Control type="text" name="aulaAsignada" value={datosEstudiante.aulaAsignada} onChange={manejarCambio} placeholder="Aula Asignada" required />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => mostrarModalEstudiante(false)}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={agregarEstudiante}>
                    {indiceEstudianteSeleccionado !== null ? 'Guardar Cambios' : 'Agregar Estudiante'}
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
            <th>Fechas</th>
            <th>Monitor</th>
            <th>Pregrado del Monitor</th> {/* Nueva columna para Pregrado del Monitor */}
            <th>Estado</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        {convocatorias.map((convocatoria, index) => (
            <tr key={convocatoria.id}>
                <td>{convocatoria.title}</td>
                <td>{convocatoria.startDate} - {convocatoria.endDate}</td>
                <td>{convocatoria.monitor || 'No asignado'}</td>
                <td>{convocatoria.pregrado || 'No especificado'}</td> {/* Muestra el pregrado del monitor */}
                <td>{convocatoria.status}</td>
                <td>
                    <Button 
                        variant="warning" 
                        onClick={() => editConvocatoria(index)} 
                        style={{ marginRight: '5px' }}
                    >
                        Editar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={() => deleteConvocatoria(index)}
                    >
                        Eliminar
                    </Button>
                </td>
            </tr>
        ))}
    </tbody>
</Table>

{/* Tabla de Monitores */}
<h3>Monitores Inscritos</h3>

{/* Filtro de Pregrado */}
<Form.Group controlId="pregradoFilter">
    <Form.Label>Filtrar por Pregrado</Form.Label>
    <Form.Control 
        as="select" 
        value={pregradoFilter} 
        onChange={(e) => setPregradoFilter(e.target.value)} 
    >
        <option value="">Seleccionar Pregrado</option>
        <option value="Pregrado de Ingeniería de Sistemas">Pregrado de Ingeniería de Sistemas</option>
        <option value="Pregrado de Arquitectura">Pregrado de Arquitectura</option>
        <option value="Pregrado de Ingeniería Industrial">Pregrado de Ingeniería Industrial</option>
        <option value="Pregrado de Derecho">Pregrado de Derecho</option>
        <option value="Pregrado de Diseño Industrial">Pregrado de Diseño Industrial</option>
        <option value="Pregrado de Ciencias del Deporte">Pregrado de Ciencias del Deporte</option>
        <option value="Pregrado de Psicología">Pregrado de Psicología</option>
        <option value="Pregrado de Enfermería">Pregrado de Enfermería</option>
        {/* Agrega más opciones si es necesario */}
    </Form.Control>
</Form.Group>

<Table striped bordered hover className="mt-3">
    <thead>
        <tr>
            <th>Convocatoria</th>
            <th>Monitor</th>
            <th>Pregrado</th> {/* Columna para Pregrado */}
            <th>Fecha de Inscripción</th>
            <th>Horario del Monitor</th> {/* Nueva columna para el horario del monitor */}
        </tr>
    </thead>
    <tbody>
        {convocatorias
            .filter(convocatoria => convocatoria.status === "Cerrada" && convocatoria.monitor) // Filtra las convocatorias con status "Cerrada" y monitor asignado
            .filter(convocatoria => 
                pregradoFilter ? convocatoria.pregrado === pregradoFilter : true // Aplica el filtro si se seleccionó un pregrado
            )
            .map((convocatoria, index) => (
                <tr key={convocatoria.id}>
                    <td>{convocatoria.title}</td>
                    <td>{convocatoria.monitor}</td>
                    <td>{convocatoria.pregrado || "No especificado"}</td> {/* Muestra el pregrado del monitor */}
                    <td>{new Date().toLocaleDateString()}</td> {/* Muestra la fecha actual como la fecha de inscripción */}
                    <td>{convocatoria.monitorSchedule || "No especificado"}</td> {/* Muestra el horario del monitor */}
                </tr>
            ))
        }
    </tbody>
</Table>

<Modal show={showConvocatoriaModal} onHide={() => setShowConvocatoriaModal(false)}>
    <Modal.Header closeButton>
        <Modal.Title>{selectedConvocatoriaIndex !== null ? 'Editar Convocatoria' : 'Nueva Convocatoria'}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            {/* Campo Título */}
            <Form.Group controlId="formTitle">
                <Form.Label>Título</Form.Label>
                <Form.Control 
                    type="text" 
                    name="title" 
                    value={convocatoriaData.title} 
                    onChange={(e) => setConvocatoriaData({ ...convocatoriaData, title: e.target.value })} 
                    placeholder="Título de la Convocatoria" 
                    required 
                />
            </Form.Group>
            
            {/* Fecha de Inicio */}
            <Form.Group controlId="formStartDate">
                <Form.Label>Fecha de Inicio</Form.Label>
                <Form.Control 
                    type="date" 
                    name="startDate" 
                    value={convocatoriaData.startDate} 
                    onChange={(e) => setConvocatoriaData({ ...convocatoriaData, startDate: e.target.value })} 
                    required 
                />
            </Form.Group>
            
            {/* Fecha de Cierre */}
            <Form.Group controlId="formEndDate">
                <Form.Label>Fecha de Cierre</Form.Label>
                <Form.Control 
                    type="date" 
                    name="endDate" 
                    value={convocatoriaData.endDate} 
                    onChange={(e) => setConvocatoriaData({ ...convocatoriaData, endDate: e.target.value })} 
                    required 
                />
            </Form.Group>
            
            {/* Descripción */}
            <Form.Group controlId="formDescription">
                <Form.Label>Descripción</Form.Label>
                <Form.Control 
                    type="text" 
                    name="description" 
                    value={convocatoriaData.description} 
                    onChange={(e) => setConvocatoriaData({ ...convocatoriaData, description: e.target.value })} 
                    placeholder="Breve descripción de la Convocatoria" 
                    required 
                />
            </Form.Group>
            
            {/* Estado */}
            <Form.Group controlId="formStatus">
                <Form.Label>Estado</Form.Label>
                <Form.Control 
                    as="select" 
                    name="status" 
                    value={convocatoriaData.status} 
                    onChange={(e) => {
                        setConvocatoriaData({ ...convocatoriaData, status: e.target.value });
                    }}
                >
                    <option value="Abierta">Abierta</option>
                    <option value="Cerrada">Cerrada</option>
                </Form.Control>
            </Form.Group>

            {/* Horario del Monitor */}
            <Form.Group controlId="formMonitorSchedule">
                <Form.Label>Horario del Monitor</Form.Label>
                <Form.Control 
                    type="text" 
                    name="monitorSchedule" 
                    value={convocatoriaData.monitorSchedule || ''} 
                    onChange={(e) => setConvocatoriaData({ ...convocatoriaData, monitorSchedule: e.target.value })} 
                    placeholder="Horario del Monitor (Ej: Lunes 10:00 - 12:00)" 
                />
            </Form.Group>
            
            {/* Nombre del Monitor (Condicional) */}
            {convocatoriaData.status === "Cerrada" && (
                <>
                    <Form.Group controlId="formMonitor">
                        <Form.Label>Monitor</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="monitor" 
                            value={convocatoriaData.monitor || ''} 
                            onChange={(e) => setConvocatoriaData({ ...convocatoriaData, monitor: e.target.value })} 
                            placeholder="Nombre del Monitor" 
                            required 
                        />
                    </Form.Group>

                    {/* Pregrado del Monitor (Condicional) */}
                    <Form.Group controlId="formPregrado">
                        <Form.Label>Pregrado del Monitor</Form.Label>
                        <Form.Control 
                            as="select" 
                            name="pregrado" 
                            value={convocatoriaData.pregrado || ''} 
                            onChange={(e) => setConvocatoriaData({ ...convocatoriaData, pregrado: e.target.value })} 
                            required
                        >
                            <option value="">Seleccionar Pregrado</option>
                            <option value="Pregrado de Ingeniería de Sistemas">Pregrado de Ingeniería de Sistemas</option>
                            <option value="Pregrado de Arquitectura">Pregrado de Arquitectura</option>
                            <option value="Pregrado de Ingeniería Industrial">Pregrado de Ingeniería Industrial</option>
                            <option value="Pregrado de Derecho">Pregrado de Derecho</option>
                            <option value="Pregrado de Diseño Industrial">Pregrado de Diseño Industrial</option>
                            <option value="Pregrado de Ciencias del Deporte">Pregrado de Ciencias del Deporte</option>
                            <option value="Pregrado de Psicología">Pregrado de Psicología</option>
                            <option value="Pregrado de Enfermería">Pregrado de Enfermería</option>
                            {/* Puedes agregar más opciones de pregrado aquí */}
                        </Form.Control>
                    </Form.Group>
                </>
            )}
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
