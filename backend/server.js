const express = require('express');
const PORT = 5000;
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGOBD_URL } = require('./config')

app.get("/welcome",(req,res)=>{
    res.status(200).json({"msg":"hello world"});
}); 
global.__basedir = __dirname;
mongoose.connect(MONGOBD_URL);

mongoose.connection.on('connected', () => {
    console.log("DB connected");
})
mongoose.connection.on('error', (error) => {
    console.log("Some error while connecting to DB");
})

require('./models/user');
require('./models/tweetmodel');

app.use(cors());
app.use(express.json());

app.use(require('./routes/user_route'));
// app.use(require('./routes/post_route'));
app.use(require('./routes/file_route'));

app.listen(PORT, () => {
    console.log("Server started",PORT);
});