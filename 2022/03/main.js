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
    return data;
};

const charPoint = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(
    ""
);

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    data = data.map((d) => {
        const len = d.length;
        return [d.slice(0, len / 2), d.slice(len / 2, len)];
    });
    const commons = [];
    data.forEach((row) => {
        const fst = row[0].split("");
        const snd = row[1].split("");

        const filteredArray = fst.filter((value) => snd.includes(value));
        commons.push(filteredArray[0]);
    });
    const sum = commons
        .map((c) => charPoint.findIndex((cc) => cc === c) + 1)
        .reduce((p, c) => p + c, 0);
    return sum;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const commons = [];
    for (let i = 0; i < data.length; i += 3) {
        const a = data[i].split("");
        const b = data[i + 1].split("");
        const c = data[i + 2].split("");

        const filteredArray = a.filter(
            (value) => b.includes(value) && c.includes(value)
        );
        commons.push(filteredArray[0]);
    }
    const sum = commons
        .map((c) => charPoint.findIndex((cc) => cc === c) + 1)
        .reduce((p, c) => p + c, 0);
    return sum;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
