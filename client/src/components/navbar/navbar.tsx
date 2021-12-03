import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';
import './navbar.css';
import { propTypes } from 'react-bootstrap/esm/Image';

export const NavigationBar = (props: any) => {

    
    return (
        <Navbar className="nav" fixed = "top" expand="sm" variant="light" bg="light">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav className="me-auto">
                    <Nav.Link href="home" className="links">Home</Nav.Link>
                    <Nav.Link href="resForm" className="links">Make A Reservation</Nav.Link>
                    <Nav.Link href="about" className="links">About</Nav.Link>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="loginInfo">
                        <Navbar.Text>
                            Signed in as: <a href={props.loginId}>{props.loginUsername}</a>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Nav>
            </Container>
        </Navbar>
    );
}