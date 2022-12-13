const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return eval(d);
        });
    // const pairs = [];
    // for (let i = 0; i < data.length; i += 3) {
    //     pairs.push({ a: data[i], b: data[i + 1] });
    // }
    // console.log(pairs);
    return data;
};

const compareArray = (a, b) => {
    const min = Math.min(a.length, b.length);
    for (let i = 0; i < min; i++) {
        let aa = a[i];
        let bb = b[i];
        if (!(Number.isInteger(aa) && Number.isInteger(bb))) {
            if (Number.isInteger(aa)) aa = [aa];
            if (Number.isInteger(bb)) bb = [bb];
            const eq = compareArray(aa, bb);
            if (eq != 0) {
                return eq;
            }
        } else {
            const eq = aa - bb;
            if (eq != 0) {
                return eq;
            }
        }
    }
    return a.length - b.length;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const pairs = [];
    for (let i = 0; i < data.length; i += 3) {
        pairs.push({ a: data[i], b: data[i + 1] });
    }

    let sum = 0;
    pairs.forEach((d, idx) => {
        const res = compareArray(d.a, d.b);
        if (res < 0) {
            sum += idx + 1;
        }
    });
    return sum;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data)).filter((d) => d != null);
    data.push([[2]]);
    data.push([[6]]);
    const sorted = data.sort((a, b) => compareArray(a, b));
    let a = undefined;
    let b = undefined;
    sorted.forEach((d, idx) => {
        if (JSON.stringify(d) === "[[2]]") a = idx + 1;
        if (JSON.stringify(d) === "[[6]]") b = idx + 1;
    });
    return a * b;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
