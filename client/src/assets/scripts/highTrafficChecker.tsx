import { transpileModule } from "typescript";
import axios from 'axios';
import Reservation from '../../models/reservation';
import Table from "../../models/table";

export const checkHolidays = (date: Date) => {
    //January
    if(date.getMonth() === 0)
    {
        if(date.getDate() === 1) return true;
        if(date.getDate() === 18) return true;
    }

    //February
    if(date.getMonth() === 1)
    {
        if(date.getDate() === 15) return true;
    }

    //May
    if(date.getMonth() === 4)
    {
        if(date.getDate() === 31) return true;
    }

    //June
    if(date.getMonth() === 5)
    {
        if(date.getDate() === 19) return true;
    }

    //July
    if(date.getMonth() === 6)
    {
        if(date.getDate() === 4) return true;
    }

    //September
    if(date.getMonth() === 8)
    {
        if(date.getDate() === 6) return true;
    }

    //October
    if(date.getMonth() === 9)
    {
        if(date.getDate() === 11) return true;
    }

    //November
    if(date.getMonth() === 10)
    {
        if(date.getDate() === 11) return true;
        if(date.getDate() === 25) return true;
    }

    //December
    if(date.getMonth() === 11)
    {
        if(date.getDate() === 24) return true;
        if(date.getDate() === 25) return true;
        if(date.getDate() === 31) return true;
    }

    return false;
}

export const checkDayofWeek = (date: Date) => {
    if(date.getDay() === 5) return true;
    if(date.getDay() === 6) return true;

    return false;
}

export const checkBusyDay = (date: Date) => {
    var reservations: Reservation[] = [];
    var tables: Table[] = [];
    axios.get<Reservation[]>('http://localhost:8080/reservation/day/' + date.toISOString())
    .then((result)=> reservations = result.data)
    .then(() => {
        reservations.forEach((reservation) => {
            if(reservation.tables)
            {
                reservation.tables.forEach((table) => {
                    tables.push(table);
                })
            }
        });
    })
    .then(() => {
        if(tables.length >= 40)
        {
            return true;
        }
        else
        {
            return false;
        }
    });

    return false;
}