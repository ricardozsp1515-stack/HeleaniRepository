import app from './src/app';
import env from './env';


import user_routes from './src/routes/user_routes';
import auth_routes from './src/routes/auth_routes';
import pet_routes from  './src/routes/pet_routes';

//use routes

//users routes
app.use('/api/users', user_routes);

//auth routes
app.use('/api/auth', auth_routes)

//pet routes
app.use('/api/pets', pet_routes)

app.use('/api', (req, res) =>{
    res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});