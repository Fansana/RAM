/**
 * Created by Nexus on 12.04.2018.
 */
var RAM = function () {
    this.input = [];
    this.memeory = [0];
    this.output = [];
    this.programm = [];
    this.labels = {};
    this.instructionPointer = 0;
    this.halted = false;
};

RAM.prototype.process = function () {
    if (this.halted)
        return;
    var instruction = this.programm[this.instructionPointer];
    process.stdout.write(this.instructionPointer + ": ");
    if (instruction) {
        switch (instruction.instruction) {
            case "READ":
                if (instruction.operand.startsWith("=")) {
                    console.error(instruction + ": This does not make sense")
                } else if (instruction.operand.startsWith("*")) {
                    let value = +instruction.operand.substring(1);
                    let registerValue = this.getMemory(value);
                    this.setMemory(registerValue, this.input.shift())
                } else {
                    let value = +instruction.operand;
                    this.setMemory(value, this.input.shift())
                }
                this.instructionPointer++;
                break;
            case "LOAD":
                if (instruction.operand.startsWith("=")) {
                    this.setMemory(0, +instruction.operand.substring(1));
                } else if (instruction.operand.startsWith("*")) {
                    let value = +instruction.operand.substring(1);
                    let memoryValue = this.getMemory(value);
                    this.setMemory(0, memoryValue)
                } else {
                    let value = +instruction.operand;
                    this.setMemory(0, this.getMemory(value))
                }
                this.instructionPointer++;
                break;
            case "STORE":
                if (instruction.operand.startsWith("=")) {
                    console.error(instruction + ": This does not make sense")
                } else if (instruction.operand.startsWith("*")) {
                    let value = +instruction.operand.substring(1);
                    let memoryValue = this.getMemory(value);
                    this.setMemory(memoryValue, this.getMemory(0))
                } else {
                    let value = +instruction.operand;
                    this.setMemory(value, this.getMemory(0))
                }
                this.instructionPointer++;
                break;
            case "WRITE":
                if (instruction.operand.startsWith("=")) {
                    this.output[this.output.length] = +instruction.operand.substring(1);
                } else if (instruction.operand.startsWith("*")) {
                    let value = +instruction.operand.substring(1);
                    let memoryValue = this.getMemory(value);
                    this.output[this.output.length] = this.getMemory(memoryValue);
                } else {
                    this.output[this.output.length] = this.getMemory(+instruction.operand);
                }
                this.instructionPointer++;
                break;
            case "ADD":
                if (instruction.operand.startsWith("=")) {
                    this.setMemory(0, this.getMemory(0) + instruction.operand.substring(1));
                } else if (instruction.operand.startsWith("*")) {
                    let value = +instruction.operand.substring(1);
                    let memoryValue = this.getMemory(value);
                    this.setMemory(0, this.getMemory(0) + this.getMemory(memoryValue));
                } else {
                    let value = +instruction.operand;
                    this.setMemory(0, this.getMemory(0) + this.getMemory(value));
                }
                this.instructionPointer++;
                break;
            case "MULT":
                if (instruction.operand.startsWith("=")) {
                    this.setMemory(0, this.getMemory(0) * instruction.operand.substring(1));
                } else if (instruction.operand.startsWith("*")) {
                    let value = +instruction.operand.substring(1);
                    let memoryValue = this.getMemory(value);
                    this.setMemory(0, this.getMemory(0) * this.getMemory(memoryValue));
                } else {
                    let value = +instruction.operand;
                    this.setMemory(0, this.getMemory(0) * this.getMemory(value));
                }
                this.instructionPointer++;
                break;
            case "DIV":
                if (instruction.operand.startsWith("=")) {
                    this.setMemory(0, Math.floor(this.getMemory(0) / instruction.operand.substring(1)));
                } else if (instruction.operand.startsWith("*")) {
                    let value = +instruction.operand.substring(1);
                    let memoryValue = this.getMemory(value);
                    this.setMemory(0, Math.floor(this.getMemory(0) / this.getMemory(memoryValue)));
                } else {
                    let value = +instruction.operand;
                    this.setMemory(0, Math.floor(this.getMemory(0) / this.getMemory(value)));
                }
                this.instructionPointer++;
                break;
            case "SUB":
                if (instruction.operand.startsWith("=")) {
                    this.setMemory(0, this.getMemory(0) - instruction.operand.substring(1));
                } else if (instruction.operand.startsWith("*")) {
                    let value = +instruction.operand.substring(1);
                    let memoryValue = this.getMemory(value);
                    this.setMemory(0, this.getMemory(0) - this.getMemory(memoryValue));
                } else {
                    let value = +instruction.operand;
                    this.setMemory(0, this.getMemory(0) - this.getMemory(value));
                }
                this.instructionPointer++;
                break;
            case "JUMP":
                var label = this.labels[instruction.operand];
                if (label != undefined)
                    this.instructionPointer = this.labels[instruction.operand];
                else
                    console.error("Jump reference to undefined label \"" + instruction.operand + "\"");
                break;
            case "JGTZ":
                var label = this.labels[instruction.operand];
                if (label != undefined)
                    if (this.getMemory(0) > 0)
                        this.instructionPointer = this.labels[instruction.operand];
                    else
                        this.instructionPointer++;
                else
                    console.error("Jump reference to undefined label \"" + instruction.operand + "\"");
                break;
            case "JZERO":
                var label = this.labels[instruction.operand];
                if (label != undefined)
                    if (this.getMemory(0) == 0)
                        this.instructionPointer = this.labels[instruction.operand];
                    else
                        this.instructionPointer++;
                else
                    console.error("Jump reference to undefined label \"" + instruction.operand + "\"");
                break;
            case "HALT":
                this.halted = true;
                break;
            default:
                this.instructionPointer++;
                break;
        }
    }
    process.stdout.write("[" + this.memeory + "] " + instruction.instruction + " " + instruction.operand + "\n");


};

RAM.prototype.loadProgram = function (text) {
    var instructions = text.replace(/[|\\][a-zA-z ()0-9-<>]*/g, "").replace(/[ |\t]+/g, ' ').split(/;|\r\n/g);
    for (let i = 0; i < instructions.length; i++) {
        if (!this.syntaxCheck(instructions[i])) {
            console.log(instructions[i] + " Did not match the required syntax");
            return;
        } else {
            var parts = instructions[i].trim().split(" ");
            console.log(parts)
            if (parts.length == 3) {
                this.labels[parts[0].slice(0, -1)] = this.programm.length;
                if (parts[1].match(/^LOAD|STORE|ADD|SUB|MULT|DIV|READ|WRITE$/)) {
                    this.programm.push({label: parts[0].slice(0, -1), instruction: parts[1], operand: parts[2]})
                } else if (parts[1].match(/^JUMP|JGTZ|JZERO$/)) {
                    this.programm.push({label: parts[0].slice(0, -1), instruction: parts[1], operand: parts[2]})
                }
            } else if (parts.length == 2) {
                if (parts[0].match(/^[a-z]+:$/)) {
                    if (parts[1].match(/^HALT$/)) {
                        this.labels[parts[0].slice(0, -1)] = this.programm.length;
                        this.programm.push({label: parts[0].slice(0, -1), instruction: parts[1], operand: null})
                    }
                } else if (parts[0].match(/^LOAD|STORE|ADD|SUB|MULT|DIV|READ|WRITE$/)) {
                    if (parts[1].match(/^[=*]?\d+$/)) {
                        this.programm.push({label: null, instruction: parts[0], operand: parts[1]})
                    }
                } else if (parts[0].match(/^JUMP|JGTZ|JZERO$/)) {
                    if (parts[1].match(/^[a-z]+$/)) {
                        this.programm.push({label: null, instruction: parts[0], operand: parts[1]})
                    }
                }
            } else if (parts.length == 1) {
                if (parts[0].match(/^[a-z]+:$/)) {
                    this.labels[parts[0].slice(0, -1)] = this.programm.length;
                    this.programm.push({label: parts[0].slice(0, -1), instruction: null, operand: null})
                } else if (parts[0].match(/^HALT$/)) {
                    this.programm.push({label: null, instruction: parts[0], operand: null})
                }
            }
        }
    }
};
/**
 * check if commands are valid
 */
RAM.prototype.syntaxCheck = function (instruction) {

    let parts = instruction.trim().split(" ");

    if (parts.length == 3) {
        if (!parts[0].match(/^[a-z]+:$/)) {
            return false;
        }
        if (parts[1].match(/^LOAD|STORE|ADD|SUB|MULT|DIV|READ|WRITE$/)) {
            if (!parts[2].match(/^[a-z]+$/)) {
                return true;
            }
        }
        if (parts[1].match(/^JUMP|JGTZ|JZERO$/)) {
            if (!parts[2].match(/^[=*]?\d+$/)) {
                return true;
            }
        }
    } else if (parts.length == 2) {
        if (parts[0].match(/^[a-z]+:$/)) {
            if (parts[1].match(/^HALT$/)) {
                return true;
            }
        } else if (parts[0].match(/^LOAD|STORE|ADD|SUB|MULT|DIV|READ|WRITE$/)) {
            if (parts[1].match(/^[=*]?\d+$/)) {
                return true;
            }
        } else if (parts[0].match(/^JUMP|JGTZ|JZERO$/)) {
            if (parts[1].match(/^[a-z]+$/)) {
                return true;
            }
        }
    } else if (parts.length == 1) {
        if (parts[0].match(/^[a-z]+:$/)) {
            return true;
        } else if (parts[0].match(/^HALT$/)) {
            return true;
        }
    }
    return false;

};

RAM.prototype.setMemory = function (i, value) {
    this.memeory[i] = value;
};

RAM.prototype.getMemory = function (i) {
    if (this.memeory[i] == undefined)
        return 0;
    else
        return this.memeory[i];
};
RAM.prototype.accumulator = function (value) {
    if (value)
        return this.memory[0] = value;
    else
        return this.memeory[0];
}
module.exports = RAM;