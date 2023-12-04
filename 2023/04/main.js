const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [cards, winCards] = d.split(": ")[1].split(" | ");
            return {
                cards: cards
                    .split(" ")
                    .filter((d) => d != "")
                    .map(Number),
                winCards: winCards
                    .split(" ")
                    .filter((d) => d != "")
                    .map(Number),
            };
        });
    // console.log(data);
    return data;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const points = data
        .map((d, idx) => {
            let currentPoint = 0;
            d.cards.forEach((c) => {
                if (d.winCards.includes(c)) {
                    if (currentPoint == 0) {
                        currentPoint = 1;
                    } else {
                        currentPoint *= 2;
                    }
                }
            });
            return currentPoint;
        })
        .reduce((prev, curr) => prev + curr, 0);
    return points;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const copies = Array(data.length).fill(1);
    data.forEach((d, idx) => {
        let count = 0;
        d.cards.forEach((c) => {
            if (d.winCards.includes(c)) {
                count++;
            }
        });
        let i = idx + 1;
        while (i < copies.length && count > 0) {
            copies[i] += copies[idx];
            i++;
            count--;
        }
    });
    return copies.reduce((prev, curr) => prev + curr, 0);
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
