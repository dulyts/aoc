const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d.split("").map(Number);
        })[0];
    const parsed = [];
    for (let i = 0; i < data.length; i += 2) {
        for (let j = 0; j < data[i]; j++) {
            parsed.push(i / 2);
        }
        if (i + 1 >= data.length) continue;
        for (let j = 0; j < data[i + 1]; j++) {
            parsed.push(".");
        }
    }
    return parsed;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let head = data.findIndex((d) => d === ".");
    let tail = data.length - 1;
    while (head < tail) {
        data[head] = data[tail];
        data[tail] = ".";
        while (head < tail && data[head] != ".") {
            head++;
        }
        while (tail > head && data[tail] == ".") {
            tail--;
        }
    }
    let checksum = 0;
    data.forEach((d, idx) => {
        if (d != ".") {
            checksum += idx * d;
        }
    });
    return checksum;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const asd = [];
    for (let i = 0; i < data.length; i++) {
        let j = i + 1;
        while (j < data.length && data[i] === data[j]) {
            j++;
        }
        asd.push({ id: data[i], c: j - i });
        i = j - 1;
    }
    let maxId = 0;
    asd.forEach((d) => {
        if (d.id != "." && d.id > maxId) {
            maxId = d.id;
        }
    });
    console.log(asd);
    console.log(maxId);
    let currId = maxId;
    // print(asd);
    while (currId >= 0) {
        let currIdx = asd.findIndex((d) => d.id == currId);
        let freeSpaceIdx = asd.findIndex((d) => {
            return d.id === "." && d.c >= asd[currIdx].c;
        });
        // console.log("-->", freeSpaceIdx, currIdx, currId);
        if (currIdx < freeSpaceIdx || freeSpaceIdx < 0) {
            currId--;
            continue;
        }
        if (asd[freeSpaceIdx].c === asd[currIdx].c) {
            asd[freeSpaceIdx].id = asd[currIdx].id;
            asd[currIdx].id = ".";
        } else {
            const remain = asd[freeSpaceIdx].c - asd[currIdx].c;
            asd.splice(freeSpaceIdx, 0, { ...asd[currIdx] });
            currIdx++;
            freeSpaceIdx++;
            asd[currIdx].id = ".";
            asd[freeSpaceIdx].c = remain;
        }
        currId--;
        // print(asd);
    }

    const str = asd
        .map((d) => {
            let a = "";
            for (let i = 0; i < d.c; i++) {
                a += d.id;
            }
            return a;
        })
        .join("")
        .split("");

    console.log(str.join(""));
    let checksum = 0;
    // str.forEach((d, idx) => {
    //     if (d != ".") {
    //         checksum += idx * d;
    //     }
    // });

    let i = 0;
    asd.forEach((d, idx) => {
        console.log(d.id);
        if (d.id != ".") {
            let c = d.c;
            while (c > 0) {
                checksum += i * d.id;
                i++;
                c--;
            }
        } else {
            i += d.c;
        }
    });
    return checksum;
};

const print = (asd) => {
    console.log(
        asd
            .map((d) => {
                let a = "";
                for (let i = 0; i < d.c; i++) {
                    a += d.id;
                }
                return a;
            })
            .join("")
    );
};

// 84889168404 - wrong
// 1492187058950 - wrong
// 112362819606
// 118537996460

const inputs = ["sample_0.txt"];
// inputs.push("sample_1.txt");
// inputs.push("sample_2.txt");
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
