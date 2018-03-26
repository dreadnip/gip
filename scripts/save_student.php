<?php
require_once __DIR__.'/../db.php';

$data = file_get_contents('php://input');
$response = save($data->student, $data->evaluaties);
header('Content-Type: application/json');
echo json_encode($response);