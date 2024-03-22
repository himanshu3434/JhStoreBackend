import { config } from "dotenv";
config();

import { app } from "./app.js";
import { ConnectDb } from "./db/db.js";

ConnectDb().then(() => {
  app.on("error", (err) => {
    console.log("error in the express ");
    process.exit(1);
  });
  app.listen(process.env.PORT, () => {
    console.log("Server is running at  port ", process.env.PORT);
  });
});
