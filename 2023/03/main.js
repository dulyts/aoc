const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("");
        });
    const numbers = [];
    data.forEach((d, y) => {
        let i = 0;
        while (i < d.length) {
            if (!isNaN(d[i])) {
                const nums = [Number(d[i])];
                let x = i;
                let j = i + 1;
                while (!isNaN(d[j])) {
                    nums.push(Number(d[j]));
                    j++;
                }
                numbers.push({ num: Number(nums.join("")), y, x });
                i = j;
            } else {
                i++;
            }
        }
    });
    return {
        map: data.map((row) => {
            return row.map((d) => {
                if (!isNaN(d) || d == ".") {
                    return undefined;
                }
                return d;
            });
        }),
        numbers,
    };
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const N = data.map.length;
    const M = data.map[0].length;
    const goodNumbers = data.numbers.map(({ num, x, y }) => {
        const len = num.toString().length;
        let i1 = Math.max(0, y - 1);
        let i2 = Math.min(N - 1, y + 1);
        let j1 = Math.max(0, x - 1);
        let j2 = Math.min(M - 1, x + len);
        for (let i = i1; i <= i2; i++) {
            for (let j = j1; j <= j2; j++) {
                if (data.map[i][j]) {
                    return num;
                }
            }
        }
    });
    return goodNumbers.filter(Number).reduce((prev, curr) => prev + curr, 0);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const N = data.map.length;
    const M = data.map[0].length;
    const gears = {}; // key: "y|x", val: {"number": true}
    data.numbers.forEach(({ num, x, y }) => {
        const len = num.toString().length;
        let i1 = Math.max(0, y - 1);
        let i2 = Math.min(N - 1, y + 1);
        let j1 = Math.max(0, x - 1);
        let j2 = Math.min(M - 1, x + len);
        for (let i = i1; i <= i2; i++) {
            for (let j = j1; j <= j2; j++) {
                if (data.map[i][j] == "*") {
                    if (!gears[`${i}|${j}`]) {
                        gears[`${i}|${j}`] = {};
                    }
                    gears[`${i}|${j}`][num] = true;
                }
            }
        }
    });
    const gearRatios = Object.keys(gears).map((g) => {
        const gearParts = Object.keys(gears[g]);
        if (gearParts.length == 2) {
            return gearParts.reduce((prev, curr) => prev * Number(curr), 1);
        }
        return 0;
    });
    return gearRatios.reduce((prev, curr) => prev + curr, 0);
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
