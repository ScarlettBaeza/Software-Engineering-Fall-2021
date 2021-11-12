import { ObjectId } from "mongodb";

export default class Reservation {
    public id?: ObjectId;
    public dateTime: number;
    public reserver: string;
    constructor(id, dateTime, reserver){
        this.id = id;
        this.dateTime = dateTime;
        this.reserver = reserver;
    }
}