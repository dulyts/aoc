def read_file(filename):
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        return lines

def part1(data):
    pass

def part2(data):
    pass

filename = "input.txt"
filename = "sample_0.txt"

data = read_file(filename)
print(data)
part1(data)
part2(data)