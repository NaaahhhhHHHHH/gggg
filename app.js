const express = require('express');
const { sequelize, connectDB } = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const {setupCronJobs} = require('./service/service');
const cors = require('cors');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use('/', require('./routes/customerRoute'));
app.use('/', require('./routes/serviceRoute'));
app.use('/', require('./routes/formRoute'));
app.use('/', require('./routes/employeeRoute'));
app.use('/', require('./routes/jobRoute'));
app.use('/', require('./routes/ownerRoute'));
app.use('/', require('./routes/authRoute'));
app.use('/', require('./routes/assignmentRoute'));

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const PORT = process.env.PORT || 5000;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
setupCronJobs();