import numpy as np
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

base_pattern = [0,1,0,-1]
input = '12345678'
# AFTER_N = 4
# input = '80871224585914546619083218645595' * 12
# input = '19617804207202209144916044189917'
# input = '69317163492948606335995924319873'
# input = '59768092839927758565191298625215106371890118051426250855924764194411528004718709886402903435569627982485301921649240820059827161024631612290005106304724846680415690183371469037418126383450370741078684974598662642956794012825271487329243583117537873565332166744128845006806878717955946534158837370451935919790469815143341599820016469368684893122766857261426799636559525003877090579845725676481276977781270627558901433501565337409716858949203430181103278194428546385063911239478804717744977998841434061688000383456176494210691861957243370245170223862304663932874454624234226361642678259020094801774825694423060700312504286475305674864442250709029812379'
# input = '59768092839927758565191298625215106371890118051426250855924764194411528004718709886402903435569627982485301921649240820059827161024631612290005106304724846680415690183371469037418126383450370741078684974598662642956794012825271487329243583117537873565332166744128845006806878717955946534158837370451935919790469815143341599820016469368684893122766857261426799636559525003877090579845725676481276977781270627558901433501565337409716858949203430181103278194428546385063911239478804717744977998841434061688000383456176494210691861957243370245170223862304663932874454624234226361642678259020094801774825694423060700312504286475305674864442250709029812379'
# input = '03036732577212944063491565474664' * 7
input = '03036732577212944063491565474664' * 10000

AFTER_N = 100

end_cache = [[] for _ in range(0,AFTER_N)]

c = 21
step = 16
# c = 328
# step = 325

# t = time.time()
# for l in range(1,5):
#     last = np.array([int(i) for i in input*l], dtype=int)
#     L = len(last)

#     for i in range(0,AFTER_N):
#         new_last = []
#         for j in range(0, L):
#             tmp = 0
#             for k in range(0, L):
#                 iiii = ((k+1) // (j + 1)) % 4
#                 if iiii == 1:
#                     tmp += last[k]
#                 elif iiii == 3:
#                     tmp -= last[k]
#             tmp = abs(tmp) % 10
#             # print(f' = {tmp}')
#             new_last.append(tmp)
#         print(f'After {i+1} phases: ', end='')
#         for i in new_last:
#             print(i, end='')
#         print('')
#         last = new_last

#         end_cache[i] = last[:-1 * (c + i * step)]
#         print(end_cache)

# print(time.time() - t)
# exit()

# 5976809

# 1                                                                                                                                                                                                                                                                                                                                                                   24176176480919046114038763195595
# 2                                                                                                                                                                                                                                                                                                                                   6256043602520603011363465224777459921379035919046114038763195595
# 3                                                                                                                                                                                                                                                                                                   761475234291254386412029747446879332632650889714317813965774777459921379035919046114038763195595
# 4                                                                                                                                                                                                                                                                   12324257180380022570126116102466504696708578617775186346522477745992137655389714317813965774777459921379035919046114038763195595
# 5                                                                                                                                                                                                                                   7812150466036410508266937019899991973107189516852212914587144137933263265088971431781396577477745992137655389714317813965774777459921379035919046114038763195595
# 6                                                                                                                                                                                                   598378836851400427702157819613412211251127751797552425726222823094319125857861777518634652247774599213765538971431781396577477745992137655389714317813965774777459921379035919046114038763195595
# 7                                                                                                                                                                   67476744043941623149892290090981245790505591708781169894881116366776809319000171170352806085722297326326508897143178139657747774599213765538971431781396577477745992137655389714317813965774777459921379035919046114038763195595
# 8                                                                                                                                   5602214160883366544827994406168270759986965054305931102410826858393405594545691993000323636123876721809662639613100424813595086953921376553897143178139657747774599213765538971431781396577477745992137655389714317813965774777459921379035919046114038763195595
# 9                                                                                                   141337469173738896097068325001335451054813240441996998156078232122890644377466692702716318612837672185436925296943050871162418296022529737732250766474313045086953921376553897143178139657747774599213765538971431781396577477745992137655389714317813965774777459921379035919046114038763195595
# 10                                                                  83795850758917741161566808345307246011758532235653660852026033209698218182425458138381907920089227768098692529694305032363612387672180911288140146067072813444662682024732232250766474313045086953921376553897143178139657747774599213765538971431781396577477745992137655389714317813965774777459921379035919046114038763195595
# 11                                  0640765731548937875653978023352822380428394822619892878726939852163665083691966503529134565821629654917950765175530003236361238767218543692529694305087116241829602252928798404802662022868444662682024732232250766474313045086953921376553897143178139657747774599213765538971431781396577477745992137655389714317813965774777459921379035919046114038763195595
# 12  201031017254324801700348565355566767095318243470610096758587042367707151369628296761143959960569220587906433226027382644824547068121254369252969430503236361238767218091128814014606707281344466268202428248404802662022868444662682024732232250766474313045086953921376553897143178139657747774599213765538971431781396577477745992137655389714317813965774777459921379035919046114038763195595
#                                                                                                                                                                                                                                                                                89714317813965774777459921376553

#                                 6256043602520603011363465224777435745202555000000000000000000000
# 761475234291254386412029747446873076589048369111306450500550000000000000000000000000000000000000



#                                                 919046114038763195595
#                                 4777459921379035919046114038763195595
#                 89714317813965774777459921379035919046114038763195595
# 477745992137655389714317813965774777459921379035919046114038763195595

#21, 37, 53 || +16
#    10366463920469591619538718645595



# 11 - 21
# 27 - 37
# 43 - 53
# 59 - 69

# 03036732577212944063491565474664
# 0303673
last = [int(i) for i in input]
L = len(input)
for phase in range(0,AFTER_N):
    new_last = np.zeros((L,), dtype=int)
    for j in range(303673, L):
        tmp = 0
        for k in range(j, L):
            iiii = ((k+1) // (j + 1)) % 4
            if iiii == 1:
                tmp += last[k]
            elif iiii == 3:
                tmp -= last[k]
        tmp = abs(tmp) % 10
        new_last[j] = tmp
    # print(f'After {phase+1} phases')
    last = new_last

for i in last:
    print(i, end='')
print('')
exit()




last = [int(i) for i in input]
L = len(input)
for phase in range(0,AFTER_N):
    new_last = np.zeros((L,), dtype=int)
    for j in range(0, L):
        tmp = 0
        for k in range(j, L):
            iiii = ((k+1) // (j + 1)) % 4
            if iiii == 1:
                tmp += last[k]
            elif iiii == 3:
                tmp -= last[k]
        tmp = abs(tmp) % 10
        new_last[j] = tmp
    print(f'After {phase+1} phases')
    last = new_last

for i in last:
    print(i, end='')

exit()

# part2
for i in range(0,AFTER_N):
    # new_last = [0 for i in range(0,L)]
    # f = np.memmap('memmapped.dat', dtype=np.int, mode='w+', shape=(L, 1))
    new_last = np.zeros((L,), dtype=int)
    # print('asd')
    # t = time.time()
    for j in range(0, L):
        # if j % 100000 == 0:
        # print(time.time() - t)
        # t = time.time()
        tmp = 0
        for k in range(j, L):
            # print(f'{last[k]}*{patterns[j][pi]} +  ', end='')
            # m = get_multiplyer(j, k)
            # m = base_pattern[((k+1) // (j + 1)) % 4]
            # if m != 0:
            #     tmp += last[k] * m
            iiii = ((k+1) // (j + 1)) % 4
            if iiii == 1:
                tmp += last[k]
            elif iiii == 3:
                tmp -= last[k]
        tmp = abs(tmp) % 10
        # print(f' = {tmp}')
        new_last[j] = tmp
        # new_last.append(tmp)
    # print(f'After {i+1} phases: {new_last}')
    print(f'After {i+1} phases')
    last = new_last

aaaa = int(input[:7])
last[aaaa:8]

# for i in range(0,AFTER_N):
#     new_last = []
#     for j in range(0, L):
#         tmp = 0
#         for k in range(0, L):
#             pi = (1 + (k % len(patterns[j]))) % len(patterns[j])
#             # print(f'{last[k]}*{patterns[j][pi]} +  ', end='')
#             tmp += last[k] * patterns[j][pi]
#         tmp = abs(tmp) % 10
#         # print(f' = {tmp}')
#         new_last.append(tmp)
#     # print(f'After {i+1} phases: {new_last}')
#     print(f'After {i+1} phases')
#     last = new_last

# print(len(last))
# for i in last:
#     print(i, end='')