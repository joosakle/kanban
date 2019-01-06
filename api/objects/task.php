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

// create kanbanitem
function create(){
 
    // query to insert record
    $query = "INSERT INTO " . $this->table_name . " (content, status) VALUES(:content,:status)";
 
    // prepare query
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    $this->content=htmlspecialchars(strip_tags($this->content));
 
    // bind values
    $stmt->bindParam(":content", $this->content);
    $stmt->bindParam(":status", $this->status);
 
    // execute query
    if($stmt->execute()){
        return $this->conn->lastInsertId();
    }
 
    return -1;
     
}

// update the product
function update(){
 
    // update query
    $query = "UPDATE " . $this->table_name . " SET content = :content, status = :status WHERE id = :id";
 
    // prepare query statement
    $stmt = $this->conn->prepare($query);
 
    // sanitize
    $this->content=htmlspecialchars(strip_tags($this->content));
 
    // bind new values
    $stmt->bindParam(':content', $this->content);
    $stmt->bindParam(':status', $this->status);
    $stmt->bindParam(':id', $this->id);
 
    // execute the query
    if($stmt->execute()){
        return true;
    }
    return false;
}

function delete(){
 
    // delete query
    $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
 
    // prepare query
    $stmt = $this->conn->prepare($query);
 
    // bind id of record to delete
    $stmt->bindParam(1, $this->id);
 
    // execute query
    if($stmt->execute()){
        return true;
    }
 
    return false;
     
}

}