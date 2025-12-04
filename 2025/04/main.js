const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("");
        });
    // console.log(data);
    return data;
};

const ADJACENTS = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
];
const countAdjacent = (data, i, j) => {
    return ADJACENTS.reduce((prev, curr) => {
        const x = i + curr[0];
        const y = j + curr[1];
        if (
            x >= 0 &&
            x < data.length &&
            y >= 0 &&
            y < data[x].length &&
            data[x][y] == "@"
        ) {
            return prev + 1;
        }
        return prev;
    }, 0);
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] != "@") {
                continue;
            }
            const adjacents = countAdjacent(data, i, j);
            if (adjacents < 4) {
                sum += 1;
            }
        }
    }
    return sum;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let sum = 0;
    let hasRemove = true;
    while (hasRemove) {
        hasRemove = false
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] != "@") {
                    continue;
                }
                const adjacents = countAdjacent(data, i, j);
                if (adjacents < 4) {
                    data[i][j] = "x"
                    hasRemove = true;
                    sum += 1;
                }
            }
        }
    }
    return sum;
};

const inputs = [];
inputs.push("sample_0.txt");
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
