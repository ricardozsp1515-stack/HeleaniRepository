import app from './src/app';
import env from './env';


import user_routes from './src/routes/user_routes';

//use routes
//users routes
app.use('/api/users', user_routes);

app.use('/api', (req, res) =>{
    res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});