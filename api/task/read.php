<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
include_once '../config/database.php';
include_once '../objects/task.php';

$database = new Database();
$db = $database->getConnection();
$task = new Task($db);
 
$stmt = $task->read();
$num = $stmt->rowCount();
 
if($num>0){
    $tasks_array=array();
    $tasks_array["records"]=array();
 
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        $tasks_item=array(
            "id" => $id,
            "content" => $content,
            "status" => $status
        );
        array_push($tasks_array["records"], $tasks_item);
    }
 
    http_response_code(200);
    echo json_encode($tasks_array,JSON_NUMERIC_CHECK );
}
else{
    http_response_code(404);
    echo json_encode(
        array("message" => "No tasks found.")
    );
}