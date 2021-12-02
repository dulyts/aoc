const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split("\n")
        .slice(0, -1)
        .map((d) => {
            const [command, value] = d.split(" ");
            return { command, value: +value };
        });
    // console.log(data)
    return data;
};

const part1 = (data) => {
    const pos = { x: 0, y: 0 };
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        switch (element.command) {
            case "forward":
                pos.x += element.value;
                break;
            case "down":
                pos.y += element.value;
                break;
            case "up":
                pos.y -= element.value;
                break;

            default:
                throw Error("Nah");
        }
    }
    return pos.x * pos.y;
};
const part2 = (data) => {
    const pos = { x: 0, y: 0, aim: 0 };
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        switch (element.command) {
            case "forward":
                pos.x += element.value;
                pos.y += pos.aim * element.value;
                break;
            case "down":
                // pos.y += element.value;
                pos.aim += element.value;
                break;
            case "up":
                // pos.y -= element.value;
                pos.aim -= element.value;
                break;

            default:
                throw Error("Nah");
        }
    }
    return pos.x * pos.y;
};

// const filename = "sample_0.txt";
const filename = "input.txt";
const data = loadData(filename);
console.log("part1", part1(data));
console.log("part2", part2(data));
