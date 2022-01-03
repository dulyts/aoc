const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("");
        });
    console.log(data);
    return data;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let canMove = true;
    let step = 0;
    while (canMove) {
        console.log(step);
        canMove = false;
        let newGrid = JSON.parse(JSON.stringify(data));
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                if (data[i][j] === ">") {
                    if (j + 1 < data[i].length) {
                        if (data[i][j + 1] === ".") {
                            newGrid[i][j + 1] = ">";
                            newGrid[i][j] = ".";
                            j++;
                            canMove = true;
                        }
                    } else if (data[i][0] === ".") {
                        newGrid[i][0] = ">";
                        newGrid[i][j] = ".";
                        canMove = true;
                    }
                }
            }
        }
        data = JSON.parse(JSON.stringify(newGrid));
        for (let j = 0; j < data[0].length; j++) {
            for (let i = 0; i < data.length; i++) {
                if (data[i][j] === "v") {
                    if (i + 1 < data.length) {
                        if (data[i + 1][j] === ".") {
                            newGrid[i + 1][j] = "v";
                            newGrid[i][j] = ".";
                            i++;
                            canMove = true;
                        }
                    } else if (data[0][j] === ".") {
                        newGrid[0][j] = "v";
                        newGrid[i][j] = ".";
                        canMove = true;
                    }
                }
            }
        }
        data = newGrid;
        // data.forEach((d) => {
        //     console.log(d.join(""));
        // });
        // console.log("----------");
        step += 1;
    }
    return step;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
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
