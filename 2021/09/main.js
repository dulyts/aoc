const fs = require("fs");
const path = require("path");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("").map(Number);
        });
    // console.log(data);
    return data;
};

const part1 = (data) => {
    data = [...data];
    const lowPoints = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            let isLowPoint = true;
            const e = data[i][j];
            isLowPoint = isLowPoint && (i == 0 || data[i - 1][j] > e);
            isLowPoint =
                isLowPoint && (i == data.length - 1 || data[i + 1][j] > e);
            isLowPoint = isLowPoint && (j == 0 || data[i][j - 1] > e);
            isLowPoint =
                isLowPoint && (j == data[i].length - 1 || data[i][j + 1] > e);
            if (isLowPoint) {
                lowPoints.push(e);
            }
        }
    }
    return lowPoints.reduce((prev, next) => prev + next + 1, 0);
};
const part2 = (data) => {
    const lowPoints = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[0].length; j++) {
            let isLowPoint = true;
            const e = data[i][j];
            isLowPoint = isLowPoint && (i == 0 || data[i - 1][j] > e);
            isLowPoint =
                isLowPoint && (i == data.length - 1 || data[i + 1][j] > e);
            isLowPoint = isLowPoint && (j == 0 || data[i][j - 1] > e);
            isLowPoint =
                isLowPoint && (j == data[i].length - 1 || data[i][j + 1] > e);
            if (isLowPoint) {
                lowPoints.push([i, j]);
            }
        }
    }
    let bussins = [];

    lowPoints.forEach(([i, j]) => {
        const visited = new Set();
        const b = findBussin(visited, data, i, j);
        bussins.push(b);
    });
    bussins = bussins.sort((a,b) => b-a);
    return bussins[0] * bussins[1] * bussins[2];
};

const findBussin = (visited, data, i, j) => {
    const key = `${i}_${j}`;
    if (
        visited.has(key) ||
        i < 0 ||
        i == data.length ||
        j < 0 ||
        j == data[i].length
    ) {
        return 0;
    }
    visited.add(key);
    if (data[i][j] == 9) {
        return 0;
    }
    let b = 1;
    b += findBussin(visited, data, i - 1, j);
    b += findBussin(visited, data, i, j - 1);
    b += findBussin(visited, data, i + 1, j);
    b += findBussin(visited, data, i, j + 1);
    return b;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
