import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NavigationBar } from './components/navbar/navbar';
import { Home } from './pages/home/home';
import { ReserveTester } from './pages/reserveTester/reserveTester';
import { ReservationForm } from './pages/reservationForm/reservationForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path = "/home" element ={<Home/>}/>
          <Route path = "/menu" element = {<ReserveTester/>}/>
          <Route path = "/resForm" element = {<ReservationForm/>}/>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
