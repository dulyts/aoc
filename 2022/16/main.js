const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [a, b] = d.split(" has flow rate=");
            let aa, bb;
            if (b.includes("tunnels")) {
                [aa, bb] = b.split("; tunnels lead to valves ");
            } else {
                [aa, bb] = b.split("; tunnel leads to valve ");
            }
            return {
                from: a.split(" ")[1],
                rate: Number(aa),
                to: bb.split(", "),
            };
        })
        .reduce((prev, curr) => {
            const { from, ...remain } = curr;
            prev[from] = remain;
            return prev;
        }, {});
    const asd = Object.keys(data).filter((d) => data[d].rate > 0);

    const pairs = createPairs(["AA", ...asd])
        .map((p) => ({
            ...p,
            dist: findShortestPath(data, p.from, p.to, 0),
        }))
        .reduce((prev, curr) => {
            prev[`${curr.from}-${curr.to}`] = curr.dist;
            return {
                ...prev,
                [`${curr.from}-${curr.to}`]: curr.dist,
                [`${curr.to}-${curr.from}`]: curr.dist,
            };
        }, {});
    return { data, asd, pairs };
};

const createPairs = (arr) => {
    const pairs = [];
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            pairs.push({ from: arr[i], to: arr[j] });
        }
    }
    return pairs;
};

const findShortestPath = (data, curr, to, count) => {
    if (count > 12) return undefined;
    if (curr == to) {
        return 0;
    }
    let min = Infinity;
    data[curr].to.forEach((d) => {
        const p = findShortestPath(data, d, to, count + 1);
        if (p != undefined) min = Math.min(min, p);
    });
    return min + 1;
};

const part1 = (d) => {
    const { data, asd, pairs } = d;

    const permute = (
        arr,
        prev = undefined,
        current = "AA",
        minutes = 30,
        asd = 0
    ) => {
        let newMinutes = +minutes;
        let newAsd = +asd;
        if (prev != undefined) {
            if (pairs[`${prev}-${current}`] == undefined) return Infinity;
            newMinutes -= pairs[`${prev}-${current}`] + 1;
            if (newMinutes < 0) return asd;
            newAsd += newMinutes * data[current].rate;
        }
        if (arr.length === 0) {
            return newAsd;
        } else {
            let max = 0;
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                max = Math.max(
                    max,
                    permute(curr.slice(), current, next[0], newMinutes, newAsd)
                );
            }
            return max;
        }
    };

    const max = permute(asd);
    return max;
};

function getCombinations(chars, len) {
    var result = [];
    var f = function (prefix, chars) {
        for (var i = 0; i < chars.length; i++) {
            var elem = [...prefix, chars[i]];
            if (elem.length == len) result.push(elem);
            f(elem, chars.slice(i + 1));
        }
    };
    f([], chars);
    return result;
}

const part2 = (d) => {
    const { data, asd, pairs } = d;

    const permute = (
        arr,
        prev = undefined,
        current = "AA",
        minutes = 26,
        asd = 0
    ) => {
        let newMinutes = +minutes;
        let newAsd = +asd;
        if (prev != undefined) {
            if (pairs[`${prev}-${current}`] == undefined) return Infinity;
            newMinutes -= pairs[`${prev}-${current}`] + 1;
            if (newMinutes < 0) return asd;
            newAsd += newMinutes * data[current].rate;
        }
        if (arr.length === 0) {
            return newAsd;
        } else {
            let max = 0;
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                max = Math.max(
                    max,
                    permute(curr.slice(), current, next[0], newMinutes, newAsd)
                );
            }
            return max;
        }
    };

    let max = 0;
    const half = Math.round(asd.length / 2);
    for (let i = half - 2; i <= half + 2; i++) {
        const comb = getCombinations(asd, i);
        comb.forEach((c) => {
            const other = [];
            asd.forEach((a) => {
                if (c.indexOf(a) == -1) {
                    other.push(a);
                }
            });
            const pa = permute(c);
            const pb = permute(other);
            max = Math.max(max, pa + pb);
            if (pa + pb != Infinity) max = Math.max(max, pa + pb);
        });
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
