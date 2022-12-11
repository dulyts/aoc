const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    let i = 0;
    let monkeys = [];
    while (i < data.length) {
        const items = data[i + 1].split(": ")[1].split(", ").map(Number);
        const operation = data[i + 2].split("new = ")[1];
        const test = Number(data[i + 3].split("by ")[1]);
        const ifTrue = Number(data[i + 4].split("monkey ")[1]);
        const ifFalse = Number(data[i + 5].split("monkey ")[1]);
        monkeys.push({
            items,
            operation,
            test,
            ifTrue,
            ifFalse,
        });
        i += 7;
    }
    // console.log(monkeys);
    return monkeys;
};

const calcWorryLevel = (old, op) => {
    return eval(op);
};

const lcm = (a, b) => Math.abs(a * b);

const process = (data, monkey, item) => {
    let worryLevel = calcWorryLevel(item, monkey.operation);
    worryLevel = Math.floor(worryLevel / 3);
    if (worryLevel % monkey.test == 0) {
        data[monkey.ifTrue].items.push(worryLevel);
    } else {
        data[monkey.ifFalse].items.push(worryLevel);
    }
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const inspectedItems = [];
    data.forEach((m, idx) => {
        inspectedItems[idx] = 0;
    });
    for (let i = 0; i < 20; i++) {
        data.forEach((monkey, idx) => {
            while (monkey.items.length > 0) {
                process(data, monkey, monkey.items.shift());
                inspectedItems[idx]++;
            }
        });
    }
    const sorted = inspectedItems.sort((a, b) => b - a);
    return sorted[0] * sorted[1];
};

const process2 = (data, monkey, item, l) => {
    let worryLevel = calcWorryLevel(item, monkey.operation);
    worryLevel = worryLevel % l;
    if (worryLevel % monkey.test == 0) {
        data[monkey.ifTrue].items.push(worryLevel);
    } else {
        data[monkey.ifFalse].items.push(worryLevel);
    }
};

const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const inspectedItems = [];
    data.forEach((m, idx) => {
        inspectedItems[idx] = 0;
    });
    let l = 1;
    data.forEach((m) => (l = lcm(l, m.test)));
    for (let i = 0; i < 10000; i++) {
        data.forEach((monkey, idx) => {
            while (monkey.items.length > 0) {
                process2(data, monkey, monkey.items.shift(), l);
                inspectedItems[idx]++;
            }
        });
    }
    const sorted = inspectedItems.sort((a, b) => b - a);
    return sorted[0] * sorted[1];
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
