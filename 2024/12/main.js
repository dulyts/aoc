const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("");
        });
    // console.log(data);
    return data;
};

const isInRange = (map, { x, y }) => {
    return x >= 0 && x < map.length && y >= 0 && y < map[x].length;
};
const isPerimeter = (map, id, coord) => {
    const inRange = isInRange(map, coord);
    if (!inRange) return true;
    const { x, y } = coord;
    return map[x][y] !== id;
};

const calc = (map, x, y) => {
    let res = {
        id: map[x][y],
        area: 1,
        perimeter: 0,
    };
    const leftCoord = { x, y: y - 1 };
    const rightCoord = { x, y: y + 1 };
    const upCoord = { x: x - 1, y: y };
    const downCoord = { x: x + 1, y: y };

    res.perimeter += isPerimeter(map, res.id, leftCoord) ? 1 : 0;
    res.perimeter += isPerimeter(map, res.id, rightCoord) ? 1 : 0;
    res.perimeter += isPerimeter(map, res.id, upCoord) ? 1 : 0;
    res.perimeter += isPerimeter(map, res.id, downCoord) ? 1 : 0;
    return res;
};

const walk = (oMap, map, curr, id) => {
    if (!isInRange(map, curr)) return;
    const { x, y } = curr;
    if (id != oMap[x][y]) return;
    map[x][y] = oMap[x][y];
    oMap[x][y] = ".";
    walk(oMap, map, { x, y: y - 1 }, id);
    walk(oMap, map, { x, y: y + 1 }, id);
    walk(oMap, map, { x: x - 1, y }, id);
    walk(oMap, map, { x: x + 1, y }, id);
};

const processMap = (map, x, y) => {
    if (map[x][y] === ".") return undefined;
    const curr = JSON.parse(JSON.stringify(map));
    for (let i = 0; i < curr.length; i++) {
        for (let j = 0; j < curr[i].length; j++) {
            curr[i][j] = ".";
        }
    }
    walk(map, curr, { x, y }, map[x][y]);
    return curr;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const smallMaps = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            const asd = processMap(data, i, j);
            if (asd) {
                smallMaps.push(asd);
            }
        }
    }

    let res = 0;
    smallMaps.forEach((sm) => {
        const d = {};
        for (let i = 0; i < sm.length; i++) {
            for (let j = 0; j < sm[i].length; j++) {
                if (sm[i][j] == ".") continue;
                const dd = calc(sm, i, j);
                if (!(dd.id in d)) {
                    d[dd.id] = { area: 0, perimeter: 0 };
                }
                d[dd.id].area += dd.area;
                d[dd.id].perimeter += dd.perimeter;
            }
        }
        Object.keys(d).forEach((k) => {
            res += d[k].area * d[k].perimeter;
        });
    });
    return res;
};
const part2 = (input) => {
    d = JSON.parse(JSON.stringify(input));
    const N = d.length;
    const M = d[0].length;
    const data = Array(N * 2)
        .fill(".")
        .map((d) => Array(M * 2).fill("."));
    d.forEach((dd, x) =>
        dd.forEach((ddd, y) => {
            data[x * 2][y * 2] = ddd;
            data[x * 2 + 1][y * 2] = ddd;
            data[x * 2][y * 2 + 1] = ddd;
            data[x * 2 + 1][y * 2 + 1] = ddd;
        })
    );
    data.forEach((d) => {
        d.unshift(".");
        d.push(".");
    });
    const MM = data[0].length;
    data.unshift(Array(MM).fill("."));
    data.push(Array(MM).fill("."));

    const smallMaps = [];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            const asd = processMap(data, i, j);
            if (asd) {
                smallMaps.push(asd);
            }
        }
    }

    let res = 0;
    smallMaps.forEach((sm) => {
        let area = 0;
        let corner = 0;

        for (let i = 0; i < sm.length - 1; i++) {
            for (let j = 0; j < sm[i].length - 1; j++) {
                if (sm[i][j] != ".") area++;
                let dotCount = 0;
                for (let k = 0; k < 2; k++) {
                    for (let l = 0; l < 2; l++) {
                        if (sm[i + k][j + l] === ".") {
                            dotCount++;
                        }
                    }
                }
                if (dotCount % 2 === 1) {
                    corner++;
                }
                if (
                    dotCount == 2 &&
                    (sm[i][j] == sm[i + 1][j + 1] ||
                        sm[i + 1][j] == sm[i][j + 1])
                ) {
                    corner += 2;
                }
            }
        }
        area /= 4;
        res += area * corner;
    });

    return res;
};

const inputs = ["sample_0.txt", "sample_1.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
