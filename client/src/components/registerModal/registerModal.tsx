import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const RegisterModal = (props: any) => {
    
    return (
        <Modal centered show = {props.show} onHide = {props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Would you like to register?</Modal.Title>
            </Modal.Header>
            <Modal.Body>Register to manage reservations and to make faster reservations next time!</Modal.Body>
            <Modal.Footer>
                <Button onClick = {props.handleSubmit}> Submit Reservation without Registering </Button>
                <Button onClick = {props.handleSubmit}> Submit Reservation and send me to Registration </Button>
            </Modal.Footer>
        </Modal>
    );
}