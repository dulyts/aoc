from itertools import permutations 
import time
from datetime import datetime


def timeit(method):
    def timed(*args, **kw):
        ts = time.time()
        tsd = datetime.now()
        result = method(*args, **kw)
        te = time.time()
        ted = datetime.now()
        print('%s %s %2.2f ms' % (method.__name__, (ted - tsd), (te - ts) * 1000.0))
        return result
    return timed

def load_maze():
    maze = []
    keys = dict()
    doors = dict()
    with open("input.txt") as f:
        for line in f:
            row = []
            for x in line.strip():
                row.append(x)
            maze.append(row)
    return (maze, keys, doors)

def dummy_maze():
    maze = []
    keys = dict()
    doors = dict()
    f = '########################\n#...............b.C.D.f#\n#.######################\n#.....@.a.B.c.d.A.e.F.g#\n########################\n'
    # f = '#################\n#i.G..c...e..H.p#\n########.########\n#j.A..b...f..D.o#\n########@########\n#k.E..a...g..B.n#\n########.########\n#l.F..d...h..C.m#\n#################\n'
    # f = '########################\n#@..............ac.GI.b#\n###d#e#f################\n###A#B#C################\n###g#h#i################\n########################\n'
    # y = 0
    for line in f.split('\n'):
        row = []
        for x in line.strip():
            row.append(x)
        maze.append(row)
    return (maze, keys, doors)

(maze, _m, _) = load_maze()
(maze, _, _) = dummy_maze()

path_cache = dict()

def dump_maze(pos, keys):
    for y in range(0, len(maze)):
        for x in range(0, len(maze[y])):
            if pos and pos[0] == x and pos[1] == y:
                print('O', end='')
            else:
                if keys and maze[y][x] in keys:
                    print(' ', end='')
                else:
                    print(maze[y][x], end='')
        print('')
dump_maze(None, None)

item_cache = dict()

def get_pos(item):
    if item in item_cache: return item_cache[item]
    for y in range(0, len(maze)):
        for x in range(0, len(maze[y])):
            if maze[y][x] == item:
                item_cache[item] = (x,y)
                return (x,y)


# all_key = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
all_key = []
for y in range(0, len(maze)):
    for x in range(0, len(maze[y])):
        if 97 <= ord(maze[y][x]) and ord(maze[y][x]) <= 122:
            all_key.append(maze[y][x].lower())
print(all_key)



def crawl_to(key):
    end_pos = get_pos(key)
    current_pos = get_pos('@')
    step_maze = [[0 for _ in range(0,len(maze[0]))] for _ in range(0, len(maze))]
    keys_required = make_crawl_step(step_maze, end_pos, current_pos)
    print(f'step from @ to {key}, required {keys_required[1]} keys')
    return key, keys_required[1]

def safe_crawl_step(step_maze, keys_required, pos):
    if step_maze[pos[1]][pos[0]] == 1:
        return False
    maze_block = maze[pos[1]][pos[0]]
    # print('safe_crawl_step', pos, maze[pos[1]][pos[0]], step_maze[pos[1]][pos[0]] == 1, maze_block == '#')
    if maze_block == '#':
        return False

    return True
    

def make_crawl_step(step_maze, end_pos, current_pos):
    # print('make_step', current_pos)
    if current_pos == end_pos:
        return (True, [])

    required_keys = []
    maze_block = maze[current_pos[1]][current_pos[0]]
    if 65 <= ord(maze_block) and ord(maze_block) <= 90:
        required_keys.append(maze_block.lower())
    
    step_maze[current_pos[1]][current_pos[0]] = 1
    # left
    if safe_crawl_step(step_maze, required_keys, (current_pos[0]-1, current_pos[1])):
        (valid_route, keys) = make_crawl_step(step_maze, end_pos, (current_pos[0]-1, current_pos[1]))
        if valid_route:
            return (True, keys + required_keys)
    # right
    if safe_crawl_step(step_maze, required_keys, (current_pos[0]+1, current_pos[1])):
        (valid_route, keys) = make_crawl_step(step_maze, end_pos, (current_pos[0]+1, current_pos[1]))
        if valid_route:
            return (True, keys + required_keys)
    # up
    if safe_crawl_step(step_maze, required_keys, (current_pos[0], current_pos[1]-1)):
        (valid_route, keys) = make_crawl_step(step_maze, end_pos, (current_pos[0], current_pos[1]-1))
        if valid_route:
            return (True, keys + required_keys)
    # right
    if safe_crawl_step(step_maze, required_keys, (current_pos[0], current_pos[1]+1)):
        (valid_route, keys) = make_crawl_step(step_maze, end_pos, (current_pos[0], current_pos[1]+1))
        if valid_route:
            return (True, keys + required_keys)

    step_maze[current_pos[1]][current_pos[0]] = 0
    return (False, [])

deps = dict()
# deps['g'] = set(['f'])
# deps['f'] = set(['d', 'c', 'a'])
# deps['e'] = set(['a', 'b'])
# deps['d'] = set(['b'])
# deps['c'] = set(['b'])
# deps['b'] = set([])
# deps['a'] = set(['b'])


min_step = 99999999


for i in all_key:
    key, req_keys = crawl_to(i)
    deps[key] = set(req_keys)

key_count = len(deps)
print(deps)
_ = input()



# --------------------------------------------


def get_cache_key(s, e):
    return f'{s[0]},{s[1]}#{e[0]},{e[1]}'

def go_to(key, current_pos, keys):
    end_pos = get_pos(key)
    to_end_cache_key = get_cache_key(current_pos, end_pos)
    if to_end_cache_key in path_cache:
        return (end_pos, path_cache[to_end_cache_key])
    to_start_cache_key = get_cache_key(end_pos, current_pos)

    step_maze = [[0 for _ in range(0,len(maze[0]))] for _ in range(0, len(maze))]
    steps = make_step(step_maze, end_pos, current_pos, 0, keys)
    # print(f'step from {current_pos} to {end_pos} in {steps} step with keys {keys}')
    path_cache[to_end_cache_key] = steps
    path_cache[to_start_cache_key] = steps
    return (end_pos, steps)

def safe_step(step_maze, keys, pos):
    # print('safe_step', pos, maze[pos[1]][pos[0]], step_maze[pos[1]][pos[0]] == 1, maze[pos[1]][pos[0]] == '#')
    if step_maze[pos[1]][pos[0]] == 1:
        return False
    maze_block = maze[pos[1]][pos[0]]
    if maze_block == '#':
        return False
    if 65 <= ord(maze_block) and ord(maze_block) <= 90 and maze_block.lower() not in keys:
        return False

    return True
    

def make_step(step_maze, end_pos, current_pos, step, keys):
    # dump_maze(current_pos, keys)
    # _ = input()
    # print('make_step', current_pos)
    if current_pos == end_pos:
        return step
    
    step_maze[current_pos[1]][current_pos[0]] = 1


    # left
    if safe_step(step_maze, keys, (current_pos[0]-1, current_pos[1])):
        steps = make_step(step_maze, end_pos, (current_pos[0]-1, current_pos[1]), step+1, keys)
        if steps: return steps
    # right
    if safe_step(step_maze, keys, (current_pos[0]+1, current_pos[1])):
        steps = make_step(step_maze, end_pos, (current_pos[0]+1, current_pos[1]), step+1, keys)
        if steps: return steps
    # up
    if safe_step(step_maze, keys, (current_pos[0], current_pos[1]-1)):
        steps = make_step(step_maze, end_pos, (current_pos[0], current_pos[1]-1), step+1, keys)
        if steps: return steps
    # right
    if safe_step(step_maze, keys, (current_pos[0], current_pos[1]+1)):
        steps = make_step(step_maze, end_pos, (current_pos[0], current_pos[1]+1), step+1, keys)
        if steps: return steps

    return None


for i in all_key + ['@']:
    for j in all_key + ['@']:
        if i == j: continue
        current_pos = get_pos(i)
        end_pos = get_pos(j)
        to_end_cache_key = get_cache_key(current_pos, end_pos)
        path_cache[to_end_cache_key] = go_to(j, current_pos, all_key)[1]



print('generate_finish', path_cache)


# @timeit
def get_route_options(keys, remain_keys):
    # routes = set()
    for i in remain_keys:
        if deps[i].issubset(keys):
            yield i
            # routes.add(i)
    # return list(routes)
    # return routes

asdfadsf = 0

remain_keys = set([i for i in deps])
print(remain_keys)

def find_shortest_path(keys, pos, current_step ,remain_keys):
    global asdfadsf
    global min_step
    if current_step > min_step:
        asdfadsf += 1
        print('try', asdfadsf)
        return
    # print(len(keys))
    if len(keys) == key_count:
        # print(current_step)
        if current_step < min_step:
            min_step = current_step
            print(min_step, keys)
        asdfadsf += 1
        print('try', asdfadsf)
        return
    # print(get_route_options(keys))
    for next_key in get_route_options(keys, remain_keys):
        (next_pos, step) = go_to(next_key, pos, keys)
        keys.add(next_key)
        remain_keys.remove(next_key)
        find_shortest_path(keys, next_pos, current_step + step, remain_keys)
        keys.remove(next_key)
        remain_keys.add(next_key)




# find_shortest_path(set(), get_pos('@'), 0, remain_keys)
# print('shortest path', min_step)


# path_options = []
# def find_all_path(keys, pos):
#     if len(keys) == key_count:
#         global min_step
#         # path_options.append([i for i in keys])
#         current_pos = get_pos('@')
#         steps = 0
#         for i in keys:
#             n = go_to(i, current_pos, keys)
#             current_pos = n[0]
#             steps += n[1]
#         if steps < min_step:
#             min_step = steps
#             print(min_step)

#         return
#     for next_key in get_route_options(keys):
#         next_pos = get_pos(next_key)
#         find_all_path(keys + [next_key], next_pos)

# find_all_path([], get_pos('@'))
# print(len(path_options))

# start = 
# end = get_pos('')







from sys import maxsize 

  
# implementation of traveling Salesman Problem 
def travellingSalesmanProblem(graph, s): 
  
    # store all vertex apart from source vertex 
    vertex = [] 
    for i in range(len(graph)): 
        if i != s: 
            vertex.append(i) 
  
    # store minimum weight Hamiltonian Cycle 
    min_path = maxsize 
  
    while True:
        # store current Path weight(cost) 
        current_pathweight = 0
  
        # compute current path weight 
        print('vertex', vertex)
        k = s 
        for i in range(len(vertex)): 
            current_pathweight += graph[k][vertex[i]] 
            k = vertex[i] 
        # current_pathweight += graph[k][s] 
  
        # update minimum 
        min_path = min(min_path, current_pathweight) 
  
        if not next_permutation(vertex): 
            break
  
    return min_path 
  
# next_permutation implementation 
def next_permutation(L): 
  
    n = len(L) 
  
    i = n - 2
    while i >= 0 and L[i] >= L[i + 1]: 
        i -= 1
  
    if i == -1: 
        return False
  
    j = i + 1
    while j < n and L[j] > L[i]: 
        j += 1
    j -= 1
  
    L[i], L[j] = L[j], L[i] 
  
    left = i + 1
    right = n - 1
  
    while left < right: 
        L[left], L[right] = L[right], L[left] 
        left += 1
        right -= 1
  
    return True
  
  
# # matrix representation of graph 
# # graph = [[0, 10, 15, 20],
# #         [10, 0, 35, 25],  
# #         [15, 35, 0, 30],
# #         [20, 25, 30, 0]]


# for i in deps:
#     print(i, '->', deps[i])
# print('')

graph = []
nodes = ['@'] + all_key
# nodes = all_key
for i in range(0, len(nodes)):
    row = []
    for j in range(0, len(nodes)):
        if i == j:
            row.append('x')
            continue
        # if j == 0:
        #     row.append(999)
        #     continue
        # print(nodes[i], nodes[j], (nodes[j] not in deps or nodes[i] in deps[nodes[j]] or deps[nodes[j]] == []), (deps[nodes[j]] if nodes[j] in deps else ''))
        # if nodes[i] in deps[nodes[j]] or len(deps[nodes[j]]) == 0:
        current_pos = get_pos(nodes[i])
        end_pos = get_pos(nodes[j])
        to_end_cache_key = get_cache_key(current_pos, end_pos)
        weight = go_to(nodes[j], current_pos, all_key)[1]
        # else:
        #     weight = 999
        row.append(weight)
    graph.append(row)

PAD = 3

print(' ', end=' ')
for f in range(0, len(graph)):
    print(nodes[f].ljust(PAD), end=' ')
print('')

for f in range(0, len(graph)):
    print(nodes[f], end=' ')
    for t in range(0, len(graph)):
        print(str(graph[f][t]).ljust(PAD), end=' ')
    print('')

#         @   a   b   c   d   e   f   g
graph = [[0,  2, 22, 99, 99, 99, 99, 99], # @
        [99,  0, 24, 99, 99, 99, 99, 99], # a
        [99, 24,  0, 28, 30, 34, 99, 99], # b
        [99,  4, 28,  0,  2,  6, 99, 99], # c
        [99,  6, 30,  2,  0,  4, 36, 99], # d
        [99, 10, 34,  6,  4,  0, 40, 99], # e
        [99, 30,  6, 34, 36, 40,  0, 44], # f
        [99, 99, 99, 99, 99, 99, 99,  0]] # g

s = 0
print(travellingSalesmanProblem(graph, s))
