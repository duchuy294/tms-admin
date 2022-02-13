/**
 * Author: Onlyvic
 * Email: onlyvicisvic@gmail.com
 * Phone: (+84) 988 099 636
 * */
/**
 * Production mode
 */
function init()
{
    const port = 3080;
    const express = require('express');
    const path = require('path');

    app = express();

    httpServer = app.listen(port, function () {
        console.log("Production Express server running at localhost:" + port)
    });

    app.use(express.static(path.join(__dirname, './dist')));
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, './dist', 'index.html'));
    });
}

//Start web
init();
