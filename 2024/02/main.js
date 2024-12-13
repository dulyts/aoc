const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split(" ").map(Number);
        });
    console.log(data);
    return data;
};

const isSafe = (d) => {
    if (d[0] == d[1]) return false;
    let inc = d[0] < d[1];
    let dec = d[0] > d[1];
    let safe = true;
    for (let i = 1; i < d.length; i++) {
        if (inc) {
            safe =
                d[i - 1] < d[i] && d[i] - d[i - 1] <= 3 && d[i] - d[i - 1] >= 1;
        }
        if (dec) {
            safe =
                d[i - 1] > d[i] &&
                d[i] - d[i - 1] >= -3 &&
                d[i] - d[i - 1] <= -1;
        }
        if (!safe) return false;
    }
    return true;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let safeCount = 0;
    data.forEach((d) => {
        console.log(isSafe(d));
        safeCount += isSafe(d) ? 1 : 0;
    });
    return safeCount;
};

const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let safeCount = 0;
    data.forEach((d) => {
        let safe = isSafe(d);
        let idx = 0;
        while (!safe && idx < d.length) {
            const dd = [...d];
            dd.splice(idx, 1);
            safe = isSafe(dd);
            idx++;
        }
        safeCount += safe ? 1 : 0;
    });
    return safeCount;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
