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
    data.forEach((m) => {
        for (let i = 0; i < m[1]; i++) {
            const newRope = [];
            for (let j = 0; j < 10; j++) {
                if (j == 0) {
                    newRope.push(move(rope[0], m[0]));
                } else {
                    newRope.push(moveTail(newRope[j - 1], rope[j]));
                }
            }
            rope = newRope;
            visitedCoords.add(toCoordStr(rope[9]));
        }
    });
    return visitedCoords.size;
};

const inputs = ["sample_0.txt", "sample_1.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
