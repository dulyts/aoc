use std::fs::{File};
use std::io::{BufRead, BufReader};
use std::vec::{Vec};
use std::collections::{HashMap};


type Coord = (usize, usize);
type AstList = Vec<Coord>;

fn parse_program(inp: &str) -> AstList {
    let f = BufReader::new(File::open(inp).unwrap());

    return f.lines()
        .enumerate()
        .map(|(x,l)| l.unwrap()
            .chars()
            .enumerate()
            .filter(|&(_,v)| v == '#')
            .map(|(y,_)| (y, x))
            .collect::<AstList>())
        .collect::<Vec<_>>()
        .into_iter()
        .flatten()
        .collect();
}

fn process_asterodis(asteroids: &AstList, origo: &Coord) -> HashMap<i32, AstList> {
    let mut processed: HashMap<i32, AstList> = HashMap::new();

    let origo_x = origo.0 as f32;
    let origo_y = origo.1 as f32;
    for ast in asteroids {
        let ast_x = ast.0 as f32;
        let ast_y = ast.1 as f32;

        let degree = 360.0 - (ast_x - origo_x).atan2(ast_y - origo_y).to_degrees() - 180.0;
        // let deg_str = degree.to_string();
        // if !processed.contains_key(&deg_str) {
        //     processed.insert(deg_str.clone(), Vec::new());
        // }
        // processed.get_mut(&deg_str).unwrap().push(ast.clone());

        // let degree = PI - (ast_x - origo_x).atan2(ast_y - origo_y);
        processed.entry((degree * 1_000_000.0) as i32).or_insert_with(||Vec::new()).push(ast.clone());
    }

    // return processed;
    return processed;
}

fn part1(asteroids: &AstList) -> (&Coord, HashMap<i32, AstList>) {
    let result = asteroids.iter()
        .map(|ast| (ast, process_asterodis(&asteroids, &ast)))
        .into_iter()
        .max_by_key(|a| a.1.len())
        .unwrap();
    println!("{:?}", result.0);
        // .collect();
    
    return result;
}

// fn part2(origo: &Coord, angles: &HashMap<String, AstList>) {
//     angles.keys().sort()
//     // for (angle, asteroids) in angles {
//     //     println!("{:?}", angle);
//     // }
// }

fn main() {
    // let filename = "input.txt";
    let filename = "test5.txt";
    let asteroids = parse_program(filename);
    let station_best_data = part1(&asteroids);
    // part2(&station_best_data.0, &station_best_data.1);
    // println!("{:?}", program);
}
