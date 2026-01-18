const app = require("./app");
const connectDB = require("./config/database");
require("dotenv").config();

const PORT = process.env.PORT || 5001;

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(PORT, () => {
      console.log(`Server is successfully listening on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err);
  });
