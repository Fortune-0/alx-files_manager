const express = require('express');

//  use default port or port 50000
const port = process.env.PORT || 5000;
const app = express();
const routes = require('./routes'); 


app.use('/', routes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
