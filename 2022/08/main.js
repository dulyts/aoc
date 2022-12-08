const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("").map(Number);
        });
    return data;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const N = data.length;
    const M = data[0].length;
    const visibility = new Array(N).fill(0).map(() => new Array(M).fill(0));
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            if (i == 0 || i == N - 1 || j == 0 || j == M - 1) {
                visibility[i][j] = 1;
            }
        }
    }
    for (let i = 1; i < N - 1; i++) {
        let j = 1;
        let max = data[i][0];
        while (j < M) {
            if (data[i][j] > max) {
                visibility[i][j] = 1;
                max = data[i][j];
            }
            j++;
        }

        j = M - 2;
        max = data[i][M - 1];
        while (j > 0) {
            if (data[i][j] > max) {
                visibility[i][j] = 1;
                max = data[i][j];
            }
            j--;
        }
    }
    for (let j = 1; j < M - 1; j++) {
        let i = 1;
        max = data[0][j];
        while (i < N) {
            if (data[i][j] > max) {
                visibility[i][j] = 1;
                max = data[i][j];
            }
            i++;
        }
        i = M - 2;
        max = data[M - 1][j];
        while (i > 0) {
            if (data[i][j] > max) {
                visibility[i][j] = 1;
                max = data[i][j];
            }
            i--;
        }
    }
    let count = 0;
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            count += visibility[i][j];
        }
    }
    return count;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const N = data.length;
    const M = data[0].length;
    let max = 0;
    for (let i = 1; i < N - 1; i++) {
        for (let j = 1; j < M - 1; j++) {
            let countA = 1;
            let ii = i - 1;
            let blocked = data[ii][j] >= data[i][j];
            while (ii > 0 && !blocked) {
                countA++;
                ii--;
                blocked = data[ii][j] >= data[i][j];
            }

            let countB = 1;
            ii = i + 1;
            blocked = data[ii][j] >= data[i][j];
            while (ii < N - 1 && !blocked) {
                countB++;
                ii++;
                blocked = data[ii][j] >= data[i][j];
            }

            let countC = 1;
            let jj = j - 1;
            blocked = data[i][jj] >= data[i][j];
            while (jj > 0 && !blocked) {
                countC++;
                jj--;
                blocked = data[i][jj] >= data[i][j];
            }

            let countD = 1;
            jj = j + 1;
            blocked = data[i][jj] >= data[i][j];
            while (jj < M - 1 && !blocked) {
                countD++;
                jj++;
                blocked = data[i][jj] >= data[i][j];
            }
            const asd = countA * countB * countC * countD;
            if (asd > max) {
                max = asd;
            }
        }
    }
    return max;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
