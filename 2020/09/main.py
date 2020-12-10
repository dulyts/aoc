def read_file(file, n):
    with open(filename) as file:
        lines = [int(line[:-1]) for line in file]
    
    for i in range(0, len(lines)-1-n):
        yield (lines[i:i+n], lines[i+n])

def read_file_2(file):
    with open(filename) as file:
        lines = [int(line[:-1]) for line in file]
        return lines
    

def part1(stream):
    for it in stream:
        found = False
        for i in it[0]:
            for j in it[0]:
                if i == j:
                    continue
                if i + j == it[1]:
                    found = True
        if not found:
            return it[1]

def part2(data, search_number):
    i = 0
    sum = 0
    while sum != search_number:
        sum = data[i]
        j = i+1
        while sum < search_number and j < len(data):
            sum += data[j]
            j += 1

        if j-i > 1 and sum == search_number:
            print(min(data[i:j-1]), max(data[i:j-1]))
            return min(data[i:j-1]) + max(data[i:j-1])
        else:
            i += 1
    
        

filename = "input.txt"
n = 25
# filename = "sample_0.txt"
# n = 5

stream = read_file(filename, n)
invalid_number = part1(stream)
print(invalid_number)

data = read_file_2(filename)
a = part2(data, invalid_number)
print(a)