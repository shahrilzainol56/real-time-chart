import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { Server } from "socket.io";

dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:3000" }));

const PORT = process.env.PORT || 9000;

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    const io = new Server(server);

    // Create a Mongoose schema and model
    const DataSchema = new mongoose.Schema({
      value: Number,
      timestamp: { type: Date, default: Date.now },
    });

    const Data = mongoose.model("Data", DataSchema);

    io.on("connection", (socket) => {
      console.log("A new client has connected");

      // Emit data to connected clients every 1 second
      setInterval(async () => {
        const value = Math.random() * 100; // Generate random data
        const data = new Data({ value });
        await data.save(); // Save data to MongoDB

        socket.emit("data", data);
      }, 1000);

      socket.on("disconnect", () => {
        console.log("A client has disconnected");
      });
    });
  })
  .catch((error) => console.log(`${error} did not connect`));
