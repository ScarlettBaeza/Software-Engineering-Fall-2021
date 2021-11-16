import express from "express";
import { connectDatabases } from "./service";
import { reservationsRouter } from "./routes/reservations.router";
import { tablesRouter } from "./routes/tables.router";

const app = express();
const port = 8080; // default port to listen

connectDatabases().then(() => {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use("/reservation", reservationsRouter);
    app.use("/table", tablesRouter);

    app.listen(port, () => {
        console.log("Server started on localhost at port ", port);
    });
}).catch((error: Error)=>{
    console.error("Couldn't connect to database ", error);
});