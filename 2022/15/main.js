const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [ss, bb] = d
                .split("Sensor at ")[1]
                .split(": closest beacon is at ")
                .map((dd) => {
                    const [x, y] = dd
                        .split(", ")
                        .map((dd) => dd.split("=")[1])
                        .map(Number);
                    return { x, y };
                });
            return {
                sensor: ss,
                beacon: bb,
                dist: distance(ss, bb),
            };
        });

    return data;
};

const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const toCoordStr = ({ x, y }) => `${x}#${y}`;

// const fillMap = (map, beacons, from, dist) => {
//     for (let i = -dist; i <= dist; i++) {
//         for (let j = -dist; j <= dist; j++) {
//             const coord = { x: from.x + i, y: from.y + j };
//             if (
//                 distance(from, coord) <= dist &&
//                 !beacons.has(toCoordStr(coord))
//             ) {
//                 // console.log(coord);
//                 map.add(toCoordStr(coord));
//             }
//         }
//     }
// };

const part1 = (data, y) => {
    data = JSON.parse(JSON.stringify(data));
    const beacons = new Set();
    data.forEach((dd) => beacons.add(toCoordStr(dd.beacon)));
    const asd = new Set();
    data.forEach((d) => {
        let i = 0;
        while (distance({ x: d.sensor.x + i, y: y }, d.sensor) <= d.dist) {
            if (!beacons.has(toCoordStr({ x: d.sensor.x + i, y: y }))) {
                asd.add(d.sensor.x + i);
            }
            if (!beacons.has(toCoordStr({ x: d.sensor.x - i, y: y }))) {
                asd.add(d.sensor.x - i);
            }
            i++;
        }
    });
    return asd.size;
};
const aaaa = 10000;
const part2 = (data, max) => {
    data = JSON.parse(JSON.stringify(data));
    data.forEach((d) => {
        for (let i = -d.dist - 1; i <= d.dist + 1; i++) {
            const j = d.dist + 1 - Math.abs(i);
            const x = d.sensor.x + i;
            const y1 = d.sensor.y + j;
            const y2 = d.sensor.y - j;
            // console.log(x, y1, y2);

            let seeAny = false;
            if (x >= 0 && x <= max && y1 >= 0 && y1 <= max) {
                data.forEach((d) => {
                    seeAny |= distance({ x, y: y1 }, d.sensor) <= d.dist;
                });
                if (!seeAny) {
                    console.log(x, y1, x * 4000000 + y1);
                    return x * 4000000 + y1;
                }
            }
            if (x >= 0 && x <= max && y2 >= 0 && y2 <= max) {
                data.forEach((d) => {
                    seeAny |= distance({ x, y: y2 }, d.sensor) <= d.dist;
                });
                if (!seeAny) {
                    console.log(x, y2, x * 4000000 + y2);
                    return x * 4000000 + y2;
                }
            }
        }
    });

    // const d = { sensor: { x: 0, y: 0 }, dist: 2 };
    // for (let i = -d.dist - 1; i <= d.dist + 1; i++) {
    //     const j = d.dist + 1 - Math.abs(i);
    //     const x = d.sensor.x + i;
    //     const y1 = d.sensor.y + j;
    //     const y2 = d.sensor.y - j;
    //     console.log(x, y1, y2);
    // }

    // for (let i = 0; i < data.length - 1; i++) {
    //     for (let j = i + 1; j < data.length; j++) {
    //         const dist = distance(data[i].sensor, data[j].sensor);
    //         if (
    //             dist < data[i].dist + data[j].dist ||
    //             dist > data[i].dist + data[j].dist + 10
    //         ) {
    //             continue;
    //         }
    //         const x =
    //             data[i].sensor.x -
    //             Math.round((data[i].sensor.x - data[j].sensor.x) / 2);
    //         const y =
    //             data[i].sensor.y -
    //             Math.round((data[i].sensor.y - data[j].sensor.y) / 2);
    //         for (
    //             let xx = Math.max(x - aaaa, 0);
    //             xx <= Math.min(x + aaaa, max);
    //             xx++
    //         ) {
    //             for (
    //                 let yy = Math.max(y - aaaa, 0);
    //                 yy <= Math.min(y + aaaa, max);
    //                 yy++
    //             ) {
    //                 let seeAny = false;
    //                 data.forEach((d) => {
    //                     seeAny |=
    //                         distance({ x: xx, y: yy }, d.sensor) <= d.dist;
    //                 });
    //                 if (!seeAny) {
    //                     return xx * 4000000 + yy;
    //                 }
    //             }
    //         }
    //     }
    // }
    return null;
};

const inputs = [{ filename: "sample_0.txt", y: 10, max: 20 }];
inputs.push({ filename: "input.txt", y: 2000000, max: 4000000 });
inputs.forEach((i) => {
    console.log(i.filename);
    const data = loadData(i.filename);
    console.log("part1", part1(data, i.y));
    console.log("part2", part2(data, i.max));
});
