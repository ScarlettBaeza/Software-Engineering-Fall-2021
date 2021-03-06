import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { Reservations?: mongoDB.Collection, Tables?:mongoDB.Collection} = {}

export async function connectDatabases() {
    console.log(dotenv.config());
    const dbClient: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.REACT_APP_DATABASE_CONNECTION_STRING!);
    await dbClient.connect();
    const database: mongoDB.Db =  dbClient.db(process.env.REACT_APP_DATABASE_NAME!);
    const reservationsCollection: mongoDB.Collection = database.collection(process.env.REACT_APP_RESERVATION_COLLECTION!);
    const tablesCollection: mongoDB.Collection = database.collection(process.env.REACT_APP_TABLE_COLLECTION!);
    collections.Reservations = reservationsCollection;
    collections.Tables = tablesCollection;
}