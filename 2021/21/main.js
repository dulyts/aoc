const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .reduce((acc, curr) => {
            const [player, pos] = curr
                .split("Player ")[1]
                .split(" starting position: ")
                .map(Number);
            return {
                ...acc,
                [player]: pos,
            };
        }, {});
    // console.log(data);
    return data;
};

const diceThree = (step) => {
    let sum = 0;
    for (let i = 0; i < 3; i++) {
        sum += step;
        step++;
        if (step > 100) {
            step = 1;
        }
    }

    return [sum, step];
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const points = {
        1: 0,
        2: 0,
    };
    step = 1;
    let dies = 0;
    while (true) {
        const [newPos1, newStep1] = diceThree(step);
        step = newStep1;
        dies += 3;
        let p1 = newPos1 + data["1"];
        p1 = p1 % 10;
        if (p1 == 0) p1 = 10;
        points["1"] += p1;
        data["1"] = p1;

        if (points["1"] >= 1000) break;

        const [newPos2, newStep2] = diceThree(step);
        step = newStep2;
        dies += 3;
        let p2 = newPos2 + data["2"];
        p2 = p2 % 10;
        if (p2 == 0) p2 = 10;
        points["2"] += p2;
        data["2"] = p2;
        if (points["2"] >= 1000) break;
    }

    const min = Math.min(points["1"], points["2"]);
    return min * dies;
};

CACHE = {};

const cacheKey = (...args) => args.join(",");

const rec = (p1score, p2score, p1pos, p2pos, playerOne) => {
    let key = cacheKey(p1score, p2score, p1pos, p2pos, playerOne);
    if (CACHE[key]) {
        return CACHE[key];
    }
    let cloneP1score = p1score;
    let cloneP2score = p2score;
    let cloneP1pos = p1pos;
    let cloneP2pos = p2pos;
    let wins1 = 0;
    let wins2 = 0;

    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            for (let k = 1; k <= 3; k++) {
                if (playerOne) {
                    cloneP1pos = (p1pos + i + j + k) % 10;
                    if (cloneP1pos == 0) {
                        cloneP1pos = 10;
                    }
                    cloneP1score = p1score + cloneP1pos;
                    if (cloneP1score >= 21) {
                        wins1 += 1;
                        continue;
                    }
                } else {
                    cloneP2pos = (p2pos + i + j + k) % 10;
                    if (cloneP2pos == 0) {
                        cloneP2pos = 10;
                    }
                    cloneP2score = p2score + cloneP2pos;
                    if (cloneP2score >= 21) {
                        wins2 += 1;
                        continue;
                    }
                }
                const res = rec(
                    cloneP1score,
                    cloneP2score,
                    cloneP1pos,
                    cloneP2pos,
                    !playerOne
                );
                wins1 += res[0];
                wins2 += res[1];
            }
        }
    }
    CACHE[key] = [wins1, wins2];
    return [wins1, wins2];
};


const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const result = rec(0, 0, data["1"], data["2"], true);

    return Math.max(...result);
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
