const express = require("express");
const app = express();
const cors = require('cors')
require("dotenv");




const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




app.get("/", (req, res) => {
  return res.status(200).json({
    service: "Eats-api",
    status: "Success",
    message: "Kitchen is open & orders are cooking nicely 🔥",
  });
});

app.listen(port, () => {

    // Database Connection Logic


    console.log(`Server is running on ${port} port`)
});
