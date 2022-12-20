const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map(Number);
    return data;
};

const mod = (n, m) => {
    return ((n % m) + m) % m;
};

const move = (list = [], number, offset) => {
    if (offset == 0) {
        return list;
    }
    const idx = list.indexOf(number);
    list.splice(idx, 1);
    let newPos = mod(idx + offset, list.length);

    if (newPos == 0) list.push(number);
    else list.splice(newPos, 0, number);
    return list;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let zeroKey = undefined;
    const offset = {};
    const list = [];
    data.forEach((d, idx) => {
        if (d == 0) {
            zeroKey = idx;
        }
        offset[idx] = d;
        list.push(idx);
    });

    let N = data.length;
    let currentList = [...list];
    let i = 0;
    while (i < N) {
        currentList = move(currentList, list[i], offset[i]);
        i++;
    }
    const idxOfZero = currentList.indexOf(zeroKey);
    const a = offset[currentList[(idxOfZero + 1000) % N]];
    const b = offset[currentList[(idxOfZero + 2000) % N]];
    const c = offset[currentList[(idxOfZero + 3000) % N]];
    return a + b + c;
};

const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let zeroKey = undefined;
    const offset = {};
    const list = [];
    data.forEach((d, idx) => {
        if (d == 0) {
            zeroKey = idx;
        }
        offset[idx] = d * 811589153;
        list.push(idx);
    });

    let N = data.length;
    let currentList = [...list];
    for (let j = 0; j < 10; j++) {
        let i = 0;
        while (i < N) {
            currentList = move(currentList, list[i], offset[i]);
            i++;
        }
    }
    const idxOfZero = currentList.indexOf(zeroKey);
    const a = offset[currentList[(idxOfZero + 1000) % N]];
    const b = offset[currentList[(idxOfZero + 2000) % N]];
    const c = offset[currentList[(idxOfZero + 3000) % N]];
    return a + b + c;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
