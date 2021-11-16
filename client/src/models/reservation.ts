import { ObjectId } from "mongodb";
import Table from "./table";

export default class Reservation {
    public _id?: ObjectId;
    public dateTime: Date;
    public reserver: string;
    public phone: string;
    public email: string;
    public partySize: number;
    public tables: Table[];
    constructor(dateTime: Date, reserver: string, phone: string, email: string, partySize: number, tables: Table[], _id?: ObjectId){
        if(_id)
        {
            this._id = _id
        }
        this.dateTime = dateTime;
        this.reserver = reserver;
        this.phone = phone;
        this.email = email;
        this.partySize = partySize;
        this.tables = tables;
    }
}