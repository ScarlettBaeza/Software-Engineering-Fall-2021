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
    const [combineTables, setCombineTables] = useState<boolean>(false);
    const [combinedTables, setCombinedTables] = useState<Table[][]>([[]]);
    const [freeTables, setFreeTables] = useState<boolean[]>([true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);
    
    useEffect(() => {
        if(dateTime)
        {
            setDateTimeChanged(true);
            let startDate = new Date(dateTime.getTime() - 5400000);
            let endDate = new Date(dateTime.getTime() + 5400000);
            axios.get<Reservation[]>('http://localhost:8080/reservation/' + startDate.toISOString() + '/' + endDate.toISOString())
            .then((result)=> setReservations(result.data));
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
        if(guestsNumber)
        {
            let uncombinedTables = availableTables;
            var minimumCapacity = 100;
            uncombinedTables.forEach((table) => {
                if(minimumCapacity > table.tableCapacity && table.tableCapacity >= guestsNumber)
                {
                    minimumCapacity = table.tableCapacity;
                }
                setCombineTables(false);
            });
            setOptionsList(uncombinedTables.filter(x => x.tableCapacity === minimumCapacity));
            if(minimumCapacity === 100)
            {
                var numberOfGuests = guestsNumber;
                var totalCapacity = 0;
                var tablesRemaining = availableTables.sort((a,b) => (a.tableCapacity < b.tableCapacity ? 1 : -1));
                var capacities = returnUniques(availableTables)
                var combinedTables: Table[] = [];

                if(tablesRemaining)
                {
                    for(var table of tablesRemaining)
                    {
                        if(totalCapacity > numberOfGuests) break;
                        combinedTables.push(table);
                        totalCapacity = totalCapacity + table.tableCapacity;
                    }
                }
                
                console.log(combinedTables);
                //write reducer code here

                setCombineTables(true);
            }
        } 
    },[availableTables]);

    useEffect(() => {
        //add logic to limit tables that have extra seats, and allow for combining tables.

        //no, set highlighting boolean array here.
    },[optionsList]);
    
    

    useEffect(() => {
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
    },[freeTables, guestsNumber]);

    const returnUniques = (arr: Table[]) => {
        const map = [];
        for (let value of arr) {
          if (map.indexOf(value.tableCapacity) === -1) {
            map.push(value.tableCapacity);
          }
        }
      
        return map;
    };

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
                        <Form.Control onChange={(e)=> {setGuestsNumber(parseInt(e.target.value)); setGuestChanged(true);}} type="number" placeholder="total guests" min = "0" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Select Table</Form.Label>
                        <Form.Select aria-label="Default select example">
                            <option>Open this select menu</option>
                            {combineTables ? <option>fuck you</option> : optionsList.sort((a,b)=> a.tableNumber < b.tableNumber? -1: 1).map((x) => (<option>Table Number: {x.tableNumber}</option>))}
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