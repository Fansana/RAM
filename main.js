/**
 * Created by Nexus on 12.04.2018.
 */

const fs = require("fs");
var RAM = require("./RAM");
var text = fs.readFileSync("program.ram").toString();

var ram = new RAM();
ram.loadProgram(text);
ram.input = [9, 5];
console.log(ram.labels)
var interval = setInterval(function () {
    ram.process();
    //console.log(ram.memeory);
    if (ram.halted) {
        clearInterval(interval);
        console.log("Execution completed");
        console.log(ram.output);

    }
}, 500);

