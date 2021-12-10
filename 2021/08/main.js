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

const part2_2 = (data) => {
    let sum = 0;
    data = [...data];
    data.forEach((d) => {
        const currentCounts = ["a", "b", "c", "d", "e", "f", "g"].reduce((prev, curr) => {
            prev[curr] = 0;
            return prev;
        }, {});
        const mapping = {};
        d.s.forEach((s) => {
            s.forEach((ss) => {
                currentCounts[ss] += 1;
            });
        });
        Object.keys(currentCounts).forEach((c) => {
            if (currentCounts[c] === 4) mapping["e"] = c;
            if (currentCounts[c] === 6) mapping["b"] = c;
            if (currentCounts[c] === 9) mapping["f"] = c;
        });
        {
            const c = d.s
                .find((ss) => ss.length == 2)
                .find((c) => c != mapping["f"]);
            mapping["c"] = c;
        }
        Object.keys(currentCounts).forEach((c) => {
            if (currentCounts[c] === 8 && c != mapping["c"]) mapping["a"] = c;
        });

        const dd = d.s
            .find((ss) => {
                return ss.length == 4;
            })
            .find((ss) => {
                return (
                    mapping["b"] != ss &&
                    mapping["c"] != ss &&
                    mapping["f"] != ss
                );
            });
        mapping["d"] = dd;

        Object.keys(currentCounts).forEach((c) => {
            if (currentCounts[c] === 7 && c != mapping["d"]) mapping["g"] = c;
        });

        const tmp = {};
        Object.keys(mapping).forEach((c) => {
            tmp[mapping[c]] = c;
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

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    
    console.time("part2")
    console.log("part2", part2(data));
    console.timeEnd("part2")

    console.time("part2_2")
    console.log("part2_2", part2_2(data));
    console.timeEnd("part2_2")
});
