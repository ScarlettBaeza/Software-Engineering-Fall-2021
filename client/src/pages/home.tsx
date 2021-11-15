import React from 'react';
import Button from 'react-bootstrap/Button';
import background from '../assets/images/background.jpg'
import axios from 'axios';
import './home.css';
import Reservation from '../models/reservation';

export const Home = () => {
    const handleTest = () => {
        const testReservation = new Reservation(123,"dan",12,undefined)

        axios.post("http://localhost:8080/reservation", testReservation)
        .then((res) => console.log(res.data));

       
    }

    const handleGet = () => {
        axios.get('http://localhost:8080/reservation')
        .then((result)=>console.log(result.data))
    }

    return (
        <>
            <img
            src = {background}
            alt = 'Background'/>
            <div className = "text">EAT NOW</div>
            <Button className = "sugma" onClick = {handleTest}>Make a Reservation</Button>
            <Button className = "testy" onClick = {handleGet}> Get All Reservations</Button>
        </>
    );
}