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

const firstXUNique = (chs, n) => {
    for (let i = 0; i < chs.length - n; i++) {
        const set = new Set();
        for (let j = 0; j < n; j++) {
            set.add(chs[i + j]);
        }
        if (set.size === n) return i + n;
    }
    return null;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const chs = data[0].split("");
    return firstXUNique(chs, 4);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const chs = data[0].split("");
    return firstXUNique(chs, 14);
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
