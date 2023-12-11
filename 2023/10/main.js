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

const TILES = ["|", "-", "L", "J", "7", "F"];

const getNeighborCords = (pipe) => {
    switch (pipe) {
        case "|": // is a vertical pipe connecting north and south.
            return [
                [-1, 0],
                [1, 0],
            ];
        case "-": // is a horizontal pipe connecting east and west.
            return [
                [0, -1],
                [0, 1],
            ];
        case "L": // is a 90-degree bend connecting north and east.
            return [
                [-1, 0],
                [0, 1],
            ];
        case "J": // is a 90-degree bend connecting north and west.
            return [
                [-1, 0],
                [0, -1],
            ];
        case "7": // is a 90-degree bend connecting south and west.
            return [
                [1, 0],
                [0, -1],
            ];
        case "F": // is a 90-degree bend connecting south and east.
            return [
                [1, 0],
                [0, 1],
            ];
        // case "S": // is a Starting point
        //     return [
        //         [-1, 0],
        //         [1, 0],
        //         [0, -1],
        //         [0, 1],
        //     ];
    }
    return [];
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let start = undefined;
    const N = data.length;
    const M = data[0].length;
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            if (data[i][j] == "S") {
                start = { x: i, y: j };
            }
        }
    }

    let max = 0;
    TILES.forEach((t) => {
        // console.log("---", start);
        let prev = { ...start };
        let curr = getNeighborCords(t).map((p) => {
            let x = start.x + p[0];
            let y = start.y + p[1];
            if (x < 0) x += N;
            if (x >= N) x -= N;
            if (y < 0) y += N;
            if (y >= N) y -= N;
            return { x, y };
        })[0];
        let dist = 1;
        while (curr && data[curr.x][curr.y] != "S") {
            let next = getNeighborCords(data[curr.x][curr.y])
                .map((p) => {
                    let x = curr.x + p[0];
                    let y = curr.y + p[1];
                    if (x < 0) x += N;
                    if (x >= N) x -= N;
                    if (y < 0) y += N;
                    if (y >= N) y -= N;
                    return { x, y };
                })
                .filter((d) => {
                    return !(d.x == prev.x && d.y == prev.y);
                    // return d.x == curr.x && d.y == curr.y;
                });
            // console.log(t, curr, next, prev);
            dist++;
            prev = curr;
            curr = next[0];
            // if (data[curr.x][curr.y] == ".") break;
            // if (dist > 3) {
            //     console.log("_-----------");
            //     return;
            // }
        }
        // console.log(dist, curr);
        if (dist > max) {
            max = dist;
        }
    });

    return max / 2;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let start = undefined;
    const N = data.length;
    const M = data[0].length;
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            if (data[i][j] == "S") {
                start = { x: i, y: j };
            }
        }
    }

    let max = 0;
    let bestTile = undefined;
    TILES.forEach((t) => {
        let prev = { ...start };
        let curr = getNeighborCords(t).map((p) => {
            let x = start.x + p[0];
            let y = start.y + p[1];
            if (x < 0) x += N;
            if (x >= N) x -= N;
            if (y < 0) y += N;
            if (y >= N) y -= N;
            return { x, y };
        })[0];
        let dist = 1;
        while (curr && data[curr.x][curr.y] != "S") {
            let next = getNeighborCords(data[curr.x][curr.y])
                .map((p) => {
                    let x = curr.x + p[0];
                    let y = curr.y + p[1];
                    if (x < 0) x += N;
                    if (x >= N) x -= N;
                    if (y < 0) y += N;
                    if (y >= N) y -= N;
                    return { x, y };
                })
                .filter((d) => {
                    return !(d.x == prev.x && d.y == prev.y);
                });
            dist++;
            prev = curr;
            curr = next[0];
        }
        if (dist > max) {
            max = dist;
            console.log("newBestTile", t)
            bestTile = t;
        }
    });
    bestTile = "L"
    console.log(bestTile, max);
    const map = Array(N)
        .fill(0)
        .map((d) =>
            Array(M)
                .fill(0)
                .map((d) => ".")
        );
    map[start.x][start.y] = bestTile;
    let prev = { ...start };
    let curr = getNeighborCords(bestTile).map((p) => {
        let x = start.x + p[0];
        let y = start.y + p[1];
        if (x < 0) x += N;
        if (x >= N) x -= N;
        if (y < 0) y += N;
        if (y >= N) y -= N;
        return { x, y };
    })[0];
    while (curr && data[curr.x][curr.y] != "S") {
        map[curr.x][curr.y] = data[curr.x][curr.y];
        let next = getNeighborCords(data[curr.x][curr.y])
            .map((p) => {
                let x = curr.x + p[0];
                let y = curr.y + p[1];
                if (x < 0) x += N;
                if (x >= N) x -= N;
                if (y < 0) y += N;
                if (y >= N) y -= N;
                return { x, y };
            })
            .filter((d) => {
                return !(d.x == prev.x && d.y == prev.y);
            });
        prev = curr;
        curr = next[0];
    }
    // map.forEach((d) => console.log(d.join("")));
    // ---
    const scaledMap = Array(N * 3)
        .fill(0)
        .map((d) =>
            Array(M * 3)
                .fill(0)
                .map((d) => ".")
        );
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            const ii = i * 3 + 1;
            const jj = j * 3 + 1;
            const pipe = map[i][j];
            scaledMap[ii][jj] = pipe;
            switch (pipe) {
                case "|":
                    scaledMap[ii - 1][jj] = "|";
                    scaledMap[ii + 1][jj] = "|";
                    break;
                case "-":
                    scaledMap[ii][jj - 1] = "-";
                    scaledMap[ii][jj + 1] = "-";
                    break;
                case "L":
                    scaledMap[ii - 1][jj] = "|";
                    scaledMap[ii][jj + 1] = "-";
                    break;
                case "J":
                    scaledMap[ii - 1][jj] = "|";
                    scaledMap[ii][jj - 1] = "-";
                    break;
                case "7":
                    scaledMap[ii + 1][jj] = "|";
                    scaledMap[ii][jj - 1] = "-";
                    break;
                case "F":
                    scaledMap[ii + 1][jj] = "|";
                    scaledMap[ii][jj + 1] = "-";
                    break;
            }
        }
    }
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            const ii = i * 3 + 1;
            const jj = j * 3 + 1;
            const pipe = map[i][j];
            scaledMap[ii][jj] = pipe;
            switch (pipe) {
                case "S":
                    // scaledMap[ii - 1][jj] = "|";
                    // scaledMap[ii + 1][jj] = "|";
                    // scaledMap[ii][jj + 1] = "-";
                    // scaledMap[ii][jj - 1] = "-";
                    if (scaledMap[ii - 2][jj] && scaledMap[ii - 2][jj] != ".")
                        scaledMap[ii - 1][jj] = "|";
                    if (scaledMap[ii + 2][jj] && scaledMap[ii + 2][jj] != ".")
                        scaledMap[ii + 1][jj] = "|";
                    if (scaledMap[ii][jj - 2] && scaledMap[ii][jj - 2] != ".") {
                        scaledMap[ii][jj - 1] = "-";
                    }
                    if (scaledMap[ii][jj + 2] && scaledMap[ii][jj + 2] != ".")
                        scaledMap[ii][jj + 1] = "-";
                    break;
            }
        }
    }
    // scaledMap.forEach((r, idx) => {
    //     if (idx < 250) console.log(r.join(""));
    // });

    // ---

    const remain = [];
    const visitedNodes = new Set();
    // for (let i = 0; i < N * 3; i++) {
    //     for (let j = 0; j < M * 3; j++) {
    //         if (!(i == 0 || i == N * 3 - 1 || j == 0 || j == M * 3 - 1))
    //             continue;
    //         if (scaledMap[i][j] != ".") continue;
    //         // console.log(i, j);
    //         remain.push({ x: i, y: j });
    //     }
    // }
    remain.push({ x: 2, y: 98 });
    while (remain.length > 0/* && visitedNodes.size < 5400*/) {
        const curr = remain.shift();
        visitedNodes.add(`${curr.x}-${curr.y}`);
        if (scaledMap[curr.x][curr.y] != ".") continue;
        scaledMap[curr.x][curr.y] = "I";

        let x = curr.x - 1;
        let y = curr.y - 0;
        if (
            x >= 0 &&
            x < N * 3 &&
            y >= 0 &&
            y < M * 3 &&
            !visitedNodes.has(`${x}-${y}`)
        )
            remain.push({ x, y });

        x = curr.x + 1;
        y = curr.y - 0;
        if (
            x >= 0 &&
            x < N * 3 &&
            y >= 0 &&
            y < M * 3 &&
            !visitedNodes.has(`${x}-${y}`)
        )
            remain.push({ x, y });

        x = curr.x - 0;
        y = curr.y - 1;
        if (
            x >= 0 &&
            x < N * 3 &&
            y >= 0 &&
            y < M * 3 &&
            !visitedNodes.has(`${x}-${y}`)
        )
            remain.push({ x, y });

        x = curr.x - 0;
        y = curr.y + 1;
        if (
            x >= 0 &&
            x < N * 3 &&
            y >= 0 &&
            y < M * 3 &&
            !visitedNodes.has(`${x}-${y}`)
        )
            remain.push({ x, y });
    }
    // scaledMap.forEach((r) => console.log(r.join("")));

    // console.log("");
    // scaledMap.forEach((r, idx) => {
    //     if (idx < 250) console.log(r.join(""));
    // });
    let count = 0;
    for (let i = 0; i < N; i++) {
        // console.log(scaledMap[i].join(""));
        for (let j = 0; j < M; j++) {
            if (scaledMap[i * 3 + 1][j * 3 + 1] == "I") count++;
        }
    }
    return count;
};

const inputs = ["sample_0.txt", "sample_1.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});

// 5185 too high
