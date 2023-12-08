const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    const op = data[0].split("");
    let i = 2;
    const network = {};
    while (i < data.length) {
        const [from, to] = data[i].split(" = ");
        const asd = to.match(/\w+\w+/g);
        network[from] = {
            L: asd[0],
            R: asd[1],
            isStart: from.at(-1) == "A",
        };
        i++;
    }
    // console.log(op, network);
    return { op, network };
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const cmdLen = data.op.length;
    let curr = "AAA";
    let i = 0;
    let step = 0;
    while (curr != "ZZZ") {
        const cmd = data.op[i % cmdLen];
        curr = data.network[curr][cmd];
        i++;
        step++;
    }
    return step;
};

const gcd = (a, b) => {
    if (b == 0) return a;
    return gcd(b, a % b);
};

const lcm = (arr, n) => {
    ans = arr[0];
    for (let i = 1; i < n; i++) ans = (arr[i] * ans) / gcd(arr[i], ans);
    return ans;
};

const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const cmdLen = data.op.length;
    let curr = Object.keys(data.network).filter((d) => data.network[d].isStart);
    let steps = Array(curr.length).fill(0);
    steps = steps.map((_) => []);
    let isEnd = false;
    let i = 0;
    while (!isEnd) {
        const cmd = data.op[i % cmdLen];
        curr = curr.map((c) => data.network[c][cmd]);
        i++;
        curr.forEach((c, idx) => {
            if (c.at(-1) == "Z") {
                steps[idx].push(i);
            }
        });
        isEnd = true;
        steps.forEach((s) => {
            isEnd &= s.length >= 1;
        });
    }

    const a = steps.map((s) => s[0]);
    return lcm(a, a.length);
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
