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
    const [reservations,setReservations] = useState<Reservation[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [freeTables, setFreeTables] = useState<boolean[]>([true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);

    useEffect(() => {
    },[]);
    
    useEffect(() => {
        if(dateTime)
        {
            //let startDate = dateTime;
            //let endDate = dateTime;
            let startDate = new Date(dateTime.getTime() - 5400000);
            let endDate = new Date(dateTime.getTime() + 5400000);
            console.log('http://localhost:8080/reservation/' + startDate.toISOString()+ '/' + endDate.toISOString())
            axios.get<Reservation[]>('http://localhost:8080/reservation/' + startDate.toISOString() + '/' + endDate.toISOString())
            .then((result)=> setReservations(result.data));
        }
    },[dateTime]);

    useEffect(() => {
        setTables([]);
        console.log(reservations);
        reservations?.forEach((reservation) => {
            if(reservation.tables)
            {
                reservation.tables.forEach((table) =>{
                    setTables((oldTables) => [...oldTables, table]);
                });
            }
        });
        
    },[reservations]);

    useEffect(() => {
        let booleans = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
        tables.forEach((table) => {
            booleans[table.tableNumber-1] = false;
        });
        setFreeTables(booleans);
    },[tables]);

    const handleSubmit = () => {

        const testReservation = new Reservation(dateTime!, name!, phoneNumber!, email!, guestsNumber!);
        console.log(testReservation);
        
        axios.post("http://localhost:8080/reservation", testReservation)
        .then((res) => console.log(res.data));
        
    };

    /*
    const handleDatetimeChange = (date: Date) => {
        if(dateTime)
        {
            let startDate = new Date(date.getTime() - 5400000);
            let endDate = new Date(date.getTime() + 5400000);
            console.log('http://localhost:8080/reservation/' + startDate.toISOString()+ '/' + endDate.toISOString())
            axios.get<Reservation[]>('http://localhost:8080/reservation/' + startDate.toISOString() + '/' + endDate.toISOString())
            .then((result)=> setReservations(result.data));
            console.log(reservations);
            reservations?.forEach((reservation) => {
                if(reservation.tables)
                {
                    reservation.tables.forEach((table) =>{
                        setTables((oldTables) => [...oldTables, table]);
                    });
                }
            });
        }
    }
    */

    const handleTest = () => {
        console.log(tables);
        console.log(dateTime?.setHours(dateTime.getHours() -2));
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
                        <Datetime onChange={(e: any)=> {setDateTime(e.toDate());}}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Number of Guests</Form.Label>
                        <Form.Control onChange={(e)=> setGuestsNumber(parseInt(e.target.value))} type="number" placeholder="total guests" min = "0" />
                    </Form.Group>
                    <Button variant="primary" onClick={handleSubmit}> Submit </Button>
                    <Button variant="primary" onClick={handleTest}> Test </Button>
                </Form>
                </div>
            </div>
            <TableGrid freeTable={freeTables}/>
        </div>
    );
}