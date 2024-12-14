const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d, id) => {
            const [p, v] = d.split(" ").map((d) => {
                const [x, y] = d.split("=")[1].split(",").map(Number);
                return { x, y };
            });
            return { id, p, v };
        });
    console.log(data);
    return data;
};

const part1 = (data, N, M) => {
    data = JSON.parse(JSON.stringify(data));
    const finish = data.map((robot) => {
        // console.log(robot, robot.p.x, robot.v.x * 100, M);
        let x = robot.p.x + robot.v.x * 100;
        let y = robot.p.y + robot.v.y * 100;
        while (x < 0) x += M;
        while (y < 0) y += N;

        return {
            x: x % M,
            y: y % N,
        };
    });
    finish.forEach((r) => console.log(r));
    const grid = [];
    for (let i = 0; i < N; i++) {
        let row = [];
        for (let j = 0; j < M; j++) {
            const count = finish.reduce(
                (prev, curr) => prev + (curr.x == j && curr.y == i ? 1 : 0),
                0
            );
            row.push(count > 0 ? count : ".");
        }
        grid.push(row);
        console.log(row.join(""));
    }
    const quadrant = {
        "0-0": 0,
        "0-1": 0,
        "1-0": 0,
        "1-1": 0,
    };
    for (let i = 0; i < N; i++) {
        const halfN = Math.floor(N / 2);
        if (i == halfN) continue;
        for (let j = 0; j < M; j++) {
            const halfM = Math.floor(M / 2);
            if (j == halfM) continue;
            if (grid[i][j] != ".") {
                quadrant[`${i < halfN ? 0 : 1}-${j < halfM ? 0 : 1}`] +=
                    grid[i][j];
            }
        }
    }
    console.log(quadrant);
    return Object.keys(quadrant).reduce(
        (prev, curr) => prev * quadrant[curr],
        1
    );
};
const part2 = (data, N, M) => {
    data = JSON.parse(JSON.stringify(data));
    let density = 0;
    let step = 0;
    let grid = Array(N)
        .fill(".")
        .map(() => Array(M).fill("."));
    while (density < 0.8) {
        step++;
        if (step % 100 == 0) console.log(step);

        // clear grid
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < M; j++) {
                grid[i][j] = ".";
            }
        }

        // make step
        data = data.map((robot) => {
            let x = robot.p.x + robot.v.x;
            let y = robot.p.y + robot.v.y;
            while (x < 0) x += M;
            while (y < 0) y += N;
            x %= M;
            y %= N;
            grid[y][x] = "#";
            return {
                ...robot,
                p: { x, y },
            };
        });

        // calc image density
        const viewN = 10;
        const viewM = 10;
        let maxCount = 0;
        for (let i = 0; i < N - 10; i += 10) {
            for (let j = 0; j < M - 10; j += 10) {
                let count = 0;
                for (let k = 0; k < 10; k++) {
                    for (let l = 0; l < 10; l++) {
                        count += grid[i + k][j + l] === "." ? 0 : 1;
                    }
                }
                if (count > maxCount) maxCount = count;
            }
        }
        density = maxCount / (viewN * viewM);
    }
    grid.forEach((row) => console.log(row.join("")));
    return step;
};

const inputs = [
    // { file: "sample_0.txt", N: 7, M: 11 }
];
inputs.push({ file: "input.txt", N: 103, M: 101 });
inputs.forEach((input) => {
    console.log(input.file);
    const data = loadData(input.file);
    console.log("part1", part1(data, input.N, input.M));
    console.log("part2", part2(data, input.N, input.M));
});
