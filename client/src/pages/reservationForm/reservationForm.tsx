import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './reservationForm.css';
import axios from 'axios';
import Reservation from '../../models/reservation';
import Table from '../../models/table'
import { TableGrid } from '../../components/tableGrid/tableGrid';
import Datetime from 'react-datetime';
import { checkBusyDay, checkDayofWeek, checkHolidays } from '../../assets/scripts/highTrafficChecker'
import "react-datetime/css/react-datetime.css";

export const ReservationForm = () => {
    const [name,setName] = useState<string>();
    const [email,setEmail] = useState<string>();
    const [phoneNumber,setPhoneNumber] = useState<string>();
    const [dateTime,setDateTime] = useState<Date>();
    const [guestsNumber,setGuestsNumber] = useState<number>();
    const [selectedTable,setSelectedTable] = useState<Table>();
    const [reservations,setReservations] = useState<Reservation[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [availableTables, setAvailableTables] = useState<Table[]>([]);
    const [optionsList, setOptionsList] = useState<Table[]>([]);
    const [dateTimeChanged, setDateTimeChanged] = useState<boolean>(false);
    const [guestChanged, setGuestChanged] = useState<boolean>(false);
    const [updateList, setUpdateList] = useState<boolean>(false);
    const [combineTables, setCombineTables] = useState<boolean>(false);
    const [combinedTables, setCombinedTables] = useState<Table[]>([]);
    const [freeTables, setFreeTables] = useState<boolean[]>([true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]);
    
    useEffect(() => {
        if(dateTime)
        {
            setDateTimeChanged(true);
            let startDate = new Date(dateTime.getTime() - 3600000);
            let endDate = new Date(dateTime.getTime() + 3600000);
            axios.get<Reservation[]>('http://localhost:8080/reservation/' + startDate.toISOString() + '/' + endDate.toISOString())
            .then((result)=> setReservations(result.data));
        }
    },[dateTime]);

    useEffect(() => {
        setTables([]);
        var tables: Table[] = [];
        reservations?.forEach((reservation) => {
            if(reservation.tables)
            {
                reservation.tables.forEach((table) =>{
                    tables.push(table);
                });
            }
        });

        setTables(tables);
    },[reservations]);

    useEffect(() => {
        let booleans = [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true];
        tables.forEach((table) => {
            booleans[table.tableNumber-1] = false;
        });
        setFreeTables(booleans);
    },[tables]);

    useEffect(() => {
        setAvailableTables([])
        var tablesAvailable:Table[] = [];

        axios.get<Table[]>('http://localhost:8080/table')
        .then((result) => {tablesAvailable = result.data})
        .then(()=> {tablesAvailable = tablesAvailable.filter((x) => {return freeTables[x.tableNumber-1]})})
        .then(() => setAvailableTables(tablesAvailable));

    },[freeTables, guestsNumber]);

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
                setCombineTables(true);
                var numberOfGuests = guestsNumber;
                var totalCapacity = 0;
                var tablesRemaining = availableTables.sort((a,b) => (a.tableCapacity < b.tableCapacity ? 1 : -1));
                var combinedTables: Table[] = [];
                if(tablesRemaining)
                {
                    for(var table of tablesRemaining)
                    {
                        if(totalCapacity >= numberOfGuests) break;
                        combinedTables.push(table);
                        totalCapacity = totalCapacity + table.tableCapacity;
                    }
                }
                availableTables.sort((a,b) => (a.tableCapacity < b.tableCapacity ? -1 : 1));
                if(combinedTables[combinedTables.length-1])
                {
                    totalCapacity = totalCapacity - combinedTables[combinedTables.length-1].tableCapacity;
                    combinedTables.pop();
                    for(var table of tablesRemaining)
                    {
                        combinedTables.push(table);
                        totalCapacity = totalCapacity + table.tableCapacity;
                        if (totalCapacity >= numberOfGuests) break;
                        else
                        {
                            combinedTables.pop();
                            totalCapacity = totalCapacity - table.tableCapacity;
                        }
                    }
                }
                setCombinedTables(combinedTables);

            }
        } 
    },[availableTables]);

    useEffect(() => {
        if(dateTimeChanged && guestChanged)
        {
            setUpdateList(true);
        }
    },[dateTimeChanged,guestChanged]);

    

    useEffect(() => {
        //add logic to limit tables that have extra seats, and allow for combining tables.

        //no, set highlighting boolean array here.
    },[optionsList]);
    
    const returnUniqueCapacity = (arr: Table[]) => {
        const map = [];
        for (let value of arr) {
          if (map.indexOf(value.tableCapacity) === -1) {
            map.push(value.tableCapacity);
          }
        }
      
        return map;
    };

    const handleSubmit = () => {
        var tables: Table[] = []
        if(combineTables)
        {
            tables = combinedTables
        }
        else
        {
            if(selectedTable) tables.push(selectedTable);
        }
        const testReservation = new Reservation(dateTime!, name!, phoneNumber!, email!, guestsNumber!, tables);
        console.log(testReservation);
        axios.post("http://localhost:8080/reservation", testReservation)
        .then((res) => console.log(res.data));
    };

    const handleSelectTable = (tableNum:number) => {
        console.log(optionsList);
        setSelectedTable(optionsList.find((x) => x.tableNumber == tableNum));
    };

    const handleTest = () => {
        var tables: Table[] = []
        if(combineTables)
        {
            tables = combinedTables
        }
        else
        {
            if(selectedTable) tables.push(selectedTable);
        }
        console.log(checkHolidays(dateTime!));
        console.log(checkDayofWeek(dateTime!));
        checkBusyDay(dateTime!);
        const testReservation = new Reservation(dateTime!, name!, phoneNumber!, email!, guestsNumber!, tables);
        console.log(testReservation);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm">
                <Form>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control onChange={(e)=> setName(e.target.value)} type="text" placeholder="Full Name" required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control onChange={(e)=> setPhoneNumber(e.target.value)} type="text" placeholder="phone number" required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email</Form.Label>
                        <Form.Control onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="email address" required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Date and Time Picker</Form.Label>
                        <Datetime onChange={(e: any)=> {setDateTime(e.toDate());}}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Number of Guests</Form.Label>
                        <Form.Control onChange={(e)=> {setGuestsNumber(parseInt(e.target.value)); setGuestChanged(true);}} type="number" placeholder="total guests" min = "0" required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>{combineTables ? <>Combined Table</> : <>Select Table</>}</Form.Label>
                        <Form.Select aria-label="Default select example" onChange={(e: any) => {handleSelectTable(e.target.value)}}>
                            {combineTables ? <></> : <option>Open this select menu</option>}
                            {combineTables ? <option>{combinedTables.map((x) => {return x.tableNumber + (combinedTables.indexOf(x) === (combinedTables.length - 1) ? "" : " + ")})}</option> : optionsList.sort((a,b)=> a.tableNumber < b.tableNumber? -1: 1).map((x) => (<option value={x.tableNumber}>Table Number: {x.tableNumber}</option>))}
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