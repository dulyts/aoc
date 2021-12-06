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

const generateFished = (data, day) => {
    data = [...data]
    const days = {};
    for (let i = 0; i <= 8; i++) {
        days[i] = 0;
    }
    for (let i = 0; i < data.length; i++) {
        days[data[i]] = days[data[i]] + 1;
    }

    for (let i = 0; i < day; i++) {
        let fishResets = days[0];
        for (let j = 1; j <= 8; j++) {
            days[j-1] = days[j];
        }

        days[6] += fishResets;
        days[8] = fishResets;
    }
    let count = 0;
    for (let i = 0; i <= 8; i++) {
        count += days[i];
    }
    return count;
}

const part1 = (data) => {
    return generateFished(data, 80);
};
const part2 = (data) => {
    return generateFished(data, 256);
};

// const filename = "sample_0.txt";
const filename = "input.txt";
const data = loadData(filename);
console.log("part1", part1(data));
console.log("part2", part2(data));
