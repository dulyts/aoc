const fs = require("fs");

const point = {
    R: 1,
    P: 2,
    S: 3,
};

const map = {
    A: "R",
    B: "P",
    C: "S",
    X: "R",
    Y: "P",
    Z: "S",
};

const WIN = {
    RR: 3,
    RP: 6,
    RS: 0,
    PP: 3,
    PR: 0,
    PS: 6,
    SS: 3,
    SR: 6,
    SP: 0,
};

const ASD = {
    // win
    ZS: "R",
    ZR: "P",
    ZP: "S",
    // draw
    YR: "R",
    YP: "P",
    YS: "S",
    // lose
    XR: "S",
    XP: "R",
    XS: "P",
};

const W = {
    S: "R",
    R: "P",
    P: "S",
};
const D = {
    R: "S",
    P: "R",
    S: "P",
};

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    return data;
};

const calcScore = (data) =>
    data
        .map((d) => {
            const key = d[0] + d[1];
            return point[d[1]] + WIN[key];
        })
        .reduce((prev, curr) => prev + curr, 0);

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    data = data.map((d) => {
        const tmp = d.split(" ");
        return [map[tmp[0]], map[tmp[1]]];
    });
    return calcScore(data);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    data = data.map((d) => {
        const tmp = d.split(" ");
        const result = tmp[1];
        const opponent = map[tmp[0]];
        let me = ASD[result + opponent];
        return [opponent, me];
    });
    return calcScore(data);
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
