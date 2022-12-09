const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [a, b] = d.split(" ");
            return [a, Number(b)];
        });
    // console.log(data);
    return data;
};

const move = (currentCoord, move) => {
    const [x, y] = currentCoord;
    switch (move) {
        case "R":
            return [x + 1, y];
        case "L":
            return [x - 1, y];
        case "U":
            return [x, y + 1];
        case "D":
            return [x, y - 1];
    }
};
const toCoordStr = (coord) => `${coord[0]}-${coord[1]}`;
const moveTail = (headCoord, tailCoord) => {
    const [hx, hy] = headCoord;
    const [tx, ty] = tailCoord;
    if (!(Math.abs(tx - hx) > 1 || Math.abs(ty - hy) > 1)) {
        return tailCoord;
    }
    let xx = hx - tx;
    if (xx > 1) xx -= 1;
    else if (xx < -1) xx += 1;
    let yy = hy - ty;
    if (yy > 1) yy -= 1;
    else if (yy < -1) yy += 1;
    return [tx + xx, ty + yy];
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let headCoord = [0, 0];
    let tailCoord = [0, 0];
    const visitedCoords = new Set();
    visitedCoords.add(toCoordStr(tailCoord));
    data.forEach((m) => {
        for (let i = 0; i < m[1]; i++) {
            headCoord = move(headCoord, m[0]);
            tailCoord = moveTail(headCoord, tailCoord);
            visitedCoords.add(toCoordStr(tailCoord));
        }
    });
    return visitedCoords.size;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let rope = Array(10)
        .fill(0)
        .map((d) => [0, 0]);
    const visitedCoords = new Set();
    visitedCoords.add(toCoordStr(rope[9]));
    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;
    data.forEach((m) => {
        for (let i = 0; i < m[1]; i++) {
            const newRope = [];
            for (let j = 0; j < 10; j++) {
                if (j == 0) {
                    const asd = move(rope[0], m[0]);
                    minX = Math.min(minX, asd[0]);
                    minY = Math.min(minY, asd[1]);
                    maxX = Math.max(maxX, asd[0]);
                    maxY = Math.max(maxY, asd[1]);
                    newRope.push(asd);
                } else {
                    const asd = moveTail(newRope[j - 1], rope[j]);
                    minX = Math.min(minX, asd[0]);
                    minY = Math.min(minY, asd[1]);
                    maxX = Math.max(maxX, asd[0]);
                    maxY = Math.max(maxY, asd[1]);
                    newRope.push(asd);
                }
            }
            rope = newRope;
            visitedCoords.add(toCoordStr(rope[9]));
        }
    });
    rope = Array(10)
        .fill(0)
        .map((d) => [0, 0]);
    console.log(minX, minY, maxX, maxY);
    const N = Math.abs(minX) + Math.abs(maxX);
    const M = Math.abs(minY) + Math.abs(maxY);
    console.log(N, M);
    data.forEach((m) => {
        for (let i = 0; i < m[1]; i++) {
            const matrix = new Array(N + 1)
                .fill(0)
                .map(() => new Array(M + 1).fill(" "));
            const newRope = [];
            for (let j = 0; j < 10; j++) {
                if (j == 0) {
                    const asd = move(rope[0], m[0]);
                    newRope.push(asd);
                } else {
                    const asd = moveTail(newRope[j - 1], rope[j]);
                    newRope.push(asd);
                }
            }
            rope = newRope;
            newRope.forEach((r) => {
                matrix[r[0] + Math.abs(minX)][r[1] + Math.abs(minY)] = "#";
            });
            console.clear();
            for (let i = 0; i < N + 1; i++) {
                console.log(matrix[i].join(""));
            }
        }
    });
    return visitedCoords.size;
};

const inputs = ["sample_0.txt", "sample_1.txt"];
// inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
