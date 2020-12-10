def read_file(file):
    temp = [line[:-1] for line in file]
    mat = []
    for line in temp:
        row = []
        for c in line:
            row.append(c)
        mat.append(line)
    return mat

def count_slope(file, inc_x, inc_y):
    line_length = len(mat[0])
    count = 0
    x,y = inc_x,inc_y
    while y < len(mat):
        if mat[y][x % line_length] == '#':
            count += 1
        x  += inc_x
        y  += inc_y
    
    return count

filename = "input.txt"
# filename = "sample.txt"

with open(filename) as file:
    mat = read_file(file)
    print("part1:", count_slope(file, 3, 1))

    c = 1
    c *= count_slope(file, 1, 1)
    c *= count_slope(file, 3, 1)
    c *= count_slope(file, 5, 1)
    c *= count_slope(file, 7, 1)
    c *= count_slope(file, 1, 2)
    print("part2:", c)
