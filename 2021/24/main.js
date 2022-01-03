const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            const [command, ...params] = d.split(" ");
            return { command, params };
        });
    // console.log(data);
    return data;
};

const getValue = (store, param) => {
    if (Number.isInteger(Number(param))) {
        return Number(param);
    }
    return store[param];
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    let i = 0;
    const store = { w: 0, x: 0, y: 0, z: 0 };
    data.forEach((d) => {
        // console.log(d.params, getValue(store, d.params[1]), store[d.params[0]], store[d.params[0]] + getValue(store, d.params[1]))
        switch (d.command) {
            case "inp":
                store[d.params[0]] = `(input${i++})`;
                break;
            case "add":
                store[d.params[0]] = `(${store[d.params[0]]} + ${getValue(store, d.params[1])})`;
                break;
            case "mul":
                store[d.params[0]] = `(${store[d.params[0]]} * ${getValue(store, d.params[1])})`;
                break;
            case "div":
                store[d.params[0]] = `(${store[d.params[0]] / getValue(store, d.params[1])})`;
                break;
            case "mod":
                store[d.params[0]] = `(${store[d.params[0]]} % ${getValue(store, d.params[1])})`;
                break;
            case "eql":
                store[d.params[0]] = `(${store[d.params[0]]} === ${getValue(store, d.params[1])} ? 1 : 0)`;
                break;

            default:
                break;
        }
    });

    console.log(store);

    return;

    // const inputs = [1, 3, 5].reverse();
    let num = 99999999999999;

    let found = false;
    while (!found) {
        if (num % 100000 == 0) {
            console.log(num);
        }
        const inputs = String(num).split("").map(Number).reverse();
        let i = 0;
        const store = { w: 0, x: 0, y: 0, z: 0 };
        data.forEach((d) => {
            // console.log(d.params, getValue(store, d.params[1]), store[d.params[0]], store[d.params[0]] + getValue(store, d.params[1]))
            switch (d.command) {
                case "inp":
                    store[d.params[0]] = inputs.pop();
                    break;
                case "add":
                    store[d.params[0]] = store[d.params[0]] + getValue(store, d.params[1]);
                    break;
                case "mul":
                    store[d.params[0]] = store[d.params[0]] * getValue(store, d.params[1]);
                    break;
                case "div":
                    store[d.params[0]] = Math.trunc(store[d.params[0]] / getValue(store, d.params[1]));
                    break;
                case "mod":
                    store[d.params[0]] = store[d.params[0]] % getValue(store, d.params[1]);
                    break;
                case "eql":
                    store[d.params[0]] = store[d.params[0]] === getValue(store, d.params[1]) ? 1 : 0;
                    break;

                default:
                    break;
            }
            // console.log(d.command, store);
        });
        if (store["z"] === 0) {
            found = true;
            console.log(num);
        } else {
            num--;
        }
    }
    console.log(store);
    return null;
};
const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    return null;
};

const inputs = [
    // "sample_0.txt"
];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
