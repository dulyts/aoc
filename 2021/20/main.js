const fs = require("fs");
const { performance } = require("perf_hooks");

// const size = 10000;
// const size = 1000;
// const size = 2000; // good
// const size = 200;
// const size = 20;

const loadData = (filename) => {
    const data = fs.readFileSync(filename, "utf8").split(/\r?\n/).slice(0, -1);
    // .map((d) => {
    //     return d;
    // });
    const algo = data[0].split("");
    let i = 2;
    const tmpGrid = [];
    while (i < data.length) {
        tmpGrid.push(data[i].split(""));
        i++;
    }
    const grid = [];
    // const verticalPadding = Math.floor((size - tmpGrid.length) / 2);
    // const horizontalPadding = Math.floor((size - tmpGrid[0].length) / 2);
    const verticalPadding = 1;
    const horizontalPadding = 1;
    for (let i = 0; i < verticalPadding; i++) {
        grid.push(Array(2 * verticalPadding + tmpGrid[0].length).fill("."));
    }
    for (let i = 0; i < tmpGrid.length; i++) {
        grid.push([
            ...Array(horizontalPadding).fill("."),
            ...tmpGrid[i],
            ...Array(horizontalPadding).fill("."),
        ]);
    }
    for (let i = 0; i < verticalPadding; i++) {
        grid.push(Array(2 * verticalPadding + tmpGrid[0].length).fill("."));
    }
    const parsedData = {
        algo,
        grid,
    };
    // console.log(parsedData);
    return parsedData;
};

const getNeigbors = (grid, ii, jj, currentEdge) => {
    let binary = "";
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let x = jj + j;
            let y = ii + i;

            if (y < 0) y += 1;
            if (y >= grid.length) y -= 1;
            if (x < 0) x += 1;
            if (x >= grid[y].length) x -= 1;
            // if (y < 0 || y >= grid.length || x < 0 || x >= grid[y].length) {
            //     binary += currentEdge === "#" ? "1" : "0";
            //     continue;
            // }

            binary += grid[y][x] === "#" ? "1" : "0";
        }
    }
    return parseInt(binary, 2);
};

const createGrid = (height, width, val) => {
    const output = Array(height)
        .fill(0)
        .map((r) =>
            Array(width)
                .fill(0)
                .map((c) => val)
        );
    return output;
};

const resizeGrid = (tmpGrid, padding, val) => {
    const grid = [];
    for (let i = 0; i < padding; i++) {
        grid.push(Array(2 * padding + tmpGrid[0].length).fill(val));
    }
    for (let i = 0; i < tmpGrid.length; i++) {
        grid.push([
            ...Array(padding).fill(val),
            ...tmpGrid[i],
            ...Array(padding).fill(val),
        ]);
    }
    for (let i = 0; i < padding; i++) {
        grid.push(Array(2 * padding + tmpGrid[0].length).fill(val));
    }
    return grid;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let grid = data.grid;
    const padding = 1;
    for (let c = 0; c < 2; c++) {
        grid = resizeGrid(grid, padding, grid[0][0]);
        const output = createGrid(grid.length, grid[0].length, ".");
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                const binary = getNeigbors(grid, i, j);
                output[i][j] = data.algo[binary];
            }
        }
        grid = output;
    }
    let counter = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "#") counter += 1;
        }
    }
    return counter;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let grid = data.grid;
    const padding = 1;
    for (let c = 0; c < 50; c++) {
        grid = resizeGrid(grid, padding, grid[0][0]);
        const output = createGrid(grid.length, grid[0].length, ".");
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                const binary = getNeigbors(grid, i, j);
                output[i][j] = data.algo[binary];
            }
        }
        grid = output;
    }
    let counter = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "#") counter += 1;
        }
    }
    return counter;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    let start = performance.now();
    console.log("part1", part1(data));
    console.log("part2", part2(data));
    console.log(performance.now() - start, "ms");
});
