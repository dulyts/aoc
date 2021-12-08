const fs = require("fs");
const path = require("path");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [a, b] = d.split(" | ");
            return {
                s: a.split(" ").map((d) => d.split("")),
                o: b.split(" ").map((d) => d.split("")),
            };
        });
    // console.log(data);
    return data;
};

const numbers = {
    abcefg: 0,
    cf: 1,
    acdeg: 2,
    acdfg: 3,
    bcdf: 4,
    abdfg: 5,
    abdefg: 6,
    acf: 7,
    abcdefg: 8,
    abcdfg: 9,
};

const part1 = (data) => {
    data = [...data];

    let cc = 0;
    data.forEach((d) => {
        d.o.forEach((out) => {
            if ([2, 4, 3, 7].indexOf(out.length) > -1) {
                cc += 1;
            }
        });
    });

    return cc;
};
const part2 = (data) => {
    let sum = 0;
    data.forEach((d) => {
        const segments = {
            a: [],
            b: [],
            c: [],
            d: [],
            e: [],
            f: [],
            g: [],
        };
        const one = d.s.find((c) => c.length == 2);
        segments.c.push(...one);
        segments.f.push(...one);

        const seven = d.s
            .find((c) => c.length == 3)
            .filter((c) => segments.c.indexOf(c) === -1);
        segments.a = seven[0];

        const four = d.s
            .find((c) => c.length == 4)
            .filter((c) => segments.c.indexOf(c) === -1);
        segments.b.push(...four);
        segments.d.push(...four);

        const twoThreeFive = d.s.filter((c) => c.length == 5);
        const five = twoThreeFive.find(
            (ss) =>
                ss.indexOf(segments.b[0]) > -1 && ss.indexOf(segments.b[1]) > -1
        );
        const _g = five.filter(
            (c) =>
                c !== segments.a &&
                segments.b.indexOf(c) === -1 &&
                segments.c.indexOf(c) === -1
        );
        segments.g = _g[0];
        const twoThree = twoThreeFive.filter(
            (ss) =>
                !(
                    ss.indexOf(segments.b[0]) > -1 &&
                    ss.indexOf(segments.b[1]) > -1
                )
        );
        const three = twoThree.find(
            (ss) =>
                ss.indexOf(segments.c[0]) > -1 && ss.indexOf(segments.c[1]) > -1
        );

        const _d = three.filter(
            (c) =>
                c !== segments.a &&
                c !== segments.g &&
                segments.c.indexOf(c) === -1
        )[0];
        segments.b = segments.b.filter((c) => c != _d)[0];
        segments.d = _d;

        const two = twoThree.find(
            (ss) =>
                !(
                    ss.indexOf(segments.c[0]) > -1 &&
                    ss.indexOf(segments.c[1]) > -1
                )
        );
        const _e = two.filter(
            (c) =>
                c !== segments.a &&
                c !== segments.g &&
                c !== segments.d &&
                segments.c.indexOf(c) === -1
        )[0];
        segments.e = _e;
        const _c = two.filter(
            (c) =>
                c !== segments.a &&
                c !== segments.g &&
                c !== segments.d &&
                c !== segments.e
        )[0];
        segments.f = segments.f.filter((c) => c != _c)[0];
        segments.c = _c;

        const tmp = {};
        Object.keys(segments).forEach((d) => {
            tmp[segments[d]] = d;
        });

        let num = "";
        d.o.forEach((out) => {
            const n = out
                .map((o) => tmp[o])
                .sort()
                .join("");
            if (numbers[n] != undefined) {
                num += numbers[n];
            }
        });
        sum += Number(num);
    });
    return sum;
};

// const filename = "sample_0.txt";
const filename = "input.txt";
const data = loadData(filename);
console.log("part1", part1(data));
console.log("part2", part2(data));

