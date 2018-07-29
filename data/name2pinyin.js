const { readFileSync, writeFileSync } = require("fs");
const pinyin = require("node-pinyin");

const names = readFileSync(__dirname + "/names.txt").toString().trim().split("\n");
const py2NameMap = Object.create(null);

names.forEach(name => {
    let pyarr = pinyin(name, { heteronym: true, style: "firstLetter" });
    pyarr = handle(pyarr, name);
    pyarr.forEach(py => {
        if(py2NameMap[py] !== undefined) {
            py2NameMap[py].push(name);
        } else {
            py2NameMap[py] = [name];
        }
    });
});

function handle(arr, name) {
    let pyStrArr = [], strArr = [""];
    arr.forEach(el => {
        if(el.length > 1) {
            el = Array.from(new Set(el));
        }
        pyStrArr.push(el);
    });
    pyStrArr.forEach(pyArr => {
        if(pyArr.length > 1) {
            let tmpStrArr = [""];
            pyArr.forEach(py => {
                tmpStrArr = tmpStrArr.concat(strArr.map(str => str + py));
            });
            strArr = tmpStrArr.slice(1);
        } else {
            strArr = strArr.map(str => str + pyArr[0]);
        }
    });
    return strArr;
}

writeFileSync(__dirname + "/py2name.json", JSON.stringify(py2NameMap));
