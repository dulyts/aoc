const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split(" ").map(Number);
        })[0];
    // console.log(data);
    return data;
};

const ruleZero = (num) => {
    if (num != 0) return undefined;
    return 1;
};
const ruleEven = (num) => {
    const numStr = "" + num;
    const len = numStr.length;
    if (len % 2 === 1) return undefined;
    const num1 = numStr.substring(0, len / 2);
    const num2 = numStr.substring(len / 2);
    return [Number(num1), Number(num2)];
};
const rule2024 = (num) => {
    return num * 2024;
};

const calc = (d) => {
    let res;

    res = ruleZero(d);
    if (res) {
        return res;
    }

    res = ruleEven(d);
    if (res) {
        return res;
    }

    res = rule2024(d);
    return res;
};

const cache = new Map();
const calcInNStep = (num, step) => {
    if (step === 0) return 1;
    const cacheKey = `${num}-${step}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }
    const newNums = [calc(num)].flat();
    let res = 0;
    newNums.forEach((n) => {
        const r = calcInNStep(n, step - 1);
        res += r;
    });
    cache.set(cacheKey, res);
    return res;
};

const blink = (data) => {
    return data.map(calc).flat();
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < 25; i++) {
        data = blink(data);
    }
    return data.length;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let res = 0;
    data.forEach((n) => {
        const r = calcInNStep(n, 75);
        res += r;
    });
    return res;
};

const inputs = ["sample_0.txt"];
// inputs.push("sample_1.txt");
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
