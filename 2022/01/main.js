const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });

    const groups = [];
    let current = [];
    data.forEach((d) => {
        if (d == "") {
            groups.push(current);
            current = [];
            return;
        }
        current.push(Number(d));
    });
    groups.push(current);

    return groups;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));

    const sums = data.map((d) => d.reduce((sum, a) => sum + a, 0));
    return Math.max(...sums);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));

    const sums = data
        .map((d) => d.reduce((sum, a) => sum + a, 0))
        .sort((a, b) => b - a);
    return sums[0] + sums[1] + sums[2];
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
