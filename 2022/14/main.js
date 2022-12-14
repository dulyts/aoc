const fs = require("fs");

const loadData = (filename) => {
    let maxX = 0;
    let maxY = 0;
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d
                .split(" -> ")
                .map((dd) => dd.split(","))
                .map((dd) => {
                    const [x, y] = dd;
                    const res = { x: Number(x), y: Number(y) };
                    maxX = Math.max(maxX, res.x);
                    maxY = Math.max(maxY, res.y);
                    return res;
                });
        });
    return { maxX, maxY, wallList: data };
};

const createMap = (data) => {
    const map = new Set();
    data.wallList.forEach((walls) => {
        for (let i = 0; i < walls.length - 1; i++) {
            const from = walls[i];
            const to = walls[i + 1];
            const minX = Math.min(from.x, to.x);
            const maxX = Math.max(from.x, to.x);
            const minY = Math.min(from.y, to.y);
            const maxY = Math.max(from.y, to.y);
            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    map.add(toCoordStr(x, y));
                }
            }
        }
    });
    return { map, maxX: data.maxX, maxY: data.maxY };
};

const toCoordStr = (x, y) => `${x}-${y}`;

const fallSand = (currentPos, mapData) => {
    while (true) {
        if (currentPos.y > mapData.maxY) return false;
        if (!mapData.map.has(toCoordStr(currentPos.x, currentPos.y + 1))) {
            currentPos = { x: currentPos.x, y: currentPos.y + 1 };
            continue;
        }
        if (!mapData.map.has(toCoordStr(currentPos.x - 1, currentPos.y + 1))) {
            currentPos = { x: currentPos.x - 1, y: currentPos.y + 1 };
            continue;
        }
        if (!mapData.map.has(toCoordStr(currentPos.x + 1, currentPos.y + 1))) {
            currentPos = { x: currentPos.x + 1, y: currentPos.y + 1 };
            continue;
        }
        break;
    }
    mapData.map.add(toCoordStr(currentPos.x, currentPos.y));
    return true;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const mapData = createMap(data);
    let count = 0;
    let flag = true;
    while (flag) {
        flag &= fallSand({ x: 500, y: 0 }, mapData);
        if (flag) count++;
    }
    return count;
};

const mapHas = (mapData, curr) => {
    let hasAny = mapData.map.has(toCoordStr(curr.x, curr.y));
    hasAny |= curr.y == mapData.maxY + 2;
    return hasAny;
};

const fallSand2 = (curr, mapData) => {
    let currentPos = { x: curr.x, y: curr.y };
    while (true) {
        let next = { x: currentPos.x, y: currentPos.y + 1 };
        if (!mapHas(mapData, next)) {
            currentPos = next;
            continue;
        }
        next = { x: currentPos.x - 1, y: currentPos.y + 1 };
        if (!mapHas(mapData, next)) {
            currentPos = next;
            continue;
        }
        next = { x: currentPos.x + 1, y: currentPos.y + 1 };
        if (!mapHas(mapData, next)) {
            currentPos = next;
            continue;
        }
        break;
    }
    if (currentPos.x == curr.x && currentPos.y == curr.y) {
        return false;
    }
    mapData.map.add(toCoordStr(currentPos.x, currentPos.y));
    return true;
};

const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const mapData = createMap(data);
    let count = 0;
    let flag = true;
    while (flag) {
        flag &= fallSand2({ x: 500, y: 0 }, mapData);
        count++;
    }
    return count;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
