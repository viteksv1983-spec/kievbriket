<?php
header('Content-Type: text/plain');
echo "--- SENIOR PHP DIAGNOSTICS ---\n";
echo "DOCUMENT_ROOT: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "SCRIPT_FILENAME: " . $_SERVER['SCRIPT_FILENAME'] . "\n";
echo "Current Dir: " . getcwd() . "\n";

echo "\nListing Current Dir:\n";
$files = scandir('.');
foreach($files as $f) {
    $type = is_dir($f) ? "DIR " : "FILE";
    echo "  $type $f\n";
}

echo "\nListing Root (/):\n";
try {
    $root_files = scandir('/');
    foreach($root_files as $f) {
        echo "  $f\n";
    }
} catch (Exception $e) {
    echo "  Error: " . $e->getMessage() . "\n";
}

echo "\nChecking passenger_wsgi.py:\n";
$wsgi = 'passenger_wsgi.py';
if (file_exists($wsgi)) {
    echo "  FOUND: $wsgi\n";
    echo "  Size: " . filesize($wsgi) . "\n";
    echo "  Content (first 50 chars): " . substr(file_get_contents($wsgi), 0, 50) . "\n";
} else {
    echo "  NOT FOUND: $wsgi\n";
}
?>
