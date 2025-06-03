const express = require('express');
const app = express();
const port = 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');

const mongoose = require('mongoose');
mongoose
  .connect('mongodb://localhost:27017/proeeklo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Verbonden met MongoDB');
  })
  .catch((err) => {
    console.error('Fout bij verbinden met MongoDB:', err);
  });

app.use(express.json());

// Routes
const headerRoutes = require('./routes/header');
const loginRoute = require('./routes/login');
const userRoutes = require('./routes/users');

app.use('/api/header', headerRoutes);
app.use('/api/login', loginRoute);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static('uploads'));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});
