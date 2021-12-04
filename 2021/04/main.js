const fs = require("fs");

const loadData = (filename) => {
    const data = fs.readFileSync(filename, "utf8").split("\n").slice(0, -1);
    const numbers = data[0].split(",").map(Number);
    let i = 2;
    const tables = [];
    let currentGrid = [];
    while (i < data.length) {
        if (data[i] === "") {
            tables.push(currentGrid);
            currentGrid = [];
            i += 1;
            continue;
        }
        const row = data[i]
            .trim()
            .replace(/\s\s+/g, " ")
            .split(" ")
            .map((v) => ({
                value: Number(v),
                marked: false,
            }));
        currentGrid.push(row);
        i += 1;
    }
    tables.push(currentGrid);
    const parsed = {
        numbers,
        tables,
    };
    return parsed;
};

const part1 = (data) => {
    let i = 0;
    let win = false;
    let result = null;
    while (!win && i < data.numbers.length) {
        data.tables.forEach((table) => {
            if (win) {
                return;
            }
            table.forEach((row, ii) => {
                if (win) {
                    return;
                }
                row.forEach((col, jj) => {
                    if (win) {
                        return;
                    }
                    if (col.value === data.numbers[i]) {
                        col.marked = true;
                        let countRow = 0;
                        let countColumn = 0;
                        for (let k = 0; k < 5; k++) {
                            countRow += table[ii][k].marked ? 1 : 0;
                            countColumn += table[k][jj].marked ? 1 : 0;
                        }
                        if (countRow === 5) {
                            let asd = 0;
                            table.forEach((r) => {
                                r.forEach((c) => {
                                    asd += c.marked ? 0 : c.value;
                                });
                            });
                            win = true;
                            result = asd * data.numbers[i];
                            return;
                        }
                        if (countColumn === 5) {
                            let asd = 0;
                            table.forEach((r) => {
                                r.forEach((c) => {
                                    asd += c.marked ? 0 : c.value;
                                });
                            });
                            win = true;
                            result = asd * data.numbers[i];
                            return;
                        }
                    }
                });
            });
        });
        i += 1;
    }
    return result;
};
const part2 = (data) => {
    let i = 0;
    let win = false;
    let result = null;
    const tableWins = Array(data.tables.length).map((d) => false);
    while (!win && i < data.numbers.length) {
        data.tables.forEach((table, tt) => {
            if (win) {
                return;
            }
            table.forEach((row, ii) => {
                if (win) {
                    return;
                }
                row.forEach((col, jj) => {
                    if (win) {
                        return;
                    }
                    if (col.value === data.numbers[i]) {
                        col.marked = true;
                        let countRow = 0;
                        let countColumn = 0;
                        for (let k = 0; k < 5; k++) {
                            countRow += table[ii][k].marked ? 1 : 0;
                            countColumn += table[k][jj].marked ? 1 : 0;
                        }
                        if (countRow === 5) {
                            tableWins[tt] = true;
                        }
                        if (countColumn === 5) {
                            tableWins[tt] = true;
                        }
                        let winCount = 0;
                        tableWins.forEach((t) => (winCount += t ? 1 : 0));
                        if (winCount === tableWins.length) {
                            let asd = 0;
                            table.forEach((r) => {
                                r.forEach((c) => {
                                    asd += c.marked ? 0 : c.value;
                                });
                            });
                            result = asd * data.numbers[i];
                            win = true;
                            return;
                        }
                    }
                });
            });
        });
        i += 1;
    }
    return result;
};

// const filename = "sample_0.txt";
const filename = "input.txt";
const data = loadData(filename);
console.log("part1", part1(data));
console.log("part2", part2(data));
