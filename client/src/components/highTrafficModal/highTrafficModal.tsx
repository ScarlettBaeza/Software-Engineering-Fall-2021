import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const HighTrafficModal = (props: any) => {
    
    return (
        <Modal centered show = {props.show} onHide = {props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>High Traffic Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>The day you are attempting to reserve is a high traffic day. There will be a $10 fee if you do not show up. A credit card will be required to complete this reservation.</Modal.Body>
            <Modal.Footer>
                <Button onClick = {props.handleNext}> Next </Button>
            </Modal.Footer>
        </Modal>
    );
}