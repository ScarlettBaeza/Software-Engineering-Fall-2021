import React from 'react';
import './table.css';

export const TableSquare = (props: any) => {
    
    return (
        <div style={{backgroundColor: props.open? "#2bff6b" : "#de1b1b",  boxShadow: props.selected? "0px 0px 10px 7px #241edd" : ""}} className = {props.capacity+"Table"}>{props.tableNumber}</div>
    );
}