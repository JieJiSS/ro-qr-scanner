const { readFileSync, writeFileSync } = require("fs");

const name2id = require("./name2id.json");

const lu_arr = readFileSync(__dirname + "/lunch.txt").toString().trim().split("\n");
const bf_arr = readFileSync(__dirname + "/bf.txt").toString().trim().split("\n");

const bin2type = ["吉味双拼饭-吉野家", "照烧鸡排饭（大）-吉野家", 
    "招牌牛肉饭（大）-吉野家", "什锦蘑菇饭（大）-吉野家", 
    "原味板烧鸡腿堡-麦当劳", "经典麦辣鸡腿汉堡-麦当劳",
    "巨无霸汉堡-麦当劳", "双层阿拉斯加狭鳕鱼堡-麦当劳"
];

const bin2bftype = ["芝士火腿串点醒晨餐-吉野家",
    "肉松吉多士奶茶套餐-吉野家",
    "芝士火腿碗蒸醒晨餐-吉野家",
    "鲜美烟肉早晨全餐-麦当劳", 
    "悠享早晨全餐-麦当劳",
    "板烧鸡腿早晨全餐-麦当劳",
];

function fetchLunchByUser (fullname, day = 29) {
    for(let j = 0; j < lu_arr.length; j++) {
        lu_str = lu_arr[j];
        const arr = lu_str.split("\t").map(str => str.trim());
        if (arr[0] === fullname.trim()) {
            if (arr[1].toLowerCase() === "no order") {
                return "No Food";
            } else {
                const food_arr = arr.slice(1);
                const anchor = (day - 28) * 8;
                const lunch_today = food_arr.slice(anchor, anchor + 8);
                for (let i = 0; i < lunch_today.length; i++) {
                    if (lunch_today[i] === "1") {
                        return bin2type[i];
                    }
                }
                return "No Food";
            }
        }
    };
}

function fetchBfByUser (fullname, day = 29) {
    for(let j = 0; j < bf_arr.length; j++) {
        bf_str = bf_arr[j];
        const arr = bf_str.split("\t").map(str => str.trim());
        if (arr[0] === fullname.trim()) {
            if (arr[1].toLowerCase() === "no order") {
                return "No Food";
            } else {
                const food_arr = arr.slice(1);
                const anchor = (day - 29) * 6;
                const lunch_today = food_arr.slice(anchor, anchor + 6);
                for (let i = 0; i < lunch_today.length; i++) {
                    if (lunch_today[i] !== "0") {
                        return bin2bftype[i];
                    }
                }
                return "No Food";
            }
        }
    };
}

function getIDByName (name) {
    return name2id[name] || "";
}

module.exports = exports = {
    fetchLunchByUser,
    fetchBfByUser,
    //fetchLunchByID,
    getIDByName,
};
