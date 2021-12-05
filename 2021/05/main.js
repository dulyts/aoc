const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split("\n")
        .slice(0, -1)
        .map((d) => {
            const [from, to] = d.split(" -> ");
            const [x1, y1] = from.split(",");
            const [x2, y2] = to.split(",");
            return {
                x1: Number(x1),
                y1: Number(y1),
                x2: Number(x2),
                y2: Number(y2),
            };
        });
    let maxX = 0;
    let maxY = 0;
    data.forEach((d) => {
        maxX = Math.max(maxX, d.x1, d.x2);
        maxY = Math.max(maxY, d.y1, d.y2);
    });
    // data["maxX"] = maxX;
    // data["maxY"] = maxY;
    // console.log(data);
    return {
        maxX,
        maxY,
        data: data,
    };
};

const countOverlaps = (grid) => {
    let overlaps = 0;
    for (let i = 0; i < data.maxY + 1; i++) {
        for (let j = 0; j < data.maxX + 1; j++) {
            if (grid[i][j] >= 2) {
                overlaps += 1;
            }
        }
    }
    return overlaps;
};

const part1 = (data) => {
    const grid = [...Array(data.maxY + 1)].map((e) =>
        Array(data.maxX + 1).fill(0)
    );
    data.data.forEach((d, ii) => {
        if (d.x1 === d.x2) {
            const a = Math.min(d.y1, d.y2);
            const b = Math.max(d.y1, d.y2);
            for (let i = a; i <= b; i++) {
                grid[i][d.x1] += 1;
            }
        } else if (d.y1 === d.y2) {
            const a = Math.min(d.x1, d.x2);
            const b = Math.max(d.x1, d.x2);
            for (let i = a; i <= b; i++) {
                grid[d.y1][i] += 1;
            }
        }
    });
    return countOverlaps(grid);
};
const part2 = (data) => {
    const grid = [...Array(data.maxY + 1)].map((e) =>
        Array(data.maxX + 1).fill(0)
    );
    data.data.forEach((d, ii) => {
        if (d.x1 === d.x2 || d.y1 === d.y2) {
            if (d.x1 === d.x2) {
                const a = Math.min(d.y1, d.y2);
                const b = Math.max(d.y1, d.y2);
                for (let i = a; i <= b; i++) {
                    grid[i][d.x1] += 1;
                }
            } else if (d.y1 === d.y2) {
                const a = Math.min(d.x1, d.x2);
                const b = Math.max(d.x1, d.x2);
                for (let i = a; i <= b; i++) {
                    grid[d.y1][i] += 1;
                }
            }
        } else {
            const minX = Math.min(d.x1, d.x2);
            const maxX = Math.max(d.x1, d.x2);

            let i = d.y1;
            let j = d.x1;
            for (let k = 0; k <= maxX - minX; k++) {
                grid[i][j] += 1;
                j += Math.sign(d.x2-d.x1);
                i += Math.sign(d.y2-d.y1);
            }
        }
    });
    return countOverlaps(grid);
};

// const filename = "sample_0.txt";
const filename = "input.txt";
const data = loadData(filename);
console.log("part1", part1(data));
console.log("part2", part2(data));
