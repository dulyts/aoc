const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split("\n")
        .slice(0, -1)[0]
        .split(",")
        .map(Number);
    // console.log(data);
    return data;
};

const part1 = (data) => {
    data = [...data].sort((a, b) => a - b);
    let min = Infinity;
    for (let i = data[0]; i < data[data.length - 1]; i++) {
        let sum = 0;
        for (let j = 0; j < data.length; j++) {
            sum += Math.abs(data[j] - i);
        }
        if (sum < min) {
            min = sum;
        }
    }
    return min;
};
const part2 = (data) => {
    data = [...data].sort((a, b) => a - b);
    let min = Infinity;
    for (let i = data[0]; i < data[data.length - 1]; i++) {
        let sum = 0;
        for (let j = 0; j < data.length; j++) {
            const n = Math.abs(data[j] - i);
            sum += (n * (n + 1)) / 2;
        }
        if (sum < min) {
            min = sum;
        }
    }
    return min;
};

// const filename = "sample_0.txt";
const filename = "input.txt";
const data = loadData(filename);
console.log("part1", part1(data));
console.log("part2", part2(data));
