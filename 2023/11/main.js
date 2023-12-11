const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("").map((d) => {
                if (d == ".") {
                    return " ";
                }
                return d;
            });
        });
    const stars = [];
    data.forEach((d, x) => {
        d.forEach((dd, y) => {
            if (dd == "#") {
                stars.push({ x: x + 1, y: y + 1 });
            }
        });
    });
    const emptyRows = [];
    const emptyCols = [];
    data.forEach((d, x) => {
        if (d.join("").trim() == "") {
            emptyRows.push(x);
        }
    });
    data[0].forEach((_, y) => {
        let col = [];
        data.forEach((d) => {
            col.push(d[y]);
        });
        if (col.join("").trim() == "") {
            emptyCols.push(y);
        }
    });
    return { stars, emptyRows, emptyCols };
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const stars = data.stars;
    data.emptyRows.reverse().forEach((x) => {
        stars.forEach((s) => {
            if (s.x > x) {
                s.x += 1;
            }
        });
    });
    data.emptyCols.reverse().forEach((y) => {
        stars.forEach((s) => {
            if (s.y > y) {
                s.y += 1;
            }
        });
    });
    const distances = [];
    stars.forEach((s1, idx) => {
        for (let i = idx + 1; i < stars.length; i++) {
            const s2 = stars[i];
            const dist = Math.abs(s2.x - s1.x) + Math.abs(s2.y - s1.y);
            distances.push(dist);
        }
    });
    return distances.reduce((p, c) => p + c, 0);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const stars = data.stars;
    const asd = 1000000;
    // const asd = 100;
    data.emptyRows.reverse().forEach((x) => {
        stars.forEach((s) => {
            if (s.x > x) {
                s.x += asd - 1;
            }
        });
    });
    data.emptyCols.reverse().forEach((y) => {
        stars.forEach((s) => {
            if (s.y > y) {
                s.y += asd - 1;
            }
        });
    });
    let sum = 0;
    stars.forEach((s1, idx) => {
        for (let i = idx + 1; i < stars.length; i++) {
            const s2 = stars[i];
            const dist = Math.abs(s2.x - s1.x) + Math.abs(s2.y - s1.y);
            sum += dist;
        }
    });
    return sum;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
