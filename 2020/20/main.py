
def read_file(filename):
    tiles = []
    with open(filename) as file:
        lines = [line[:-1] for line in file]
        tile = None
        for line in lines:
            if line == "":
                tiles.append(tile)
            elif line.startswith("Tile"):
                tile = {
                    "id": line.split(" ")[1][:-1],
                    "px": []
                }
            else:
                tile["px"].append([c for c in line])
        tiles.append(tile)

    for i in tiles:
        calc_borders(i)
        i["neigbours"] = [None for i in range(0,4)]
        
    return tiles

def calc_borders(tile):
    left, right = [], []
    for j in tile["px"]:
        left.append(j[0])
        right.append(j[-1])
    tile["border"] = [[j for j in tile["px"][0]], right, [j for j in tile["px"][-1]], left]
    tile["border_rev"] = [[j for j in tile["px"][0]][::-1], right[::-1], [j for j in tile["px"][-1]][::-1], left[::-1]]


def border_match(t1, t2):
    for i in range(0, 4):
        for j in range(0, 4):
            if t1["border"][i] == t2["border"][j] or t1["border"][i] == t2["border_rev"][j]:
                tmp = j
                while abs(i-(tmp % 4)) != 2:
                    t2["px"] = rotate_90_right(t2["px"])
                    tmp += 1
                calc_borders(t2)
                if t1["border"][i] != t2["border"][tmp % 4]:
                    if (tmp % 2) == 0:
                        for k in t2["px"]:
                            k.reverse()
                    else:
                        t2["px"].reverse()
                calc_borders(t2)
                t1["neigbours"][i] = t2["id"]
                t2["neigbours"][(i+2)%4] = t1["id"]

                return True
    return False

def part1(data):
    remaining = data[1:]
    processed = [data[0]]
    while len(remaining) > 0:
        i = 0
        while i < len(remaining):
            match = False
            for p in processed:
                new_match = border_match(p, remaining[i])
                match = match or new_match
            if match:
                processed.append(remaining[i])
                remaining.pop(i)
            else:
                i += 1

    result = 1
    for p in processed:
        c = p["neigbours"].count(None)
        if c == 2:
            result *= int(p["id"])
    print(result)

def by_id(data, id):
    i = 0
    while data[i]["id"] != id:
        i += 1
    return data[i]

def put_into_image(image, px, x, y):
    for i in range(0, 8):
        for j in range(0, 8):
            image[y*8+i][x*8+j] = px[i+1][j+1]

def rotate_90_right(px):
    tmp = [[None for i in px] for j in px]
    for i in range(0, len(px)):
        for j in range(0, len(px)):
            tmp[j][len(px)-1-i] = px[i][j]
    return tmp

def print_image(image):
    for k in range(0, len(image)):
        for l in range(0, len(image)):
            print(u'\u2588' if image[k][l] == "#" else " ", end="")
        print("")
    print("-----")

def part2(data, N, M):
    image = [[None for j in range(0, 8*M)] for i in range(0, 8*N)]
    id_map = [[None for j in range(0, M)] for i in range(0, N)]
    for i in data:
        a = i["neigbours"]
        if a[0] == None and a[3] == None:
            id_map[0][0] = i["id"]
            break
    for i in range(0, N-1):
        for j in range(0, M-1):
            neigbours = next((x["neigbours"] for x in data if x["id"] == id_map[i][j]), None)
            id_map[i][j+1] = neigbours[1]
            id_map[i+1][j] = neigbours[2]
    neigbours = next((x["neigbours"] for x in data if x["id"] == id_map[N-1][M-2]), None)
    id_map[N-1][M-1] = neigbours[1]

    for i in range(0, N):
        for j in range(0, M):
            last_j = (j == N-1)
            last_i = (i == M-1)
            t1 = by_id(data, id_map[i][j])
            
            right = None
            if not last_j:
                t2 = by_id(data, id_map[i][j+1])
                for k in range(0, 4):
                    for l in range(0, 4):
                        if t1["border"][k] == t2["border"][l] or t1["border"][k] == t2["border_rev"][l]:
                            right = k
            else:
                t2 = by_id(data, id_map[i][j-1])
                for k in range(0, 4):
                    for l in range(0, 4):
                        if t1["border"][k] == t2["border"][l] or t1["border"][k] == t2["border_rev"][l]:
                            right = (k + 2) % 4
            
            bottom = None
            if not last_i:
                t3 = by_id(data, id_map[i+1][j])
                for k in range(0, 4):
                    for l in range(0, 4):
                        if t1["border"][k] == t3["border"][l] or t1["border"][k] == t3["border_rev"][l]:
                            bottom = k
            else:
                t3 = by_id(data, id_map[i-1][j])
                for k in range(0, 4):
                    for l in range(0, 4):
                        if t1["border"][k] == t3["border"][l] or t1["border"][k] == t3["border_rev"][l]:
                            bottom = (k + 2) % 4

            while (right % 4) != 1:
                t1["px"] = rotate_90_right(t1["px"])
                right += 1
                bottom += 1
            if bottom != 2:
                t1["px"].reverse()

            put_into_image(image, t1["px"], j, i)


    pattern = ['                  # ','#    ##    ##    ###',' #  #  #  #  #  #   ']
    snake_body = 15
    
    water = 0
    for i in image:
        for j in i:
            if j == "#":
                water += 1



    for i in range(0,2):
        for j in range(0,4):
            c = 0
            for k in range(0, len(image)-len(pattern)-1):
                for l in range(0, len(image)-len(pattern[0])-1):
                    match = True
                    for a in range(0, len(pattern)):
                        for b in range(0, len(pattern[0])):
                            if pattern[a][b] == "#" and image[k+a][l+b] != "#":
                                match = False
                                break
                        if not match:
                            break
                    if match:
                        c += 1
            if c != 0:
                print(water - c*snake_body)
            image = rotate_90_right(image)
        image.reverse()






filename, N, M = "input.txt", 12, 12
# filename, N, M = "sample_0.txt", 3, 3

data = read_file(filename)
# print(data)
part1(data)
part2(data, N, M)
