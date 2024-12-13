const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("").map(Number);
        });
    // console.log(data);
    const starts = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] === 0) starts.push({ x: i, y: j });
        }
    }
    return { map: data, starts };
};

const inRange = ({ x, y }, N, M) => {
    return !(x < 0 || x >= N || y < 0 || y >= M);
};
const canMove = (map, coord, currHeight, N, M) => {
    const { x, y } = coord;
    return inRange(coord, N, M) && map[x][y] == currHeight + 1;
};

const move = (map, curr, visited, ends) => {
    if (visited.has(JSON.stringify(curr))) {
        return 0;
    }
    const N = map.length;
    const M = map[0].length;

    const h = map[curr.x][curr.y];
    if (h == 9) {
        ends.push(JSON.stringify(curr));
        return 1;
    }
    visited.add(JSON.stringify(curr));

    let res = 0;

    const leftCoord = { x: curr.x, y: curr.y - 1 };
    if (canMove(map, leftCoord, h, N, M)) {
        res += move(map, leftCoord, visited, ends);
    }

    const rightCoord = { x: curr.x, y: curr.y + 1 };
    if (canMove(map, rightCoord, h, N, M)) {
        res += move(map, rightCoord, visited, ends);
    }

    const upCoord = { x: curr.x - 1, y: curr.y };
    if (canMove(map, upCoord, h, N, M)) {
        res += move(map, upCoord, visited, ends);
    }

    const downCoord = { x: curr.x + 1, y: curr.y };
    if (canMove(map, downCoord, h, N, M)) {
        res += move(map, downCoord, visited, ends);
    }

    visited.delete(JSON.stringify(curr));
    return res;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let res = 0;
    data.starts.forEach((s) => {
        const visited = new Set();
        const ends = [];
        move(data.map, s, visited, ends);
        ends.filter(
            (value, index, array) => array.indexOf(value) === index
        ).forEach((d) => res++);
    });
    return res;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let res = 0;
    data.starts.forEach((s) => {
        const visited = new Set();
        const ends = [];
        res += move(data.map, s, visited, ends);
    });
    return res;
};

const inputs = ["sample_0.txt"];
// inputs.push("sample_1.txt");
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
