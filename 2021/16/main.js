const fs = require("fs");

const hexToBinary = (str) => {
    switch (str) {
        case "0":
            return "0000";
        case "1":
            return "0001";
        case "2":
            return "0010";
        case "3":
            return "0011";
        case "4":
            return "0100";
        case "5":
            return "0101";
        case "6":
            return "0110";
        case "7":
            return "0111";
        case "8":
            return "1000";
        case "9":
            return "1001";
        case "A":
            return "1010";
        case "B":
            return "1011";
        case "C":
            return "1100";
        case "D":
            return "1101";
        case "E":
            return "1110";
        case "F":
            return "1111";
    }
};

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("").map(hexToBinary).join("").split("");
        });
    // console.log(data);
    return data[0];
};

let versionSum = 0;

const processLiteral = (data) => {
    let j = 0;
    while (j < data.length && data[j] === "1") {
        j += 5;
    }
    j += 5;
    const a = data.slice(0, j);
    const literals = [];
    while (a.length > 0) literals.push(a.splice(0, 5).slice(1, 5).join(""));
    const ls = parseInt(literals.join(""), 2);
    return j;
};

const processPackage = (data, toplevel = false) => {
    if (data.length === 0) {
        return 0;
    }
    let i = 0;
    data = JSON.parse(JSON.stringify(data));
    while (i < data.length) {
        const version = parseInt(data.slice(i, i + 3).join(""), 2);
        versionSum += version;
        i += 3;

        const packetType = parseInt(data.slice(i, i + 3).join(""), 2);
        i += 3;
        if (packetType === 4) {
            i += processLiteral(data.slice(i));
            return i;
        } else {
            const lengthTypeId = data[i];
            i += 1;
            if (lengthTypeId === "0") {
                let len = parseInt(data.slice(i, i + 15).join(""), 2);
                i += 15;
                const startI = i;
                while (i < startI + len) {
                    const packageSteps = processPackage(data.slice(i, i + len));
                    i += packageSteps;
                }
                i = startI + len;
                return i;
            } else {
                let len = parseInt(data.slice(i, i + 11).join(""), 2);
                i += 11;
                for (let k = 0; k < len; k++) {
                    const packageSteps = processPackage(data.slice(i));
                    i += packageSteps;
                }
                return i;
            }
        }
    }
    return i;
};

let stack = [];
const processLiteralPart2 = (data) => {
    let j = 0;
    while (j < data.length && data[j] === "1") {
        j += 5;
    }
    j += 5;
    const a = data.slice(0, j);
    const literals = [];
    while (a.length > 0) literals.push(a.splice(0, 5).slice(1, 5).join(""));
    const ls = parseInt(literals.join(""), 2);
    stack.push(ls);
    return j;
};

// const out = "";
const processPackage2 = (data, toplevel = false) => {
    if (data.length === 0) {
        return 0;
    }
    let i = 0;
    data = JSON.parse(JSON.stringify(data));
    while (i < data.length) {
        const version = parseInt(data.slice(i, i + 3).join(""), 2);
        versionSum += version;
        i += 3;

        const packetType = parseInt(data.slice(i, i + 3).join(""), 2);
        i += 3;
        if (packetType === 4) {
            i += processLiteralPart2(data.slice(i));
            return i;
        } else {
            switch (packetType) {
                case 0:
                    stack.push("sum");
                    break;
                case 1:
                    stack.push("product");
                    break;
                case 2:
                    stack.push("min");
                    break;
                case 3:
                    stack.push("max");
                    break;
                case 5:
                    stack.push("greaterThan");
                    break;
                case 6:
                    stack.push("lessThan");
                    break;
                case 7:
                    stack.push("equalsTo");
                    break;
            }
            stack.push("(");
            const lengthTypeId = data[i];
            i += 1;
            if (lengthTypeId === "0") {
                let len = parseInt(data.slice(i, i + 15).join(""), 2);
                i += 15;
                const startI = i;
                while (i < startI + len) {
                    const packageSteps = processPackage2(
                        data.slice(i, i + len)
                    );
                    i += packageSteps;
                }
                i = startI + len;
                stack.push(")");
                return i;
            } else {
                let len = parseInt(data.slice(i, i + 11).join(""), 2);
                i += 11;
                for (let k = 0; k < len; k++) {
                    const packageSteps = processPackage2(data.slice(i));
                    i += packageSteps;
                }
                stack.push(")");
                return i;
            }
        }
    }
    return i;
};

const sum = (...args) => {
    let v = 0;
    args.forEach((a) => (v += a));
    return v;
};
const product = (...args) => {
    let v = 1;
    args.forEach((a) => (v *= a));
    return v;
};
const greaterThan = (a, b) => {
    return a > b ? 1 : 0;
};
const lessThan = (a, b) => {
    return a < b ? 1 : 0;
};
const equalsTo = (a, b) => {
    return a == b ? 1 : 0;
};
const min = (...args) => {
    let v = Infinity;
    args.forEach((a) => (v = a < v ? a : v));
    return v;
};
const max = (...args) => {
    let v = 0;
    args.forEach((a) => (v = a > v ? a : v));
    return v;
};

const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    processPackage2(data, true);
    const expr = stack
        .join(",")
        .replace(/\,\)/g, ")")
        .replace(/\(\,/g, "(")
        .replace(/\,\(/g, "(");
    return eval(expr);
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    versionSum = 0;
    stack = [];
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", processPackage(data, true), versionSum);
    console.log("part2", part2(data));
});
