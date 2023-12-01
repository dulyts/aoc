const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    // console.log(data);
    return data;
};
const words = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
};

function replaceRange(s, start, end, substitute) {
    return s.substring(0, start) + substitute + s.substring(end);
}

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    return data.reduce((p, c) => {
        const nums = c.split("").reduce((prev, curr) => {
            if (!isNaN(curr)) {
                return [...prev, curr];
            }
            return prev;
        }, []);
        return p + Number(nums[0] + nums[nums.length - 1]);
    }, 0);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    return data
        .map((d) => {
            let newRow = d;
            for (let i = 0; i < newRow.length - 2; i++) {
                let sub = newRow.substring(i);
                Object.keys(words).map((w) => {
                    if (sub.startsWith(w)) {
                        // console.log(sub, w);
                        newRow = replaceRange(
                            newRow,
                            i,
                            // i + w.length,
                            i,
                            words[w]
                        );
                        i++;
                    }
                });
            }
            return newRow;
        })
        .reduce((p, c) => {
            // console.log(c);
            const nums = c.split("").reduce((prev, curr) => {
                if (!isNaN(curr)) {
                    return [...prev, curr];
                }
                return prev;
            }, []);
            // console.log(nums, Number(nums[0] + nums[nums.length - 1]));
            return p + Number(nums[0] + nums[nums.length - 1]);
        }, 0);
};

const inputs = ["sample_0.txt", "sample_1.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
