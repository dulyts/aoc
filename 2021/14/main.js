const fs = require("fs");

const loadData = (filename) => {
    const data = fs.readFileSync(filename, "utf8").split(/\r?\n/).slice(0, -1);
    // .map((d) => {
    //     return d;
    // });
    const init = data[0].split("");
    const trans = {};
    let i = 2;
    while (i < data.length) {
        const [a, b] = data[i].split(" -> ");
        // trans.push([a,b]);
        trans[a] = b;
        i++;
    }
    const parsedData = {
        init,
        trans,
    };
    // console.log(parsedData);
    return parsedData;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const counts = {};
    data.init.forEach((d) => {
        if (counts[d]) counts[d] += 1;
        else counts[d] = 1;
    });
    let result = data.init;
    for (let i = 0; i < 10; i++) {
        let j = 0;
        while (j < result.length - 1) {
            const curr = result[j] + result[j + 1];
            const newChar = data.trans[curr];
            if (newChar) {
                result.splice(j + 1, 0, newChar);
                if (counts[newChar]) counts[newChar] += 1;
                else counts[newChar] = 1;
                j++;
            }
            j++;
        }
        // console.log(result.join(""));
    }
    let max = 0;
    let maxChar = null;
    let min = Infinity;
    let minChar = null;
    Object.keys(counts).forEach((c) => {
        if (counts[c] > max) {
            max = counts[c];
            maxChar = c;
        }
        if (counts[c] < min) {
            min = counts[c];
            minChar = c;
        }
    });
    return max - min;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let pairs = {};
    let j = 0;
    const result = data.init;
    const counts = {};
    while (j < result.length - 1) {
        const curr = result[j] + result[j + 1];
        if (pairs[curr]) pairs[curr] += 1;
        else pairs[curr] = 1;
        if (counts[result[j]]) counts[result[j]] += 1;
        else counts[result[j]] = 1;
        j++;
    }
    if (counts[result[j]]) counts[result[j]] += 1;
    else counts[result[j]] = 1;
    for (let i = 0; i < 40; i++) {
        const newPairs = {};
        Object.keys(pairs).forEach((p) => {
            const count = pairs[p];
            const [left, right] = p.split("");
            const newChar = data.trans[p];
            if (counts[newChar]) counts[newChar] += count;
            else counts[newChar] = count;
            if (newPairs[left + newChar]) newPairs[left + newChar] += count;
            else newPairs[left + newChar] = count;
            if (newPairs[newChar + right]) newPairs[newChar + right] += count;
            else newPairs[newChar + right] = count;
        });
        pairs = newPairs;
    }
    let max = 0;
    let maxChar = null;
    let min = Infinity;
    let minChar = null;
    Object.keys(counts).forEach((c) => {
        if (counts[c] > max) {
            max = counts[c];
            maxChar = c;
        }
        if (counts[c] < min) {
            min = counts[c];
            minChar = c;
        }
    });
    return (max - min);
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
