const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("");
        })[0];
    console.log(data);
    return data;
};

const rocks = [
    {
        width: 4,
        height: 1,
        parts: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
        ],
    },
    {
        width: 3,
        height: 3,
        parts: [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 2 },
        ],
    },
    {
        width: 3,
        height: 3,
        parts: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
        ],
    },
    {
        width: 1,
        height: 4,
        parts: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
            { x: 0, y: 3 },
        ],
    },
    {
        width: 2,
        height: 2,
        parts: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
        ],
    },
];

const sideMove = (cave, rockIdx, rockCoord, move) => {
    const rock = rocks[rockIdx];
    switch (move) {
        case ">":
            if (rockCoord.x + rock.width >= 7) {
                return [false, { ...rockCoord }];
            }
            for (let i = 0; i < rock.parts.length; i++) {
                const pCoord = {
                    x: rockCoord.x + rock.parts[i].x + 1,
                    y: rockCoord.y + rock.parts[i].y,
                };
                if (cave[pCoord.y][pCoord.x] != 0) {
                    return [false, { ...rockCoord }];
                }
            }
            return [true, { ...rockCoord, x: rockCoord.x + 1 }];
        case "<":
            if (rockCoord.x <= 0) {
                return [false, { ...rockCoord }];
            }
            for (let i = 0; i < rock.parts.length; i++) {
                const pCoord = {
                    x: rockCoord.x + rock.parts[i].x - 1,
                    y: rockCoord.y + rock.parts[i].y,
                };
                if (cave[pCoord.y][pCoord.x] != 0) {
                    return [false, { ...rockCoord }];
                }
            }
            return [true, { ...rockCoord, x: rockCoord.x - 1 }];
    }
};

const fallDown = (cave, rockIdx, rockCoord) => {
    const rock = rocks[rockIdx];
    for (let i = 0; i < rock.parts.length; i++) {
        const pCoord = {
            x: rockCoord.x + rock.parts[i].x,
            y: rockCoord.y + rock.parts[i].y - 1,
        };
        if (pCoord.y < 0 || cave[pCoord.y][pCoord.x] != 0) {
            return [false, { ...rockCoord }];
        }
    }
    return [true, { ...rockCoord, y: rockCoord.y - 1 }];
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let rockIdx = 0;
    let patternIdx = 0;
    const cave = new Array(4000).fill(0).map(() => new Array(7).fill(0));
    let highest = 0;
    let rockCoord = { x: 2, y: highest + 3 };
    while (rockIdx < 2023) {
        console.log(rockIdx, patternIdx, rockCoord);
        let success = undefined;
        [success, rockCoord] = sideMove(
            cave,
            rockIdx % 5,
            rockCoord,
            data[patternIdx % data.length]
        );
        [success, rockCoord] = fallDown(cave, rockIdx % 5, rockCoord);
        if (!success) {
            rocks[rockIdx % 5].parts.forEach((p) => {
                const pCoord = {
                    x: rockCoord.x + p.x,
                    y: rockCoord.y + p.y,
                };
                highest = Math.max(highest, pCoord.y);
                cave[pCoord.y][pCoord.x] = 1;
            });
            rockIdx++;
            rockCoord = { x: 2, y: highest + 3 + 1 };
        }
        patternIdx++;
    }
    for (let i = 1000; i >= 0; i--) {
        console.log(
            "|" + cave[i].map((asd) => (asd == 0 ? "." : "#")).join("") + "|"
        );
    }
    console.log("+-------+");
    return highest - 1;
};

const floor = "1111111";
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let rockIdx = 0;
    let patternIdx = 0;
    const cave = new Array(40000).fill(0).map(() => new Array(7).fill(0));
    const sss = new Array(40000).fill(-1);
    let highest = 0;
    let rockCoord = { x: 2, y: highest + 3 };
    let bottom = undefined;
    while (rockIdx < 3000) {
        // while (true) {
        if (bottom == undefined && highest > 2) {
            bottom =
                cave[2].join("") +
                "\n" +
                cave[1].join("") +
                "\n" +
                cave[0].join("");
        }
        console.log(rockIdx, patternIdx, rockCoord);
        let success = undefined;
        [success, rockCoord] = sideMove(
            cave,
            rockIdx % 5,
            rockCoord,
            data[patternIdx % data.length]
        );
        [success, rockCoord] = fallDown(cave, rockIdx % 5, rockCoord);
        if (!success) {
            rocks[rockIdx % 5].parts.forEach((p) => {
                const pCoord = {
                    x: rockCoord.x + p.x,
                    y: rockCoord.y + p.y,
                };
                highest = Math.max(highest, pCoord.y);
                cave[pCoord.y][pCoord.x] = 1;
                sss[pCoord.y] = rockIdx;
                if (cave[pCoord.y].join("") == floor) {
                    return "!!!!" + pCoord.y;
                }
            });
            rockIdx++;
            rockCoord = { x: 2, y: highest + 3 + 1 };
        }
        // if (highest > 1000) {
        //     let i = 3;
        //     let first = undefined;
        //     let firstR = undefined;
        //     let period = undefined;
        //     let curr = asd(cave, i);
        //     while (i < highest && curr != bottom) {
        //         i++;
        //         curr = asd(cave, i);
        //     }
        //     if (patternIdx % data.length == 0 && curr == bottom) {
        //         first = i - 2;
        //         firstR = rockIdx;
        //     }
        //     i++;
        //     curr = asd(cave, i);
        //     while (i < highest - 20 && curr != bottom) {
        //         i++;
        //         curr = asd(cave, i);
        //     }
        //     if (patternIdx % data.length == 0 && curr == bottom) {
        //         period = i - first;
        //         console.log(
        //             rockIdx +
        //                 "; i:" +
        //                 i +
        //                 "; first:" +
        //                 first +
        //                 "; firstR:" +
        //                 firstR +
        //                 "; period: " +
        //                 period +
        //                 "; highest:" +
        //                 highest
        //         );
        //         break;
        //     }
        // }
        patternIdx++;
    }
    const stream = fs.createWriteStream("out.txt");
    stream.once("open", function (fd) {
        let i = 0;
        while (cave[i].join("") != "0000000") {
            stream.write(
                "|" +
                    cave[i].map((asd) => (asd == 0 ? "." : "#")).join("") +
                    "|" +
                    sss[i] +
                    "\n"
            );
            i++;
        }
        // stream.write(i);
        stream.end();
    });
    return null;
};

const asd = (cave, i) => {
    return (
        cave[i].join("") +
        "\n" +
        cave[i - 1].join("") +
        "\n" +
        cave[i - 2].join("")
    );
};

// const inputs = ["sample_0.txt"];
// inputs.push("input.txt");
// inputs.forEach((filename) => {
//     console.log(filename);
//     const data = loadData(filename);
//     // console.log("part1", part1(data));
//     console.log("part2", part2(data));
// });

const data = fs
    // .readFileSync("out_sample.txt", "utf8")
    .readFileSync("out.txt", "utf8")
    .split(/\r?\n/)
    .slice(0, -1)
    .map((d) => {
        return d.split("|");
    });

console.log(data);

let max = 0;
let maxi = 0;
let maxj = 0;

// for (let i = 1; i < data.length; i++) {
//     let j = i + 1;
//     while (j < data.length) {
//         if (data[i][1] == data[j][1]) {
//             let equal = true;
//             for (let k = 0; k < j - i; k++) {
//                 if (j + k >= data.length) {
//                     equal = false;
//                     break;
//                 }
//                 equal &= data[i + k][1] == data[j + k][1];
//                 if (!equal) break;
//             }
//             if (equal) {
//                 if (j - i > max) {
//                     console.log(i, j);
//                     max = j - i;
//                     maxi = i;
//                     maxj = j;
//                 }
//             }
//         }
//         j++;
//     }
// }
maxi = 521;
maxj = 3216;

console.log(maxi, maxj);
console.log(data[maxi][2], data[maxj][2], maxj-maxi);
console.log((1000000000000-data[maxi][2]) / (data[maxj][2]-data[maxi][2])*(maxj-maxi)+maxi)
console.log(1514285714288)

// 521 3216
// 345 2080

// (1000000000000-15) / (50-15)*53+25
// (1000000000000-345) / (2080-345)*2695+521

// 521 8606
// 345 3815

// console.log((1000000000000-345) / (3815-345)*(8606-521)+521)
1514285714288
1553314118646