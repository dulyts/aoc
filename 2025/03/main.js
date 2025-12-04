const fs = require("fs");

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
    data = JSON.parse(JSON.stringify(data));
    let sum = 0;
    data.forEach((d) => {
        let max = 0;
        for (let i = 0; i < d.length; i++) {
            for (let j = i + 1; j < d.length; j++) {
                const curr = 10 * d[i] + d[j];
                max = Math.max(max, curr);
            }
        }
        sum += max;
    });
    return sum;
};

const isPossible = (data, number) => {
    let i = 0;
    for (let j = 0; j < number.length; j++) {
        const n = number[j];
        while (i < data.length && data[i] != n) {
            i++;
        }
        if (i >= data.length) {
            return false;
        }
        i++;
    }
    return true;
};
const solve = (data, input, indices) => {
    const number = indices.map((i) => input[i]);
    if (!isPossible(data, number)) {
        return undefined;
    }
    if (indices.length == 12) {
        return number;
    }
    const usedNumbers = [];
    let idx = 0;
    while (idx < input.length) {
        if (indices.includes(idx) || usedNumbers.includes(input[idx])) {
            idx++;
            continue;
        }
        const res = solve(data, input, [...indices, idx]);
        usedNumbers.push(input[idx]);
        if (res) {
            return res;
        }
        idx++;
    }
};

const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let sum = 0;

    data.forEach((d) => {
        const ordered = [...d].sort((a, b) => b - a);
        const res = solve(d, ordered, []);
        if (res) {
            sum += Number(res.join(""));
        }
    });
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
