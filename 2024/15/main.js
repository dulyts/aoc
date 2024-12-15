const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("");
        });
    let map = [];
    let steps = [];
    let i = 0;
    while (data[i] != "") {
        map.push(data[i]);
        i++;
    }
    i++;
    while (i < data.length) {
        steps.push(...data[i]);
        i++;
    }
    let robot;
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] === "@") {
                robot = { x: i, y: j };
                map[i][j] = ".";
            }
        }
    }
    const d = { map, steps, robot };
    // console.log(d);
    return d;
};

const getDir = (step) => {
    switch (step) {
        case "<":
            return { x: 0, y: -1 };
        case ">":
            return { x: 0, y: +1 };
        case "^":
            return { x: -1, y: 0 };
        case "v":
            return { x: +1, y: 0 };
    }
};

const getDist = (a, b) => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

const moveRobot = (map, currPos, step) => {
    const dir = getDir(step);
    let end = { x: currPos.x + dir.x, y: currPos.y + dir.y };
    while (![".", "#"].includes(map[end.x][end.y])) {
        end = { x: end.x + dir.x, y: end.y + dir.y };
    }
    if (map[end.x][end.y] === "#") {
        return currPos;
    }
    if (getDist(currPos, end) == 1) {
        return end;
    }
    while (getDist(currPos, end) > 1) {
        map[end.x][end.y] = map[end.x - dir.x][end.y - dir.y];
        map[end.x - dir.x][end.y - dir.y] = ".";
        end = { x: end.x - dir.x, y: end.y - dir.y };
    }
    return { x: currPos.x + dir.x, y: currPos.y + dir.y };
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let robotPos = data.robot;

    data.steps.forEach((step) => {
        robotPos = moveRobot(data.map, robotPos, step);
    });

    let res = 0;
    data.map.forEach((row, x) => {
        row.forEach((c, y) => {
            if (c === "O") {
                res += x * 100 + y;
            }
        });
    });
    return res;
};

const canMove = (map, currPos, step) => {
    const { x, y } = currPos;
    if (map[x][y] == "#") return false;
    if (map[x][y] == ".") return true;
    const other = map[x][y] == "[" ? 1 : -1;
    let flag = true;
    const dir = getDir(step);
    flag = flag && canMove(map, { x: x + dir.x, y: y + dir.y }, step);
    flag = flag && canMove(map, { x: x + dir.x, y: y + dir.y + other }, step);
    return flag;
};
const move = (map, currPos, step) => {
    const { x, y } = currPos;
    if (map[x][y] == ".") return;
    const dir = getDir(step);
    const other = map[x][y] == "[" ? 1 : -1;
    move(map, { x: x + dir.x, y: y + dir.y }, step);
    move(map, { x: x + dir.x, y: y + dir.y + other }, step);
    map[x + dir.x][y + dir.y] = map[x][y];
    map[x + dir.x][y + dir.y + other] = map[x][y + other];
    map[x][y] = ".";
    map[x][y + other] = ".";
};
const moveRobot2 = (map, currPos, step) => {
    if (["<", ">"].includes(step)) {
        const dir = getDir(step);
        let end = { x: currPos.x + dir.x, y: currPos.y + dir.y };
        while (![".", "#"].includes(map[end.x][end.y])) {
            end = { x: end.x + dir.x, y: end.y + dir.y };
        }
        if (map[end.x][end.y] === "#") {
            return currPos;
        }
        if (getDist(currPos, end) == 1) {
            return end;
        }
        while (getDist(currPos, end) > 1) {
            map[end.x][end.y] = map[end.x - dir.x][end.y - dir.y];
            map[end.x - dir.x][end.y - dir.y] = ".";
            end = { x: end.x - dir.x, y: end.y - dir.y };
        }
        return { x: currPos.x + dir.x, y: currPos.y + dir.y };
    } else {
        const dir = getDir(step);
        const nextPos = { x: currPos.x + dir.x, y: currPos.y + dir.y };
        const hasSpace = canMove(map, nextPos, step);
        if (!hasSpace) {
            return currPos;
        }
        move(map, nextPos, step);
        return nextPos;
    }
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const newMap = [];
    data.map.forEach((row, x) => {
        const newRow = [];
        row.forEach((c, y) => {
            if (c === "O") {
                newRow.push("[", "]");
                return;
            }
            newRow.push(c, c);
        });
        newMap.push(newRow);
    });
    let robotPos = { x: data.robot.x, y: data.robot.y * 2 };
    data.steps.forEach((step) => {
        robotPos = moveRobot2(newMap, robotPos, step);
    });
    let res = 0;
    newMap.forEach((row, x) => {
        row.forEach((c, y) => {
            if (c === "[") {
                res += x * 100 + y;
            }
        });
    });
    return res;
};

const inputs = [];
inputs.push("sample_0.txt");
inputs.push("sample_1.txt");
inputs.push("sample_2.txt");
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
