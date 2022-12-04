const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const pair = d.split(",");
            const p1 = pair[0].split("-").map((p) => Number(p));
            const p2 = pair[1].split("-").map((p) => Number(p));
            return [p1, p2];
        });
    // console.log(data);
    return data;
};

const isFullyOverlap = (p1, p2) => {
    if (p1[0] <= p2[0] && p1[1] >= p2[1]) return true;
    if (p2[0] <= p1[0] && p2[1] >= p1[1]) return true;
    return false;
};
const isOverlap = (p1, p2) => {
    if (p1[0] <= p2[1] && p1[1] >= p2[0]) return true;
    if (p2[0] <= p1[1] && p2[1] >= p1[0]) return true;
    return false;
}

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let fullyContainedCount = 0;
    data.forEach((d) => {
        if (isFullyOverlap(d[0], d[1])) {
            fullyContainedCount++;
        }
    });
    return fullyContainedCount;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let fullyContainedCount = 0;
    data.forEach((d) => {
        if (isOverlap(d[0], d[1])) {
            fullyContainedCount++;
        }
    });
    return fullyContainedCount;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
