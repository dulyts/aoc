const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    // console.log(data);
    const rules = [];
    const updates = [];
    let i = 0;
    while (data[i] !== "") {
        rules.push(data[i].split("|").map(Number));
        i++;
    }
    i++;
    while (i < data.length) {
        updates.push(data[i].split(",").map(Number));
        i++;
    }
    const res = { rules, updates };
    // console.log(res);
    return res;
};

const isValidForRule = (update, rule) => {
    const idxA = update.indexOf(rule[0]);
    const idxB = update.indexOf(rule[1]);
    if (idxA === -1 || idxB === -1) return true;
    return idxA < idxB;
};
const isValidUpdate = (update, rules) => {
    for (let i = 0; i < rules.length; i++) {
        const valid = isValidForRule(update, rules[i]);
        if (!valid) return false;
    }
    return true;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let res = 0;
    data.updates
        .filter((u) => isValidUpdate(u, data.rules))
        .forEach((u) => {
            res += u[Math.floor(u.length / 2)];
        });
    return res;
};

const orderUpdate = (update, rules) => {
    return update.sort((a, b) => {
        const rule = rules.find((r) => {
            return (r[0] == a && r[1] == b) || (r[0] == b && r[1] == a);
        });
        if (!rule) return 0;
        if (rule[0] == a) return -1;
        return +1;
        // const idxA = update.indexOf(rule[0]);
        // const idxB = update.indexOf(rule[1]);
    });
};

const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let res = 0;
    data.updates
        .filter((u) => !isValidUpdate(u, data.rules))
        .forEach((u) => {
            const orderedUpdate = orderUpdate(u, data.rules);
            res += orderedUpdate[Math.floor(orderedUpdate.length / 2)];
        });
    return res;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
