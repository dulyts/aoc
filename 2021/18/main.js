const fs = require("fs");
const { performance } = require("perf_hooks");

const { Node } = require("../../js-lib/binary-tree");

Node.prototype.explode = function () {
    this.left = null;
    this.right = null;
    this.value = 0;
    this.isLeaf = true;
};

Node.prototype.split = function () {
    this.addChild(new Node(Math.floor(this.value / 2)));
    this.addChild(new Node(Math.ceil(this.value / 2)));
    this.value = null;
    this.isLeaf = false;
};

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    // console.log(data);
    return data;
};

const print = (node) => {
    if (node.isLeaf) {
        return node.value;
    }
    return `[${print(node.left)},${print(node.right)}]`;
};

const parseData = (data) => {
    let rootNode = new Node();
    let actualNode = rootNode;
    data.slice(1)
        .split("")
        .forEach((c) => {
            switch (c) {
                case ",":
                    break;
                case "[":
                    const newNode = new Node();
                    actualNode.addChild(newNode);
                    actualNode = newNode;
                    break;
                case "]":
                    actualNode = actualNode.parent;
                    break;
                default:
                    const leaf = new Node(Number(c));
                    actualNode.addChild(leaf);
                    break;
            }
        });
    // console.log(rootNode)
    return rootNode;
};

const magnitude = (node) => {
    if (node.isLeaf) return node.value;
    return 3 * magnitude(node.left) + 2 * magnitude(node.right);
};

const part1 = (data) => {
    let actualResult = parseData(data[0]);
    // console.log("start:          ", print(actualResult));
    for (let i = 1; i < data.length; i++) {
        const newResult = new Node();
        newResult.addChild(actualResult);
        newResult.addChild(parseData(data[i]));

        actualResult = newResult;
        // console.log("after addition: ", print(actualResult));
        reduce(actualResult);
    }

    let resultStr = print(actualResult);
    resultStr = resultStr
        .replace(/\[/g, "(3*")
        .replace(/\]/g, ")")
        .replace(/\,/g, "+2*");
    // return eval(resultStr);

    // const result1 = eval(resultStr);
    // const result2 = magnitude(actualResult);
    // console.log(result1, result2);
    // return result1;

    return magnitude(actualResult);
};

const reduce = (actualResult) => {
    let reduced = true;
    while (reduced) {
        reduced = false;
        if (explodeFourPair(actualResult, 0)) {
            // console.log("after explode:  ", print(actualResult));
            reduced = true;
            continue;
        }
        if (split(actualResult)) {
            // console.log("after split:    ", print(actualResult));
            reduced = true;
            continue;
        }
    }
};

const split = (node) => {
    if (!node) return false;
    if (node.isLeaf && node.value >= 10) {
        node.split();
        return true;
    }
    if (split(node.left)) return true;
    if (split(node.right)) return true;
    return false;
};

const getLeftMost = (node) => {
    let curr = node;
    while (curr.parent != null && curr.parent.left == curr) curr = curr.parent;
    if (curr.parent == null) return null;
    curr = curr.parent;
    curr = curr.left;
    while (curr != null && !curr.isLeaf) curr = curr.right;
    return curr;
};
const getRightMost = (node) => {
    let curr = node;
    while (curr.parent != null && curr.parent.right == curr) curr = curr.parent;
    if (curr.parent == null) return null;
    curr = curr.parent;
    curr = curr.right;
    while (curr != null && !curr.isLeaf) curr = curr.left;
    return curr;
};

const explodeFourPair = (curr, depth) => {
    if (!curr || curr.isLeaf) return false;
    if (depth >= 4 && curr.left.isLeaf && curr.right.isLeaf) {
        const leftMost = getLeftMost(curr.left);
        if (leftMost) {
            leftMost.value += Number(curr.left.value);
        }

        const rightMost = getRightMost(curr.right);
        if (rightMost) {
            rightMost.value += Number(curr.right.value);
        }

        curr.explode();
        return true;
    }
    if (explodeFourPair(curr.left, depth + 1)) return true;
    if (explodeFourPair(curr.right, depth + 1)) return true;
    return false;
};

const part2 = (data) => {
    let max = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data.length; j++) {
            if (i === j) continue;
            const a1 = data[i];
            const a2 = data[j];

            const addition = new Node();
            addition.addChild(parseData(a1));
            addition.addChild(parseData(a2));
            reduce(addition);
            const result = magnitude(addition);
            max = Math.max(max, result);
        }
    }
    return max;
};

let start = null;
const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    start = performance.now();
    console.log("part1", part1(data), " | ", performance.now() - start, "ms");
    start = performance.now();
    console.log("part2", part2(data), " | ", performance.now() - start, "ms");
});
