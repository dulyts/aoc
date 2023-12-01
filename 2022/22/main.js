const fs = require("fs");

const mod = (n, m) => {
    return ((n % m) + m) % m;
};

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.l = null;
        this.r = null;
        this.u = null;
        this.d = null;
    }
}

const nextInDir = (map, pos, dir, size = 4) => {
    let currPos = {
        x: mod(pos.x + dir[0], map.length),
        y: mod(pos.y + dir[1], map[0].length),
    };
    while (!["#", "."].includes(map[currPos.x][currPos.y].val)) {
        // console.log(currPos);
        currPos = {
            x: mod(currPos.x + dir[0], map.length),
            y: mod(currPos.y + dir[1], map[0].length),
        };
        if (map[currPos.x][currPos.y].val == "E") {
            const xx = Math.floor(currPos.x / size);
            const yy = Math.floor(currPos.y / size);
            const xxx = currPos.x % size;
            const yyy = currPos.y % size;
            
        }
    }
    if (map[currPos.x][currPos.y].val == "#") return null;
    if (map[currPos.x][currPos.y].val == ".") return currPos;
    // if (map[currPos.x][currPos.y].val == "E") console.log("!!!!")
};

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    // console.log(data);
    const N = data.indexOf("");
    const M = data
        .slice(0, N)
        .map((d) => d.length)
        .reduce((prev, curr) => Math.max(prev, curr), 0);

    const map = new Array(N).fill(0).map(() => new Array(M).fill({ val: "E" }));
    data.slice(0, N).forEach((d, x) => {
        d.split("").forEach((dd, y) => {
            if (dd != " ") map[x][y] = { val: dd, node: new Node(x, y) };
        });
    });
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            // console.log(i, j);
            if (map[i][j].val == ".") {
                const nextR = nextInDir(map, { x: i, y: j }, [0, 1]);
                if (nextR) {
                    map[i][j].node.r = map[nextR.x][nextR.y].node;
                    map[nextR.x][nextR.y].node.l = map[i][j].node;
                }

                const nextD = nextInDir(map, { x: i, y: j }, [1, 0]);
                if (nextD) {
                    map[i][j].node.d = map[nextD.x][nextD.y].node;
                    map[nextD.x][nextD.y].node.u = map[i][j].node;
                }

                const nextL = nextInDir(map, { x: i, y: j }, [0, -1]);
                if (nextL) {
                    map[i][j].node.l = map[nextL.x][nextL.y].node;
                    map[nextL.x][nextL.y].node.r = map[i][j].node;
                }

                const nextU = nextInDir(map, { x: i, y: j }, [-1, 0]);
                if (nextU) {
                    map[i][j].node.u = map[nextU.x][nextU.y].node;
                    map[nextU.x][nextU.y].node.d = map[i][j].node;
                }
            }
        }
    }
    let cmd = data[N + 1]
        .replace(new RegExp("R", "g"), " R ")
        .replace(new RegExp("L", "g"), " L ")
        .split(" ")
        .map((d) => {
            if (Number.isInteger(d)) {
                return Number(d);
            }
            return d;
        });
    return { cmd, map };
};
const loadData2 = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    // console.log(data);
    const N = data.indexOf("");
    const M = data
        .slice(0, N)
        .map((d) => d.length)
        .reduce((prev, curr) => Math.max(prev, curr), 0);

    const map = new Array(N).fill(0).map(() => new Array(M).fill({ val: "E" }));
    data.slice(0, N).forEach((d, x) => {
        d.split("").forEach((dd, y) => {
            if (dd != " ") map[x][y] = { val: dd, node: new Node(x, y) };
        });
    });
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            // console.log(i, j);
            if (map[i][j].val == ".") {
                const nextR = nextInDir(map, { x: i, y: j }, [0, 1]);
                if (nextR) {
                    map[i][j].node.r = map[nextR.x][nextR.y].node;
                    map[nextR.x][nextR.y].node.l = map[i][j].node;
                }

                const nextD = nextInDir(map, { x: i, y: j }, [1, 0]);
                if (nextD) {
                    map[i][j].node.d = map[nextD.x][nextD.y].node;
                    map[nextD.x][nextD.y].node.u = map[i][j].node;
                }

                const nextL = nextInDir(map, { x: i, y: j }, [0, -1]);
                if (nextL) {
                    map[i][j].node.l = map[nextL.x][nextL.y].node;
                    map[nextL.x][nextL.y].node.r = map[i][j].node;
                }

                const nextU = nextInDir(map, { x: i, y: j }, [-1, 0]);
                if (nextU) {
                    map[i][j].node.u = map[nextU.x][nextU.y].node;
                    map[nextU.x][nextU.y].node.d = map[i][j].node;
                }
            }
        }
    }
    let cmd = data[N + 1]
        .replace(new RegExp("R", "g"), " R ")
        .replace(new RegExp("L", "g"), " L ")
        .split(" ")
        .map((d) => {
            if (Number.isInteger(d)) {
                return Number(d);
            }
            return d;
        });
    return { cmd, map };
};

const DIR = ["r", "d", "l", "u"];
const DIR2 = [">", "v", "<", "^"];

const toPointStr = (x, y) => `${x}-${y}`;

const doCommand = (node, dir, cmd, asd) => {
    if (cmd == "R") {
        asd[toPointStr(node.x, node.y)] = mod(dir + 1, 4);
        return { node, dir: mod(dir + 1, 4) };
    }
    if (cmd == "L") {
        asd[toPointStr(node.x, node.y)] = mod(dir - 1, 4);
        return { node, dir: mod(dir - 1, 4) };
    }
    // const dirVec = DIR[dir];
    // let i = 0;
    // let pos = { ...currentPos };
    // while (i < cmd && !nextIsWall(map))
    // switch(d)
    const d = DIR[dir];
    let i = 0;
    // if (node[d] == null) {
    //     return { node, dir };
    // }
    let currentNode = node;
    let nextNode = node[d];
    while (i < cmd && nextNode != null) {
        currentNode = nextNode;
        nextNode = nextNode[d];
        i++;
        asd[toPointStr(currentNode.x, currentNode.y)] = dir;
    }
    return { node: currentNode, dir };
};

const part1 = (data) => {
    console.log(data.cmd);

    const start = data.map[0].find((d) => d.val == ".").node;
    console.log("-----------------");
    let curr = { node: start, dir: 0 };
    asd = { [toPointStr(curr.node.x, curr.node.y)]: 0 };
    data.cmd.forEach((c) => {
        curr = doCommand(curr.node, curr.dir, c, asd);
    });

    // for (let i = 0; i < data.map.length; i++) {
    //     for (let j = 0; j < data.map[i].length; j++) {
    //         if (i == curr.node.x && j == curr.node.y) process.stdout.write("C");
    //         else if (asd[toPointStr(i, j)] != undefined) {
    //             let ddd = DIR2[asd[toPointStr(i, j)]];
    //             process.stdout.write(ddd);
    //         } else if (data.map[i][j].val == "E") process.stdout.write(" ");
    //         else process.stdout.write("" + data.map[i][j].val);
    //     }
    //     console.log("");
    // }
    return 1000 * (curr.node.x + 1) + 4 * (curr.node.y + 1) + curr.dir;
};
const part2 = (data) => {
    // data = JSON.parse(JSON.stringify(data));
    return null;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    let data = loadData(filename);
    console.log("part1", part1(data));
    data = loadData2(filename);
    console.log("part2", part2(data));
});

// wrong 146376
// wrong 137382
