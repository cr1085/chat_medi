import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import routes from "../helpers/routes";
import useAuth from "../auth/useAuth";

export default function Navigation() {
  const { logout } = useAuth();

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" bg="dark" className="navbar-custom">
      <Navbar.Brand className="d-flex justify-content-center ml-4" style={{ fontWeight: "bold", fontSize: "22px", padding: "0 120px" }}>
        <Nav.Link as={NavLink} to={routes.home} className="text-light">
          Bienestar CECAR
        </Nav.Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mx-auto">
          <Nav.Link as={NavLink} to={routes.monitorias} className="text-light" style={{ padding: "20px 15px" }}>Monitoria</Nav.Link>
          <Nav.Link as={NavLink} to={routes.escuelas_de_formacion} className="text-light" style={{ padding: "20px 15px" }}>Escuelas De Formación</Nav.Link>
          <Nav.Link as={NavLink} to={routes.atencion_medica} className="text-light" style={{ padding: "20px 15px" }}>Atención Médica</Nav.Link>
          <Nav.Link as={NavLink} to={routes.atencion_psicologica} className="text-light" style={{ padding: "20px 15px" }}>Atención Psicológica</Nav.Link>
          <Nav.Link as={NavLink} to={routes.seguimiento_tae} className="text-light" style={{ padding: "20px 15px" }}>Seguimiento TAE</Nav.Link>
          <NavDropdown title="Admin" className="text-light">
            <NavDropdown.Item as={NavLink} to={routes.admin.users} className="text-dark">Usuarios</NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Link as={NavLink} to={routes.login} className="me-2 text-light" style={{ padding: "20px 25px" }}>Iniciar Sesión</Nav.Link>
          <Nav.Link as={NavLink} to={routes.register} className="me-2 text-light" style={{ padding: "20px 25px" }}>Registrarse</Nav.Link>
          <Nav.Link as={NavLink} to={routes.account} className="me-2 text-light" style={{ padding: "20px 25px" }}>Mi Cuenta</Nav.Link>
          <Nav.Link onClick={logout} className="text-light" style={{ padding: "20px 25px" }}>Cerrar Sesión</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
