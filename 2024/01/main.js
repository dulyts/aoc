const fs = require("fs");

const loadData = (filename) => {
    const a = [];
    const b = [];
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("   ");
        })
        .forEach((d) => {
            a.push(d[0]);
            b.push(d[1]);
        });

    console.log(data);
    return { a, b };
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const a_sorted = data.a.sort();
    const b_sorted = data.b.sort();
    let dist = 0;
    a_sorted.forEach((d, idx) => {
        dist += Math.abs(d - b_sorted[idx]);
    });
    return dist;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let sim = 0;
    data.a.forEach((d) => {
        sim +=
            d *
            data.b.reduce((prev, curr) => {
                if (curr == d) return prev + 1;
                return prev;
            }, 0);
    });
    return sim;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
