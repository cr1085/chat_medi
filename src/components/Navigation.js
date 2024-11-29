import { useState } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHome, faBookReader, faUserMd, faBrain, faChartLine, faUsersCog, faSignInAlt, faUserPlus, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import routes from "../helpers/routes";
import useAuth from "../auth/useAuth";
import "./Navigation.css"; // Archivo CSS personalizado

export default function Navigation() {
  const { logout, isLogged } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => setExpanded(!expanded);
  const handleClose = () => setExpanded(false);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      variant="dark"
      bg="primary" 
      className="navbar-custom"
      expanded={expanded}
    >
      <Container>
        <Navbar.Brand
          as={NavLink}
          to={routes.home}
          className="text-light"
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faHome} className="me-2" />
          Bienestar CECAR
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={handleToggle} />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={NavLink} to={routes.monitorias} className="text-light" onClick={handleClose}>
              <FontAwesomeIcon icon={faBookReader} className="me-2" /> Monitoria
            </Nav.Link>
           <Nav.Link as={NavLink} to={routes.escuelas_de_formacion} className="text-light" onClick={handleClose}>
              <FontAwesomeIcon icon={faBrain} className="me-2" /> Escuelas De Formación
            </Nav.Link>
            <Nav.Link as={NavLink} to={routes.atencion_medica} className="text-light" onClick={handleClose}>
              <FontAwesomeIcon icon={faUserMd} className="me-2" /> Atención Médica
            </Nav.Link>
            <Nav.Link as={NavLink} to={routes.atencion_psicologica} className="text-light" onClick={handleClose}>
              <FontAwesomeIcon icon={faBrain} className="me-2" /> Atención Psicológica
            </Nav.Link>
            <Nav.Link as={NavLink} to={routes.seguimiento_tae} className="text-light" onClick={handleClose}>
              <FontAwesomeIcon icon={faChartLine} className="me-2" /> Seguimiento TAE
            </Nav.Link>
            {!isLogged && ( // Mostrar solo si NO está autenticado
            <>
              <NavDropdown title={<span><FontAwesomeIcon icon={faUsersCog} className="me-2" /> Admin</span>} className="text-light" onClick={handleClose}>
              <NavDropdown.Item as={NavLink} to={routes.admin.users} className="text-dark">
                Usuarios
              </NavDropdown.Item>
               <NavDropdown.Item as={NavLink} to={routes.login} className="text-dark">
                Login
              </NavDropdown.Item>
               <NavDropdown.Item as={NavLink} to={routes.register} className="text-dark">
                Singup
              </NavDropdown.Item>
            </NavDropdown>
            </>
          )}
           
          </Nav>
          <Nav className="ms-auto">
           {isLogged && ( // Mostrar solo si está autenticado
            <>
              <Nav.Link as={NavLink} to={routes.account} className="text-light" onClick={handleClose}>
                <FontAwesomeIcon icon={faUser} className="me-2" /> Mi Cuenta
              </Nav.Link>
              <Nav.Link onClick={() => { logout(); handleClose(); }} className="text-light">
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Cerrar Sesión
              </Nav.Link>
            </>
          )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}