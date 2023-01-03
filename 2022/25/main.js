const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("").reverse();
        });
    // console.log(data);
    return data;
};

const MAPPER = {
    2: 2,
    1: 1,
    0: 0,
    "-": -1,
    "=": -2,
};
const MAPPER_BACK = {
    2: 2,
    1: 1,
    0: 0,
    "-1": "-",
    "-2": "=",
};

const convertNumber = (digits) => {
    const result = digits.reduce((prev, curr, idx) => {
        return prev + Math.pow(5, idx) * MAPPER[curr];
    }, 0);
    // console.log(digits.reverse().join(""), result);
    return result;
};

const mod = (number, div) => {
    const d = Math.round(number / div);
    const dd = div * d;
    const r = dd - number;
    return { num: d, remind: r == 0 ? r : -1 * r };
};

const convertBack = (number) => {
    const digits = [];
    while (number != 0) {
        const asd = mod(number, 5);
        // console.log(asd);
        number = asd.num;
        digits.push(MAPPER_BACK[asd.remind]);
    }
    return digits.reverse().join("");
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const sum = data.reduce((prev, curr) => prev + convertNumber(curr), 0);
    return convertBack(sum);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    return null;
};

const inputs = ["sample_0.txt", "sample_1.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
