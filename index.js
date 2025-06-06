const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors'); // <-- Add CORS

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

app.use(cors({ origin: 'http://localhost:5174' }));
app.use(express.json());

// Routes
const headerRoutes = require('./routes/header');
const loginRoute = require('./routes/login');
const userRoutes = require('./routes/users');
const introRoutes = require('./routes/intro');
const countdownRoutes = require('./routes/countdown');
const infoRoutes = require('./routes/info');
const realiserenRoutes = require('./routes/realiseren');
const logoRoutes = require('./routes/logo');
const deelnameRoutes = require('./routes/deelname');
const categorieRoutes = require('./routes/categorieen');
const puntRoutes = require('./routes/punten');

app.use('/api/header', headerRoutes);
app.use('/api/login', loginRoute);
app.use('/api/users', userRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/intro', introRoutes);
app.use('/api/countdown', countdownRoutes);
app.use('/api/info', infoRoutes);
app.use('/api/realiseren', realiserenRoutes);
app.use('/api/logo', logoRoutes);
app.use('/api/deelname', deelnameRoutes);
app.use('/api/categorieen', categorieRoutes);
app.use('/api/punten', puntRoutes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server draait op http://localhost:${port}`);
});
