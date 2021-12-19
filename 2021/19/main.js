const fs = require("fs");

const tttt = [
    [0, 0, 0],
    [-26, 4784, -2373],
    [-30, 4754, -3575],
    [-71, 13, -1212],
    [-46, 1144, -3539],
    [25, 3564, 1159],
    [-1232, 2394, -1256],
    [1257, 3581, 1281],
    [31, -171, -3652],
    [107, 6003, -4795],
    [79, 2402, -2282],
    [-1210, 3430, -1146],
    [-65, 4737, -4855],
    [41, -71, 1237],
    [-81, 4790, 86],
    [0, 2382, -1111],
    [-36, 1088, -1126],
    [-57, 3497, -2322],
    [78, -1232, 64],
    [1260, 4769, 75],
    [-4, 5941, -2429],
    [1188, 2336, 1318],
    [1278, 3527, 66],
    [-33, 5990, -1126],
    [-1217, 3540, 69],
    [-2342, 2296, -1116],
    [103, 3591, -38],
    [1206, -48, -3477],
    [70, 5976, -3633],
    [-76, 1096, -2344],
    [-14, -154, -2399],
    [83, 3425, -1085],
    [87, -2453, -6],
    [79, 3522, 2431],
    [-74, -66, 2337],
    [-2358, 2273, -48],
];
let max = 0;
for (let i = 0; i < tttt.length - 1; i++) {
    const e1 = tttt[i];
    for (let j = i + 1; j < tttt.length; j++) {
        const e2 = tttt[j];
        max = Math.max(
            max,
            Math.abs(e1[0] - e2[0]) +
                Math.abs(e1[1] - e2[1]) +
                Math.abs(e1[2] - e2[2])
        );
    }
}
console.log(max);
return;

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

const orientation = (a, i) => {
    const [x, y, z] = a;
    switch (i) {
        case 0:
            return [x, y, z];
        case 1:
            return [x, y, -z];
        case 2:
            return [x, -y, z];
        case 3:
            return [x, -y, -z];
        case 4:
            return [-x, y, z];
        case 5:
            return [-x, y, -z];
        case 6:
            return [-x, -y, z];
        case 7:
            return [-x, -y, -z];
        //
        case 8:
            return [z, x, y];
        case 9:
            return [-z, x, y];
        case 10:
            return [z, -x, y];
        case 11:
            return [-z, -x, y];
        case 12:
            return [z, x, -y];
        case 13:
            return [-z, x, -y];
        case 14:
            return [z, -x, -y];
        case 15:
            return [-z, -x, -y];
        //
        case 16:
            return [y, z, x];
        case 17:
            return [-y, z, x];
        case 18:
            return [y, z, -x];
        case 19:
            return [-y, z, -x];
        case 20:
            return [y, -z, x];
        case 21:
            return [-y, -z, x];
        case 22:
            return [y, -z, -x];
        case 23:
            return [-y, -z, -x];
        //
        case 24:
            return [x, z, y];
        case 25:
            return [x, -z, y];
        case 26:
            return [x, z, -y];
        case 27:
            return [x, -z, -y];
        case 28:
            return [-x, z, y];
        case 29:
            return [-x, -z, y];
        case 30:
            return [-x, z, -y];
        case 31:
            return [-x, -z, -y];
        //
        case 32:
            return [z, y, x];
        case 33:
            return [-z, y, x];
        case 34:
            return [z, y, -x];
        case 35:
            return [-z, y, -x];
        case 36:
            return [z, -y, x];
        case 37:
            return [-z, -y, x];
        case 38:
            return [z, -y, -x];
        case 39:
            return [-z, -y, -x];
        //
        case 40:
            return [y, x, z];
        case 41:
            return [-y, x, z];
        case 42:
            return [y, -x, z];
        case 43:
            return [-y, -x, z];
        case 44:
            return [y, x, -z];
        case 45:
            return [-y, x, -z];
        case 46:
            return [y, -x, -z];
        case 47:
            return [-y, -x, -z];
    }
};
const isMatch = (p1, p2, offset) => {
    if (
        p2[0] - offset[0] === p1[0] &&
        p2[1] - offset[1] === p1[1] &&
        p2[2] - offset[2] === p1[2]
    ) {
        // console.log(
        //     "isMatch",
        //     p1,
        //     p2,
        //     offset,
        //     [p2[0] - offset[0], p2[1] - offset[1], p2[2] - offset[2]],
        //     true
        // );
        return true;
    }
    // console.log(
    //     "isMatch",
    //     p1,
    //     p2,
    //     offset,
    //     [p2[0] - offset[0], p2[1] - offset[1], p2[2] - offset[2]],
    //     false
    // );
    return false;
};

const findOverlap = (s1, s2) => {
    for (let o = 0; o < 48; o++) {
        for (let i = 0; i < s1.length; i++) {
            const refCoordA = s1[i];
            for (let j = 0; j < s2.length; j++) {
                let overlapCount = 1;
                let refCoordB = orientation(s2[j], o);
                const offset = [
                    refCoordB[0] - refCoordA[0], //
                    refCoordB[1] - refCoordA[1], //
                    refCoordB[2] - refCoordA[2], //
                ];
                // console.log(offset)
                for (let k = 0; k < s1.length; k++) {
                    for (let l = 0; l < s2.length; l++) {
                        if (k === i && l === j) continue;

                        let pp1 = s1[k];
                        let pp2 = orientation(s2[l], o);
                        if (isMatch(pp1, pp2, offset)) {
                            overlapCount++;
                        }
                    }
                }

                if (overlapCount >= 12) {
                    return { pos: offset, ori: o };
                }
            }
        }
    }
    return null;
};

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const relativeOffsets = {
        "0-0": { pos: [0, 0, 0], ori: 0, rot: 0 },
    };
    const q = [0];
    const processed = [];
    const beacons = new Set();
    const pos = {
        0: [0, 0, 0],
    };
    const oris = {
        0: [-1, -1, -1],
    };
    const o = {
        0: 0,
    };
    data[0].forEach((b) => {
        beacons.add(`${b[0]},${b[1]},${b[2]}`);
    });
    while (q.length > 0) {
        const curr = q.pop();
        processed.push(curr);
        for (let i = 0; i < data.length; i++) {
            if (processed.indexOf(i) === -1) {
                // const foundRelativeOffset = findOverlap(
                //     data[curr].map((b) => orientation(b, o[curr])),
                //     data[i]
                // );
                const foundRelativeOffset = findOverlap(data[curr], data[i]);
                if (!foundRelativeOffset) continue;
                q.push(i);
                processed.push(i);

                o[i] = foundRelativeOffset.ori;
                // oris[i] = orientation(oris[curr], foundRelativeOffset.ori);
                oris[i] = orientation(oris[curr], foundRelativeOffset.ori);
                console.log(i, foundRelativeOffset, oris[i]);
                const tmp = vecProd(oris[curr], foundRelativeOffset.pos);

                // pos[i] = vecProd(
                //     [-1, -1, -1],
                //     vecAdd(pos[curr], foundRelativeOffset.pos)
                // );
                pos[i] = vecAdd(pos[curr], foundRelativeOffset.pos);
                // pos[i] = vecAdd(pos[curr], foundRelativeOffset.pos);

                // console.log("--------------");
                // console.log(data[i]);
                data[i] = data[i].map((b) => {
                    const cc = vecAdd(
                        vecProd([-1, -1, -1], pos[i]),
                        orientation(b, foundRelativeOffset.ori)
                    );
                    // console.log(cc)
                    beacons.add(`${cc[0]},${cc[1]},${cc[2]}`);
                    return orientation(b, foundRelativeOffset.ori);
                    // return b;
                });
                // console.log(data[i]);
            }
        }
    }
    console.log(pos);
    console.log(beacons.size);

    return;
    // for (let i = 0; i < data.length - 1; i++) {
    //     // for (let i = 0; i < data.length; i++) {
    //     const s1 = data[i];
    //     for (let j = i + 1; j < data.length; j++) {
    //         // for (let j = 0; j < data.length; j++) {
    //         if (i === j) continue;
    //         const s2 = data[j];
    //         const foundRelativeOffset = findOverlap(s1, s2);
    //         relativeOffsets[`${i}-${j}`] = foundRelativeOffset;
    //     }
    // }
    // console.log(relativeOffsets);
    // const pos = {
    //     0: [0, 0, 0],
    // };
    // const asd = {
    //     0: [-1, -1, -1],
    // };

    // while (true) {
    //     let changed = false;
    //     Object.keys(relativeOffsets).forEach((k) => {
    //         if (!relativeOffsets[k]) return;
    //         const curr = relativeOffsets[k];

    //         const [a, b] = k.split("-");
    //         if (a > b) return;
    //         // if (pos[b] || !pos[a]) return;
    //         if (!pos[b]) {
    //             if (!pos[a]) return;
    //             changed = true;
    //             console.log(k);

    //             const tmp = [
    //                 asd[a][0] * curr.pos[0],
    //                 asd[a][1] * curr.pos[1],
    //                 asd[a][2] * curr.pos[2],
    //             ];
    //             // console.log(tmp);

    //             asd[b] = orientation(asd[a], curr.ori);
    //             pos[b] = [
    //                 pos[a][0] + tmp[0], //
    //                 pos[a][1] + tmp[1], //
    //                 pos[a][2] + tmp[2], //
    //             ];
    //         } else if (!pos[a]) {
    //             if (!pos[b]) return;
    //             changed = true;
    //             console.log(k);

    //             asd[a] = orientation(asd[b], curr.ori);
    //             const tmp = [
    //                 -1 * asd[b][0] * curr.pos[0],
    //                 1 * asd[b][2] * curr.pos[2],
    //                 1 * asd[b][1] * curr.pos[1],
    //             ];
    //             // console.log(tmp);

    //             pos[a] = [
    //                 pos[b][0] - tmp[0], //
    //                 pos[b][1] - tmp[1], //
    //                 pos[b][2] - tmp[2], //
    //             ];
    //         }
    //     });
    //     console.log(changed);
    //     if (!changed) break;
    // }
    // console.log(pos);

    // let beacons = new Set();
    // data.forEach((d,i) => {
    //     d.forEach(c => {
    //         const cc = vecAdd(pos[i], c);
    //         // console.log(cc);
    //         beacons.add(`${cc[0]},${cc[1]},${cc[2]}`)
    //         // console.log(beacons)
    //     })
    // })
    // console.log(beacons.length, beacons)

    // return;
    // // const asd = {
    // //     0: [-1, -1, -1],
    // // };
    // // const ori = {
    // //     0: [0, 1, 2],
    // // };

    // // 5 - [-1, 1, -1]
    // Object.keys(relativeOffsets).forEach((k) => {
    //     if (!relativeOffsets[k]) return;
    //     const curr = relativeOffsets[k];
    //     // const tmp = vecProd(ROT[curr.rot], curr.pos);
    //     const tmp = curr.pos;
    //     const [aa, bb] = k.split("-");
    //     let a, b;
    //     if (pos[aa]) {
    //         a = aa;
    //         b = bb;
    //     } else {
    //         return;
    //         // a = bb;
    //         // b = aa;
    //     }
    //     asd[b] = vecProd(asd[a], ROT[curr.rot]);
    //     ori[b] = revOrientation(ori[a], curr.ori);
    //     // const tttt = [pos[a][ori[a][0]], pos[a][ori[a][1]], pos[a][ori[a][2]]];
    //     const tttt = [tmp[ori[a][0]], tmp[ori[a][1]], tmp[ori[a][2]]];
    //     pos[b] = [
    //         pos[a][0] + asd[a][0] * tttt[0],
    //         pos[a][1] + asd[a][1] * tttt[1],
    //         pos[a][2] + asd[a][2] * tttt[2],
    //     ];
    // });
    // console.log(pos);
    // console.log(asd, ori);
    // return null;
};

const part2 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    return null;
};

const inputs = ["sample_0.txt"];
inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
