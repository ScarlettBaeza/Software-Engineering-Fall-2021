import express from "express";
import { connectDatabases } from "./service";
import { reservationsRouter } from "./routes/reservations.router";

const app = express();
const port = 8080; // default port to listen

connectDatabases().then(() => {
    app.use("/reservation", reservationsRouter);
    app.listen(port, () => {
        console.log("Server started on localhost at port ", port);
    });
}).catch((error: Error)=>{
    console.error("Couldn't connect to database ", error);
});