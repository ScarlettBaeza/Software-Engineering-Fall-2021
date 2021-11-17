import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './reservationForm.css';
import axios from 'axios';
import Reservation from '../../models/reservation';
import Table from '../../models/table'
import { TableGrid } from '../../components/tableGrid/tableGrid';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

export const ReservationForm = () => {
    const [name,setName] = useState<string>();
    const [email,setEmail] = useState<string>();
    const [phoneNumber,setPhoneNumber] = useState<string>();
    const [dateTime,setDateTime] = useState<Date>();
    const [guestsNumber,setGuestsNumber] = useState<number>();
    const [reservations,setReservations] = useState<Reservation[]>();
    const [tables, setTables] = useState<Table[]>();
    const [freeTables, setFreeTables] = useState<boolean[]>([]);

    useEffect(() => {
        axios.get<Reservation[]>('http://localhost:8080/reservation')
        .then((result)=> setReservations(result.data));

        axios.get<Table[]>('http://localhost:8080/table')
        .then((result)=> setTables(result.data));

    },[]);

    useEffect(() => {
        console.log(reservations);
    },[dateTime]);

    const handleTest = () => {
        setFreeTables([true, true, false, false, true, true, false, false, true]);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm">
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control onChange={(e)=> setName(e.target.value)} type="text" placeholder="Full Name" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control onChange={(e)=> setPhoneNumber(e.target.value)} type="text" placeholder="phone number" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email</Form.Label>
                        <Form.Control onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="email address" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Date and Time Picker</Form.Label>
                        <Datetime onChange={(e: any)=> setDateTime(e.toDate())}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Number of Guests</Form.Label>
                        <Form.Control onChange={(e)=> setGuestsNumber(parseInt(e.target.value))} type="number" placeholder="total guests" min = "0" />
                    </Form.Group>
                    <Button variant="primary" onClick={handleTest}> Submit </Button>
                </Form>
                </div>
            </div>
            <div className="row">
                {dateTime?.toDateString()}
            </div>
            <TableGrid freeTable={freeTables}/>
        </div>
    );
}