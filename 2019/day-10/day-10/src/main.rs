use std::fs::{File};
use std::io::{BufRead, BufReader};
use std::vec::{Vec};
use std::collections::{HashMap};
// use std::f32;

// fn parse_program(inp: &str) -> Vec<Vec<(usize,usize)>> {
fn parse_program(inp: &str) -> Vec<(usize,usize)> {
    let f = BufReader::new(File::open(inp).unwrap());

    let arr: Vec<(usize,usize)> = f.lines()
        .enumerate()
        .map(|(i,l)| l.unwrap()
            .chars()
            .enumerate()
            .filter(|&(_,v)| v == '#')
            .map(|(j,_)| (i,j))
            .collect::<Vec<(usize,usize)>>())
        .collect::<Vec<Vec<(usize,usize)>>>()
        .into_iter()
        .flatten()
        .collect();

    return arr;
}

type Coord = (usize, usize);
type AstList = Vec<Coord>;

// fn process_asterodis(asteroids: &AstList, origo: &Coord) -> HashMap<String, AstList> {
fn process_asterodis(asteroids: &AstList, origo: &Coord) -> (Coord, usize) {
    let mut processed: HashMap<String, AstList> = HashMap::new();

    let origo_x = origo.0 as f32;
    let origo_y = origo.1 as f32;
    for ast in asteroids {
        let ast_x = ast.0 as f32;
        let ast_y = ast.1 as f32;
        let degree = 360.0 - (ast_x - origo_x).atan2(ast_y - origo_y).to_degrees() - 180.0;
        let deg_str = degree.to_string();
        if !processed.contains_key(&deg_str) {
            processed.insert(deg_str.clone(), Vec::new());
        }
        processed.get_mut(&deg_str).unwrap().push(ast.clone());
    }

    return (origo.clone(), processed.len());
}

fn part1(asteroids: &AstList) {
    let result = asteroids.iter()
        .map(|ast| process_asterodis(&asteroids, &ast))
        .into_iter()
        .max_by_key(|a| a.1)
        .unwrap();
    println!("{:?}", result);
        // .collect();
    
    // asteroids;
}

fn main() {
    let filename = "input.txt";
    // let filename = "test5.txt";
    let program = parse_program(filename);
    part1(&program);
    // println!("{:?}", program);
}
