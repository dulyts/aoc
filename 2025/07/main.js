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

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let beams = [];
    for (let i = 0; i < data[0].length; i++) {
        if (data[0][i] === "S") {
            beams.push(i);
        }
    }
    let count = 0;
    for (let i = 1; i < data.length; i++) {
        const newBeams = new Set();
        beams.forEach((b) => {
            if (data[i][b] === ".") {
                data[i][b] = "|";
                newBeams.add(b);
            }
            if (data[i][b] === "^") {
                count++;
                if (b > 0) {
                    data[i][b - 1] = "|";
                    newBeams.add(b - 1);
                }
                if (b < data.length - 1) {
                    data[i][b + 1] = "|";
                    newBeams.add(b + 1);
                }
            }
        });
        beams = [...newBeams];
    }
    // data.forEach((d) => console.log(d.join("")));
    return count;
};
const CACHE = {};
const travel = (data, i, b) => {
    const cacheKey = `${i}-${b}`;
    if (cacheKey in CACHE) {
        return CACHE[cacheKey];
    }
    if (i == data.length) {
        return 1;
    }
    if (data[i][b] === ".") {
        const res = travel(data, i + 1, b);
        CACHE[cacheKey] = res;
        return res;
    }
    let count = 0;
    if (data[i][b] === "^") {
        if (b > 0) {
            count += travel(data, i + 1, b - 1);
        }
        if (b < data.length - 1) {
            count += travel(data, i + 1, b + 1);
        }
    }
    CACHE[cacheKey] = count;
    return count;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let S;
    for (let i = 0; i < data[0].length; i++) {
        if (data[0][i] === "S") {
            S = i;
        }
    }
    return travel(data, 1, S);
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
