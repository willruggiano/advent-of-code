use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

fn main() {
    let mut elves: Vec<i32> = Vec::new();

    if let Ok(lines) = read_lines("input.txt") {
        let mut curr = 0;
        for line in lines {
            if let Ok(l) = line {
                if l.is_empty() {
                    elves.push(curr);
                    curr = 0;
                } else {
                    curr += l.trim().parse::<i32>().expect("Wanted a number");
                }
            }
        }
    }

    elves.sort();
    println!("Max: {}", elves[elves.len() - 1]);

    let len = elves.len();
    let top_three = &elves[len - 3..len];
    let top_three_sum: i32 = top_three.iter().sum();
    println!("Top three: {}", top_three_sum);
}

fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where
    P: AsRef<Path>,
{
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}
