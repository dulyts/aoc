const fs = require("fs");
const { performance } = require("perf_hooks");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split(",").map(Number);
        });
    // console.log(data);
    return data;
};

const toPointStr = (x, y, z) => `${x}#${y}#${z}`;

const dirs = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
    [-1, 0, 0],
    [0, -1, 0],
    [0, 0, -1],
];

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const points = new Set();
    data.forEach((d) => points.add(toPointStr(d[0], d[1], d[2])));
    let visibleFaceCount = 0;
    data.forEach((d) => {
        dirs.forEach((dir) => {
            if (
                !points.has(
                    toPointStr(d[0] + dir[0], d[1] + dir[1], d[2] + dir[2])
                )
            ) {
                visibleFaceCount++;
            }
        });
    });
    return visibleFaceCount;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let maxx, maxy, maxz;
    data.forEach((d) => {
        maxx = Math.max(maxx ?? d[0], d[0]);
        maxy = Math.max(maxy ?? d[1], d[1]);
        maxz = Math.max(maxz ?? d[2], d[2]);
    });
    const lava = new Array(maxx + 1)
        .fill(0)
        .map(() =>
            new Array(maxy + 1)
                .fill(0)
                .map(() => new Array(maxz + 1).fill(false))
        );
    data.forEach((d) => (lava[d[0]][d[1]][d[2]] = true));

    const air = new Set();
    for (let x = 0; x < lava.length; x++) {
        for (let y = 0; y < lava[0].length; y++) {
            for (let z = 0; z < lava[0][0].length; z++) {
                if (!lava[x][y][z]) continue;
                dirs.forEach((dir) => {
                    fillIfAir(lava, x, y, z, dir, air);
                });
            }
        }
    }

    const points = new Set();
    for (let x = 0; x < lava.length; x++) {
        for (let y = 0; y < lava[0].length; y++) {
            for (let z = 0; z < lava[0][0].length; z++) {
                if (lava[x][y][z]) {
                    points.add(toPointStr(x, y, z));
                }
            }
        }
    }

    let visibleFaceCount = 0;
    data.forEach((d) => {
        dirs.forEach((dir) => {
            if (
                !points.has(
                    toPointStr(d[0] + dir[0], d[1] + dir[1], d[2] + dir[2])
                )
            ) {
                visibleFaceCount++;
            }
        });
    });
    return visibleFaceCount;
};

const fillIfAir = (lava, xx, yy, zz, dir, air) => {
    let x = xx + dir[0];
    let y = yy + dir[1];
    let z = zz + dir[2];
    if (air.has(toPointStr(x, y, z))) {
        return;
    }
    if (
        x < 0 ||
        x >= lava.length ||
        y < 0 ||
        y >= lava[0].length ||
        z < 0 ||
        z >= lava[0][0].length
    ) {
        return;
    }
    if (lava[x][y][z]) {
        return;
    }

    const visitedNodes = new Set();
    const asd = new Set();
    asd.add(toPointStr(x, y, z));
    const openNodes = [{ x, y, z }];

    let reachSide = false;
    while (!reachSide && openNodes.length > 0) {
        const { x, y, z } = openNodes.shift();
        visitedNodes.add(toPointStr(x, y, z));
        if (
            x < 0 ||
            x >= lava.length ||
            y < 0 ||
            y >= lava[0].length ||
            z < 0 ||
            z >= lava[0][0].length
        ) {
            reachSide = true;
            break;
        }
        if (air.has(toPointStr(x, y, z))) {
            reachSide = true;
            break;
        }
        if (!lava[x][y][z]) {
            dirs.forEach((d) => {
                const newX = x + d[0];
                const newY = y + d[1];
                const newZ = z + d[2];
                const pointStr = toPointStr(newX, newY, newZ);
                if (!visitedNodes.has(pointStr) && !asd.has(pointStr)) {
                    openNodes.push({ x: newX, y: newY, z: newZ });
                    asd.add(pointStr);
                }
            });
        }
    }
    if (!reachSide) {
        visitedNodes.forEach((v) => {
            const [x, y, z] = v.split("#");
            if (
                x < 0 ||
                x >= lava.length ||
                y < 0 ||
                y >= lava[0].length ||
                z < 0 ||
                z >= lava[0][0].length
            ) {
                return;
            }
            lava[x][y][z] = true;
        });
    } else {
        visitedNodes.forEach((v) => {
            const [x, y, z] = v.split("#");
            if (
                x < 0 ||
                x >= lava.length ||
                y < 0 ||
                y >= lava[0].length ||
                z < 0 ||
                z >= lava[0][0].length
            ) {
                return;
            }
            if (!lava[x][y][z]) {
                air.add(toPointStr(x, y, z));
            }
        });
    }
    return reachSide;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    let startTime = performance.now();
    console.log("part1", part1(data), performance.now() - startTime);
    startTime = performance.now();
    console.log("part2", part2(data), performance.now() - startTime);
});
