const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("");
        });
    const start = { x: 0, y: data[0].indexOf(".") };
    const N = data.length - 1;
    const end = { x: N, y: data[N].indexOf(".") };
    // const inner = data.slice(1, -1).map((d) => d.slice(1, -1));
    const winds = [];
    data.forEach((d, x) =>
        d.forEach((dd, y) => {
            if ([">", "<", "^", "v"].includes(dd)) {
                winds.push({ dir: DIR_MAPPER[dd], x, y });
            }
        })
    );
    return { map: data, winds, start, end };
};

function mod(n, m) {
    return ((n % m) + m) % m;
}

const STEP = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
];

const DIR_MAPPER = {
    ">": { x: 0, y: 1 },
    "<": { x: 0, y: -1 },
    "^": { x: -1, y: 0 },
    v: { x: 1, y: 0 },
};

const moveWinds = (winds, N, M) => {
    return winds.map((w) => ({
        ...w,
        x: mod(w.x - 1 + w.dir.x, N) + 1,
        y: mod(w.y - 1 + w.dir.y, M) + 1,
    }));
};

const pointToStr = ({ x, y }) => `${x}#${y}`;

const move = (winds, currPos, end, N, M, distance, min) => {
    // console.log(currPos);
    if (distance >= min) return Infinity;
    if (currPos.x == end.x && currPos.y == end.y) {
        return distance;
    }
    const currentWinds = moveWinds(winds, N, M);
    const windsSet = new Set();
    currentWinds.forEach((w) => windsSet.add(pointToStr(w)));
    const validSteps = STEP.filter((s) => {
        const newPos = { x: currPos.x + s.x, y: currPos.y + s.y };
        return (
            ((newPos.x > 0 &&
                newPos.x < N + 1 &&
                newPos.y > 0 &&
                newPos.y < M + 1) ||
                (newPos.x == end.x && newPos.y == end.y)) &&
            !windsSet.has(pointToStr(newPos))
        );
    });
    // let min = Infinity;
    validSteps.forEach((s) => {
        min = Math.min(
            min,
            move(
                currentWinds,
                { x: currPos.x + s.x, y: currPos.y + s.y },
                end,
                N,
                M,
                distance + 1,
                min
            )
        );
    });
    if (validSteps.length == 0) {
        min = Math.min(
            min,
            move(currentWinds, { ...currPos }, end, N, M, distance + 1, min)
        );
    }
    return min;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const N = data.map.length - 2;
    const M = data.map[0].length - 2;

    const dist = move(data.winds, data.start, data.end, N, M, 0, 40);
    return dist;
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
