const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d, x) => {
            return d
                .split("")
                .map((dd, y) => {
                    if (dd == "#") {
                        return {
                            x,
                            y,
                            list: JSON.parse(JSON.stringify(DIRS)),
                        };
                    }
                    return undefined;
                })
                .filter((dd) => dd != undefined);
        })
        .flat()
        .reduce(
            (prev, curr, idx) => ({ ...prev, [idx]: { idx, ...curr } }),
            {}
        );
    // console.log(data);
    return data;
};

const DIRS = [
    {
        dir: { x: -1, y: 0 },
        adj: [
            { x: -1, y: 1 },
            { x: -1, y: -1 },
        ],
    },
    {
        dir: { x: 1, y: 0 },
        adj: [
            { x: 1, y: -1 },
            { x: 1, y: 1 },
        ],
    },
    {
        dir: { x: 0, y: -1 },
        adj: [
            { y: -1, x: -1 },
            { y: -1, x: 1 },
        ],
    },
    {
        dir: { x: 0, y: 1 },
        adj: [
            { y: 1, x: -1 },
            { y: 1, x: 1 },
        ],
    },
];

const toPointStr = ({ x, y }) => `${x}#${y}`;

const checkNear = (positions, { x, y }) => {
    let hasAnyNear = false;
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i == x && j == y) continue;
            hasAnyNear =
                hasAnyNear || positions.has(toPointStr({ x: i, y: j }));
        }
    }
    return hasAnyNear;
};

const findValidDirection = (positions, elf) => {
    let valid = false;
    let i = -1;
    while (!valid && i < elf.list.length - 1) {
        i++;
        valid =
            !positions.has(
                toPointStr({
                    x: elf.x + elf.list[i].dir.x,
                    y: elf.y + elf.list[i].dir.y,
                })
            ) &&
            !positions.has(
                toPointStr({
                    x: elf.x + elf.list[i].adj[0].x,
                    y: elf.y + elf.list[i].adj[0].y,
                })
            ) &&
            !positions.has(
                toPointStr({
                    x: elf.x + elf.list[i].adj[1].x,
                    y: elf.y + elf.list[i].adj[1].y,
                })
            );
    }
    if (!valid) {
        return undefined;
    }
    return {
        elfIndex: elf.idx,
        index: i,
        newPos: { x: elf.x + elf.list[i].dir.x, y: elf.y + elf.list[i].dir.y },
    };
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    for (let i = 0; i < 10; i++) {
        const positions = new Set();
        Object.keys(data).forEach((d) => positions.add(toPointStr(data[d])));
        const movableElves = Object.keys(data)
            .map((d) => data[d])
            .filter((d) => checkNear(positions, d));

        const proposedMoves = movableElves
            .map((d) => findValidDirection(positions, d))
            .filter((d) => d != undefined);

        const validMoves = proposedMoves.filter((m, idxA) => {
            const asd = proposedMoves.find(
                (p, idxB) =>
                    idxA != idxB &&
                    m.newPos.x == p.newPos.x &&
                    m.newPos.y == p.newPos.y
            );
            return asd == undefined;
        });
        validMoves.forEach((move) => {
            data[move.elfIndex].x = move.newPos.x;
            data[move.elfIndex].y = move.newPos.y;
        });
        Object.keys(data).forEach((d) => {
            const m = data[d].list.shift();
            data[d].list.push(m);
        });
    }

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    Object.keys(data).forEach((d) => {
        const elf = data[d];
        minX = Math.min(minX, elf.x);
        maxX = Math.max(maxX, elf.x);
        minY = Math.min(minY, elf.y);
        maxY = Math.max(maxY, elf.y);
    });

    const positions = new Set();
    Object.keys(data).forEach((d) => positions.add(toPointStr(data[d])));
    let count = 0;
    for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
            if (!positions.has(toPointStr({ x: i, y: j }))) {
                count++;
            }
        }
    }

    return count;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let round = 0;
    let hasMove = true;
    while (hasMove) {
        const positions = new Set();
        Object.keys(data).forEach((d) => positions.add(toPointStr(data[d])));
        const movableElves = Object.keys(data)
            .map((d) => data[d])
            .filter((d) => checkNear(positions, d));

        const proposedMoves = movableElves
            .map((d) => findValidDirection(positions, d))
            .filter((d) => d != undefined);

        const validMoves = proposedMoves.filter((m, idxA) => {
            const asd = proposedMoves.find(
                (p, idxB) =>
                    idxA != idxB &&
                    m.newPos.x == p.newPos.x &&
                    m.newPos.y == p.newPos.y
            );
            return asd == undefined;
        });
        hasMove = validMoves.length > 0;
        validMoves.forEach((move) => {
            data[move.elfIndex].x = move.newPos.x;
            data[move.elfIndex].y = move.newPos.y;
        });
        Object.keys(data).forEach((d) => {
            const m = data[d].list.shift();
            data[d].list.push(m);
        });
        round++;
    }
    return round;
};

const inputs = [
    "sample_0.txt",
    // "sample_1.txt",
];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
