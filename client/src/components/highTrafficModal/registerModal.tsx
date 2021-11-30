import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const HighTrafficModal = (props: any) => {
    
    return (
        <Modal centered show = {props.show} onHide = {props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>High Traffic Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>The day you are attempting to reserve is a High Traffic day</Modal.Body>
            <Modal.Footer>
                <Button onClick = {props.handleToSubmit}> Acknowledge </Button>
            </Modal.Footer>
        </Modal>
    );
}