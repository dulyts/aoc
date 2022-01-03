const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("");
        });
    const pos = [];
    const grid = data.map((d, i) => {
        return d.map((dd, j) => {
            if (["A", "B", "C", "D"].indexOf(dd) !== -1) {
                pos.push({
                    type: dd,
                    pos: [i, j],
                });
                return ".";
            }
            return dd;
        });
    });
    return {
        grid: grid,
        amphs: pos,
    };
};

const sorted = (amphs) => {
    let sorted = true;
    amphs.forEach((a) => {
        switch (a.type) {
            case "A":
                sorted = sorted && a.pos[0] > 1 && a.pos[1] == 3;
                break;
            case "B":
                sorted = sorted && a.pos[0] > 1 && a.pos[1] == 5;
                break;
            case "C":
                sorted = sorted && a.pos[0] > 1 && a.pos[1] == 7;
                break;
            case "D":
                sorted = sorted && a.pos[0] > 1 && a.pos[1] == 9;
                break;

            default:
                break;
        }
    });
    // if (sorted) console.log("asd");
    return sorted;
};

// console.log(sorted([
//     {type: "A", pos: [2,3]},
//     {type: "A", pos: [3,3]},
// ]))
// console.log(sorted([
//     {type: "A", pos: [2,3]},
//     {type: "A", pos: [1,3]},
// ]))
// console.log(sorted([
//     {type: "A", pos: [2,3]},
//     {type: "A", pos: [1,5]},
// ]))
// return
const PREVS = new Set();
const rec = (grid, amphs, energy, prevDir) => {
    const asd = JSON.stringify(amphs);
    if (PREVS.has(asd)) {
        // console.log("asd")
        return Infinity;
    }
    PREVS.add(asd);

    grid.forEach((row,i) => {
        let line = "";
        row.forEach((c,j) => {
            const a = amphs.find(a => a.pos[0] == i && a.pos[1] == j);
            if (a) line += a.type;
            else line += c;
        })
        console.log(line)
    })
    console.clear()
    // console.log("-----")

    // console.log(energy, prevDir, JSON.stringify(amphs));
    if (sorted(amphs)) {
        return energy;
    }

    let minEnergy = Infinity;
    amphs.forEach((p, i) => {
        let validPlace = true;
        switch (p.type) {
            case "A":
                validPlace = validPlace && ((p.pos[0] == 3 && p.pos[1] == 3) || (p.pos[1] == 3 && p.pos[0] == 2 && amphs.find(a => (a.type == "A" && a.pos[0] == 3 && a.pos[1] == 3))));
                break;
            case "B":
                validPlace = validPlace && ((p.pos[0] == 3 && p.pos[1] == 5) || (p.pos[1] == 5 && p.pos[0] == 2 && amphs.find(a => (a.type == "B" && a.pos[0] == 3 && a.pos[1] == 5))));
                break;
            case "C":
                validPlace = validPlace && ((p.pos[0] == 3 && p.pos[1] == 7) || (p.pos[1] == 7 && p.pos[0] == 2 && amphs.find(a => (a.type == "C" && a.pos[0] == 3 && a.pos[1] == 7))));
                break;
            case "D":
                validPlace = validPlace && ((p.pos[0] == 3 && p.pos[1] == 9) || (p.pos[1] == 9 && p.pos[0] == 2 && amphs.find(a => (a.type == "D" && a.pos[0] == 3 && a.pos[1] == 9))));
                break;
        }
        if (validPlace) return;

        for (let dir = 0; dir < 4; dir++) {
            // if (prevDir && Math.abs(prevDir - dir) == 2) continue;
            let newAmps = JSON.parse(JSON.stringify(amphs));
            // console.log(Math.abs(prevDir - dir));
            let x = p.pos[1];
            let y = p.pos[0];
            switch (dir) {
                case 0:
                    x--;
                    break;
                case 1:
                    y--;
                    break;
                case 2:
                    x++;
                    break;
                case 3:
                    y++;
                    break;
            }
            if (y <= 0 || y >= grid.length || x <= 0 || x >= grid[0].length) {
                continue;
            }
            if (grid[y][x] !== "." || amphs.find((a) => a.pos[0] === y && a.pos[1] === x)) {
                continue;
            }
            const newAmp = { ...p, pos: [y, x] };
            // console.log(newAmps)
            newAmps.splice(i, 1, newAmp);
            // newAmps.push(newAmp);

            // console.log(newAmps)
            // return;
            let newEnergy = energy;
            switch (p.type) {
                case "A":
                    newEnergy += 1;
                    break;
                case "B":
                    newEnergy += 10;
                    break;
                case "C":
                    newEnergy += 100;
                    break;
                case "D":
                    newEnergy += 1000;
                    break;

                default:
                    break;
            }
            if (newEnergy > 15000) continue;
            const res = rec(grid, newAmps, newEnergy, dir);
            minEnergy = Math.min(minEnergy, res);
            // console.log(minEnergy)
        }
    });
    return minEnergy;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    // data.grid.forEach(r => console.log(r.join("")))
    // return

    return rec(data.grid, data.amphs, 0, null);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    return null;
};

const inputs = ["sample_0.txt"];
// inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
