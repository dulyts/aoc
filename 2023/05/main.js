const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            return d;
        });
    const proc = {
        mappers: {},
    };
    const [_, ...seeds] = data[0].split(" ").map(Number);
    proc["seeds"] = seeds;
    let i = 2;
    while (i < data.length) {
        const [mapName] = data[i].split(" ");
        i++;
        const mappingData = [];
        while (i < data.length && data[i] != "") {
            const [dest, src, range] = data[i].split(" ");
            mappingData.push({
                src: Number(src),
                dest: Number(dest),
                range: Number(range),
            });
            i++;
        }
        proc.mappers[mapName] = mappingData;
        i++;
    }
    console.log(proc.seed, proc.mappers);
    return proc;
};

const MAPPING = {
    seed: "soil",
    soil: "fertilizer",
    fertilizer: "water",
    water: "light",
    light: "temperature",
    temperature: "humidity",
    humidity: "location",
};

const mapData = (mappers, num) => {
    for (let i = 0; i < mappers.length; i++) {
        const mapper = mappers[i];
        if (mapper.src <= num && mapper.src + mapper.range > num) {
            const diff = num - mapper.src;
            return mapper.dest + diff;
        }
    }
    return num;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const results = data.seeds.map((seed) => {
        let currentVal = seed;
        let currentType = "seed";
        let nextType = MAPPING[currentType];
        let mapper = data.mappers[`${currentType}-to-${nextType}`];
        while (mapper != undefined) {
            currentVal = mapData(mapper, currentVal);
            currentType = nextType;
            nextType = MAPPING[currentType];
            mapper = data.mappers[`${currentType}-to-${nextType}`];
        }
        return currentVal;
    });
    return Math.min(...results);
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let min = 99999999999;
    for (let i = 0; i < data.seeds.length; i += 2) {
        for (let j = 0; j < data.seeds[i + 1]; j++) {
            let seed = data.seeds[i] + j;
            let currentVal = seed;
            let currentType = "seed";
            let nextType = MAPPING[currentType];
            let mapper = data.mappers[`${currentType}-to-${nextType}`];
            while (mapper != undefined) {
                currentVal = mapData(mapper, currentVal);
                currentType = nextType;
                nextType = MAPPING[currentType];
                mapper = data.mappers[`${currentType}-to-${nextType}`];
            }
            if (currentVal < min) {
                min = currentVal;
                console.log(min);
            }
        }
    }
    return min;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
