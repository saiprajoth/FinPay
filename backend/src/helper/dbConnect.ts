import mongoose from "mongoose";

export async function dbConnect() {
  try {
    console.log(process.env.MONGOURL);
    const result = await mongoose.connect(process.env.MONGOURL || "");
    console.log("database connection successfull");
    return;
  } catch (error) {
    console.error("error occured while connecting to the database");
    process.exit(1);
  }
}
