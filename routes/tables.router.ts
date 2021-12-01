import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../service";
import Table from "../client/src/models/table";

export const tablesRouter = express.Router();

tablesRouter.use(express.json());

//GET
tablesRouter.get("/", async (req: Request, res: Response) => {
    try{
        const tables = (await collections.Tables!.find({}).toArray()) as Table[];
        res.status(200).send(tables);
    }
    catch(error: any){
        res.status(500).send(`Error getting all tables: ${error.message}`);
    }
});

tablesRouter.get("/find", async (req: Request, res: Response) => {
    try {
        const tableNumber = req?.query?.number!.toString();
        const query = { tableNumber: parseInt(req?.query?.number!.toString()) };
        const table = (await collections.Tables!.findOne(query)) as Table;
        if (table){
            res.status(200).send(table as Table)
        }
        else
        {
            throw new TypeError("Can't Find that table");
        }
    } catch (error: any) {
        res.status(404).send(`Unable to find table: ${req.query.number}`);
    }
});

tablesRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        const _id = req?.params?.id;
        const query = { _id: new ObjectId(_id) };
        const table = (await collections.Tables!.findOne(query)) as Table;
        if (table) res.status(200).send(table);
    } catch (error: any) {
        res.status(404).send(`Unable to find table: ${req.params.id}`);
    }
});



//POST
tablesRouter.post("/", async (req: Request, res: Response) => {
    try {
        const table = req.body as Table;
        const result = await collections.Tables!.insertOne(table);
        if(result){
            res.status(201).send(`Created a new table. Id: ${result.insertedId}`)
        }
        else {
            res.status(500).send("Failed to create table.");
        }
    } catch (error: any) {
        console.error(error);
        res.status(400).send(error.message);
    }
});

//PUT
tablesRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const _id = req?.params?.id;
        const table: Table = req.body as Table;
        const query = { _id: new ObjectId(_id) };
      
        const result = await collections.Tables!.updateOne(query, { $set: table });

        if(result){
            res.status(200).send(`Updated table. id: ${_id}`)
        }
        else{
            res.status(304).send(`Failed to update table. id: ${req?.params?.id}`);
        }
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

//DELETE
tablesRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const _id = req?.params?.id;
        const query = { _id: new ObjectId(_id) };
        const result = await collections.Tables!.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Removed table. id: ${_id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove table. id: ${_id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Table with id ${_id} does not exist`);
        }
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});