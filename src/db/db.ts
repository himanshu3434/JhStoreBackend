import mongoose from "mongoose";

const ConnectDb = async () => {
  try {
    const url = process.env.MONGO_DB_URI || "";

    const connectionInstance = await mongoose.connect(url);
    console.log(
      "Database Connected SuccessFully at ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("Error While Connecting The DataBase ");
    process.exit(1);
  }
};

export { ConnectDb };
