const express= require("express");
const app= express();
const users= require("./routes/user.js");
const post= require("./routes/post.js");
const session= require("express-session");

const sessionOptions= { // Initialising a express session
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialised: true
};

app.use(session(sessionOptions));

app.get("/register", (req, res) =>{
    let {name= "Anonymous"} = req.query; // Extracting the name from the URL query
    req.session.name= name; // Storing the info in the session
    res.redirect("/hello");
})
app.get("/hello", (req, res) =>{ // Acessing the stored info from the session
    res.send(`hello, ${req.session.name}`);
})

// app.get("/reqcount", (req, res) =>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// })

// app.get("/test", (req, res) =>{
//     res.send("test succesfull");
// })

app.listen(3000, () =>{
    console.log("server listening");
})