import React from 'react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import './home.css';
import Reservation from '../../models/reservation';
import Table from '../../models/table'

export const Home = () => {
    return (
        <>
        <div id="loginBox">
            <div className="left">
                <h1 className="signup">Sign up Today</h1>
                <input className="text" name="username" placeholder="Username" />
                <input className="text" name="email" placeholder="E-mail" />
                <input type="password" name="password" placeholder="Password" />
                <input type="password" name="password2" placeholder="Retype password" />
                <Button type="submit" name="signup_submit" value="Sign me up" href="registeredReserve"> Sign me up </Button>
            </div> 

            <div className="or">OR</div>
            
            <div className="right">
                <h1 className="contGuest">Continue as Guest</h1>
                <Button className = "resMake" href="resForm">Make a Reservation</Button>
            </div>
        </div>
        </>
    );
}