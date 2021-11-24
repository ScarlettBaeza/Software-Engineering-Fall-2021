import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import './navbar.css';
import logo from '../../assets/images/logo.png';

export const NavigationBar = () => {

    
    return (
        <Navbar fixed = "top" expand="sm" variant="light" bg="light">
            <Container>
                <Navbar.Brand href = "home">
                    <img 
                    src = {logo}
                    alt = 'Logo'
                    width = '200'
                    height = '100'/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="me-auto">
                <Nav.Link href="home">Home</Nav.Link>
                    <Nav.Link href="resForm">Make A Reservation</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}