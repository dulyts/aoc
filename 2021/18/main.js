const fs = require("fs");

class Node {
    constructor(value) {
        this.parent = null;
        this.left = null;
        this.right = null;
        this.value = value;
        this.isLeaf = Number.isInteger(value);
    }

    addChild(node) {
        node.parent = this;
        if (!this.left) this.left = node;
        else this.right = node;
    }

    explode() {
        this.left = null;
        this.right = null;
        this.value = 0;
        this.isLeaf = true;
    }

    split() {
        this.addChild(new Node(Math.floor(this.value / 2)));
        this.addChild(new Node(Math.ceil(this.value / 2)));
        this.value = null;
        this.isLeaf = false;
    }
}

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
    if (!node) return "(?)";
    if (node.isLeaf) {
        return node.value;
    }
    return `[${print(node.left)},${print(node.right)}]`;
};

const parseData = (data) => {
    let rootNode = new Node();
    let actualNode = rootNode;
    data.split("").forEach((c) => {
        if (c === ",") {
        } else if (c === "[") {
            const newNode = new Node();
            actualNode.addChild(newNode);
            actualNode = newNode;
        } else if (c === "]") {
            actualNode = actualNode.parent;
        } else {
            const leaf = new Node(Number(c));
            actualNode.addChild(leaf);
        }
    });
    rootNode = rootNode.left;
    rootNode.parent = null;
    // console.log(rootNode)
    return rootNode;
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
    return eval(resultStr);
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
    for (let i = 0; i < data.length - 1; i++) {
        for (let j = i + 1; j < data.length; j++) {
            const a1 = data[i];
            const a2 = data[j];

            const addition = new Node();
            addition.addChild(parseData(a1));
            addition.addChild(parseData(a2));
            reduce(addition);
            let resultStr = print(addition);
            resultStr = resultStr
                .replace(/\[/g, "(3*")
                .replace(/\]/g, ")")
                .replace(/\,/g, "+2*");
            const result = eval(resultStr);
            if (result > max) max = result;

            const addition2 = new Node();
            addition2.addChild(parseData(a2));
            addition2.addChild(parseData(a1));
            reduce(addition2);
            let resultStr2 = print(addition2);
            resultStr2 = resultStr2
                .replace(/\[/g, "(3*")
                .replace(/\]/g, ")")
                .replace(/\,/g, "+2*");
            const result2 = eval(resultStr2);
            if (result2 > max) max = result2;
        }
    }
    return max;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
