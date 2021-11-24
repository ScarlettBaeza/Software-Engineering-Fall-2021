import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import './navbar.css';

export const NavigationBar = () => {

    
    return (
        <Navbar fixed = "top" expand="sm" variant="light" bg="light">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="me-auto">
                    <Nav.Link href="home" className="links">Home</Nav.Link>
                    <Nav.Link href="resForm" className="links">Make A Reservation</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}