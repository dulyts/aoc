const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("");
        });
    const antennas = [];
    const N = data.length;
    const M = data[0].length;
    data.forEach((row, x) => {
        row.forEach((col, y) => {
            if (col != ".") {
                antennas.push({ type: col, x, y });
            }
        });
    });
    return { antennas, N, M };
};
const isInRange = (N, M, x, y) => {
    return x >= 0 && x < N && y >= 0 && y < M;
};
const dist = (a, b) => {
    return { x: a.x - b.x, y: a.y - b.y };
};
const getAntinodes = (a, b, N, M) => {
    const d = dist(a, b);
    const antinodes = [
        { x: a.x + d.x, y: a.y + d.y },
        { x: b.x - d.x, y: b.y - d.y },
    ];
    // console.log(a, b, antinodes);
    return antinodes.filter((dd) => isInRange(N, M, dd.x, dd.y));
};
const getAntinodes2 = (a, b, N, M) => {
    const d = dist(a, b);
    const antinodes = [];
    for (let i = 1; i < Math.max(N, M); i++) {
        antinodes.push({ x: a.x + d.x * i, y: a.y + d.y * i });
        antinodes.push({ x: b.x - d.x * i, y: b.y - d.y * i });
    }
    // console.log(a, b, antinodes);
    return antinodes.filter((dd) => isInRange(N, M, dd.x, dd.y));
};

const part1 = (data) => {
    const { antennas, N, M } = JSON.parse(JSON.stringify(data));
    const antinodes = new Set();
    for (let i = 0; i < antennas.length; i++) {
        for (let j = i + 1; j < antennas.length; j++) {
            const a = antennas[i];
            const b = antennas[j];
            if (a.type != b.type) continue;
            getAntinodes(a, b, N, M).forEach((d) =>
                antinodes.add(JSON.stringify(d))
            );
        }
    }

    // for (let i = 0; i < N; i++) {
    //     let line = "";
    //     for (let j = 0; j < M; j++) {
    //         const antenna = antennas.find((a) => a.x == i && a.y == j);
    //         if (antenna) {
    //             line += antenna.type;
    //             continue;
    //         }
    //         const antinode = antinodes.has(JSON.stringify({ x: i, y: j }));
    //         if (antinode) {
    //             line += "#";
    //             continue;
    //         }
    //         line += ".";
    //     }
    //     console.log(line);
    // }
    return antinodes.size;
};
const part2 = (data) => {
    const { antennas, N, M } = JSON.parse(JSON.stringify(data));
    const antinodes = new Set();
    for (let i = 0; i < antennas.length; i++) {
        for (let j = i + 1; j < antennas.length; j++) {
            const a = antennas[i];
            const b = antennas[j];
            if (a.type != b.type) continue;
            getAntinodes2(a, b, N, M).forEach((d) =>
                antinodes.add(JSON.stringify(d))
            );
        }
    }
    antennas.forEach((a) => antinodes.add(JSON.stringify({ x: a.x, y: a.y })));

    for (let i = 0; i < N; i++) {
        let line = "";
        for (let j = 0; j < M; j++) {
            const antenna = antennas.find((a) => a.x == i && a.y == j);
            if (antenna) {
                line += antenna.type;
                continue;
            }
            const antinode = antinodes.has(JSON.stringify({ x: i, y: j }));
            if (antinode) {
                line += "#";
                continue;
            }
            line += ".";
        }
        console.log(line);
    }
    return antinodes.size;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
