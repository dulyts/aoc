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

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const regex = /(mul\(\d+,\d+\))/gm;
    let res = 0;
    data.forEach((d) => {
        while ((m = regex.exec(d)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                if (groupIndex != 0) return;
                const params = match.substring(4, match.length - 1).split(",");
                // console.log(params[0], "*", params[1]);
                res += params[0] * params[1];
            });
        }
    });
    return res;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const regex = /^(mul\(\d{0,3},\d{0,3}\))/gm;
    let res = 0;

    const cmd = [];
    const d = data.join("");
    let disabled = false;
    let i = 0;
    while (i < d.length) {
        let txt = d.substring(i);
        if (!disabled) {
            const m = txt.match(regex);
            if (m) cmd.push(m[0]);
        }
        if (txt.substring(0, 7) === "don't()") {
            disabled = true;
        }
        if (txt.substring(0, 4) === "do()") {
            disabled = false;
        }
        i++;
    }
    cmd.forEach((c) => {
        const params = c.substring(4, c.length - 1).split(",");
        res += params[0] * params[1];
    });
    return res;
};

// too low 38356128
// p1 - 153469856

const inputs = ["sample_0.txt", "sample_1.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
