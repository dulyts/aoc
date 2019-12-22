






matrix = [[[] for _ in range(0, 1000)] for _ in range(0, 1000)]
claims = set()

with open('input.txt') as f:
    for line in f:
        p = line.split(' @ ')
        data = p[1].split(': ')
        coord = [int(i) for i in data[0].split(',')]
        size = [int(i) for i in data[1].split('x')]
        for y in range(coord[1], coord[1] + size[1]):
            for x in range(coord[0], coord[0] + size[0]):
                # print(x,y)
                matrix[y][x].append(p[0])
                claims.add(p[0])

    sum = 0
    for y in range(0, 1000):
        for x in range(0, 1000):
            if len(matrix[y][x]) > 1:
                sum += 1
                for i in matrix[y][x]:
                    try:
                        claims.remove(i)
                    except: pass
    print(sum)
    print(claims)
