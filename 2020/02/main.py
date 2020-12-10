import re

regex = r"(\d{1,})-(\d{1,}) (.{1}): (.*)"
# 0 1 2  3
# 1-3 a: abcde


sample = ["1-3 a: abcde", "1-3 b: cdefg", "2-9 c: ccccccccc"]

def part1(file):
    valid_pws = 0
    for line in file:
        matches = re.finditer(regex, line)
        for matchNum, match in enumerate(matches, start=1):
            min = match.groups()[0]
            max = match.groups()[1]
            c = match.groups()[2]
            pw = match.groups()[3]
            
            occ = pw.count(c)
            if occ >= int(min) and occ <= int(max):
                valid_pws += 1
    print(valid_pws)

def part2(file):
    valid_pws = 0
    for line in file:
    # for line in sample:
        matches = re.finditer(regex, line)
        for matchNum, match in enumerate(matches, start=1):
            min = match.groups()[0]
            max = match.groups()[1]
            c = match.groups()[2]
            pw = match.groups()[3]
            
            # print(str(int(min)) + " - " + str(int(max)) + " - " + c + " - " + pw + " - " + str(occ) + " = " + ("+1" if occ >= int(min) and occ <= int(max) else "0"))
            tmp = 0
            if pw[int(min)-1] == c:
                tmp += 1
            if pw[int(max)-1] == c:
                tmp += 1
            if tmp == 1:
                valid_pws += 1
            
    print(valid_pws)

with open("input.txt") as file:
    part1(file)

with open("input.txt") as file:
    part2(file)
