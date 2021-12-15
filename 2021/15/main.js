const fs = require("fs");

const isEqualNode = (n1, n2) => {
    return n1.x === n2.x && n1.y === n2.y;
};

const h = (a, b) => {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
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

const init = (height, width) => {
    const grid = [];
    for (let i = 0; i < height; i++) {
        const row = [];
        for (let j = 0; j < width; j++) {
            const node = {
                x: j,
                y: i,
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

const calculate = (map, start, goal) => {
    const grid = init(map.length, map[0].length);
    const openNodes = new PriorityQueue();
    openNodes.push(start, 0);

    grid[start.y][start.x].g = 0;
    grid[start.y][start.x].f = h(start, goal);

    while (!openNodes.isEmpty()) {
        const current = openNodes.pop();
        if (isEqualNode(current, goal)) {
            let risk = 0;
            let asd = goal;
            while (asd != null) {
                risk += map[asd.y][asd.x];
                asd = grid[asd.y][asd.x].parent;
            }
            risk -= map[start.y][start.x];
            return risk;
        }
        const neighbors = getNeighbors(map, current);
        for (const neighbor of neighbors) {
            const tentativeGScore =
                grid[current.y][current.x].g + neighbor.distance;
            if (tentativeGScore < grid[neighbor.coord.y][neighbor.coord.x].g) {
                grid[neighbor.coord.y][neighbor.coord.x].parent = current;
                grid[neighbor.coord.y][neighbor.coord.x].g = tentativeGScore;
                grid[neighbor.coord.y][neighbor.coord.x].f =
                    tentativeGScore + h(neighbor.coord, goal);
                openNodes.pushOrUpdatePriority(
                    neighbor.coord,
                    grid[neighbor.coord.y][neighbor.coord.x].f
                );
            }
        }
    }
    return null;
};

const getNeighbors = (grid, node) => {
    const neigbors = [];
    if (node.x > 0) {
        const coord = { x: node.x - 1, y: node.y };
        neigbors.push({ coord, distance: grid[coord.y][coord.x] });
    }
    if (node.x < grid[node.y].length - 1) {
        const coord = { x: node.x + 1, y: node.y };
        neigbors.push({ coord, distance: grid[coord.y][coord.x] });
    }
    if (node.y > 0) {
        const coord = { x: node.x, y: node.y - 1 };
        neigbors.push({ coord, distance: grid[coord.y][coord.x] });
    }
    if (node.y < grid.length - 1) {
        const coord = { x: node.x, y: node.y + 1 };
        neigbors.push({ coord, distance: grid[coord.y][coord.x] });
    }
    return neigbors;
};

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("").map(Number);
        });
    // console.log(data);
    return data;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const route = calculate(
        data,
        { x: 0, y: 0 },
        { x: data.length - 1, y: data[0].length - 1 }
    );
    return route;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    map = Array(data.length * 5)
        .fill(0)
        .map((r) => Array(data[0].length * 5));
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            const ii = Math.floor(i / data.length);
            const jj = Math.floor(j / data.length);
            const newValue =
                data[i % data.length][j % data[i % data.length].length] +
                ii +
                jj;
            map[i][j] = newValue > 9 ? (newValue % 10) + 1 : newValue;
        }
    }
    const route = calculate(
        map,
        { x: 0, y: 0 },
        { x: map.length - 1, y: map[0].length - 1 }
    );
    return route;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
