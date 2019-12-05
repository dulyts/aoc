def calc(input):
	return int(input) // 3 - 2

def part1(file):
	sum = 0
	for line in file:
		sum = sum + calc(line)
	return sum


def part2(file):
	sum = 0
	for line in file:
		rest = calc(line)
		while rest > 0:
			sum = sum + rest
			rest = calc(rest)
	return sum

with open("input.txt") as file:
	print(part1(file))

with open("input.txt") as file:
	print(part2(file))
