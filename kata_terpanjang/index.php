<?php
// Kalimat yang diberikan
$inputString = "Ini adalah contoh kalimat dengan beberapa kata terpanjang.";

// Mengubah kalimat menjadi array kata
$words = explode(" ", $inputString);

// Variabel untuk menyimpan kata terpanjang
$longestWord = "";

// Loop untuk mencari kata terpanjang
foreach ($words as $word) {
    // Menghapus tanda baca dari kata
    $word = preg_replace("/[^\w]/", '', $word);
    
    // Jika panjang kata lebih besar dari panjang kata terpanjang saat ini
    if (strlen($word) > strlen($longestWord)) {
        $longestWord = $word;
    }
}

// Tampilkan hasil
echo "Kata terpanjang adalah: \"$longestWord\"";
?>
