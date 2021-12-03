import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Redirector } from './components/redirector/redirector';
import { NavigationBar } from './components/navbar/navbar';
import { Home } from './pages/home/home';
import { ReservationForm } from './pages/reservationForm/reservationForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { About } from './pages/about/about';
import { RegisteredReservationForm } from './pages/registeredReservationForm/registeredReservationForm';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar loginUsername="Nobody"/>
        <Routes>
          <Route path = "/" element ={<Redirector/>} />
          <Route path = "/home" element ={<Home/>}/>
          <Route path = "/registeredReserve" element = {<RegisteredReservationForm/>}/>
          <Route path = "/resForm" element = {<ReservationForm/>}/>
          <Route path = "/about" element = {<About/>}/>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
