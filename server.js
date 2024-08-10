import express from 'express';
import routes from './routes/index';

//  use default port or port 50000
const port = process.env.PORT || 5000;
const app = express();


app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
