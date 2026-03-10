const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const userController = require('./controllers/userController');

app.post('/enable', userController.enableUser);
app.post('/disable', userController.disableUser);

app.use('/roles', roleRoutes);
app.use('/users', userRoutes);

mongoose.connect('mongodb://localhost:27017/btnodejs')
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
