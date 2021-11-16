import { ObjectId } from "mongodb";
import  Reservation  from './reservation';

export default class Table {
    public _id?: ObjectId;
    public tableNumber: number;
    public tableCapacity: number;
    public reservations?: Reservation[];

    constructor(tableNumber: number, tableCapacity: number, reservations?: Reservation[], _id?: ObjectId){
        if(_id)
        {
            this._id = _id
        }
        if (reservations)
        {
            this.reservations = reservations;
        }
        this.tableNumber = tableNumber;
        this.tableCapacity = tableCapacity;
    }
}