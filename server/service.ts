import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { Reservations?: mongoDB.Collection } = {}

export async function connectDatabases() {
    console.log(dotenv.config());
    const dbClient: mongoDB.MongoClient = new mongoDB.MongoClient("mongodb+srv://cooldevs:coolerdevs@cluster0.imgtn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
    await dbClient.connect();
    const database: mongoDB.Db =  dbClient.db(process.env.REACT_APP_DATABASE_NAME!);
    const reservationsCollection: mongoDB.Collection = database.collection(process.env.REACT_APP_RESERVATION_COLLECTION!);
    collections.Reservations = reservationsCollection;
}