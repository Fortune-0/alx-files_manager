const express = require('express');

const port = process.env.PORT || 5000;
const app = express();
const routes = require('./routes'); 


app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
