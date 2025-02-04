<?php
if (file_exists('.env')) {
    $dotenv = fopen('.env', 'r');
    while ($line = fgets($dotenv)) {
        if (strpos($line, 'API_KEY') !== false) {
            $api_key = trim(explode('=', $line)[1]);
            break;
        }
    }
    fclose($dotenv);
}

header('Content-Type: application/json');
echo json_encode(['apiKey' => $api_key]);
?>
