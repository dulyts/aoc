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

class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    push(node, priority) {
        let i = 0;
        while (i < this.queue.length && this.queue[i].priority < priority) {
            i += 1;
        }
        this.queue.splice(i, 0, { value: node, priority });
    }

    pushOrUpdatePriority(node, priority) {
        const index = this.indexOf(node);
        if (index === -1) {
            this.push(node, priority);
        } else {
            this.updatePriority(index, priority);
        }
    }

    updatePriority(index, priority) {
        const node = this.queue.splice(index, 1).value;
        this.push(node, priority);
    }

    pop() {
        return this.queue.shift().value;
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    indexOf(node) {
        return this.queue.indexOf((e) => isEqualNode(e, node));
    }
}

const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
];
const getCode = (data, curr) => data[curr.x][curr.y].charCodeAt(0);

isEqualNode = (a, b) => a.x == b.x && a.y == b.y;

const init = (height, width) => {
    const grid = [];
    for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
            const node = {
                x: i,
                y: j,
                f: Infinity,
                g: Infinity,
                h: null,
                parent: null,
            };
            row.push(node);
        }
        grid.push(row);
    }
    return grid;
};

const h = (a, b) => {
    const ac = offsetToAxial(a);
    const bc = offsetToAxial(b);
    return Math.abs(bc.x - ac.x) + Math.abs(bc.y - ac.y);
};

const offsetToAxial = (a) => {
    const q = a.x - (a.y - (a.y % 2)) / 2;
    const r = a.y;
    return { x: q, y: r };
};

const calculate = (map, start, goal) => {
    const grid = init(map.length, map[0].length);
    const openNodes = new PriorityQueue();
    openNodes.push(start, 0);
    const visitedNodes = [];

    grid[start.x][start.y].g = 0;
    grid[start.x][start.y].f = h(start, goal);

    while (!openNodes.isEmpty()) {
        const current = openNodes.pop();
        if (isEqualNode(current, goal)) {
            const path = [];
            let asd = goal;
            while (asd != null) {
                asd = grid[asd.x][asd.y].parent;
                if (asd != null) path.push(asd);
            }
            path.pop();
            return {
                path,
                visitedNodes,
            };
        }
        const neighbors = getNeighbors(map, current);
        for (const neighbor of neighbors) {
            if (!visitedNodes.find((n) => isEqualNode(n, neighbor.coord))) {
                visitedNodes.push(neighbor.coord);
            }
            const tentativeGScore =
                grid[current.x][current.y].g + neighbor.distance;
            if (tentativeGScore < grid[neighbor.coord.x][neighbor.coord.y].g) {
                grid[neighbor.coord.x][neighbor.coord.y].parent = current;
                grid[neighbor.coord.x][neighbor.coord.y].g = tentativeGScore;
                grid[neighbor.coord.x][neighbor.coord.y].f =
                    tentativeGScore + h(neighbor.coord, goal);
                openNodes.pushOrUpdatePriority(
                    neighbor.coord,
                    grid[neighbor.coord.x][neighbor.coord.y].f
                );
            }
        }
    }
    // console.log("Nay :(");
    return {
        path: [],
        visitedNodes,
    };
};

const getNeighbors = (map, node) => {
    // console.log(map, node);

    const dirs = directions
        .map((d) => ({ x: node.x + d[0], y: node.y + d[1] }))
        .filter(
            (d) =>
                !(
                    d.x < 0 ||
                    d.x >= map.length ||
                    d.y < 0 ||
                    d.y >= map[0].length
                )
        )
        .filter((d) => {
            const currentCode = getCode(map, node);
            const nextCode = getCode(map, d);
            return nextCode - currentCode <= 1;
        })
        .map((d) => ({ coord: d, distance: 1 }));

    return dirs;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));

    let start = undefined;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] == "S") start = { x: i, y: j };
        }
    }
    let end = undefined;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] == "E") end = { x: i, y: j };
        }
    }
    data[start.x][start.y] = "a";
    data[end.x][end.y] = "z";

    const res = calculate(data, start, end);
    console.log(res.path.reverse(), res.path.length);
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] == "E") process.stdout.write("E");
            else if (data[i][j] == "S") process.stdout.write("S");
            else if (res.path.find((p) => isEqualNode(p, { x: i, y: j })))
                process.stdout.write("#");
            else process.stdout.write(".");
        }
        console.log();
    }
    return res.path.length + 1;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));

    let start = undefined;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] == "S") start = { x: i, y: j };
        }
    }
    let end = undefined;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] == "E") end = { x: i, y: j };
        }
    }
    data[start.x][start.y] = "a";
    data[end.x][end.y] = "z";

    let min = Infinity;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] == "a") {
                const ss = { x: i, y: j };
                const res = calculate(data, ss, end);
                if (res.path.length > 0) {
                    const ll = res.path.length + 1;
                    if (ll < min) min = ll;
                }
            }
        }
    }
    return min;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
