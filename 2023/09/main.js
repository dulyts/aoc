const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split(" ").map(Number);
        });
    // console.log(data);
    return data;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const res = data.map((d) => {
        const diffs = [d];
        let isEnd = false;
        while (!isEnd) {
            const newDiff = [];
            const lastDiff = diffs.length - 1;
            for (let i = 1; i < diffs[lastDiff].length; i++) {
                newDiff.push(diffs[lastDiff][i] - diffs[lastDiff][i - 1]);
            }
            diffs.push(newDiff);
            isEnd = true;
            newDiff.forEach((dd) => {
                isEnd &= dd == 0;
            });
        }
        for (let i = diffs.length - 2; i >= 0; i--) {
            diffs[i].push(diffs[i + 1].at(-1) + diffs[i].at(-1));
        }
        const val = diffs[0].at(-1);
        return val;
    });
    return res.reduce((p, c) => p + c, 0);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const res = data.map((d) => {
        const diffs = [d];
        let isEnd = false;
        while (!isEnd) {
            const newDiff = [];
            const lastDiff = diffs.length - 1;
            for (let i = 1; i < diffs[lastDiff].length; i++) {
                newDiff.push(diffs[lastDiff][i] - diffs[lastDiff][i - 1]);
            }
            diffs.push(newDiff);
            isEnd = true;
            newDiff.forEach((dd) => {
                isEnd &= dd == 0;
            });
        }
        for (let i = diffs.length - 2; i >= 0; i--) {
            diffs[i].unshift(diffs[i].at(0) - diffs[i + 1].at(0));
        }
        const val = diffs[0].at(0);
        return val;
    });
    return res.reduce((p, c) => p + c, 0);
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
