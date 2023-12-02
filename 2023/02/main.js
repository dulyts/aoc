const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [game, allSet] = d.split(":");
            const [_, gameId] = game.split(" ");
            const sets = allSet.split(";");
            const processedSets = sets.map((s) => {
                const set = s.split(",").reduce((prev, curr) => {
                    const [count, color] = curr.trim().split(" ");
                    return [...prev, { color, count: Number(count) }];
                }, []);
                return set;
            });
            return {
                gameId: Number(gameId),
                sets: processedSets,
            };
        });
    // console.log(data);
    return data;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const maxCubes = { red: 12, green: 13, blue: 14 };
    const pGames = data.map((game) => {
        let validGame = true;
        game.sets.forEach((set) => {
            set.forEach(({ color, count }) => {
                if (!color in maxCubes) {
                    validGame = false;
                    return;
                }
                if (count > maxCubes[color]) {
                    validGame = false;
                    return;
                }
            });
        });
        return validGame ? game.gameId : 0;
    });
    return pGames.reduce((prev, curr) => prev + curr, 0);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const pGames = data.map((game) => {
        const maxCubes = { red: 0, green: 0, blue: 0 };
        game.sets.forEach((set) => {
            set.forEach(({ color, count }) => {
                if (count > maxCubes[color]) {
                    maxCubes[color] = count;
                }
            });
        });
        return maxCubes["red"] * maxCubes["green"] * maxCubes["blue"];
    });
    return pGames.reduce((prev, curr) => prev + curr, 0);;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
