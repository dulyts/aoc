const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });

    const commands = [];
    let i = 0;
    while (i < data.length) {
        const [, cmd, ...params] = data[i].split(" ");
        i++;
        const output = [];
        while (i < data.length && !data[i].startsWith("$")) {
            output.push(data[i]);
            i++;
        }
        commands.push({
            cmd,
            params,
            output,
        });
    }
    return commands;
};

const processData = (data) => {
    let currentDirectory = undefined;
    const dirSize = {};
    data.forEach((d) => {
        if (d.cmd === "cd") {
            if (d.params[0] === "/") currentDirectory = "/";
            else if (d.params[0] === "..")
                currentDirectory = currentDirectory.substring(
                    0,
                    currentDirectory.lastIndexOf("/")
                );
            else {
                if (currentDirectory == "/") {
                    currentDirectory += d.params[0];
                } else {
                    currentDirectory += "/" + d.params[0];
                }
            }
            return;
        }
        if (d.cmd === "ls") {
            let currDirSize = 0;
            d.output.forEach((o) => {
                if (!o.startsWith("dir")) {
                    const fileSize = Number(o.split(" ")[0]);
                    currDirSize += fileSize;
                }
            });
            dirSize[currentDirectory] = currDirSize;
        }
    });
    const fullDirSize = {};
    Object.keys(dirSize).map((d) => {
        let size = dirSize[d];
        Object.keys(dirSize)
            .filter((a) => {
                return a !== d && a.startsWith(d);
            })
            .forEach((a) => (size += dirSize[a]));
        fullDirSize[d] = size;
    });
    return fullDirSize;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const fullDirSize = processData(data);

    return Object.values(fullDirSize)
        .filter((a) => a < 100000)
        .reduce((sum, curr) => sum + curr, 0);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const fullDirSize = processData(data);

    const requiredSpace = 30000000;
    const currentSpace = 70000000 - fullDirSize["/"];
    let lowestDeltaKey = "/";
    Object.keys(fullDirSize).forEach((d) => {
        const asd = currentSpace + fullDirSize[d];
        const asdl = currentSpace + fullDirSize[lowestDeltaKey];
        if (asd > requiredSpace && asd < asdl) {
            lowestDeltaKey = d;
        }
    });

    return fullDirSize[lowestDeltaKey];
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
