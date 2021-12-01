const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split("\n")
        .map((d) => +d);
    return data;
};

const part1 = (data) => {
    let count = 0;
    for (let i = 1; i < data.length; i++) {
        const prev = data[i - 1];
        const curr = data[i];
        if (curr > prev) {
            count += 1;
        }
    }
    return count;
};
const part2 = (data) => {
    const intervalLength = 3;
    let count = 0;
    let prevSum = 0;
    for (let i = 0; i < data.length - intervalLength; i++) {
        let sum = 0;
        for (let j = 0; j < intervalLength; j++) {
            sum += data[i + j];
        }
        if (i != 0) {
            if (sum > prevSum) {
                count += 1;
            }
        }
        prevSum = sum;
    }
    return count;
};

// const filename = "input_0.txt";
const filename = "input_1.txt";
const data = loadData(filename);
console.log("part1", part1(data));
console.log("part2", part2(data));
