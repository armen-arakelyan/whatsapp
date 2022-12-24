"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
(0, connection_1.connect)().then(res => {
    connection_1.ev.on('get labels', data => {
        console.log('>>>', data);
    });
});
