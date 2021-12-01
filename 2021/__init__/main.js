const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split("\n")
        .map((d) => {
            return d;
        });
    return data;
};

const part1 = (data) => {
    return null;
};
const part2 = (data) => {
    return null;
};

// const filename = "sample_0.txt";
const filename = "input.txt";
const data = loadData(filename);
console.log("part1", part1(data));
console.log("part2", part2(data));
