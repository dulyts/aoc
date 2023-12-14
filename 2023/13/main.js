const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    const patterns = [];
    let p = [];
    data.forEach((d) => {
        if (d.length == 0) {
            patterns.push(p);
            p = [];
            return;
        }
        p.push(d);
    });
    patterns.push(p);

    const dd = patterns.map((p) => {
        const cols = [];
        for (let y = 0; y < p[0].length; y++) {
            let col = "";
            for (let x = 0; x < p.length; x++) {
                col += p[x][y];
            }
            cols.push(col);
        }
        return {
            rows: p,
            cols,
        };
    });
    return dd;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    return data
        .map((d, idx) => {
            for (let y = 1; y < d.cols.length; y++) {
                let i1 = y - 1;
                let i2 = y;
                let isSame = true;
                while (i1 >= 0 && i2 < d.cols.length && isSame) {
                    isSame = d.cols[i1] == d.cols[i2];
                    i1--;
                    i2++;
                }
                if (isSame) {
                    return y;
                }
            }

            for (let x = 1; x < d.rows.length; x++) {
                let i1 = x - 1;
                let i2 = x;
                let isSame = true;
                while (i1 >= 0 && i2 < d.rows.length && isSame) {
                    isSame = d.rows[i1] == d.rows[i2];
                    i1--;
                    i2++;
                }
                if (isSame) {
                    return x * 100;
                }
            }
        })
        .reduce((p, c) => p + c, 0);
};

const difference = (a, b) => {
    return a.split("").reduce((p, aa, idx) => {
        const bb = b[idx];
        if (aa != bb) {
            return p + 1;
        }
        return p;
    }, 0);
};

const findSimmetry = (array, mult) => {
    for (let x = 1; x < array.length; x++) {
        let i1 = x - 1;
        let i2 = x;
        let diff = 0;
        while (i1 >= 0 && i2 < array.length) {
            diff += difference(array[i1], array[i2]);
            i1--;
            i2++;
        }
        if (diff == 1) {
            return x * mult;
        }
    }
};

const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    return data
        .map((d, idx) => {
            const horizontalSimmetry = findSimmetry(d.rows, 100);
            if (horizontalSimmetry) return horizontalSimmetry;
            const verticalSimmetry = findSimmetry(d.cols, 1);
            if (verticalSimmetry) return verticalSimmetry;
        })
        .reduce((p, c) => p + c, 0);
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
// inputs.push("input_2.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
