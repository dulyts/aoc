def part1(file):
    tmp = [line[:-1] for line in file]
    for i in range(0, len(tmp)):
        for j in range(i+1, len(tmp)):
            if int(tmp[i]) + int(tmp[j]) == 2020:
                print(int(tmp[i]) * int(tmp[j]))
        

def part2(file):
    tmp = [line[:-1] for line in file]
    for i in range(0, len(tmp)):
        for j in range(i+1, len(tmp)):
            for k in range(j+1, len(tmp)):
                if int(tmp[i]) + int(tmp[j]) + int(tmp[k]) == 2020:
                    print(int(tmp[i]) * int(tmp[j]) * int(tmp[k]))

with open("input.txt") as file:
    part1(file)
    
with open("input.txt") as file:
    part2(file)
