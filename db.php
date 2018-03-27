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
	var_dump($db);
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

function save($data)
{
	$db = new PDO("sqlite:".__DIR__ ."/gip.db");
	//erase old values
	$student_id = $data[0]->student_id;
	$stmt = $db->prepare("DELETE FROM gipevaluatie WHERE ge_leerling_fk = :student_id");
	$stmt->bindParam(':student_id', $student_id);
	$stmt->execute();

	//begin insert new
	$db->beginTransaction ();
	$stmt = $db->prepare("INSERT INTO gipevaluatie VALUES (null, :student_id, :gipvak_id, :date, :score, :note)");
	foreach ($data as $row) {
	    $stmt->bindParam(':student_id', $row->student_id);
	    $stmt->bindParam(':gipvak_id', $row->gipvak_id);
	    $stmt->bindValue(':date', time());
	    $stmt->bindParam(':score', $row->score);
	    $stmt->bindParam(':note', $row->note);
	    $stmt->execute();
	}
	$result = $db->commit();
	$db = null;
	return $result;
}