const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [bp, p] = d.split(": ");
            const costs = p
                .split(".")
                .slice(0, -1)
                .map((pp) => {
                    const [r, c] = pp.split(" robot costs ");
                    const costs = c.split(" and ").map((c) => {
                        const [count, type] = c.split(" ");
                        return { count: Number(count), type };
                    });
                    return { robot: r.split("Each ")[1], costs };
                })
                .reduce((prev, curr) => {
                    return { ...prev, [curr.robot]: curr.costs };
                }, {});
            return costs;
        });
    // console.log(data);
    return data;
};

const resources = {
    ore: 0,
    clay: 1,
    obsidian: 2,
    geode: 3,
};
// const decision = ["geode", "clay", "obsidian", "ore", undefined];
const decision = ["geode", "clay", "obsidian", "ore"];

const hasEnoughFor = (costs, stock) => {
    let flag = true;
    costs.forEach((c) => (flag &= stock[c.type] >= c.count));
    return flag;
};

const calcNewStock = (stock, robots, minutes) => {
    console.log("calcNewStock", stock, robots, minutes);
    return {
        ore: stock.ore + robots.ore * minutes,
        clay: stock.clay + robots.clay * minutes,
        obsidian: stock.obsidian + robots.obsidian * minutes,
        geode: stock.geode + robots.geode * minutes,
    };
};

const calcRequiredMinute = (costs, stock, robots) => {
    let maxMinutes = 0;
    for (let i = 0; i < costs.length; i++) {
        let c = costs[i];
        if (robots[c.type] == 0) {
            return Infinity;
        }
        maxMinutes = Math.max(
            maxMinutes,
            Math.ceil((c.count - stock[c.type]) / robots[c.type])
        );
    }
    return maxMinutes;
};

const step = (blueprint, robots, stock, minute) => {
    // console.log(minute, stock, robots);
    if (minute >= 24) {
        // if (stock.geode > 0) {
        //     console.log(stock.geode);
        // }
        return stock.geode;
    }
    if (
        Object.keys(robots).reduce((prev, curr) => prev + robots[curr], 0) > 10
    ) {
        return calcNewStock(stock, robots, 24 - minute).geode;
    }
    let newStock = calcNewStock(stock, robots, 1);
    let max = 0;
    decision.forEach((d) => {
        const requiredMinute =
            calcRequiredMinute(blueprint[d], newStock, robots) + 1;
        // console.log("----");
        if (requiredMinute == Infinity) return;
        if (requiredMinute + minute > 24) {
            // newStock = calcNewStock(
            //     newStock,
            //     robots,
            //     requiredMinute + minute - 24
            // );
            max = Math.max(max, newStock.geode);
            // console.log(robots, max);
            return;
        }
        newStock = calcNewStock(newStock, robots, requiredMinute);

        let tmpStock = { ...newStock };
        blueprint[d].forEach((r) => (tmpStock[r.type] -= r.count));
        // console.log(newStock, tmpStock, blueprint[d]);
        max = Math.max(
            max,
            step(
                blueprint,
                { ...robots, [d]: robots[d] + 1 },
                tmpStock,
                minute + requiredMinute
            )
        );

        // if (!hasEnoughFor(blueprint[d], stock)) {
        //     max = Math.max(max, step(blueprint, robots, newStock, minute + 1));
        // } else {
        //     let tmpStock = { ...newStock };
        //     blueprint[d].forEach((r) => (tmpStock[r.typ] -= r.count));
        //     let tmpRobots = { ...robots, [d]: robots[d] + 1 };
        //     max = Math.max(
        //         max,
        //         step(blueprint, tmpRobots, tmpStock, minute + 1)
        //     );
        // }
    });
    return max;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const max = step(
        data[0],
        { ore: 1, clay: 0, obsidian: 0, geode: 0 },
        {
            ore: 2,
            clay: 0,
            obsidian: 0,
            geode: 0,
        },
        3
    );
    return max;
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
