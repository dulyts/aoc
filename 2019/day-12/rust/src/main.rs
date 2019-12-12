use std::cmp::{max, min};
use std::convert::TryFrom;

fn gcd(a: usize, b: usize) -> usize {
    match ((a, b), (a & 1, b & 1)) {
        ((x, y), _) if x == y => y,
        ((0, x), _) | ((x, 0), _) => x,
        ((x, y), (0, 1)) | ((y, x), (1, 0)) => gcd(x >> 1, y),
        ((x, y), (0, 0)) => gcd(x >> 1, y >> 1) << 1,
        ((x, y), (1, 1)) => {
            let (x, y) = (min(x, y), max(x, y));
            gcd((y - x) >> 1, x)
        }
        _ => unreachable!(),
    }
}
 
fn lcm(a: usize, b: usize) -> usize {
    a * b / gcd(a, b)
}

fn part1() {

}

fn part2() {
    // let mut moons: [i32; 12] = [-1,0,2, 2,-10,-7, 4,-8,8, 3,5,-1];
    // let init_moons: [i32; 12] = [-1,0,2, 2,-10,-7, 4,-8,8, 3,5,-1];
    
    // let mut moons: [i32; 12] = [-8,-10,0, 5,5,10, 2,-7,3, 9,-8,-3];
    // let init_moons: [i32; 12] = [-8,-10,0, 5,5,10, 2,-7,3, 9,-8,-3];
    
    let mut moons: [i32; 12] = [4,12,13,-9,14,-3,-7,-1,2,-11,17,-1];
    let init_moons: [i32; 12] = [4,12,13,-9,14,-3,-7,-1,2,-11,17,-1];
    let mut velocities: [i32; 12] = [0; 12];
    // let mut velocities = moons.iter().map(|_| 0).collect::<Vec<_>>();

    let N = 12;
    let mut times = Vec::new();
    for coord in 0..3 {
        let mut all_on_start = false;
        let mut time: i64 = 1;
        while !all_on_start {
            for i in (coord..N).step_by(3) {
                for j in (i+3..N).step_by(3) {
                        if moons[i] != moons[j] {
                            if moons[i] < moons[j] {
                                velocities[i] += 1;
                                velocities[j] -= 1;
                            } else {
                                velocities[i] -= 1;
                                velocities[j] += 1;
                            }
                        }
                }
            }

            
            all_on_start = true;
            for i in (coord..N).step_by(3) {
                moons[i] += velocities[i];
                all_on_start = all_on_start && moons[i] == init_moons[i];
            }

            time = time + 1;
        }
        times.push(time);
    }
    let mut asd = 1;
    for i in times {
        asd = lcm(asd, usize::try_from(i).unwrap());
    }
    println!("{}", asd);

}


fn main() {
    part1();
    part2();
}