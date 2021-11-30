import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './reservationForm.css';
import axios from 'axios';
import Reservation from '../../models/reservation';
import Table from '../../models/table'
import { TableGrid } from '../../components/tableGrid/tableGrid';
import Datetime from 'react-datetime';
import { RegisterModal } from '../../components/registerModal/registerModal';
import { HighTrafficModal } from '../../components/highTrafficModal/registerModal';
import { checkBusyDay, checkDayofWeek, checkHolidays } from '../../assets/scripts/highTrafficChecker'
import "react-datetime/css/react-datetime.css";
import moment from 'moment';

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
    const [validated, setValidated] = useState<boolean>(false);

    const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
    const [highTrafficReason, setHighTrafficReason] = useState<boolean[]>([false, false, false]);

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

    const handleSubmit = (event: any) => {
        /*
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
        */
        const form = event.currentTarget;
        if(form.checkValidity() === false || !dateTimeChanged)
        {
            event.preventDefault();
            event.stopPropagation();
        }
        else
        {
            event.preventDefault();
            if(checkBusyDay(dateTime!) || checkDayofWeek(dateTime!) || checkHolidays(dateTime!))
            {
                console.log("damn its busy");
            }
            else
            {
                setShowRegisterModal(true);
            }
        }

        setValidated(true);
    };

    const handleSelectTable = (tableNum:number) => {
        setSelectedTable(optionsList.find((x) => x.tableNumber == tableNum));
    };

    const handleTest = (event: any) => {
        /*
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
        */
        const form = event.currentTarget;
        if(form.checkValidity() === false)
        {
            event.preventDefault();
            event.stopPropagation();
        }
        else
        {
            console.log("submitted!");
        }
        setValidated(true);
    };

    const handleSendDatabase = () => {
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
        axios.post("http://localhost:8080/reservation", testReservation)
        .then((res) => console.log(res.data));
    }

    const valid = (current: any) => {
        var yesterday = moment().subtract(1, "day");
        return current.isAfter(yesterday)
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm">
                <Form noValidate validated = {validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="text1">Name</Form.Label>
                        <Form.Control onChange={(e)=> setName(e.target.value)} type="text" placeholder="Full Name" required/>
                        <Form.Control.Feedback type="invalid">Please enter a name.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="text1">Phone Number</Form.Label>
                        <Form.Control onChange={(e)=> setPhoneNumber(e.target.value)} type="tel" placeholder="phone number" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required/>
                        <Form.Control.Feedback type="invalid">Please enter a valid phone number.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="text1">Email</Form.Label>
                        <Form.Control onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="email address" required/>
                        <Form.Control.Feedback type="invalid">Please enter an email.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="text1">Date and Time Picker</Form.Label>
                        <Datetime onChange={(e: any)=> {setDateTime(e.toDate());}} isValidDate={valid}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="text1">Number of Guests</Form.Label>
                        <Form.Control onChange={(e)=> {setGuestsNumber(parseInt(e.target.value)); setGuestChanged(true);}} type="number" placeholder="total guests" min = "0" required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className="text1">{combineTables ? <>Combined Table</> : <>Select Table</>}</Form.Label>
                        <Form.Select aria-label="Default select example" onChange={(e: any) => {handleSelectTable(e.target.value)}} required>
                            {combineTables ? <></> : <option selected disabled value="">Open this select menu</option>}
                            {combineTables ? <option>Table Numbers: {combinedTables.map((x) => {return x.tableNumber + (combinedTables.indexOf(x) === (combinedTables.length - 1) ? "" : " + ")})}</option> : optionsList.sort((a,b)=> a.tableNumber < b.tableNumber? -1: 1).map((x) => (<option value={x.tableNumber}>Table Number: {x.tableNumber}</option>))}
                        </Form.Select>
                    </Form.Group>
                    <Button type="submit"> Submit </Button>
                </Form>
                </div>
            </div>
            <TableGrid freeTable={freeTables}/>
            <RegisterModal show = {showRegisterModal} handleClose = {() => {setShowRegisterModal(false)}} handleSubmit = {handleSendDatabase}></RegisterModal>
        </div>
    );
}