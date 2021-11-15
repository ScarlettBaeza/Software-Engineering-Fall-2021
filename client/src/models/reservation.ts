import { ObjectId } from "mongodb";

export default class Reservation {
    public id?: ObjectId;
    public dateTime: Date;
    public reserver: string;
    public partySize: number;
    constructor(dateTime: Date, reserver: string, partySize: number, id: ObjectId | undefined){
        if(id)
        {
            this.id = id
        }
        this.dateTime = dateTime;
        this.reserver = reserver;
        this.partySize = partySize;
    }
}