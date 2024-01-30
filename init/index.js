const mongoose= require("mongoose");
const initData= require("./data");
const Listing= require("../Models/listing");

const MONGO_URL="mongodb://127.0.0.1:27017/VoyageVentures";

main()
.then(() =>{
    console.log("connected to DB");
})
.catch(() =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB= async () =>{
    await Listing.deleteMany({}); //Empty the database if there is some data already present
    await Listing.insertMany(initData.data);
    console.log("Data initialized");
}

initDB();