const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split("\n")
        .slice(0, -1)
        .map((d) => {
            return d.trim();
        });
    // console.log(data);
    return data;
};

const getBitCountInPos = (data, index) => {
    return data.reduce(
        (prev, curr) => {
            return {
                zero: (prev.zero += Number(curr[index]) == 0 ? 1 : 0),
                one: (prev.one += Number(curr[index]) == 1 ? 1 : 0),
            };
        },
        { zero: 0, one: 0 }
    );
};

const getMostCommon = (data, index) => {
    const counts = getBitCountInPos(data, index);
    return counts.zero > counts.one ? 0 : 1;
};

const getLeastCommon = (data, index) => {
    const counts = getBitCountInPos(data, index);
    return counts.zero <= counts.one ? 0 : 1;
};

const part1 = (data) => {
    const l = data[0].length;
    let gamma = 0;
    let epsylon = 0;
    for (let i = 0; i < l; i++) {
        const counts = getBitCountInPos(data, i);
        const pos = l - 1 - i;
        gamma += (counts.zero > counts.one ? 0 : 1) * Math.pow(2, pos);
        epsylon += (counts.zero > counts.one ? 1 : 0) * Math.pow(2, pos);
    }
    return gamma * epsylon;
};

const filterListByBitCriteria = (data, fn) => {
    let list = [...data];
    let pos = 0;
    while (list.length > 1) {
        const commonBit = fn(list, pos);
        list = list.filter((e) => Number(e[pos]) === commonBit);
        pos += 1;
    }
    return list;
}

const part2 = (data) => {
    const most = parseInt(filterListByBitCriteria(data, getMostCommon).join(""), 2);
    const least = parseInt(filterListByBitCriteria(data, getLeastCommon).join(""), 2);
    return most * least;
};

// const filename = "sample_0.txt";
const filename = "input.txt";
const data = loadData(filename);
console.log("part1", part1(data));
console.log("part2", part2(data));
