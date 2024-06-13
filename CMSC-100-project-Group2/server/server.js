import express from "express";
import mongoose from "mongoose";
import router from "./routes.js";
import cors from "cors";

// set up express backend
const app = express();
app.use(express.urlencoded({ extended: false }));  // (recognize incoming request as strings or array) form data to json
app.use(express.json())  // (recognize incoming request as JSON) request body to json
app.use(cors());    // cors for requests

// connect to the database
mongoose.connect("mongodb://127.0.0.1:27017/clearanceDB");

router(app);





app.listen(3001, () => {
    console.log("Server is now listening on port 3001");
})