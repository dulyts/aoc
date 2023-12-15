const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("");
        });
    return data;
};

const move = (map, from, to) => {
    map[to.x][to.y] = map[from.x][from.y];
    map[from.x][from.y] = ".";
};

const tiltNorth = (map) => {
    for (let i = 0; i < map[0].length; i++) {
        for (let j = 0; j < map.length; j++) {
            if (map[j][i] == "#") continue;
            if (map[j][i] == ".") {
                const to = { x: j, y: i };
                let jj = j + 1;
                while (
                    jj < map.length &&
                    map[jj][i] != "O" &&
                    map[jj][i] != "#"
                ) {
                    jj++;
                }
                if (jj < map.length && map[jj][i] == "O") {
                    const from = { x: jj, y: i };
                    move(map, from, to);
                }
            }
        }
    }
};
const tiltSouth = (map) => {
    for (let i = 0; i < map[0].length; i++) {
        for (let j = map.length - 1; j >= 0; j--) {
            if (map[j][i] == "#") continue;
            if (map[j][i] == ".") {
                const to = { x: j, y: i };
                let jj = j - 1;
                while (jj >= 0 && map[jj][i] != "O" && map[jj][i] != "#") {
                    jj--;
                }
                if (jj >= 0 && map[jj][i] == "O") {
                    const from = { x: jj, y: i };
                    move(map, from, to);
                }
            }
        }
    }
};

const tiltWest = (map) => {
    for (let i = 0; i < map.length; i++) {
        for (let j = map[0].length - 1; j >= 0; j--) {
            if (map[i][j] == "#") continue;
            if (map[i][j] == ".") {
                const to = { x: i, y: j };
                let jj = j - 1;
                while (jj >= 0 && map[i][jj] != "O" && map[i][jj] != "#") {
                    jj--;
                }
                if (jj >= 0 && map[i][jj] == "O") {
                    const from = { x: i, y: jj };
                    move(map, from, to);
                }
            }
        }
    }
};

const tiltEast = (map) => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == "#") continue;
            if (map[i][j] == ".") {
                const to = { x: i, y: j };
                let jj = j + 1;
                while (
                    jj < map[0].length &&
                    map[i][jj] != "O" &&
                    map[i][jj] != "#"
                ) {
                    jj++;
                }
                if (jj < map[0].length && map[i][jj] == "O") {
                    const from = { x: i, y: jj };
                    move(map, from, to);
                }
            }
        }
    }
};

const mapKey = (map) => {
    return map.map((d) => d.join("")).join("");
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    tiltNorth(data);
    return data
        .map((d, idx) => {
            const level = data.length - idx;
            return d
                .map((dd) => (dd == "O" ? level : 0))
                .reduce((p, c) => p + c, 0);
        })
        .reduce((p, c) => p + c, 0);
};
const part2 = (d) => {
    let data = JSON.parse(JSON.stringify(d));
    const cache = {};
    cache[mapKey(data)] = 0;
    let i = 1;
    while (i < 1000000000) {
        tiltNorth(data);
        tiltEast(data);
        tiltSouth(data);
        tiltWest(data);
        const key = mapKey(data);
        if (key in cache) {
            break;
        }
        cache[key] = i;
        i++;
    }
    const key = mapKey(data);
    const firstIndex =
        ((1000000000 - cache[key]) % (i - cache[key])) + cache[key];

    const sss = chunkSubstr(Object.keys(cache)[firstIndex], data[0].length);
    return sss
        .map((d, idx) => {
            const level = sss.length - idx;
            return d
                .map((dd) => (dd == "O" ? level : 0))
                .reduce((p, c) => p + c, 0);
        })
        .reduce((p, c) => p + c, 0);
};

function chunkSubstr(str, size) {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size).split("");
    }

    return chunks;
}

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
