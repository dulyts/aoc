import copy
ITER = 6

def read_file(file):
    with open(filename) as file:
        lines = [line[:-1] for line in file]

        N = ITER * 2 + len(lines)
        H = ITER + int(len(lines) / 2)
        print(H)
        mat = [[[False for k in range(0, N)] for j in range(0, N)] for i in range(0, N)]
        for y in range(0, len(lines)):
            for x in range(0, len(lines[y])):
                mat[ITER+y][ITER+x][H] = True if lines[y][x] == "#" else False
        # for y in range(0, len(mat)):
        #     for x in range(0, len(mat)):
        #         print(("#" if mat[y][x][H] else "."), end='')
        #     print("")
        return mat

def count_neighbors(mat, y,x,z):
    active_count = 0
    inactive_count = 0
    for i in range(max(0, y-1),min(len(mat), y+2)):
        for j in range(max(0, x-1),min(len(mat), x+2)):
            for k in range(max(0, z-1),min(len(mat), z+2)):
                # print((i,j,k))
                if i == y and j == x and k == z:
                    continue
                if mat[i][j][k]:
                    active_count += 1
                else:
                    inactive_count += 1
    return (active_count, inactive_count)

def part1(mat):
    # print(count_neighbors(mat,7,7,6))
    # for i in range(0, 6):
    # i = 0
    for i in range(0,6):
        new_mat = copy.deepcopy(mat)
        for y in range(0, len(mat)):
            for x in range(0, len(mat)):
                for z in range(0, len(mat)):
                    (active, inactive) = count_neighbors(mat, y,x,z)
                    if mat[y][x][z] and (active < 2 or active > 3):
                        new_mat[y][x][z] = False
                    if not mat[y][x][z] and active == 3:
                        new_mat[y][x][z] = True
        mat = new_mat

    count = 0
    for y in range(0, len(mat)):
        for x in range(0, len(mat)):
            for z in range(0, len(mat)):
                if mat[y][x][z]:
                    count += 1
    print(count)
    
    # print("-----------")
    # for y in range(5, 10):
    #     for x in range(5, 10):
    #         print(("#" if new_mat[y][x][7] else "."), end='')
    #     print("")
    # print("-----------")
    # for y in range(5, 10):
    #     for x in range(5, 10):
    #         print(("#" if new_mat[y][x][8] else "."), end='')
    #     print("")
        


def read_file_2(file):
    with open(filename) as file:
        lines = [line[:-1] for line in file]

        N = ITER * 2 + len(lines)
        H = ITER + int(len(lines) / 2)
        print(H)
        mat = [[[[False for k in range(0, N)] for k in range(0, N)] for j in range(0, N)] for i in range(0, N)]
        for y in range(0, len(lines)):
            for x in range(0, len(lines[y])):
                mat[ITER+y][ITER+x][H][H] = True if lines[y][x] == "#" else False
        # for y in range(0, len(mat)):
        #     for x in range(0, len(mat)):
        #         print(("#" if mat[y][x][H] else "."), end='')
        #     print("")
        return mat

def count_neighbors_2(mat, y,x,z,w):
    active_count = 0
    inactive_count = 0
    for i in range(max(0, y-1),min(len(mat), y+2)):
        for j in range(max(0, x-1),min(len(mat), x+2)):
            for k in range(max(0, z-1),min(len(mat), z+2)):
                for l in range(max(0, w-1),min(len(mat), w+2)):
                    # print((i,j,k))
                    if i == y and j == x and k == z and l == w:
                        continue
                    if mat[i][j][k][l]:
                        active_count += 1
                    else:
                        inactive_count += 1
    return (active_count, inactive_count)

def part2(mat):
    for i in range(0,6):
        new_mat = copy.deepcopy(mat)
        for y in range(0, len(mat)):
            for x in range(0, len(mat)):
                for z in range(0, len(mat)):
                    for w in range(0, len(mat)):
                        (active, inactive) = count_neighbors_2(mat, y,x,z,w)
                        if mat[y][x][z][w] and (active < 2 or active > 3):
                            new_mat[y][x][z][w] = False
                        if not mat[y][x][z][w] and active == 3:
                            new_mat[y][x][z][w] = True
        mat = new_mat

    count = 0
    for y in range(0, len(mat)):
        for x in range(0, len(mat)):
            for z in range(0, len(mat)):
                for w in range(0, len(mat)):
                    if mat[y][x][z][w]:
                        count += 1
    print(count)

filename = "input.txt"
# filename = "sample_0.txt"

mat = read_file(filename)
# print(mat)
part1(mat)

mat = read_file_2(filename)
part2(mat)