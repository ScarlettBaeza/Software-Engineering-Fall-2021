import React, { useEffect } from 'react';
import { TableSquare } from '../../components/table/table';
import "./tableGrid.css"
import "react-datetime/css/react-datetime.css";
export const TableGrid = (props: any) => {
    useEffect(()=>{

    },[]);
    return (
        <div className="grid">
            <div className="container">
            <div className="row g-1">
                <div className="col-2 align-self-center">
                    <TableSquare open={props.freeTable[0]} capacity = "six" tableNumber = {1}/>
                </div>

                <div className="col-1 align-self-center">
                    <TableSquare open={props.freeTable[1]} capacity = "two" tableNumber = {2}/>
                </div>
                
                <div className="col-2 align-self-center">
                    <TableSquare open={props.freeTable[2]} capacity = "four" tableNumber = {3}/>
                </div>
                <div className="col-2 align-self-center">
                    <TableSquare open={props.freeTable[3]} capacity = "four" tableNumber = {4}/>
                </div>

                <div className="col-2 align-self-center">
                    <TableSquare open={props.freeTable[4]} capacity = "four" tableNumber = {5}/>
                </div>

                <div className="col-1 align-self-center">
                    <TableSquare open={props.freeTable[5]} capacity = "two" tableNumber = {6}/>
                </div>

                <div className="col-2 align-self-center">
                    <TableSquare open={props.freeTable[6]} capacity = "six" tableNumber = {7}/>
                </div>
            </div>
            <div className="row g-1">
                <div className="col-2"></div>
                <div className="col-1"></div>
                <div className="col-2 align-self-center">
                    <TableSquare open={props.freeTable[7]} capacity = "four" tableNumber = {8}/>
                </div>
                <div className="col-2 align-self-center">
                    <TableSquare open={props.freeTable[8]} capacity = "four" tableNumber = {9}/>
                </div>
                <div className="col-2 align-self-center">
                    <TableSquare open={props.freeTable[9]} capacity = "four" tableNumber = {10}/>
                </div>
                <div className="col-1">
                </div>
                <div className="col-2">
                </div>
            </div>
            <div className="row g-1">
                <div className = "col-2 align-self-center">
                    <TableSquare open={props.freeTable[10]} capacity = "six" tableNumber = {11}/>
                </div>
                <div className="col-1 align-self-center">
                    <TableSquare open={props.freeTable[11]} capacity = "two" tableNumber = {12}/>
                </div>
                <div className="col align-self-center">
                    <TableSquare open={props.freeTable[12]} capacity = "four" tableNumber = {13}/>
                </div>
                <div className="col align-self-center">
                    <TableSquare open={props.freeTable[13]} capacity = "four" tableNumber = {14}/>
                </div>
                <div className="col align-self-center">
                    <TableSquare open={props.freeTable[14]} capacity = "four" tableNumber = {15}/>
                </div>
                <div className="col-1 align-self-center">
                    <TableSquare open={props.freeTable[15]} capacity = "two" tableNumber = {16}/>
                </div>
                <div className="col-2 align-self-center">
                    <TableSquare open={props.freeTable[16]} capacity = "six" tableNumber = {17}/>
                </div>
            </div>
        </div>
        </div>
    );
}