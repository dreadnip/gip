<?php
require_once __DIR__.'/../db.php';

$class_id = file_get_contents('php://input');
$students = get_students_by_class($class_id);
$gipvakken = get_gipvakken_by_class($class_id);
$data = [
	"students" => $students,
	"gipvakken" => $gipvakken
];
header('Content-Type: application/json');
echo json_encode($data);