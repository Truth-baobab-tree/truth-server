const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');

const { sequelize } = require('./models');

const app = express();
const prod = process.env.NODE_ENV === 'production';

if (!prod) require('dotenv').config();

app.set('port', prod ? process.env.PORT : 5050);

sequelize
  .sync({ force: false })
  .then(() => console.log('DB connected!'))
  .catch(err => console.error(err));

if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(cors({
    origin: true,
    credentials: true,
  }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json("This is truth server.");
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = prod ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(`Server is listening on port is ${app.get('port')}!`);
});
