part2 l = phases 100 (map (read . (:"")) (take 10000 (concat (repeat l))) :: [Int])

phases 1 l = phase l 0 (length l)
phases n l = phases (n-1) (phase l 0 (length l))

phase _ _ 0   = []
phase l j len = (getDigit l j) : (phase l (j + 1) (len - 1))

getDigit l j = (abs (getDigit_ l 0 j)) `mod` 10
    where
        getDigit_ [] _ _ = 0
        getDigit_ (x:xs) k j
            | iiii == 1 = x + (getDigit_ xs (k+1) j)
            | iiii == 3 = ((-1) * x) + (getDigit_ xs (k+1) j)
            | otherwise = getDigit_ xs (k+1) j
            where
                iiii = ((k + 1) `div` (j + 1)) `mod` 4

-- main = do
--     print (part2 "03036732577212944063491565474664")