const fs = require("fs");

const ORDER = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const ORDER_2 = [
    "A",
    "K",
    "Q",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "J",
];

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [hand, bid] = d.split(" ");
            const cards = hand
                .split("")
                .sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
            return {
                orig: hand,
                cards,
                bid: Number(bid),
            };
        });
    // console.log(data);
    return data;
};

const getHandType = ({ cards }) => {
    const cardCount = groupBy(cards, (d) => d[0]);
    const counts = [...cardCount.values()]
        .map((d) => d.length)
        .sort()
        .reverse();
    let mostCard = counts[0];
    let secondMostCard = counts[1];
    if (mostCard == 5) return 10;
    if (mostCard == 4) return 9;
    if (mostCard == 3 && secondMostCard == 2) return 7;
    if (mostCard == 3) return 6;
    if (mostCard == 2 && secondMostCard == 2) return 5;
    if (mostCard == 2) return 4;
    return 3;
};

const compareHands = (a, b) => {
    const aType = getHandType(a);
    const bType = getHandType(b);
    if (aType == bType) {
        let i = 0;
        while (i < 5 && a.orig[i] == b.orig[i]) {
            i++;
        }
        return ORDER.indexOf(a.orig[i]) - ORDER.indexOf(b.orig[i]);
    }
    return bType - aType;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const sortedHands = data.sort(compareHands).reverse();
    const res = sortedHands.map((d, idx) => {
        return (idx + 1) * d.bid;
    });
    return res.reduce((p, c) => p + c, 0);
};

// ----------------

const getHandType2 = ({ cards }) => {
    const cardCount = groupBy(cards, (d) => d[0]);
    const jokerCount = cardCount.get("J")?.length || 0;
    const counts = [...cardCount.values()]
        .map((d) => ({
            count: d.length,
            val: d[0],
        }))
        .sort((a, b) => {
            if (a.val == "J") return -1;
            if (b.val == "J") return +1;
            return a.count - b.count;
        })
        .reverse();
    let mostCard = counts[0].count;
    let isJokerUsed = false;
    if (counts[0].val != "J") {
        isJokerUsed = true;
        mostCard += jokerCount;
    }

    let secondMostCard = counts[1]?.count || 0;
    if (!isJokerUsed && counts[1]?.val != "J") secondMostCard += jokerCount;

    if (mostCard == 5) return 10;
    if (mostCard == 4) return 9;
    if (mostCard == 3 && secondMostCard == 2) return 7;
    if (mostCard == 3) return 6;
    if (mostCard == 2 && secondMostCard == 2) return 5;
    if (mostCard == 2) return 4;
    return 3;
};

const compareHands2 = (a, b) => {
    const aType = getHandType2(a);
    const bType = getHandType2(b);
    if (aType == bType) {
        let i = 0;
        while (i < 5 && a.orig[i] == b.orig[i]) {
            i++;
        }
        return ORDER_2.indexOf(a.orig[i]) - ORDER_2.indexOf(b.orig[i]);
    }
    return bType - aType;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const sortedHands = data.sort(compareHands2).reverse();
    const res = sortedHands.map((d, idx) => {
        return (idx + 1) * d.bid;
    });
    return res.reduce((p, c) => p + c, 0);
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
