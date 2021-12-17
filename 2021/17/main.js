const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [x, y] = d.split("target area: ")[1].split(", ");
            return {
                x: x
                    .split("=")[1]
                    .split("..")
                    .map(Number)
                    .sort((a, b) => a - b),
                y: y
                    .split("=")[1]
                    .split("..")
                    .map(Number)
                    .sort((a, b) => a - b),
            };
        });
    // console.log(data);
    return data;
};

const makeStep = (pos, velocity) => {
    pos[0] += velocity[0];
    pos[1] += velocity[1];
    if (velocity[0] != 0) {
        if (velocity[0] < 0) velocity[0]++;
        else velocity[0]--;
    }

    velocity[1]--;

    return [pos, velocity];
};

const inRange = (range, pos) => {
    return (
        pos[0] >= range.x[0] &&
        pos[0] <= range.x[1] &&
        pos[1] >= range.y[0] &&
        pos[1] <= range.y[1]
    );
};

const goThrough = (range, pos) => {
    return pos[0] > range.x[1] || pos[1] < range.y[0];
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data[0]));
    let globalMaxY = 0;
    for (let vy = 0; vy < 500; vy++) {
        for (let vx = 0; vx < 500; vx++) {
            let pos = [0, 0];
            let velocity = [vx, vy];
            let maxY = 0;
            while (!inRange(data, pos) && !goThrough(data, pos)) {
                [p, v] = makeStep(pos, velocity);
                pos = p;
                velocity = v;

                if (p[1] > maxY) maxY = p[1];
            }
            if (inRange(data, pos) && maxY > globalMaxY) globalMaxY = maxY;
        }
    }
    return globalMaxY;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data[0]));
    let count = 0;
    for (let vy = -500; vy < 500; vy++) {
        for (let vx = -500; vx < 500; vx++) {
            let pos = [0, 0];
            let velocity = [vx, vy];
            let maxY = 0;
            while (!inRange(data, pos) && !goThrough(data, pos)) {
                [p, v] = makeStep(pos, velocity);
                pos = p;
                velocity = v;

                if (p[1] > maxY) maxY = p[1];
            }
            if (inRange(data, pos)) count++;
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
