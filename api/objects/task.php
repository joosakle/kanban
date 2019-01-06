<?php
class Task{
 
    private $conn;
    private $table_name = "task";
 
    public $id;
    public $content;
    public $status;

    public function __construct($db){
        $this->conn = $db;
    }

function read(){
    $query = "SELECT id, content, status FROM " . $this->table_name . "";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt;
}
function create(){
    $query = "INSERT INTO " . $this->table_name . " (content, status) VALUES(:content,:status)";

    $stmt = $this->conn->prepare($query);
 
    $this->content=htmlspecialchars(strip_tags($this->content));
 
    $stmt->bindParam(":content", $this->content);
    $stmt->bindParam(":status", $this->status);
 
    if($stmt->execute()){
        return $this->conn->lastInsertId();
    }
 
    return -1;
     
}

function update(){
 
    $query = "UPDATE " . $this->table_name . " SET content = :content, status = :status WHERE id = :id";
 
    $stmt = $this->conn->prepare($query);
 
    $this->content=htmlspecialchars(strip_tags($this->content));
 
    $stmt->bindParam(':content', $this->content);
    $stmt->bindParam(':status', $this->status);
    $stmt->bindParam(':id', $this->id);
 
    if($stmt->execute()){
        return true;
    }
    return false;
}

function delete(){
 
    $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindParam(1, $this->id);
    if($stmt->execute()){
        return true;
    }
 
    return false;
     
}

}