import React from 'react';
import Button from 'react-bootstrap/Button';
import background from '../../assets/images/background.jpg'
import axios from 'axios';
import './home.css';
import Reservation from '../../models/reservation';
import Table from '../../models/table'

export const Home = () => {
    const handleTest = () => {
        var tables = [];
        var table1 = new Table(23,2,undefined,undefined);
        var table2 = new Table(11,4, undefined,undefined);
        tables.push(table1);
        tables.push(table2);
        const testReservation = new Reservation(new Date(), "dan", "123-456-7890", "dan@dan.com", 12, tables);

        axios.post("http://localhost:8080/reservation", testReservation)
        .then((res) => console.log(res.data));

    }

    const handleGet = () => {
        var reservations: Reservation[] | undefined = undefined;
        axios.get<Reservation[]>('http://localhost:8080/reservation')
        .then((result)=> reservations = result.data)
        .then(function() {
            if(reservations)
            {
                reservations.forEach(reservation =>{
                    console.log(reservation.dateTime);
                });
            }
        });
    }

    const handleTablePost = () => {
        const table1 = new Table(1,2);
        axios.post("http://localhost:8080/table", table1)
        .then((res) => console.log(res.data));
    }

    const handleTableGet = () => {
        var tables: Table[] | undefined = undefined;
        axios.get<Table[]>('http://localhost:8080/table')
        .then((result)=> tables = result.data)
        .then(function() {
            if(tables)
            {
                tables.forEach(tables =>{
                    console.log(tables);
                });
            }
        });
    }

    return (
        <>
            <img
            src = {background}
            alt = 'Background'/>
            <div className = "text">EAT NOW</div>
            <Button className = "sugma" onClick = {handleTest}>Make a Reservation</Button>
            <Button className = "testy" onClick = {handleGet}> Get All Reservations</Button>
            <Button className = "tableTesty" onClick = {handleTablePost}>Make a Table</Button>
            <Button className = "tableTesty" onClick = {handleTableGet}>Get all Tables</Button>
        </>
    );
}