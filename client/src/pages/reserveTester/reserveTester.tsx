import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import background from '../../assets/images/background.jpg'
import axios from 'axios';
import Reservation from '../../models/reservation';
import Table from '../../models/table'
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

export const ReserveTester = () => {
    const [reserved, setReserved] = useState(false);
    const [tables, setTables] = useState<Table[]>();

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm">
                <Datetime/>
                </div>
                <div className="col-sm">
                {reserved ? <>true</>: <>false</>}
                </div>
                <div className="col-sm">
                {reserved ? <>true</>: <>false</>}
                </div>
            </div>
        </div>
    );
}