import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { Reservations?: mongoDB.Collection } = {}

export async function connectDatabases() {
    dotenv.config();
    const dbClient: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DATABASE_CONNECTION_STRING);
    await dbClient.connect();
    const database: mongoDB.Db =  dbClient.db(process.env.DATABASE_NAME);
    const reservationsCollection: mongoDB.Collection = database.collection(process.env.RESERVATION_COLLECTION);
    collections.Reservations = reservationsCollection;
}