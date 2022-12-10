const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [a, b] = d.split(" ");
            if (b) return [a, Number(b)];
            return [a];
        });
    // console.log(data);
    return data;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let X = 1;
    let remainCycle = undefined;
    let currentCycle = 1;
    let i = 0;
    let sum = 0;
    while (currentCycle <= 220) {
        switch (data[i][0]) {
            case "noop":
                remainCycle = 1;
                break;
            case "addx":
                remainCycle = 2;
                break;
        }
        while (remainCycle > 0) {
            if ((currentCycle - 20) % 40 == 0) {
                sum += currentCycle * X;
            }
            remainCycle--;
            currentCycle++;
        }
        switch (data[i][0]) {
            case "noop":
                break;
            case "addx":
                X += data[i][1];
                break;
        }
        i++;
        if (i >= data.length) i = 0;
    }
    return sum;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));

    let X = 0;
    let remainCycle = undefined;
    let currentCycle = 0;
    let i = 0;
    let image = [[], [], [], [], [], [], []];
    while (currentCycle <= 240) {
        switch (data[i][0]) {
            case "noop":
                remainCycle = 1;
                break;
            case "addx":
                remainCycle = 2;
                break;
        }
        while (remainCycle > 0) {
            const col = currentCycle % 40;
            const row = image[Math.floor(currentCycle / 40)];
            if (col < X || col > X + 2) {
                row.push(" ");
            } else {
                row.push("█");
            }
            remainCycle--;
            currentCycle++;
        }
        switch (data[i][0]) {
            case "noop":
                break;
            case "addx":
                X += data[i][1];
                break;
        }
        i++;
        if (i >= data.length) i = 0;
    }
    return "\n" + image.map((i) => i.join("")).join("\n");
};

const inputs = [
    // "sample_0.txt",
    "sample_1.txt",
];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
