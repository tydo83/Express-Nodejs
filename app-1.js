const express = require("express");

const indexRouter = require("./router/index")
const teamRouter = require("./router/team")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// app.get("/", function (req, res) {
//     res.send("Welcome to our first API");
// })
app.use("/", indexRouter)
app.use("/team", teamRouter)

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

