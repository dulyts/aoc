const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [a, ...b] = d.split(" ");
            const monkey = a.split(":")[0];
            if (b.length == 1) {
                return { monkey, num: Number(b[0]) };
            }
            return { monkey, op: b };
        })
        .reduce((prev, curr) => {
            return { ...prev, [curr.monkey]: curr };
        }, {});
    // console.log(data);
    return data;
};

const resolveJob = (data, monkeyKey, results) => {
    const monkey = data[monkeyKey];
    if (results[monkey.op[0]] == undefined) {
        results[monkey.op[0]] = resolveJob(data, monkey.op[0], results);
    }
    if (results[monkey.op[2]] == undefined) {
        results[monkey.op[2]] = resolveJob(data, monkey.op[2], results);
    }
    return eval(
        `results['${monkey.op[0]}'] ${monkey.op[1]} results['${monkey.op[2]}']`
    );
};

const resolveJob2 = (data, monkeyKey, results) => {
    const monkey = data[monkeyKey];
    if (monkey.op[0] != "humn" && results[monkey.op[0]] == undefined) {
        results[monkey.op[0]] = resolveJob2(data, monkey.op[0], results);
    }
    if (monkey.op[2] != "humn" && results[monkey.op[2]] == undefined) {
        results[monkey.op[2]] = resolveJob2(data, monkey.op[2], results);
    }

    const a = `(${results[monkey.op[0]]} ${monkey.op[1]} ${
        results[monkey.op[2]]
    })`;
    try {
        const asd = eval(a);
        return asd;
    } catch (e) {
        return {
            left: results[monkey.op[0]],
            op: monkey.op[1],
            right: results[monkey.op[2]],
        };
    }
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const results = {};
    Object.keys(data).forEach((k) => {
        const d = data[k];
        if (d.num) {
            results[d.monkey] = d.num;
        }
    });

    return resolveJob(data, "root", results);
};

const inverse = {
    "+": "-",
    "-": "+",
    "/": "*",
    "*": "/",
};

const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    data["root"].op[1] = "==";
    const results = {};
    Object.keys(data).forEach((k) => {
        const d = data[k];
        if (d.num) {
            results[d.monkey] = d.num;
        }
    });

    results["humn"] = "x";
    const asd = resolveJob2(data, "root", results);
    let l = asd.left;
    let res = asd.right;
    while (Number.isInteger(l.left) || Number.isInteger(l.right)) {
        if (Number.isInteger(l.left)) {
            if (["/", "-"].includes(l.op)) {
                res = `(${l.left} ${l.op} ${res})`;
            } else {
                if (l.op) res = `(${res} ${inverse[l.op]} ${l.left})`;
            }
            l = l.right;
        }
        if (Number.isInteger(l.right)) {
            res = `(${res} ${inverse[l.op]} ${l.right})`;
            l = l.left;
        }
    }
    return eval(res);
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
