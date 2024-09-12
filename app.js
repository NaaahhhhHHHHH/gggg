const express = require('express');
const { sequelize, connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use('/', require('./routes/customers'));
app.use('/', require('./routes/categories'));
app.use('/', require('./routes/services'));
//app.use('/', require('./routes/appointments'));
//app.use('/', require('./routes/blogs'));
//app.use('/', require('./routes/about'));
//app.use('/', require('./routes/gallery'));
app.use('/', require('./routes/employees'));
app.use('/', require('./routes/branches'));
app.use('/', authRoutes);

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

const PORT = process.env.PORT || 5000;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));