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
    const [availableTables, setAvailableTables] = useState<Table[]>([]);
    const [optionsList, setOptionsList] = useState<Table[]>([]);
    const [dateTimeChanged, setDateTimeChanged] = useState<boolean>(false);
    const [guestChanged, setGuestChanged] = useState<boolean>(false);
    const [updateList, setUpdateList] = useState<boolean>(false);
    const [freeTables, setFreeTables] = useState<boolean[]>([true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);
    
    useEffect(() => {
        if(dateTime)
        {
            //let startDate = dateTime;
            //let endDate = dateTime;
            setDateTimeChanged(true);
            let startDate = new Date(dateTime.getTime() - 5400000);
            let endDate = new Date(dateTime.getTime() + 5400000);
            axios.get<Reservation[]>('http://localhost:8080/reservation/' + startDate.toISOString() + '/' + endDate.toISOString())
            .then((result)=> setReservations(result.data));
            handleUpdateList();
        }
    },[dateTime]);

    useEffect(() => {
        setTables([]);
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

    useEffect(() => {
        if(dateTimeChanged && guestChanged)
        {
            setUpdateList(true);
        }
    },[dateTimeChanged,guestChanged]);

    useEffect(() => {
        handleUpdateList();
    },[updateList]);

    useEffect(() => {
        if(guestsNumber) setOptionsList(availableTables.filter(x => x.tableCapacity >= guestsNumber));
    },[availableTables]);

    useEffect(() => {
        console.log(optionsList);
        //add logic to limit tables that have extra seats, and allow for combining tables.
    },[optionsList]);

    const handleUpdateList = () => {
        setAvailableTables([])
        if(updateList)
        {
            for(var index in freeTables)
            {
                if(freeTables[index])
                {
                    var tableQuery = parseInt(index) + 1;
                    var table: Table;                    
                    axios.get<Table>('http://localhost:8080/table/find?number=' + tableQuery)
                    .then((result)=> table = result.data)
                    .then(function() {
                        setAvailableTables((oldTables) => [...oldTables, table]);
                    });
                }
            }
        }
    }


    const handleSubmit = () => {
        const testReservation = new Reservation(dateTime!, name!, phoneNumber!, email!, guestsNumber!);
        console.log(testReservation);
        axios.post("http://localhost:8080/reservation", testReservation)
        .then((res) => console.log(res.data));
    };

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
                        <Form.Control onChange={(e)=> {setGuestsNumber(parseInt(e.target.value)); setGuestChanged(true); handleUpdateList();}} type="number" placeholder="total guests" min = "0" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Select Table</Form.Label>
                        <Form.Select aria-label="Default select example">
                            <option>Open this select menu</option>
                            {optionsList.sort((a,b)=> a.tableNumber < b.tableNumber? -1: 1).map((x) => (<option>Table Number: {x.tableNumber}</option>))}
                        </Form.Select>
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