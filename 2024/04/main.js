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

const findRight = (data, i, j, l) => {
    let word = "";
    let x = j;
    while (x < j + l && x < data[i].length) {
        word += data[i][x];
        x++;
    }
    return word;
};
const findLeft = (data, i, j, l) => {
    let word = "";
    let x = j;
    while (x > j - l && x >= 0) {
        word += data[i][x];
        x--;
    }
    return word;
};
const findUp = (data, i, j, l) => {
    let word = "";
    let y = i;
    while (y > i - l && y >= 0) {
        word += data[y][j];
        y--;
    }
    return word;
};
const findDown = (data, i, j, l) => {
    let word = "";
    let y = i;
    while (y < i + l && y < data.length) {
        word += data[y][j];
        y++;
    }
    return word;
};
const findDownRight = (data, i, j, l) => {
    let word = "";
    let k = 0;
    while (k < l && i + k < data.length && j + k < data[i + k].length) {
        word += data[i + k][j + k];
        k++;
    }
    return word;
};
const findDownLeft = (data, i, j, l) => {
    let word = "";
    let k = 0;
    while (k < l && i + k < data.length && j - k >= 0) {
        word += data[i + k][j - k];
        k++;
    }
    return word;
};
const findUpRight = (data, i, j, l) => {
    let word = "";
    let k = 0;
    while (k < l && i - k >= 0 && j + k < data[i - k].length) {
        word += data[i - k][j + k];
        k++;
    }
    return word;
};
const findUpLeft = (data, i, j, l) => {
    let word = "";
    let k = 0;
    while (k < l && i - k >= 0 && j - k >= 0) {
        word += data[i - k][j - k];
        k++;
    }
    return word;
};

const findMatch = (data, i, j) => {
    const left = findLeft(data, i, j, 4);
    const right = findRight(data, i, j, 4);
    const up = findUp(data, i, j, 4);
    const down = findDown(data, i, j, 4);

    const upRight = findUpRight(data, i, j, 4);
    const upLeft = findUpLeft(data, i, j, 4);
    const downRight = findDownRight(data, i, j, 4);
    const downLeft = findDownLeft(data, i, j, 4);

    let count = 0;
    count += left === "XMAS" ? 1 : 0;
    count += right === "XMAS" ? 1 : 0;
    count += up === "XMAS" ? 1 : 0;
    count += down === "XMAS" ? 1 : 0;

    count += upRight === "XMAS" ? 1 : 0;
    count += upLeft === "XMAS" ? 1 : 0;
    count += downRight === "XMAS" ? 1 : 0;
    count += downLeft === "XMAS" ? 1 : 0;
    return count;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let count = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            count += findMatch(data, i, j);
        }
    }
    return count;
};

const findMatch2 = (data, i, j) => {
    const upLeft = findUpLeft(data, i + 1, j + 1, 3);
    const upRight = findUpRight(data, i + 1, j - 1, 3);
    const downRight = findDownRight(data, i - 1, j - 1, 3);
    const downLeft = findDownLeft(data, i - 1, j + 1, 3);

    let count = 0;

    count += upLeft === "MAS" ? 1 : 0;
    count += upRight === "MAS" ? 1 : 0;
    count += downLeft === "MAS" ? 1 : 0;
    count += downRight === "MAS" ? 1 : 0;
    return count >= 2 ? 1 : 0;
};

const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let count = 0;
    for (let i = 1; i < data.length - 1; i++) {
        for (let j = 1; j < data[i].length - 1; j++) {
            count += findMatch2(data, i, j);
        }
    }
    return count;
};

const inputs = ["sample_0.txt", "sample_1.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
