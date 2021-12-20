const fs = require("fs");
const { performance } = require("perf_hooks");

const loadData = (filename) => {
    const data = fs.readFileSync(filename, "utf8").split(/\r?\n/).slice(0, -1);
    const datas = [];
    let i = 1;
    let currentData = [];
    while (i < data.length) {
        if (data[i].startsWith("---")) {
            datas.push(currentData);
            currentData = [];
        } else if (data[i] === "") {
        } else {
            currentData.push(data[i].split(",").map(Number));
        }
        i++;
    }
    datas.push(currentData);
    // console.log(datas);
    return datas;
};

const vecProd = (a, b) => {
    return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
};
const vecAdd = (a, b) => {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
};

const orientation = ([x, y, z], i) => {
    switch (i) {
        case 0:  return [ x,  y,  z]; // prettier-ignore
        case 1:  return [ x, -y, -z]; // prettier-ignore
        case 2:  return [ x,  z, -y]; // prettier-ignore
        case 3:  return [ x, -z,  y]; // prettier-ignore
        case 4:  return [-x, -z, -y]; // prettier-ignore
        case 5:  return [-x,  y, -z]; // prettier-ignore
        case 6:  return [-x,  z,  y]; // prettier-ignore
        case 7:  return [-x, -y,  z]; // prettier-ignore
        case 8:  return [ z,  x,  y]; // prettier-ignore
        case 9:  return [ z, -x, -y]; // prettier-ignore
        case 10: return [ z,  y, -x]; // prettier-ignore
        case 11: return [ z, -y,  x]; // prettier-ignore
        case 12: return [-z,  y,  x]; // prettier-ignore
        case 13: return [-z, -y, -x]; // prettier-ignore
        case 14: return [-z,  x, -y]; // prettier-ignore
        case 15: return [-z, -x,  y]; // prettier-ignore
        case 16: return [ y,  z,  x]; // prettier-ignore
        case 17: return [ y, -z, -x]; // prettier-ignore
        case 18: return [ y,  x, -z]; // prettier-ignore
        case 19: return [ y, -x,  z]; // prettier-ignore
        case 20: return [-y,  x,  z]; // prettier-ignore
        case 21: return [-y, -x, -z]; // prettier-ignore
        case 22: return [-y,  z, -x]; // prettier-ignore
        case 23: return [-y, -z,  x]; // prettier-ignore
    }
};

const findOverlap = (s1, s2) => {
    for (let o = 0; o < 24; o++) {
        const deltas = {};
        for (let i = 0; i < s1.length; i++) {
            const refCoordA = s1[i];
            for (let j = 0; j < s2.length; j++) {
                const refCoordB = orientation(s2[j], o);
                const offset = [
                    refCoordB[0] - refCoordA[0], //
                    refCoordB[1] - refCoordA[1], //
                    refCoordB[2] - refCoordA[2], //
                ];
                const key = `${offset[0]},${offset[1]},${offset[2]}`;
                if (deltas[key]) {
                    deltas[key] += 1;
                    if (deltas[key] >= 12) {
                        return { pos: offset, ori: o };
                    }
                } else {
                    deltas[key] = 1;
                }
            }
        }
    }
    return null;
};

const process = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const q = [0];
    const processed = [];
    const beacons = new Set();
    const pos = {
        0: [0, 0, 0],
    };
    data[0].forEach((b) => {
        beacons.add(`${b[0]},${b[1]},${b[2]}`);
    });
    while (q.length > 0) {
        const curr = q.pop();
        processed.push(curr);
        for (let i = 0; i < data.length; i++) {
            if (processed.indexOf(i) === -1) {
                const start = performance.now();
                const foundRelativeOffset = findOverlap(data[curr], data[i]);
                console.log(performance.now() - start, "ms");
                if (!foundRelativeOffset) continue;
                q.push(i);
                processed.push(i);

                console.log(i, foundRelativeOffset);
                pos[i] = vecAdd(pos[curr], foundRelativeOffset.pos);

                data[i] = data[i].map((b) => {
                    const cc = vecAdd(
                        vecProd([-1, -1, -1], pos[i]),
                        orientation(b, foundRelativeOffset.ori)
                    );
                    beacons.add(`${cc[0]},${cc[1]},${cc[2]}`);
                    return orientation(b, foundRelativeOffset.ori);
                });
            }
        }
    }
    console.log(pos);
    let max = 0;
    Object.keys(pos).forEach((k1) => {
        const e1 = pos[k1];
        Object.keys(pos).forEach((k2) => {
            const e2 = pos[k2];
            max = Math.max(
                max,
                Math.abs(e1[0] - e2[0]) +
                    Math.abs(e1[1] - e2[1]) +
                    Math.abs(e1[2] - e2[2])
            );
        });
    });

    return {
        numberOfBeacons: beacons.size,
        maxDistance: max,
    };
};

const inputs = ["sample_0.txt"];
// inputs.push("input.txt");
inputs.push("bubu_day19_input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    const start = performance.now();
    const { numberOfBeacons, maxDistance } = process(data);
    console.log("numberOfBeacons", numberOfBeacons);
    console.log("maxDistance", maxDistance);
    console.log(performance.now() - start, "ms");
});
