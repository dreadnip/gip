<?php
require_once __DIR__.'/../db.php';

$student_id = file_get_contents('php://input');
$student = get_student($student_id);
$gipevaluaties = get_gipevaluaties($student_id);
$data = (object)[
	"student" => $student,
	"gipevaluaties" => $gipevaluaties
];
header('Content-Type: application/json');
echo json_encode($data);