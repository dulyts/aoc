const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    // console.log(data);
    return data;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data)).map((d) =>
        d.trim().replace(/ +/g, " ").split(" ")
    );
    const maths = [];
    for (let i = 0; i < data[0].length; i++) {
        const numbers = [];
        for (let j = 0; j < data.length - 1; j++) {
            numbers.push(Number(data[j][i]));
        }
        maths.push({ numbers, op: data[data.length - 1][i] });
    }
    return maths.reduce((prev, curr) => {
        return prev + eval(curr.numbers.join(curr.op));
    }, 0);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data)).map((d) => d.split(""));
    let sum = 0;
    let part = [];
    for (let j = data[0].length - 1; j >= 0; j--) {
        const op = data[data.length - 1][j];
        const numbers = [];
        for (let i = 0; i < data.length - 1; i++) {
            if (data[i][j] != " ") {
                numbers.push(data[i][j]);
            }
        }
        part.push(Number(numbers.join("")));
        if (op != " ") {
            sum += eval(part.join(op));
            part = [];
            j--;
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
