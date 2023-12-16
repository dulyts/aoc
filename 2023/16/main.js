const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("");
        });
    // console.log(data);
    return data;
};

const move = (dirs, { x, y }) => {
    return dirs.map((dir) => {
        switch (dir) {
            case "L":
                return { x, y: y - 1, dir };
            case "R":
                return { x, y: y + 1, dir };
            case "U":
                return { x: x - 1, y, dir };
            case "D":
                return { x: x + 1, y, dir };
            default:
                console.error("Should not!");
        }
    });
};

const getNextNodes = (data, curr) => {
    const N = data.length;
    const M = data[0].length;
    if (curr.x < 0 || curr.y < 0 || curr.x >= N || curr.y >= M) {
        return [];
    }
    const cm = data[curr.x][curr.y];
    const nextDirs = getNextDirs(cm, curr.dir);
    return move(nextDirs, curr);
};

const getNextDirs = (cm, dir) => {
    if (cm == ".") return [dir];
    if (cm == "-" && (dir == "L" || dir == "R")) return [dir];
    if (cm == "-" && !(dir == "L" || dir == "R")) return ["L", "R"];
    if (cm == "|" && (dir == "U" || dir == "D")) return [dir];
    if (cm == "|" && !(dir == "U" || dir == "D")) return ["U", "D"];

    if (cm == "\\" && dir == "R") return ["D"];
    if (cm == "\\" && dir == "L") return ["U"];
    if (cm == "\\" && dir == "U") return ["L"];
    if (cm == "\\" && dir == "D") return ["R"];

    if (cm == "/" && dir == "R") return ["U"];
    if (cm == "/" && dir == "L") return ["D"];
    if (cm == "/" && dir == "U") return ["R"];
    if (cm == "/" && dir == "D") return ["L"];
};

const hash = ({ x, y, dir }) => `${x}|${y}|${dir}`;

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const N = data.length;
    const M = data[0].length;
    const visited = new Set();
    const remain = [{ x: 0, y: 0, dir: "R" }];

    while (remain.length > 0) {
        const curr = remain.shift();
        if (visited.has(hash(curr))) {
            continue;
        }
        visited.add(hash(curr));
        remain.push(...getNextNodes(data, curr));
    }
    const visitedCoords = new Set();
    visited.forEach((v) => {
        const [x, y] = v.split("|");
        if (x < 0 || y < 0 || x >= N || y >= M) {
            return;
        }
        visitedCoords.add(`${x}|${y}`);
    });
    return visitedCoords.size;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const N = data.length;
    const M = data[0].length;
    let max = 0;
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            const starts = [];
            if (i == 0) starts.push({ x: i, y: j, dir: "D" });
            if (i == N - 1) starts.push({ x: i, y: j, dir: "U" });
            if (j == 0) starts.push({ x: i, y: j, dir: "R" });
            if (j == M - 1) starts.push({ x: i, y: j, dir: "L" });
            if (starts.length == 0) continue;

            starts.forEach((s) => {
                const visited = new Set();
                const remain = [s];

                while (remain.length > 0) {
                    const curr = remain.shift();
                    if (visited.has(hash(curr))) {
                        continue;
                    }
                    visited.add(hash(curr));
                    remain.push(...getNextNodes(data, curr));
                }
                const visitedCoords = new Set();
                visited.forEach((v) => {
                    const [x, y] = v.split("|");
                    if (x < 0 || y < 0 || x >= N || y >= M) {
                        return;
                    }
                    visitedCoords.add(`${x}|${y}`);
                });
                max = Math.max(max, visitedCoords.size);
            });
        }
    }

    return max;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
