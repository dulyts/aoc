const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    // console.log(data);
    return data;
};
const str2Num = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
};
const numStr = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
];

const reverse = (str) => str.split("").reverse().join("");

const reStraight = new RegExp(`\\d|${numStr.join("|")}`);
const reReverse = new RegExp(`\\d|${numStr.map(reverse).join("|")}`);

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    return data.reduce((prev, curr) => {
        const first = /\d/.exec(curr)[0];
        const last = /\d/.exec(reverse(curr))[0];
        return prev + 10 * Number(first) + Number(last);
    }, 0);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    return data.reduce((prev, curr) => {
        let first = reStraight.exec(curr)[0];
        let last = reReverse.exec(reverse(curr))[0];
        if (isNaN(first)) first = str2Num[first];
        if (isNaN(last)) last = str2Num[reverse(last)];
        return prev + 10 * Number(first) + Number(last);
    }, 0);
};

const inputs = [
    "sample_0.txt",
    // , "sample_1.txt"
];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
