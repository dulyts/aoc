const fs = require("fs");
const path = require("path");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("");
        });
    // console.log(data);
    return data;
};

const getClosingBracket = (bracket) => {
    switch (bracket) {
        case "<":
            return ">";
        case "[":
            return "]";
        case "(":
            return ")";
        case "{":
            return "}";
        default:
            break;
    }
};
const getErrorScore = (bracket) => {
    switch (bracket) {
        case ">":
            return 25137;
        case "]":
            return 57;
        case ")":
            return 3;
        case "}":
            return 1197;
        default:
            break;
    }
};
const getIncompleteScore = (bracket) => {
    switch (bracket) {
        case ">":
            return 4;
        case "]":
            return 2;
        case ")":
            return 1;
        case "}":
            return 3;
        default:
            break;
    }
};

const openingBrackets = ["<", "[", "(", "{"];

const part1 = (data) => {
    data = [...data];
    let errorScore = 0;
    data.forEach((d) => {
        const stack = [];
        let correct = true;
        let i = 0;
        while (correct && i < d.length) {
            const e = d[i];
            if (openingBrackets.indexOf(e) > -1) {
                stack.push(e);
            } else {
                const open = stack.pop();
                const close = getClosingBracket(open);
                if (close !== e) {
                    correct = false;
                    break;
                }
            }
            i += 1;
        }
        if (!correct) {
            errorScore += getErrorScore(d[i]);
        }
    });
    return errorScore;
};
const part2 = (data) => {
    data = [...data];
    validLines = [];
    data.forEach((d) => {
        const stack = [];
        let correct = true;
        let i = 0;
        while (correct && i < d.length) {
            const e = d[i];
            if (openingBrackets.indexOf(e) > -1) {
                stack.push(e);
            } else {
                const open = stack.pop();
                const close = getClosingBracket(open);
                if (close !== e) {
                    correct = false;
                    break;
                }
            }
            i += 1;
        }
        if (correct) {
            validLines.push(d);
        }
    });

    let scores = [];
    validLines.forEach((d) => {
        const stack = [];
        let correct = true;
        let i = 0;
        while (correct && i < d.length) {
            const e = d[i];
            if (openingBrackets.indexOf(e) > -1) {
                stack.push(e);
            } else {
                const open = stack.pop();
            }
            i += 1;
        }
        let lineScore = 0;
        while (stack.length > 0) {
            const open = stack.pop();
            const close = getClosingBracket(open);
            d.push(close);
            lineScore = lineScore * 5 + getIncompleteScore(close);
        }
        scores.push(lineScore);
    });
    scores = scores.sort((a, b) => a - b);
    return scores[Math.floor(scores.length / 2)];
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt")
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
