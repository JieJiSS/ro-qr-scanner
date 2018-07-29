const { readFileSync } = require("fs");

const volunteer_raw = readFileSync(__dirname + "/data/volunteer.txt").toString().trim();
const observer_raw = readFileSync(__dirname + "/data/observer.txt").toString().trim();
const manager_raw = readFileSync(__dirname + "/data/manager.txt").toString().trim();
/**
 * [Name, 29_Breakfast, 30_Bf, 31_Bf, 28_Launch, 29_L, 30_L, 31_L] []
 */
const volunteer_arr = volunteer_raw.split("\n").map(str => str.split("\t"));
const observer_arr = observer_raw.split("\n").map(str => str.split("\t"));
const manager_arr = manager_raw.split("\n").map(str => str.split("\t"));

function data(name, day) {
    const anchor = day - 28 + 4;
    for(let i = 0; i < volunteer_arr.length; i++) {
        if(name === volunteer_arr[i][0]) {
            return volunteer_arr[i][anchor];
        }
    }
    for(let i = 0; i < observer_arr.length; i++) {
        if(name === observer_arr[i][0]) {
            return observer_arr[i][anchor];
        }
    }
    for(let i = 0; i < manager_arr.length; i++) {
        if(name === manager_arr[i][0]) {
            return manager_arr[i][anchor];
        }
    }
    return "No Food";
}

function dataBf(name, day) {
    const anchor = day - 29 + 1;
    for(let i = 0; i < volunteer_arr.length; i++) {
        if(name === volunteer_arr[i][0]) {
            return volunteer_arr[i][anchor];
        }
    }
    for(let i = 0; i < observer_arr.length; i++) {
        if(name === observer_arr[i][0]) {
            return observer_arr[i][anchor];
        }
    }
    for(let i = 0; i < manager_arr.length; i++) {
        if(name === manager_arr[i][0]) {
            return manager_arr[i][anchor];
        }
    }
    return "No Food";
}

module.exports = exports = {
    data,
    dataBf,
};
