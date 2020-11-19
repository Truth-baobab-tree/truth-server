const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const pageRouter = require('./routes/page');
const userRouter = require('./routes/user');
const infoRouter = require('./routes/info');

const {
  sequelize
} = require('./models');

dotenv.config();

const app = express();
const prod = process.env.NODE_ENV === 'production';


app.set('port', prod ? process.env.PORT : 5050);

sequelize
  .sync({
    force: false
  })
  .then(() => console.log('DB connected!'))
  .catch(err => console.error(err));

if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(cors({
    origin: true,
  }));
}

app.use(morgan(prod ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use('/page', pageRouter);
app.use('/user', userRouter);
app.use('/info', infoRouter);

app.use('*', (err, req, res, next) => {
  console.log(err);
  res.status(500).json('error');
});

app.get('/', (req, res) => {
  res.status(200).json('Hello, Truth Server.');
});

app.listen(app.get('port'), () => {
  console.log(`Server is listening on port is ${app.get('port')}!`);
});
