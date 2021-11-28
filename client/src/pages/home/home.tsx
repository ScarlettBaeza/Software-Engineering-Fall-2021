import React from 'react';
import Button from 'react-bootstrap/Button';
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
        <div id="loginBox">
            <div className="left">
                <h1 className="signup">Sign up Today</h1>
                <input type="text" name="username" placeholder="Username" />
                <input type="text" name="email" placeholder="E-mail" />
                <input type="password" name="password" placeholder="Password" />
                <input type="password" name="password2" placeholder="Retype password" />
                <Button type="submit" name="signup_submit" value="Sign me up"> Sign me up </Button>
            </div> 

            <div className="or">OR</div>
            
            <div className="right">
                <h1 className="contGuest">Continue as Guest</h1>
                <Button className = "resMake" onClick = {handleTest} href="resForm">Make a Reservation</Button>
            </div>
        </div>
        </>
    );
}