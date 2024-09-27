<?php
// Array INPUT dan QUERY
$inputArray = ['xc', 'dz', 'bbb', 'dz'];
$queryArray = ['bbb', 'ac', 'dz'];

// Array untuk menyimpan hasil
$outputArray = [];

// Loop melalui setiap kata dalam QUERY
foreach ($queryArray as $query) {
    // Hitung jumlah kemunculan kata dalam INPUT
    $count = 0;
    foreach ($inputArray as $input) {
        if ($input === $query) {
            $count++;
        }
    }
    // Tambahkan hasil ke outputArray
    $outputArray[] = $count;
}

// Tampilkan hasil
echo "OUTPUT = [" . implode(", ", $outputArray) . "]";
?>
