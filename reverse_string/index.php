<?php
// String awal
$inputString = "NEGIE1";

// Pisahkan huruf dan angka
$letters = preg_replace('/[^A-Za-z]/', '', $inputString); // Mengambil hanya huruf
$digits = preg_replace('/[A-Za-z]/', '', $inputString); // Mengambil hanya angka

// Balikkan huruf
$reversedLetters = strrev($letters);

// Gabungkan huruf yang dibalik dengan angka
$result = $reversedLetters . $digits;

// Tampilkan hasil
echo "Hasil = \"$result\"";
?>
