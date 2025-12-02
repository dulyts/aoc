const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .flatMap((d) => {
            return d.split(",");
        })
        .map((d) => {
            return d.split("-").map(Number);
        });
    // console.log(data);
    return data;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const validIds = [];
    data.forEach((d) => {
        for (let i = d[0]; i <= d[1]; i++) {
            const str = i.toString();
            if (str.length % 2 != 0) {
                continue;
            }
            const a = str.substring(0, str.length / 2);
            const b = str.substring(str.length / 2, str.length);
            if (a == b) {
                validIds.push(i);
            }
        }
    });
    return validIds.reduce((prev, curr) => prev + curr, 0);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const validIds = [];
    data.forEach((d) => {
        const used = new Set();
        for (let i = d[0]; i <= d[1]; i++) {
            const str = i.toString();
            for (let j = 1; j <= str.length / 2; j++) {
                const pattern = str.substring(0, j);
                let alt = "";
                while (alt.length < str.length) {
                    alt += pattern;
                }
                if (str == alt) {
                    if (!used.has(i)) {
                        validIds.push(i);
                        used.add(i);
                    }
                }
            }
        }
    });
    return validIds.reduce((prev, curr) => prev + curr, 0);
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
