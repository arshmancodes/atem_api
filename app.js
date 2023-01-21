const express = require('express');
const app = express();
const parser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

app.use(parser.json());


app.use('/user', userRoutes);

//app.use(express.json());


app.listen(3000, () => {
    console.log("The server is running at 3000");
})
