const fs = require("fs");

const loadData = (filename) => {
    const data = fs
        .readFileSync(filename, "utf8")
        .split(/\r?\n/)
        .slice(0, -1)
        .map((d) => {
            let [state, coords] = d.split(" ");
            const [x, y, z] = coords
                .split(",")
                .map((d) => d.split("=")[1].split("..").map(Number));
            return { state, coords: { x, y, z } };
        });
    // console.log(data);
    return data;
};

const getKey = (x, y, z) => `${x},${y},${z}`;

const part1 = (data) => {
    data = JSON.parse(JSON.stringify(data));
    const turnedOn = new Set();
    data.forEach((d) => {
        for (
            let x = Math.max(-50, d.coords.x[0]);
            x <= Math.min(50, d.coords.x[1]);
            x++
        ) {
            // prettier-ignore
            for (let y = Math.max(-50,d.coords.y[0]); y <= Math.min(50, d.coords.y[1]); y++) { // prettier-ignore
                for (let z = Math.max(-50,d.coords.z[0]); z <= Math.min(50, d.coords.z[1]); z++) { // prettier-ignore
                    const key = getKey(x, y, z);
                    if (d.state == "on") {
                        turnedOn.add(key);
                    } else {
                        if (turnedOn.has(key)) {
                            turnedOn.delete(key);
                        }
                    }
                }
            }
        }
    });
    return turnedOn.size;
};

const isIntersectCoords = (c1, c2) => {
    return c1[0] < c2[1] && c1[1] > c2[0];
};

const isIntersect3dCoords = (c1, c2) => {
    return (
        isIntersectCoords(c1.x, c2.x) &&
        isIntersectCoords(c1.y, c2.y) &&
        isIntersectCoords(c1.z, c2.z)
    );
};

const isIntercetionPoint = (p, cube) => {
    return (
        p.x >= cube.x[0] &&
        p.x <= cube.x[1] &&
        p.y >= cube.y[0] &&
        p.y <= cube.y[1] &&
        p.z >= cube.z[0] &&
        p.z <= cube.z[1]
    );
};

const getIntersectionPoints = (c1, c2) => {
    const points = new Set();
    for (let x = 0; x < 2; x++) {
        for (let y = 0; y < 2; y++) {
            for (let z = 0; z < 2; z++) {
                if (
                    isIntercetionPoint(
                        { x: c2.x[x], y: c2.y[y], z: c2.z[z] },
                        c1
                    )
                ) {
                    points.add(`${c2.x[x]},${c2.y[y]},${c2.z[z]}`);
                }
            }
        }
    }
    const res = [];
    points.forEach((p) => {
        const [x, y, z] = p.split(",").map(Number);
        res.push({ x, y, z });
    });
    return res;
};

const splitCube = (coords, splitCoords) => {
    const smallCubes = new Set();
    const newx = [
        coords.x[0],
        ...splitCoords.map((a) => a.x),
        coords.x[1],
    ].filter(function (item, pos, ary) {
        return !pos || item >= ary[pos - 1];
    });
    const newy = [
        coords.y[0],
        ...splitCoords.map((a) => a.y),
        coords.y[1],
    ].filter(function (item, pos, ary) {
        return !pos || item >= ary[pos - 1];
    });
    const newz = [
        coords.z[0],
        ...splitCoords.map((a) => a.z),
        coords.z[1],
    ].filter(function (item, pos, ary) {
        return !pos || item >= ary[pos - 1];
    });
    // console.log(newx);
    // console.log(newy);
    // console.log(newz);
    for (let x = 0; x < newx.length - 1; x++) {
        if (newx[x] === newx[x + 1]) continue;
        for (let y = 0; y < newy.length - 1; y++) {
            if (newy[y] === newy[y + 1]) continue;
            for (let z = 0; z < newz.length - 1; z++) {
                // if (newz[z] === newz[z + 1]) continue;
                smallCubes.add(`${newx[x]}|${newx[x + 1]},${newy[y]}|${newy[y + 1]},${newz[z]}|${newz[z + 1]}`); // prettier-ignore
            }
        }
    }
    const tmp = [];

    smallCubes.forEach((p) => {
        const [x, y, z] = p.split(",").map((d) => d.split("|").map(Number));
        tmp.push({ x, y, z });
    });
    // console.log("smallCubes", tmp, smallCubes);
    return tmp;
};

// const cc = { x: [1, 4], y: [1, 4], z: [0, 0] };
// const asd = getIntersectionPoints(
//     cc,
//     // { x: [2, 3], y: [2, 3], z: [0, 0] }
//     { x: [2, 3], y: [3, 5], z: [0, 0] }
// );
// console.log("getIntersectionPoints", asd);
// const newSmallCubes = [];
// splitCube(cc, asd).forEach((ss) => {
//     newSmallCubes.push({
//         state: "on",
//         coords: ss,
//     });
// });
// console.log(newSmallCubes);
// return;

// const part2 = (data) => {
//     data = JSON.parse(JSON.stringify(data));

//     let smallerCubes = [];
//     data.forEach((d) => {
//         if (d.state === "on") {
//             smallerCubes.push(d);
//             return;
//         }
//         let tmp = [];
//         for (let i = 0; i < smallerCubes.length; i++) {
//             const smoll = smallerCubes[i];
//             // console.log("asd", smoll, d)
//             if (isIntersect3dCoords(smoll.coords, d.coords)) {
//                 const instersectPoints = getIntersectionPoints(
//                     smoll.coords,
//                     d.coords
//                 );
//                 if(instersectPoints.length === 0) {
//                     tmp.push(smoll)
//                     continue;
//                 }
//                 // console.log("is", instersectPoints);

//                 let newSmallCubes = splitCube(smoll.coords, instersectPoints);
//                 // if (newSmallCubes.length == 1) {
//                 //     tmp.push(...newSmallCubes.map(dd => ({state: d.state, coords: dd})))
//                 //     // console.log("tmp", tmp)
//                 //     continue;
//                 // }
//                 console.log("new");
//                 console.log(instersectPoints);
//                 console.log(newSmallCubes);
//                 console.log(smoll.coords);
//                 console.log("---");
//                 newSmallCubes = newSmallCubes
//                     .filter((cube) => !isIntersect3dCoords(cube, d.coords))
//                     .map((dd) => ({ state: smoll.state, coords: dd }));
//                 // console.log(newSmallCubes.length)
//                 // console.log("--------")
//                 // console.log(newSmallCubes)
//                 tmp.push(...newSmallCubes);
//             } else {
//                 tmp.push(smoll);
//             }
//         }
//         smallerCubes = tmp;
//     });
//     console.log("smallerCubes.length", smallerCubes.length);

//     let count = 0;
//     smallerCubes.forEach((cube) => {
//         const c = cube.coords;
//         let size =
//             Math.abs(c.x[1] - c.x[0]) *
//             Math.abs(c.y[1] - c.y[0]) *
//             Math.abs(c.z[1] - c.z[0]);
//         count += size;
//     });

//     // 2758514936282235
//     // 1322641053708887

//     return count;
//     const turnedOnCount = 0;
//     const turned = [];
//     for (let i = 0; i < data.length; i++) {
//         const curr = data[i];
//         if (curr.state == "on") {
//             const c = data[i].coords;
//             let newTurned = c.x[1] - c.x[0] * c.y[1] - c.y[0] * c.z[1] - c.z[0];
//             // turned.forEach(on => {
//             //     const oc = on.coords;
//             //     if (oc.x[0] >= c.x)
//             //     for(let x = Math)
//             // })
//         }

//         for (let j = 0; j < i; j++) {
//             const prev = array[j];
//         }
//     }
//     return turnedOn.size;
// };

const part2 = (data) => {
    let xxx = [];
    let yyy = [];
    let zzz = [];
    data.forEach((d) => {
        xxx.push(...d.coords.x);
        yyy.push(...d.coords.y);
        zzz.push(...d.coords.z);
    });
    xxx = [...new Set(xxx)].map(Number).sort((a, b) => a - b);
    yyy = [...new Set(yyy)].map(Number).sort((a, b) => a - b);
    zzz = [...new Set(zzz)].map(Number).sort((a, b) => a - b);
    console.log(xxx, yyy, zzz);
    const grid = Array(xxx.length)
        .fill(0)
        .map((d) =>
            Array(yyy.length)
                .fill(0)
                .map((dd) => Array(zzz.length).fill(false))
        );

    data.forEach((d, dIdx) => {
        console.log(dIdx, ":", d.coords, d.state);
        let i = xxx.indexOf(d.coords.x[0]);
        let ii = true;
        while (xxx[i] < d.coords.x[1] || ii) {
            ii = false;
            let j = yyy.indexOf(d.coords.y[0]);
            let jj = true;
            while (yyy[j] < d.coords.y[1] || jj) {
                jj = false;
                let k = zzz.indexOf(d.coords.z[0]);
                let kk = true;
                while (zzz[k] < d.coords.z[1] || kk) {
                    kk = false;
                    if ((d.state === "on") !== grid[i][j][k]) {
                        // console.log(xxx[i], yyy[j], zzz[k], d.state === "on");
                        grid[i][j][k] = d.state === "on";
                    }
                    k++;
                }
                j++;
            }
            i++;
        }
    });

    let count = 0;
    for (let i = 0; i <= xxx.length - 1; i++) {
        for (let j = 0; j <= yyy.length - 1; j++) {
            for (let k = 0; k <= zzz.length - 1; k++) {
                // console.log(xxx[i], yyy[j], zzz[k], grid[i][j][k]);
                // if (grid[i][j][k] || grid[i-1][j-1][k-1]) {
                if (grid[i][j][k]) {
                    let asd = 1;
                    
                    if (i !== xxx.length -1) {
                        asd *= (Math.abs(xxx[i+1] - xxx[i]) + 0) // prettier-ignore
                    // } else {
                    //     asd +=1;
                    }
                    if (j !== yyy.length -1) {
                        asd *= (Math.abs(yyy[j+1] - yyy[j]) + 0) // prettier-ignore
                    // } else {
                    //     asd +=1;
                    }
                    if (k !== zzz.length -1) {
                        asd *= (Math.abs(zzz[k+1] - zzz[k]) + 0); // prettier-ignore
                    // } else {
                    //     asd +=1;
                    }
                    count += asd;
                }
            }
        }
    }
    console.log(count);

    // 2758514936282235
    // 2758667608830126
    // 2758294543632066
};

const inputs = [
    "sample_0.txt",
    // "sample_1.txt",
    "sample_2.txt",
];
// inputs.push("input.txt");
inputs.forEach((filename) => {
    console.log(filename);
    const data = loadData(filename);
    console.log("part1", part1(data));
    console.log("part2", part2(data));
});
