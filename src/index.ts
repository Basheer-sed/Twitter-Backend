import express from "express";
import tweetRoutes from "./routes/tweetRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

app.use("/user", userRoutes);
app.use("/tweet", tweetRoutes);

app.listen(3001, () => {
  console.log("Server ready at localhost:3001");
});
