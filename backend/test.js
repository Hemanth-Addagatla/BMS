import mongoose from "mongoose";

const uri =
  "mongodb://hemanthaddagatla15_db_user:Hemanth123@ac-z5ymjl7-shard-00-00.hlfpqdg.mongodb.net:27017,ac-z5ymjl7-shard-00-01.hlfpqdg.mongodb.net:27017,ac-z5ymjl7-shard-00-02.hlfpqdg.mongodb.net:27017/?ssl=true&replicaSet=atlas-7tbhyd-shard-0&authSource=admin&appName=Cluster0";

try {
  await mongoose.connect(uri);
  console.log("Connected");
} catch (err) {
  console.error(err);
}