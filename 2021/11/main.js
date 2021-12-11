const fs = require("fs");
const path = require("path");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("").map(Number);
        });
    // console.log(data)
    return data;
};

const flashOcto = (data, needToFlash, [i, j], flashedInStep) => {
    for (let ii = i - 1; ii <= i + 1; ii++) {
        for (let jj = j - 1; jj <= j + 1; jj++) {
            if (flashedInStep.has(`${ii}_${jj}`)) {
                continue;
            }
            if (
                ii >= 0 &&
                ii < data.length &&
                jj >= 0 &&
                jj < data[ii].length
            ) {
                data[ii][jj] += 1;
                if (data[ii][jj] > 9) {
                    needToFlash.push([ii, jj]);
                }
            }
        }
    }
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let flashCount = 0;
    for (let step = 0; step < 100; step++) {
        const flashedInStep = new Set();
        const needToFlash = [];

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                data[i][j] += 1;
                if (data[i][j] > 9) {
                    needToFlash.push([i, j]);
                }
            }
        }
        while (needToFlash.length > 0) {
            const coord = needToFlash.pop();
            if (flashedInStep.has(`${coord[0]}_${coord[1]}`)) {
                continue;
            }
            flashedInStep.add(`${coord[0]}_${coord[1]}`);
            flashOcto(data, needToFlash, coord, flashedInStep);
            flashCount += 1;
        }

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] > 9) {
                    data[i][j] = 0;
                }
            }
        }

    }
    return flashCount;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let sync = false;
    let step = 0;
    while (!sync) {
        const flashedInStep = new Set();
        const needToFlash = [];

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                data[i][j] += 1;
                if (data[i][j] > 9) {
                    needToFlash.push([i, j]);
                }
            }
        }
        while (needToFlash.length > 0) {
            const coord = needToFlash.pop();
            if (flashedInStep.has(`${coord[0]}_${coord[1]}`)) {
                continue;
            }
            flashedInStep.add(`${coord[0]}_${coord[1]}`);
            flashOcto(data, needToFlash, coord, flashedInStep);
        }

        sync = true;
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] > 9) {
                    data[i][j] = 0;
                }
                sync = sync && data[i][j] == 0;
            }
        }

        step += 1;
    }
    return step;
};

const inputs = ["sample_0.txt", "sample_1.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
