import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Reservation from '../../models/reservation';
import Table from '../../models/table'
import { TableGrid } from '../../components/tableGrid/tableGrid';
import Datetime from 'react-datetime';
import { RegisterModal } from '../../components/registerModal/registerModal';
import { HighTrafficModal } from '../../components/highTrafficModal/highTrafficModal';
import { checkBusyDay, checkDayofWeek, checkHolidays } from '../../assets/scripts/highTrafficChecker'
import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import './reservationForm.css';

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
    const [showHighTrafficModal, setShowHighTrafficModal] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

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

    const handleSubmit = (event: any) => {
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
                setShowHighTrafficModal(true);
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
        .then(() => window.location.reload());
    }

    const valid = (current: any) => {
        var yesterday = moment().subtract(1, "day");
        return current.isAfter(yesterday)
    }

    return (
        <div className ="superContainer">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-sm">
                        <Form noValidate validated = {validated} onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label className="text1">Name</Form.Label>
                                <Form.Control onChange={(e)=> setName(e.target.value)} type="text" placeholder="Full Name" required/>
                                <Form.Control.Feedback type="invalid">Please enter a name.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label className="text1">Phone Number</Form.Label>
                                <Form.Control onChange={(e)=> setPhoneNumber(e.target.value)} type="tel" placeholder="Phone Number ###-###-####" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required/>
                                <Form.Control.Feedback type="invalid">Please enter a valid phone number in ###-###-### format.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label className="text1">Email</Form.Label>
                                <Form.Control onChange={(e)=> setEmail(e.target.value)} type="email" placeholder="Email Address" required/>
                                <Form.Control.Feedback type="invalid">Please enter an email.</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label className="text1">Date and Time Picker</Form.Label>
                                <Datetime onChange={(e: any)=> {setDateTime(e.toDate());}} isValidDate={valid}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label className="text1">Number of Guests</Form.Label>
                                <Form.Control onChange={(e)=> {setGuestsNumber(parseInt(e.target.value)); setGuestChanged(true);}} type="number" placeholder="Total Guests" min = "0" required/>
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
                    <div className="col-sm">
                        <TableGrid freeTable={freeTables}/>
                    </div>
                </div>
                <RegisterModal show = {showRegisterModal} handleClose = {() => {setShowRegisterModal(false)}} handleSubmit = {handleSendDatabase}></RegisterModal>
                <HighTrafficModal show = {showHighTrafficModal} handleClose = {() => {setShowHighTrafficModal(false)}} handleNext = {() => {setShowHighTrafficModal(false); setShowRegisterModal(true);}}></HighTrafficModal>
            </div>
        </div>
    );
}