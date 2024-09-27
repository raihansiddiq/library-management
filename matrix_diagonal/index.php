<?php
// Matriks
$matrix = [
    [1, 2, 0],
    [4, 5, 6],
    [7, 8, 9]
];

// Menghitung jumlah diagonal pertama (dari kiri atas ke kanan bawah)
$diagonal1Sum = 0;
$diagonal2Sum = 0;
$size = count($matrix);

for ($i = 0; $i < $size; $i++) {
    $diagonal1Sum += $matrix[$i][$i]; // Diagonal pertama
    $diagonal2Sum += $matrix[$i][$size - 1 - $i]; // Diagonal kedua
}

// Menghitung selisih
$result = $diagonal1Sum - $diagonal2Sum;

// Tampilkan hasil
echo "Hasil = $result";
?>
