
class Point:

    def __init__(self,x,y,z):
        self.x = x
        self.y = y
        self.z = z
        self.init_x = x
        self.init_y = y
        self.init_z = z
        self.reset_velocity()
    
    def reset_velocity(self):
        self.vx = 0
        self.vy = 0
        self.vz = 0

    def calc(self):
        self.x += self.vx
        self.y += self.vy
        self.z += self.vz
    
    def on_start_point(self):
        return self.init_x == self.x and self.init_y == self.y and self.init_z == self.z
    
    def on_start_point2(self):
        return self.vx == 0 and self.vy == 0 and self.vy == 0

    def get_energy(self):
        return (abs(self.x) + abs(self.y) + abs(self.z)) * (abs(self.vx) + abs(self.vy) + abs(self.vz))
    
    def __repr__(self):
        return f'pos=<x={self.x},y={self.y},z={self.z}>, vel=<x={self.vx},y={self.vy},z={self.vz}>'

def read_file():
    with open("input.txt") as f:
        moons = []
        for line in f:
            line = line[1:-2]
            params = line.split(',')
            x = int(params[0].split('=')[1])
            y = int(params[1].split('=')[1])
            z = int(params[2].split('=')[1])
            moons.append(Point(x,y,z))
    return moons

def part1():
    moons = read_file()
    # moons = [Point(-1, 0, 2),Point(2, -10, -7),Point(4, -8, 8),Point(3, 5, -1)]
    # moons = [Point(-8, -10,0),Point(5, 5, 10),Point(2, -7,3),Point(9, -8, -3)]
    for i in moons:
        i.reset_velocity()
    
    sum_e = 0
    for time in range(1, 1000+1):
        for i in range(0, len(moons)-1):
            for j in range(i+1, len(moons)):
                if moons[i].x < moons[j].x:
                    moons[i].vx += 1
                    moons[j].vx -= 1
                elif moons[i].x > moons[j].x:
                    moons[i].vx -= 1
                    moons[j].vx += 1
                
                if moons[i].y < moons[j].y:
                    moons[i].vy += 1
                    moons[j].vy -= 1
                elif moons[i].y > moons[j].y:
                    moons[i].vy -= 1
                    moons[j].vy += 1
                
                if moons[i].z < moons[j].z:
                    moons[i].vz += 1
                    moons[j].vz -= 1
                elif moons[i].z > moons[j].z:
                    moons[i].vz -= 1
                    moons[j].vz += 1
        # if time % 10 == 0:
        #     print(f'After {time} steps:')
        #     for i in moons:
        #         print(i)
        for i in moons:
            i.calc()
            # print(i)
        # if time % 10 == 0:
    for i in moons:
        sum_e += i.get_energy()
        print(i.get_energy())
    print(sum_e)



def part2_bruteforce():
    moons = read_file()
    # moons = [Point(-1, 0, 2),Point(2, -10, -7),Point(4, -8, 8),Point(3, 5, -1)]
    # moons = [Point(-8, -10,0),Point(5, 5, 10),Point(2, -7,3),Point(9, -8, -3)]
    moons = [Point(-8, -10, 0),Point(5, 5, 10),Point(2, -7, 3),Point(9, -8, -3)]
    for i in moons:
        i.reset_velocity()
        print(i)
    print('-----')
    
    sum_e = 0
    all_on_start = False
    time = 0
    while not all_on_start:
        for i in range(0, len(moons)-1):
            for j in range(i+1, len(moons)):
                if moons[i].x < moons[j].x:
                    moons[i].vx += 1
                    moons[j].vx -= 1
                elif moons[i].x > moons[j].x:
                    moons[i].vx -= 1
                    moons[j].vx += 1
                
                if moons[i].y < moons[j].y:
                    moons[i].vy += 1
                    moons[j].vy -= 1
                elif moons[i].y > moons[j].y:
                    moons[i].vy -= 1
                    moons[j].vy += 1
                
                if moons[i].z < moons[j].z:
                    moons[i].vz += 1
                    moons[j].vz -= 1
                elif moons[i].z > moons[j].z:
                    moons[i].vz -= 1
                    moons[j].vz += 1
        # if time % 10 == 0:
        #     print(f'After {time} steps:')
        #     for i in moons:
        #         print(i)
        for i in moons:
            i.calc()
            # print(i)
        # if time % 10 == 0:

        asd = True
        for i in moons:
            asd = asd and i.on_start_point()
        all_on_start = asd

        time += 1
    for i in moons:
        print(i)
    print(time)

def part2():
    moons = read_file()
    # moons = [Point(-1, 0, 2),Point(2, -10, -7),Point(4, -8, 8),Point(3, 5, -1)]
    # moons = [Point(-8, -10,0),Point(5, 5, 10),Point(2, -7,3),Point(9, -8, -3)]
    moons = [Point(-8, -10, 0),Point(5, 5, 10),Point(2, -7, 3),Point(9, -8, -3)]
    for i in moons:
        i.reset_velocity()
        print(i)
    print('-----')
    
    sum_e = 0
    all_on_start = False
    time = 0
    while not all_on_start:
        for i in range(0, len(moons)-1):
            for j in range(i+1, len(moons)):
                if moons[i].x < moons[j].x:
                    moons[i].vx += 1
                    moons[j].vx -= 1
                elif moons[i].x > moons[j].x:
                    moons[i].vx -= 1
                    moons[j].vx += 1
                
                if moons[i].y < moons[j].y:
                    moons[i].vy += 1
                    moons[j].vy -= 1
                elif moons[i].y > moons[j].y:
                    moons[i].vy -= 1
                    moons[j].vy += 1
                
                if moons[i].z < moons[j].z:
                    moons[i].vz += 1
                    moons[j].vz -= 1
                elif moons[i].z > moons[j].z:
                    moons[i].vz -= 1
                    moons[j].vz += 1

        
        for i in moons:
            i.calc()

        asd = True
        i = 0
        while asd and i < len(moons):
            asd = asd and moons[i].on_start_point2()
        all_on_start = asd

        time += 1
        if time % 10000000 == 0:
            print(time)
            
    for i in moons:
        print(i)
    print(time)


# part1()
part2()


