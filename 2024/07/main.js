const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [result, numPart] = d.split(": ");
            const numbers = numPart.split(" ").map(Number);
            return { result: Number(result), numbers };
        });
    // console.log(data);
    return data;
};

const calc = (res, prev, remain) => {
    if (remain.length === 0) {
        return prev === res;
    }
    const rem = [...remain];
    const curr = rem.shift();
    const res1 = calc(res, prev + curr, rem);
    if (res1) return res1;
    const res2 = calc(res, prev * curr, rem);
    if (res2) return res2;
    return false;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let sum = 0;
    data.forEach((d) => {
        const rem = [...d.numbers];
        const curr = rem.shift();
        const valid = calc(d.result, curr, rem);
        if (valid) {
            sum += d.result;
        }
    });
    return sum;
};

const calc2 = (res, prev, remain) => {
    if (remain.length === 0) {
        return prev === res;
    }
    const rem = [...remain];
    const curr = rem.shift();
    const res1 = calc2(res, prev + curr, rem);
    if (res1) return res1;
    const res2 = calc2(res, prev * curr, rem);
    if (res2) return res2;
    const res3 = calc2(res, Number("" + prev + curr), rem);
    if (res3) return res3;
    return false;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let sum = 0;
    data.forEach((d) => {
        const rem = [...d.numbers];
        const curr = rem.shift();
        const valid = calc2(d.result, curr, rem);
        if (valid) {
            sum += d.result;
        }
    });
    return sum;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
