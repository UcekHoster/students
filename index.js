const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cors = require('cors')
const mongoose = require('mongoose');
const $ = require('jquery');
const Float = require('mongoose-float').loadType(mongoose);
const compression = require('compression')
dotenv.config();

const authRouter = require('./routes/auth');
const privateRouter = require('./routes/fieldEntry.js');

app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
mongoose.connect(process.env.DB_SECRET_KEY, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}, () => {
  console.log('Connected to Mongo');
});


app.use(bodyParser.json());
app.use(compression())

app.use('/', authRouter);
app.use('/login', privateRouter);
app.use('/formEntry', privateRouter);
app.use('/semesters', privateRouter);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, () => {
  console.log(`Server started at ${port}`)
});