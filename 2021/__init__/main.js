const fs = require("fs");
const path = require('path');

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    console.log(data)
    return data;
};

const part1 = (data) => {
    return null;
};
const part2 = (data) => {
    return null;
};

fs.readdirSync(__dirname).forEach(filename => {
    if (filename.endsWith(".txt")) {
        console.log(filename)
        const data = loadData(filename);
        console.log("part1", part1(JSON.parse(JSON.stringify(data))));
        console.log("part2", part2(JSON.parse(JSON.stringify(data))));
    }
})
