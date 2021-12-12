const fs = require("fs");
const { performance } = require("perf_hooks");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("-");
        })
        .reduce((prev, next) => {
            if (prev[next[0]]) {
                prev[next[0]].push(next[1]);
            } else {
                prev[next[0]] = [next[1]];
            }
            if (prev[next[1]]) {
                prev[next[1]].push(next[0]);
            } else {
                prev[next[1]] = [next[0]];
            }
            return prev;
        }, {});
    // console.log(data);
    return data;
};

const asd = (data, currentNode, path) => {
    if (currentNode === "end") {
        return 1;
    }
    let count = 0;
    data[currentNode].forEach((d) => {
        if (
            d !== "start" &&
            (d[0] === d[0].toUpperCase() || path.indexOf(d) === -1)
        ) {
            count += asd(data, d, [...path, d]);
        }
    });
    return count;
};

const hasTwiceVisitedSmallCave = (path) => {
    for (let i = 1; i < path.length; i++) {
        const d = path[i];
        if (d[0] === d[0].toLowerCase()) {
            for (let j = i+1; j < path.length; j++) {
                const d2 = path[j];
                if (d === d2) {
                    return true;
                }
            }
        }
    }
    return false;
};

const asd2 = (data, currentNode, path) => {
    if (currentNode === "end") {
        return 1;
    }
    let count = 0;
    data[currentNode].forEach((d) => {
        if (
            d !== "start" &&
            (d[0] === d[0].toUpperCase() ||
                path.indexOf(d) === -1 ||
                !hasTwiceVisitedSmallCave(path))
        ) {
            count += asd2(data, d, [...path, d]);
        }
    });
    return count;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const count = asd(data, "start", ["start"]);
    return count;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const count = asd2(data, "start", ["start"]);
    return count;
};

const inputs = ["sample_0.txt", , "sample_1.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    const t1 = performance.now();
    console.log("part2", part2(data));
    const t2 = performance.now();
    console.log(t2 - t1, "ms");
});
