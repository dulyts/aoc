const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split(",");
        });
    // console.log(data);
    return data[0];
};

const getHash = (str) => {
    let val = 0;
    str.split("").forEach((c) => {
        val += c.charCodeAt(0);
        val *= 17;
        val %= 256;
    });
    return val;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    return data.map(getHash).reduce((p, c) => p + c, 0);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const boxes = {};
    data.forEach((d) => {
        const opIdx = d.split("").findIndex((c) => ["=", "-"].includes(c));
        const op = d[opIdx];
        const label = d.substring(0, opIdx);

        const hash = getHash(label);
        if (!boxes[hash]) {
            boxes[hash] = [];
        }

        if (op == "=") {
            const focalLength = d.substring(opIdx + 1);
            const inBoxIdx = boxes[hash].findIndex(
                (lens) => lens.label == label
            );
            if (inBoxIdx != -1) {
                boxes[hash][inBoxIdx].focalLength = focalLength;
            } else {
                boxes[hash].push({ label, focalLength });
            }
        }
        if (op == "-") {
            const inBoxIdx = boxes[hash].findIndex(
                (lens) => lens.label == label
            );
            if (inBoxIdx != -1) {
                boxes[hash].splice(inBoxIdx, 1);
            }
        }
    });
    return Object.keys(boxes)
        .map((b) => {
            const boxNumber = Number(b);
            return boxes[b]
                .map((bb, idx) => {
                    const power = (boxNumber + 1) * (idx + 1) * bb.focalLength;
                    return power;
                })
                .reduce((p, c) => p + c, 0);
        })
        .reduce((p, c) => p + c, 0);
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
