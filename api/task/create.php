<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
include_once '../config/database.php';
include_once '../objects/task.php';
 
$database = new Database();
$db = $database->getConnection();

$task = new Task($db);
$data = json_decode(file_get_contents("php://input"));
 
if(
    !empty($data->content) &&
    !empty($data->status)
){
    $task->content = $data->content;
    $task->status = $data->status;
    $id = $task->create();

    if($id != -1){
        http_response_code(201);
        echo json_encode(array("id" =>  $id ),JSON_NUMERIC_CHECK);
    }
    else{
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create task."));
    }
}
else{
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create task. Data is incomplete."));
}
?>