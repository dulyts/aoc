pub fn main() {
    // let inp: Vec<i32> = "12345678"
    // let inp: Vec<i32> = "03036732577212944063491565474664"
    // let inp: Vec<i32> = "02935109699940807407585447034323"
    // let inp: Vec<i32> = "03081770884921959731165446850517"
    let inp: Vec<i32> = "59768092839927758565191298625215106371890118051426250855924764194411528004718709886402903435569627982485301921649240820059827161024631612290005106304724846680415690183371469037418126383450370741078684974598662642956794012825271487329243583117537873565332166744128845006806878717955946534158837370451935919790469815143341599820016469368684893122766857261426799636559525003877090579845725676481276977781270627558901433501565337409716858949203430181103278194428546385063911239478804717744977998841434061688000383456176494210691861957243370245170223862304663932874454624234226361642678259020094801774825694423060700312504286475305674864442250709029812379"
        .chars()
        .filter(|c| c != &'\n')
        .map(|c| c.to_string().parse::<i32>().unwrap())
        .collect();

    // let offset: usize = 0303673;
    // let offset: usize = 0293510;
    // let offset: usize = 0308177;
    // let mut next_last = Vec::with_capacity(inp.len());
    // for j in 0..inp.len() {
    //     next_last.push(inp[j]);
    // }
        
    let offset: usize = 5976809;
    let mut next_last = Vec::with_capacity(inp.len() * 10000);
    for _ in 0..10000 {
        for j in 0..inp.len() {
            next_last.push(inp[j]);
        }
    }

    let mut last = next_last.clone();

    for phase in 0..100 {
        let mut tmp = 0;
        for i in 0..(next_last.len() / 2) {
            tmp += next_last[next_last.len() - 1 - i];
            last[next_last.len() - 1 - i] = tmp.abs() % 10;
        }
        std::mem::swap(&mut last, &mut next_last);
        println!("After {} phase", phase + 1)
    }

    for i in (offset)..(offset + 8) {
        print!("{}", next_last[i]);
    }
    
}
