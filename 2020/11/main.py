import copy

def read_file(file):
    with open(filename) as file:
        data = []
        for line in [line[:-1] for line in file]:
            data.append([c for c in line])

        return data

def count_near_occupied(data, i, j):
    count = 0
    for x in range(max(0,i-1), min(len(data), i+2)):
        for y in range(max(0,j-1), min(len(data[x]), j+2)):
            if x == i and y == j:
                continue
            if data[x][y] == "#":
                count += 1
    return count

def part1(data):
    new_data = copy.deepcopy(data)

    while True:
        last_data = new_data
        new_data = copy.deepcopy(new_data)
        changes = 0

        for i in range(0, len(last_data)):
            for j in range(0, len(last_data[i])):
                c = count_near_occupied(last_data, i, j)
                if last_data[i][j] == "L" and c == 0:
                    new_data[i][j] = "#"
                    changes += 1
                if last_data[i][j] == "#" and c >= 4:
                    new_data[i][j] = "L"
                    changes += 1
        
        if changes == 0:
            break
    occupied_spaces = 0
    for i in new_data:
        for j in i:
            if j == "#":
                occupied_spaces += 1
    print(occupied_spaces)



def count_near_occupied_2(data, i, j):
    count = 0
    x = i-1
    while x >= 0:
        if data[x][j] == "L":
            break
        if data[x][j] == "#":
            count += 1
            break
        x -= 1

    x = i+1
    while x < len(data):
        if data[x][j] == "L":
            break
        if data[x][j] == "#":
            count += 1
            break
        x += 1
        

    y = j-1
    while y >= 0:
        if data[i][y] == "L":
            break
        if data[i][y] == "#":
            count += 1
            break
        y -= 1

    y = j+1
    while y < len(data[i]):
        if data[i][y] == "L":
            break
        if data[i][y] == "#":
            count += 1
            break
        y += 1
    
    x = i-1
    y = j-1
    while x >= 0 and y >= 0:
        if data[x][y] == "L":
            break
        if data[x][y] == "#":
            count += 1
            break
        x -= 1
        y -= 1
    
    x = i+1
    y = j+1
    while x < len(data) and y < len(data[x]):
        if data[x][y] == "L":
            break
        if data[x][y] == "#":
            count += 1
            break
        x += 1
        y += 1
    
    x = i-1
    y = j+1
    while x >= 0 and y < len(data[x]):
        if data[x][y] == "L":
            break
        if data[x][y] == "#":
            count += 1
            break
        x -= 1
        y += 1
    
    x = i+1
    y = j-1
    while x < len(data) and y >= 0:
        if data[x][y] == "L":
            break
        if data[x][y] == "#":
            count += 1
            break
        x += 1
        y -= 1

    return count


def part2(data):
    new_data = copy.deepcopy(data)

    while True:
        last_data = new_data
        new_data = copy.deepcopy(new_data)
        changes = 0

        for i in range(0, len(last_data)):
            for j in range(0, len(last_data[i])):
                c = count_near_occupied_2(last_data, i, j)
                if last_data[i][j] == "L" and c == 0:
                    new_data[i][j] = "#"
                    changes += 1
                if last_data[i][j] == "#" and c >= 5:
                    new_data[i][j] = "L"
                    changes += 1
        
        if changes == 0:
            break
    occupied_spaces = 0
    for i in new_data:
        for j in i:
            if j == "#":
                occupied_spaces += 1
    print(occupied_spaces)

filename = "input.txt"
filename = "sample_0.txt"

data = read_file(filename)
part1(data)
part2(data)