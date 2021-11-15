import React from 'react';
import Button from 'react-bootstrap/Button';
import background from '../assets/images/background.jpg'
import axios from 'axios';
import './home.css';
import Reservation from '../models/reservation';

export const Home = () => {
    const handleTest = () => {
        const testReservation = new Reservation(new Date(),"dan",12,undefined)

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