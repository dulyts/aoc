const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("");
        });
    let state = undefined;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] === "^") {
                data[i][j] = "X";
                state = { x: i, y: j, dir: "up" };
            }
        }
    }
    const d = { map: data, start: state };
    // console.log(d);
    return d;
};

const move = (map, curr) => {
    switch (curr.dir) {
        case "up":
            if (curr.x == 0) return undefined;
            if (map[curr.x - 1][curr.y] === "#")
                return { ...curr, dir: "right" };
            return { ...curr, x: curr.x - 1 };
        case "down":
            if (curr.x == map.length - 1) return undefined;
            if (map[curr.x + 1][curr.y] === "#")
                return { ...curr, dir: "left" };
            return { ...curr, x: curr.x + 1 };
        case "left":
            if (curr.y == 0) return undefined;
            if (map[curr.x][curr.y - 1] === "#") return { ...curr, dir: "up" };
            return { ...curr, y: curr.y - 1 };
        case "right":
            if (curr.y == map[curr.x].length - 1) return undefined;
            if (map[curr.x][curr.y + 1] === "#")
                return { ...curr, dir: "down" };
            return { ...curr, y: curr.y + 1 };
    }
};

// 5161 - X

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let state = data.start;
    while (state != undefined) {
        state = move(data.map, state);
        if (state) {
            data.map[state.x][state.y] = "X";
        }
    }
    // data.map.forEach((d) => console.log(d.join("")));

    let count = 0;
    for (let i = 0; i < data.map.length; i++) {
        for (let j = 0; j < data.map[i].length; j++) {
            if (data.map[i][j] === "X") {
                count++;
            }
        }
    }
    return count;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let count = 0;
    for (let i = 0; i < data.map.length; i++) {
        for (let j = 0; j < data.map[i].length; j++) {
            if (["#", "X"].includes(data.map[i][j])) continue;
            const map = JSON.parse(JSON.stringify(data)).map;
            let state = JSON.parse(JSON.stringify(data)).start;
            map[i][j] = "#";
            let mem = new Set();
            mem.add(JSON.stringify(state));
            let valid = true;
            while (state != undefined) {
                state = move(map, state);
                if (mem.has(JSON.stringify(state))) {
                    valid = false;
                    break;
                }
                mem.add(JSON.stringify(state))
                if (state) {
                    map[state.x][state.y] = "X";
                }
            }
            if (!valid) {
                count++;
            }
        }
    }
    return count;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
