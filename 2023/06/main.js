const fs = require("fs");

const re = /\d+/g;
const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return [...d.matchAll(re)].map((d) => Number(d[0]));
        });
    // console.log(data);
    return data[0].map((_, idx) => ({
        time: data[0][idx],
        record: data[1][idx],
    }));
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const nums = data.map((game) => {
        let min = 99999;
        let max = 0;
        for (let i = 1; i < game.time; i++) {
            const travelTime = game.time - i;
            const dist = i * travelTime;
            if (dist > game.record) {
                if (i < min) min = i;
                if (i > max) max = i;
            }
        }
        return max - min + 1;
    });
    return nums.reduce((p, c) => p * c, 1);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let time = [];
    let record = [];
    data.forEach((d) => {
        time.push(d.time);
        record.push(d.record);
    });
    time = Number(time.join(""));
    record = Number(record.join(""));

    let min = 9999999999;
    let max = 0;
    for (let i = 1; i < time; i++) {
        const travelTime = time - i;
        const dist = i * travelTime;
        if (dist > record) {
            if (i < min) min = i;
            if (i > max) max = i;
        }
    }
    return max - min + 1;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
