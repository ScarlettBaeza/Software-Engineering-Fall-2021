import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../service";
import Reservation from "../../client/src/models/reservation";

export const reservationsRouter = express.Router();

reservationsRouter.use(express.json());

//GET
reservationsRouter.get("/", async (req: Request, res: Response) => {
    try{
        const reservations = (await collections.Reservations!.find({}).toArray()) as Reservation[];
        res.status(200).send(reservations);
    }
    catch(error: any){
        res.status(500).send(`Error getting all reservations: ${error.message}`);
    }
});

reservationsRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const query = { _id: new ObjectId(id) };
        const reservation = (await collections.Reservations!.findOne(query)) as Reservation;
        if (reservation) res.status(200).send(reservation);
    } catch (error: any) {
        res.status(404).send(`Unable to find reservation: ${req.params.id}`);
    }
});

reservationsRouter.get("/:startTime/:endTime", async (req: Request, res: Response) => {
    try {
        const startTime = req?.params?.startTime;
        const endTime = req?.params?.endTime;
        const startQuery = { dateTime: startTime };
        const endQuery = { dateTime: endTime };
        console.log(startTime, endTime);
        const reservation = (await collections.Reservations!.find({ dateTime : { $gt: startTime, $lt: endTime}}).toArray()) as Reservation[];
        console.log(reservation);
        if (reservation) res.status(200).send(reservation);
        else throw(console.error());
        
    } catch (error: any) {
        res.status(404).send(`Unable to find reservation: ${req.params.id}`);
    }
});

//POST
reservationsRouter.post("/", async (req: Request, res: Response) => {
    try {
        const reservation = req.body as Reservation;
        const result = await collections.Reservations!.insertOne(reservation);
        if(result){
            res.status(201).send(`Created a new reservation. Id: ${result.insertedId}`)
        }
        else {
            res.status(500).send("Failed to create reservation.");
        }
    } catch (error: any) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

//PUT
reservationsRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const reservation: Reservation = req.body as Reservation;
        const query = { _id: new ObjectId(id) };
      
        const result = await collections.Reservations!.updateOne(query, { $set: reservation });

        if(result){
            res.status(200).send(`Updated reservation. id: ${id}`)
        }
        else{
            res.status(304).send(`Failed to update reservation. id: ${req?.params?.id}`);
        }
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

//DELETE
reservationsRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id = req?.params?.id;
        const query = { id: new ObjectId(id) };
        const result = await collections.Reservations!.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed reservation. id: ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove reservation. id: ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Reservation with id ${id} does not exist`);
        }
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});