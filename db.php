<?php

//Alle studenten via klas ID
function get_students_by_class($class_id)
{
	$db = new PDO("sqlite:".__DIR__ ."/gip.db");
	$stmt = $db->prepare("SELECT leerling.ll_id AS id, leerling.ll_voornaam AS voornaam, leerling.ll_naam as naam FROM leerling INNER JOIN klas ON leerling.ll_klas_fk = klas.kl_id WHERE klas.kl_id = :class_id");
	$stmt->bindParam(':class_id', $class_id);
	$stmt->execute();
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
	$db = null;
	return $result;
}

//Alle 
function get_gipvakken_by_class($class_id)
{
	$db = new PDO("sqlite:".__DIR__ ."/gip.db");
	$stmt = $db->prepare("SELECT * FROM gipvak INNER JOIN klas ON gipvak.gv_klas_fk = klas.kl_id WHERE klas.kl_id = :class_id");
	$stmt->bindParam(':class_id', $class_id);
	$stmt->execute();
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
	$db = null;
	return $result;
}

function get_classes()
{
	$db = new PDO("sqlite:".__DIR__ ."/gip.db");
	$sql = "SELECT * FROM klas";
	$result = $db->query($sql)->fetchAll(PDO::FETCH_CLASS);
	$db = null;
	return $result;
}

function get_student($student_id)
{
	$db = new PDO("sqlite:".__DIR__ ."/gip.db");
	$stmt = $db->prepare("SELECT * FROM leerling WHERE ll_id = :student_id");
	$stmt->bindParam(':student_id', $student_id);
	$stmt->execute();
	$result = $stmt->fetchAll(PDO::FETCH_CLASS);
	$db = null;
	return $result[0];
}

function get_gipevaluaties($student_id)
{
	$db = new PDO("sqlite:".__DIR__ ."/gip.db");
	$stmt = $db->prepare("SELECT * FROM gipevaluatie WHERE ge_leerling_fk = :student_id");
	$stmt->bindParam(':student_id', $student_id);
	$stmt->execute();
	$result = $stmt->fetchAll(PDO::FETCH_CLASS);
	$db = null;
	return $result;
}

function save($student_id, $evaluaties)
{

}

function add_user($email, $password, $status, $hash, $first_name, $last_name){
	$db = new PDO("sqlite:".__DIR__ ."/../../data/dashboard_db.sqlite");
	$stmt = $db->prepare("INSERT INTO users VALUES (null, :password, :email, :status, :hash, :first_name, :last_name)");
	$stmt->bindParam(':client_id', $client_id);
	$stmt->bindParam(':email', $email);
	$stmt->bindParam(':password', $password);
	$stmt->bindParam(':status', $status);
	$stmt->bindParam(':hash', $hash);
	$stmt->bindParam(':first_name', $first_name);
	$stmt->bindParam(':last_name', $last_name);
	$stmt->execute();
	return $db->lastInsertId(); //user id just created
	$db = null;
}

function complete_client_setup($client_id){
	$db = new PDO("sqlite:".__DIR__ ."/../../data/dashboard_db.sqlite");
	$stmt = $db->prepare("UPDATE clients SET cl_setup_complete = 1 WHERE cl_id = :client_id");
	$stmt->bindParam(':client_id', $client_id);
	$stmt->execute();
	$db = null;
}