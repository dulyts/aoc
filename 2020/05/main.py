import math

def read_file(file):
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        return lines

def get_seat_id(line):
    # print('-----------')
    h_pos_start = 0
    h_pos_end = 127
    for dir in line[:6]:
        half = (h_pos_start + h_pos_end) / 2
        if dir == 'F':
            h_pos_end = math.floor(half)
        else:
            h_pos_start = math.ceil(half)
    
    if line[6] == 'F':
        h_end_pos = h_pos_start
    else:
        h_end_pos = h_pos_end

    # print(h_end_pos)
    
    v_pos_start = 0
    v_pos_end = 7
    for dir in line[7:]:
        half = (v_pos_start + v_pos_end) / 2
        if dir == 'L':
            v_pos_end = math.floor(half)
        else:
            v_pos_start = math.ceil(half)
    
    if line[6] == 'L':
        v_end_pos = v_pos_start
    else:
        v_end_pos = v_pos_end

    # print(v_end_pos)
    seat_id = h_end_pos * 8 + v_end_pos
    return seat_id

def part1(filename):
    lines = read_file(filename)
    max_seat_id = 0
    for line in lines:
        seat_id = get_seat_id(line)
        if seat_id > max_seat_id:
            max_seat_id = seat_id
    print(max_seat_id)

def part2(filename):
    lines = read_file(filename)
    seats = [False for i in range(0, 1023)]
    for line in lines:
        seat_id = get_seat_id(line)
        seats[seat_id] = True
    
    for i in range(1, 1022):
        if seats[i] == False and seats[i-1] == True and seats[i+1] == True:
            print(i)
            return


filename = "input.txt"
# filename = "sample.txt"
# filename = "test.txt"

part1(filename)
part2(filename)