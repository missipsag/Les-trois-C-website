const express = require("express");
const colors =  require("colors")
const PORT = 3000;
const App = express();




App.listen(PORT , () => {
    console.log(`\nSERVER RUNNING ON PORT ${PORT}`.blue);
})