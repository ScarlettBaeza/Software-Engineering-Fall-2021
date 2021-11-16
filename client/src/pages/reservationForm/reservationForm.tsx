import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import background from '../../assets/images/background.jpg'
import axios from 'axios';
import Reservation from '../../models/reservation';
import Table from '../../models/table'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

export const ReservationForm = () => {
    //const [reserved, setReserved] = useState(false);
    //const [tables, setTables] = useState<Table[]>();

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm">
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Full Name" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="text" placeholder="phone n" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Example text area</Form.Label>
                        <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                </Form>
                </div>
            </div>
        </div>
    );
}