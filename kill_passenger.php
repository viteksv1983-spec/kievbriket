<?php
echo "Looking for python processes...<br>\n";
$output = [];
$return_var = 0;
// Find processes matching 'python' or 'passenger'
exec('ps aux | grep -i python', $output, $return_var);

foreach ($output as $line) {
    echo htmlspecialchars($line) . "<br>\n";
    if (strpos($line, 'grep') === false) {
        // Simple regex to extract PID from ps aux
        if (preg_match('/^\S+\s+(\d+)/', $line, $matches)) {
            $pid = $matches[1];
            echo "Attempting to kill PID $pid...<br>\n";
            exec("kill -9 $pid");
        }
    }
}

// Also try the specific python3.12 binary name
$output2 = [];
exec('ps aux | grep -i python3.12', $output2, $return_var);
foreach ($output2 as $line) {
    if (strpos($line, 'grep') === false) {
        if (preg_match('/^\S+\s+(\d+)/', $line, $matches)) {
            $pid = $matches[1];
            echo "Attempting to kill PID $pid...<br>\n";
            exec("kill -9 $pid");
        }
    }
}
echo "Done.";
?>
