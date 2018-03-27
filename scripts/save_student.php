<?php
require_once __DIR__.'/../db.php';

$data = file_get_contents('php://input');
$json = json_decode($data);
$response = save($json);
header('Content-Type: application/json');
echo json_encode($response);