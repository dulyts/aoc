const fs = require("fs");

const loadData = (filename) => {
    const data = fs.readFileSync(filename, "utf8").split(/\r?\n/).slice(0, -1);
    // .map((d) => {
    //     return d;
    // });
    let maxX = 0;
    let maxY = 0;
    let i = 0;
    const coords = [];
    const folds = [];
    while (i < data.length && data[i] !== "") {
        const [x, y] = data[i].split(",");
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        coords.push([Number(x), Number(y)]);
        i += 1;
    }
    i += 1;
    while (i < data.length) {
        const [dir, num] = data[i].split("fold along ")[1].split("=");
        folds.push([dir, Number(num)]);
        i += 1;
    }
    let parsedData = {
        coords,
        folds,
        maxX,
        maxY,
    };
    // console.log(parsedData);
    return parsedData;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let currMaxX = data.maxX + 1;
    let currMaxY = data.maxY + 1;
    let grid = Array(currMaxY)
        .fill(0)
        .map((r) => Array(currMaxX).fill(0));
    data.coords.map((d) => {
        const [x, y] = d;
        grid[y][x] = 1;
    });
    // for (let i = 0; i < grid.length; i++) {
    //     console.log(grid[i].join(""));
    // }
    // console.log(grid);
    data.folds.some((fold, foldNumber) => {
        // console.log(currMaxX, currMaxY)
        const [dir, num] = fold;
        if (dir == "y") {
            currMaxY = num;
            let newGrid = Array(currMaxY)
                .fill(0)
                .map((r) => Array(currMaxX).fill(0));
            for (let i = 0; i < currMaxY; i++) {
                for (let j = 0; j < currMaxX; j++) {
                    // console.log(j,i)
                    newGrid[i][j] += grid[i][j];
                    newGrid[i][j] += grid[grid.length - 1 - i][j];
                }
            }
            grid = newGrid;
        }

        if (dir == "x") {
            currMaxX = num;
            let newGrid = Array(currMaxY)
                .fill(0)
                .map((r) => Array(currMaxX).fill(0));
            for (let i = 0; i < currMaxY; i++) {
                for (let j = 0; j < currMaxX; j++) {
                    // console.log(j,i)
                    newGrid[i][j] += grid[i][j];
                    newGrid[i][j] += grid[i][grid[i].length - 1 - j];
                }
            }
            grid = newGrid;
        }

        // for (let i = 0; i < grid.length; i++) {
        //     // console.log(grid[i]);
        //     console.log(grid[i].join(""));
        // }

        if (foldNumber == 0) {
            return;
        }
    });
    let count = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            count += grid[i][j] > 0 ? 1 : 0;
        }
    }
    return count;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let currMaxX = data.maxX + 1;
    let currMaxY = data.maxY + 1;
    let grid = Array(currMaxY)
        .fill(0)
        .map((r) => Array(currMaxX).fill(0));
    data.coords.map((d) => {
        const [x, y] = d;
        grid[y][x] = 1;
    });
    data.folds.some(fold => {
        const [dir, num] = fold;
        if (dir == "y") {
            currMaxY = num;
            let newGrid = Array(currMaxY)
                .fill(0)
                .map((r) => Array(currMaxX).fill(0));
            for (let i = 0; i < currMaxY; i++) {
                for (let j = 0; j < currMaxX; j++) {
                    newGrid[i][j] += grid[i][j];
                    const ii = currMaxY * 2- i;
                    if (ii < grid.length) {
                        newGrid[i][j] += grid[ii][j];
                    }
                }
            }
            grid = newGrid;
        }

        if (dir == "x") {
            currMaxX = num;
            let newGrid = Array(currMaxY)
                .fill(0)
                .map((r) => Array(currMaxX).fill(0));
            for (let i = 0; i < currMaxY; i++) {
                for (let j = 0; j < currMaxX; j++) {
                    newGrid[i][j] += grid[i][j];
                    const jj = currMaxX * 2-j;
                    if (jj < grid[i].length) {
                        newGrid[i][j] += grid[i][jj];
                    }
                }
            }
            grid = newGrid;
        }
    });
    for (let i = 0; i < currMaxY; i++) {
        console.log(grid[i].map((d) => (d == 0 ? " " : "█")).join(""));
    }

    return null;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
