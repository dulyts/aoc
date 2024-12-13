const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    const games = [];
    for (let i = 0; i < data.length; i += 4) {
        const [aX, aY] = data[i]
            .split(": ")[1]
            .split(", ")
            .map((d) => d.split("+")[1])
            .map(Number);
        const [bX, bY] = data[i + 1]
            .split(": ")[1]
            .split(", ")
            .map((d) => d.split("+")[1])
            .map(Number);
        const [prizeX, prizeY] = data[i + 2]
            .split(": ")[1]
            .split(", ")
            .map((d) => d.split("=")[1])
            .map(Number);
        games.push({
            btnA: { x: aX, y: aY },
            btnB: { x: bX, y: bY },
            prize: { x: prizeX, y: prizeY },
        });
    }
    // console.log(games);
    return games;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const costs = data.map(({ btnA, btnB, prize }) => {
        const solutions = [];
        for (let i = 0; i <= 100; i++) {
            for (let j = 0; j <= 100; j++) {
                const x = i * btnA.x + j * btnB.x;
                const y = i * btnA.y + j * btnB.y;
                if (x === prize.x && y === prize.y) {
                    solutions.push({ a: i, b: j });
                }
            }
        }
        if (solutions.length === 0) return;
        let minCost = Infinity;
        solutions.forEach((s) => {
            const cost = s.a * 3 + s.b * 1;
            if (cost < minCost) minCost = cost;
        });
        return minCost;
    });
    const allCost = costs.reduce((prev, curr) => {
        if (!curr) return prev;
        return prev + curr;
    }, 0);
    return allCost;
};
function lcm(min, max) {
    function range(min, max) {
        var arr = [];
        for (var i = min; i <= max; i++) {
            arr.push(i);
        }
        return arr;
    }

    function gcd(a, b) {
        return !b ? a : gcd(b, a % b);
    }

    function lcm(a, b) {
        return (a * b) / gcd(a, b);
    }

    var multiple = min;
    range(min, max).forEach(function (n) {
        multiple = lcm(multiple, n);
    });

    return multiple;
}
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const costs = data.map(({ btnA, btnB, prize }) => {
        let px = prize.x + 10000000000000;
        let py = prize.y + 10000000000000;
        let det = btnA.x * btnB.y - btnA.y * btnB.x;
        let a = (px * btnB.y - py * btnB.x) / det;
        let b = (btnA.x * py - btnA.y * px) / det;
        if (Math.floor(a) != a || Math.floor(b) != b) return 0;
        if (btnA.x * a + btnB.x * b == px && btnA.y * a + btnB.y * b == py) {
            return a * 3 + b;
        } else {
            return 0;
        }
    });
    const allCost = costs.reduce((prev, curr) => {
        return prev + curr;
    }, 0);
    return allCost;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
