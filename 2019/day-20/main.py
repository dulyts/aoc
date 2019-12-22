from collections import defaultdict

nodes = dict()
nodes_count = defaultdict(lambda: 0)
map = []

def read_file(filename):
    with open(filename) as f:
        for line in f:
            row = []
            for x in line.split('\n')[0]:
                row.append(x)
            map.append(row)
    # print(map)
    for y in range(2, len(map)-2):
        for x in range(2, len(map[0])-2):
            if map[y][x] != '.':
                continue

            if 65 <= ord(map[y-1][x]) and ord(map[y-1][x]) <= 90:
                key = '' + map[y-2][x] + map[y-1][x]
                nodes[key + '-' + str(nodes_count[key])] = ((x,y))
                nodes_count[key] += 1

            if 65 <= ord(map[y+1][x]) and ord(map[y+1][x]) <= 90:
                key = '' + map[y+1][x] + map[y+2][x]
                nodes[key + '-' + str(nodes_count[key])] = ((x,y))
                nodes_count[key] += 1
                
            if 65 <= ord(map[y][x-1]) and ord(map[y][x-1]) <= 90:
                key = '' + map[y][x-2] + map[y][x-1]
                nodes[key + '-' + str(nodes_count[key])] = ((x,y))
                nodes_count[key] += 1
            
            if 65 <= ord(map[y][x+1]) and ord(map[y][x+1]) <= 90:
                key = '' + map[y][x+1] + map[y][x+2]
                nodes[key + '-' + str(nodes_count[key])] = ((x,y))
                nodes_count[key] += 1


    print(nodes)


def path_to(from_pos, to_pos):
    step_maze = [[0 for _ in range(0,len(map[0]))] for _ in range(0, len(map))]
    steps = make_step(step_maze, from_pos, to_pos, 0)
    return steps

def safe_step(step_maze, pos):
    if not (0 <= pos[1] and pos[1] < len(map) and 0 <= pos[0] and pos[0] < len(map[0])):
        return False
    if step_maze[pos[1]][pos[0]] == 1:
        return False
    maze_block = map[pos[1]][pos[0]]
    if maze_block == '.':
        # print('safe', map[pos[1]][pos[0]], pos[0], pos[1])
        return True
    if 65 <= ord(map[pos[1]][pos[0]]) and ord(map[pos[1]][pos[0]]) <= 90:
        return True
    return False
    

def make_step(step_maze, current_pos, end_pos, step):
    # print(current_pos)
    # _ = input()
    if current_pos == end_pos:
        # print('step', step)
        return step
    
    step_maze[current_pos[1]][current_pos[0]] = 1


    # left
    # print('left', safe_step(step_maze, (current_pos[0]-1, current_pos[1])))
    if safe_step(step_maze, (current_pos[0]-1, current_pos[1])):
        steps = make_step(step_maze, (current_pos[0]-1, current_pos[1]), end_pos, step+1)
        if steps: return steps
    # right
    # print('right', safe_step(step_maze, (current_pos[0]+1, current_pos[1])))
    if safe_step(step_maze, (current_pos[0]+1, current_pos[1])):
        steps = make_step(step_maze, (current_pos[0]+1, current_pos[1]), end_pos, step+1)
        if steps: return steps
    # up
    # print('up', safe_step(step_maze, (current_pos[0], current_pos[1]-1)))
    if safe_step(step_maze, (current_pos[0], current_pos[1]-1)):
        steps = make_step(step_maze, (current_pos[0], current_pos[1]-1), end_pos, step+1)
        if steps: return steps
    # down
    # print('down', safe_step(step_maze, (current_pos[0], current_pos[1]+1)))
    if safe_step(step_maze, (current_pos[0], current_pos[1]+1)):
        # print('step', (current_pos[0], current_pos[1]+1))
        steps = make_step(step_maze, (current_pos[0], current_pos[1]+1), end_pos, step+1)
        if steps: return steps

    return None


class Graph(): 
  
    def __init__(self, vertices): 
        self.V = vertices 
        self.graph = [[0 for column in range(vertices)]  
                    for row in range(vertices)] 
  
    def printSolution(self, dist): 
        print("Vertex tDistance from Source")
        for node in range(self.V): 
            print(node, "t", dist[node])
  
    # A utility function to find the vertex with  
    # minimum distance value, from the set of vertices  
    # not yet included in shortest path tree 
    def minDistance(self, dist, sptSet): 
  
        # Initilaize minimum distance for next node 
        min = 99999999999
        min_index = None
  
        # Search not nearest vertex not in the  
        # shortest path tree 
        for v in range(self.V): 
            if dist[v] < min and sptSet[v] == False: 
                min = dist[v] 
                min_index = v 
  
        return min_index 
  
    # Funtion that implements Dijkstra's single source  
    # shortest path algorithm for a graph represented  
    # using adjacency matrix representation 
    def dijkstra(self, src): 
  
        dist = [99999999999] * self.V 
        dist[src] = 0
        sptSet = [False] * self.V 
  
        for _ in range(self.V): 
  
            # Pick the minimum distance vertex from  
            # the set of vertices not yet processed.  
            # u is always equal to src in first iteration 
            u = self.minDistance(dist, sptSet) 
  
            # Put the minimum distance vertex in the  
            # shotest path tree 
            sptSet[u] = True
  
            # Update dist value of the adjacent vertices  
            # of the picked vertex only if the current  
            # distance is greater than new distance and 
            # the vertex in not in the shotest path tree 
            for v in range(self.V): 
                if self.graph[u][v] > 0 and \
                     sptSet[v] == False and \
                     dist[v] > dist[u] + self.graph[u][v]: 
                    dist[v] = dist[u] + self.graph[u][v] 
  
        self.printSolution(dist)
        return dist

def part_1():
    # read_file('test0.txt')
    # read_file('test1.txt')
    read_file('test2.txt')
    # read_file('input.txt')
    edge_matrix = []
    print('    ', end=' ')
    for i in nodes:
        print(i, end=' ')
    print('')
    for i in nodes:
        row = []
        print(i, end=' ')
        for j in nodes:
            if i == j:
                print('0'.ljust(4), end=' ')
                row.append(0)
                continue

            if i.split('-')[0] == j.split('-')[0]:
                print('1'.ljust(4), end=' ')
                row.append(1)
                continue

            step = path_to(nodes[i], nodes[j])
            if step:
                row.append(step)
                print(str(step).ljust(4), end=' ')
            else:
                print('0'.ljust(4), end=' ')
                row.append(0)
        edge_matrix.append(row)
        print('')

    start = list(nodes.keys()).index('AA-0')
    end = list(nodes.keys()).index('ZZ-0')
    # for y in range(len(edge_matrix)):
    #     for x in range(len(edge_matrix[0])):
    #         print(str(edge_matrix[y][x]).ljust(2), end=' ')
    #     print('')
    # print('')

    # start = 0
    # end = len(edge_matrix)

    print(start)
    print(end)
    # for i in range(len(nodes)):
    #     if nodes[i].startswith('AA'):
    #         start = 

    # g = Graph(end)
    # g.graph = edge_matrix
    # g.dijkstra(start)
    g = Graph(len(edge_matrix))
    g.graph = edge_matrix
    print(g.dijkstra(0)[end])


part_1()


