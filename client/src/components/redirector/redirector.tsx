import React, { useEffect } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import { Container, Nav } from 'react-bootstrap';

export const Redirector = () => {
    useEffect(()=>{
        window.location.href = "/home";
    },[])
    return (
        <></>
    );
}