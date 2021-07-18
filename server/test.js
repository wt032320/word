const fs = require("fs");
fs.readFile("./index.js", 'utf-8', (err, data) => {
    if (err)
        console.log(err);
    else
        console.log(data);
});