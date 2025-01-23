<?php
// Load environment variables from the .env file
if (file_exists('.env')) {
    $dotenv = fopen('.env', 'r');
    while ($line = fgets($dotenv)) {
        // Parse the line and store it in an associative array
        if (strpos($line, 'API_KEY') !== false) {
            $api_key = trim(explode('=', $line)[1]);
            break;
        }
    }
    fclose($dotenv);
}

// Send the API key as JSON response
header('Content-Type: application/json');
echo json_encode(['apiKey' => $api_key]);
?>