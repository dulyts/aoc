const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const dir = d.substring(0, 1);
            const val = Number(d.substring(1, d.length));
            return { dir, val };
        });
    // console.log(data);
    return data;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let curr = 50;
    let countZero = 0;
    data.forEach(({ dir, val }) => {
        curr += (dir === "R" ? 1 : -1) * val;
        while (curr < 0) curr = 100 + curr;
        while (curr > 99) curr -= 100;
        if (curr == 0) {
            countZero++;
        }
    });
    return countZero;
};
const mod = (n, m) => {
    return ((n % m) + m) % m;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let curr = 50;
    let countZero = 0;
    data.forEach(({ dir, val }) => {
        const orig = curr;
        curr += (dir === "R" ? 1 : -1) * val;

        if (orig == 0 && dir == "L") {
            countZero--;
        }
        while (curr < 0) {
            curr += 100;
            countZero++;
        }
        if (curr < 0 || curr > 99) {
            countZero += Math.abs(Math.trunc(curr / 100));
            curr = mod(curr, 100);
        } else {
            curr = mod(curr, 100);
            if (curr == 0) {
                countZero++;
            }
        }
    });
    return countZero;
};

const inputs = [];
inputs.push("sample_0.txt");
// inputs.push("sample_1.txt");
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
