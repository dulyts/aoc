const fs = require("fs");

const asd = /\s?(\s{3})|\[(.)\]/g;
const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    let i = 0;
    let stackNumber = (data[i].length - 3) / 4 + 1;
    const stacks = Array(stackNumber)
        .fill(undefined)
        .map((d) => []);
    while (true) {
        if (data[i].startsWith(" 1")) {
            i += 2;
            break;
        }
        let j = 0;
        for (const match of data[i].matchAll(asd)) {
            if (match[2]) {
                stacks[j].push(match[2]);
            }
            j++;
        }
        i++;
    }

    const commands = [];
    while (data[i]) {
        const asd = data[i].split(" ");
        commands.push({
            count: Number(asd[1]),
            from: Number(asd[3]) - 1,
            to: Number(asd[5]) - 1,
        });
        i++;
    }
    // console.log("stacks", stacks);
    return { stacks: stacks.map((s) => s.reverse()), commands };
};

const part1 = (data) => {
    const { stacks, commands } = JSON.parse(JSON.stringify(data));
    commands.forEach((cmd) => {
        for (let i = 0; i < cmd.count; i++) {
            stacks[cmd.to].push(stacks[cmd.from].pop());
        }
    });
    return stacks.map((s) => s[s.length - 1]).join("");
};
const part2 = (data) => {
    const { stacks, commands } = JSON.parse(JSON.stringify(data));
    commands.forEach((cmd) => {
        const l = stacks[cmd.from].length;
        const pack = stacks[cmd.from].splice(l - cmd.count, cmd.count);
        stacks[cmd.to].push(...pack);
    });
    return stacks.map((s) => s[s.length - 1]).join("");
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
