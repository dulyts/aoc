import math

import time

asd = {}

def timeit(method):
    def timed(*args, **kw):
        ts = time.perf_counter()
        result = method(*args, **kw)
        te = time.perf_counter()
        if 'log_time' in kw:
            name = kw.get('log_name', method.__name__.upper())
            kw['log_time'][name] = int((te - ts) * 1000)
        # else:
        #     print('%r  %.20f' % (method.__name__, (te - ts)))

        if method.__name__.upper() not in asd:
            asd[method.__name__.upper()] = []
        asd[method.__name__.upper()].append(te - ts)
        
        return result
    return timed

def lcm(a, b):
    return abs(a*b) // math.gcd(a, b)

############################################################################
## https://math.stackexchange.com/questions/2218763/how-to-find-lcm-of-two-numbers-when-one-starts-with-an-offset ##
############################################################################

def combine_phased_rotations(a_period, a_phase, b_period, b_phase):
    """Combine two phased rotations into a single phased rotation

    Returns: combined_period, combined_phase

    The combined rotation is at its reference point if and only if both a and b
    are at their reference points.
    """
    gcd, s, t = extended_gcd(a_period, b_period)
    phase_difference = a_phase - b_phase
    pd_mult, pd_remainder = divmod(phase_difference, gcd)
    if pd_remainder:
        raise ValueError("Rotation reference points never synchronize.")

    combined_period = a_period // gcd * b_period
    combined_phase = (a_phase - s * pd_mult * a_period) % combined_period
    return combined_period, combined_phase

def arrow_alignment(red_len, green_len, a_r, a_g):
    """Where the arrows first align, where green starts shifted by advantage"""
    period, phase = combine_phased_rotations(
        red_len, -a_r % red_len, green_len, -a_g % green_len
    )
    return -phase % period


def extended_gcd(a, b):
    """Extended Greatest Common Divisor Algorithm

    Returns:
        gcd: The greatest common divisor of a and b.
        s, t: Coefficients such that s*a + t*b = gcd

    Reference:
        https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm#Pseudocode
    """
    old_r, r = a, b
    old_s, s = 1, 0
    old_t, t = 0, 1
    while r:
        quotient, remainder = divmod(old_r, r)
        old_r, r = r, remainder
        old_s, s = s, old_s - quotient * s
        old_t, t = t, old_t - quotient * t

    return old_r, old_s, old_t



def read_file(file):
    with open(filename) as file:
        lines = [line[:-1] for line in file]

    data = {}
    data["depart_time"] = int(lines[0])
    data["buses"] = lines[1].split(",")
    return data

def part1(data):
    closest_timestamp = 9999999
    closest_bus_id = -1
    for d in data["buses"]:
        if d == "x":
            continue
        b = int(d)
        next_start = (data["depart_time"] // b) * b + b
        # print(b, next_start)
        if next_start < closest_timestamp:
            closest_timestamp = next_start
            closest_bus_id = b
    print(closest_bus_id * (closest_timestamp - data["depart_time"]))

@timeit
def part2(data):
    buses = []
    for i in range(0, len(data["buses"])):
        if data["buses"][i] == "x":
            continue
        buses.append((int(data["buses"][i]), i))
    buses = sorted(buses, key=lambda bus: -bus[0])

    sync = arrow_alignment(red_len=buses[0][0], green_len=buses[1][0], a_r=-1*buses[0][1], a_g=-1*buses[1][1])
    step = lcm(buses[0][0], buses[1][0])
    for i in buses[2:]:
        sync = arrow_alignment(red_len=step, green_len=i[0], a_r=sync, a_g=-1*i[1])
        step = lcm(step, i[0])
    return sync

from functools import reduce
def chinese_remainder(n, a):
    sum = 0
    prod = reduce(lambda a, b: a*b, n)
    for n_i, a_i in zip(n, a):
        p = prod // n_i
        sum += a_i * mul_inv(p, n_i) * p
    return sum % prod
 
 
 
def mul_inv(a, b):
    b0 = b
    x0, x1 = 0, 1
    if b == 1: return 1
    while a > 1:
        q = a // b
        a, b = b, a%b
        x0, x1 = x1 - q * x0, x0
    if x1 < 0: x1 += b0
    return x1

@timeit
def part2_chinese_remainder_theorem(data):
    n = []
    a = []
    for i in range(0, len(data["buses"])):
        if data["buses"][i] == "x":
            continue
        n.append(int(data["buses"][i]))
        a.append(-i)
    return chinese_remainder(n, a)


filename = "input.txt"
# filename = "sample_0.txt"
# filename = "sample_1.txt"
# filename = "sample_2.txt"
# filename = "sample_3.txt"
# filename = "sample_4.txt"
# filename = "sample_5.txt"
# filename = "sample_6.txt"

data = read_file(filename)
# print(data)
part1(data)
print(part2(data))
print(part2_chinese_remainder_theorem(data))

for i in range(0,1000):
    part2(data)
    part2_chinese_remainder_theorem(data)

def average(lst): 
    return sum(lst) / len(lst) 

for i in asd:
    print(i, average(asd[i]))