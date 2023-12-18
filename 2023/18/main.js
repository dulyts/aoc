const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [dir, dist, cc] = d.split(" ");
            return {
                dir,
                dist: Number(dist),
                color: cc.substring(1, cc.length - 1),
            };
        });
    // console.log(data);
    return data;
};

const DIR = {
    L: { x: 0, y: -1 },
    R: { x: 0, y: 1 },
    U: { x: -1, y: 0 },
    D: { x: 1, y: 0 },
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let curr = { x: 0, y: 0 };
    const points = [curr];
    data.forEach((d) => {
        const { x, y } = DIR[d.dir];
        let next = { x: curr.x + x * d.dist, y: curr.y + y * d.dist };
        points.push(next);
        curr = next;
    });
    let minX = points[0].x;
    let maxX = points[0].x;
    let minY = points[0].y;
    let maxY = points[0].y;
    points.forEach((p) => {
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
    });
    const N = Math.abs(maxX - minX);
    const M = Math.abs(maxY - minY);
    const diffX = Math.abs(minX);
    const diffY = Math.abs(minY);
    const grid = new Array(N + 1).fill(0).map(() => new Array(M + 1).fill("."));
    curr = { x: diffX, y: diffY };
    grid[diffX][diffY] = "S";
    data.forEach((d) => {
        const { x, y } = DIR[d.dir];
        let next = { x: curr.x + x * d.dist, y: curr.y + y * d.dist };

        for (
            let i = Math.min(curr.x, next.x);
            i <= Math.max(curr.x, next.x);
            i++
        ) {
            for (
                let j = Math.min(curr.y, next.y);
                j <= Math.max(curr.y, next.y);
                j++
            ) {
                grid[i][j] = "#";
            }
        }

        curr = next;
    });

    const yy = grid[0].findIndex((d) => d == "#");
    const remain = [];
    const visitedNodes = new Set();
    remain.push({ x: 1, y: yy + 1 });
    while (remain.length > 0) {
        const curr = remain.shift();
        visitedNodes.add(`${curr.x}-${curr.y}`);
        if (grid[curr.x][curr.y] != ".") continue;
        grid[curr.x][curr.y] = "#";

        let coord = { x: curr.x - 1, y: curr.y - 0 };
        checkAddNode(N, M, coord, visitedNodes, remain);
        coord = { x: curr.x + 1, y: curr.y - 0 };
        checkAddNode(N, M, coord, visitedNodes, remain);
        coord = { x: curr.x - 0, y: curr.y - 1 };
        checkAddNode(N, M, coord, visitedNodes, remain);
        coord = { x: curr.x - 0, y: curr.y + 1 };
        checkAddNode(N, M, coord, visitedNodes, remain);
    }

    return grid.reduce(
        (p, c) => p + c.reduce((pp, cc) => pp + (cc == "#" ? 1 : 0), 0),
        0
    );
};
const checkAddNode = (N, M, coord, visitedNodes, remain) => {
    if (
        coord.x >= 0 &&
        coord.x < N &&
        coord.y >= 0 &&
        coord.y < M &&
        !visitedNodes.has(`${coord.x}-${coord.y}`)
    ) {
        remain.push({ x: coord.x, y: coord.y });
    }
};

const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));

    data = data.map((d) => {
        let dir;
        switch (d.color.substring(d.color.length - 1)) {
            case "0":
                dir = "R";
                break;
            case "1":
                dir = "D";
                break;
            case "2":
                dir = "L";
                break;
            case "3":
                dir = "U";
                break;
        }
        const dist = parseInt(d.color.substring(1, d.color.length - 1), 16);
        return { dir, dist };
    });
    let curr = { x: 0, y: 0 };
    const points = [curr];

    data.forEach((d) => {
        const { x, y } = DIR[d.dir];
        let next = {
            x: curr.x + x * d.dist,
            y: curr.y + y * d.dist,
        };
        points.push(next);
        curr = next;
    });
    return (
        calcPolygonArea(points.slice(0)) +
        data.reduce((p, c) => p + c.dist, 0) / 2 +
        1
    );
};
function calcPolygonArea(vertices) {
    let total = 0;

    for (let i = 0, l = vertices.length; i < l; i++) {
        const addX = vertices[i].x;
        const addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
        const subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
        const subY = vertices[i].y;

        total += addX * addY * 0.5;
        total -= subX * subY * 0.5;
    }

    return Math.abs(total);
}

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});

42;
