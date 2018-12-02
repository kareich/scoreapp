<?php
    header('Access-Control-Allow-Origin: *');
    require 'connect.php';    
    global $dbh;
    $checktype = $_POST['checktype'];

    if ($checktype == 'pullscores') {
        $stmt = $dbh->prepare('SELECT * FROM scores');
        $stmt->execute();
        $result = $stmt->fetchAll();
        echo json_encode($result);
    }
    if ($checktype == 'updatescore') {
        $id = $_POST['id'];
        $title = $_POST['title'];
        $author = $_POST['author'];
        $type = $_POST['type'];
        $year = $_POST['year'];
        $stmt = $dbh->prepare('UPDATE scores SET title = :title, author = :author, type = :type, year = :year WHERE id = :id');
        $stmt->execute(array(':title' => $title, ':author' => $author, ':type' => $type, ':year' => $year, ':id' => $id));
    }
    if ($checktype == 'addscore') {
        $title = $_POST['title'];
        $author = $_POST['author'];
        $type = $_POST['type'];
        $year = $_POST['year'];
        $stmt = $dbh->prepare('INSERT INTO scores (title, author, type, year) VALUES (:title, :author, :type, :year)');
        $stmt->execute(array(':title' => $title, ':author' => $author, ':type' => $type, ':year' => $year));
        $id = $dbh->lastInsertId();
        move_uploaded_file($_FILES['file']['tmp_name'], 'scores/'.$id.'.pdf');
        $im = new Imagick();  
        try {
            $im->readImage('scores/'.$id.'.pdf[0]');
            $im->scaleImage(0, 200);
            $im->writeImages('thumbnails/'.$id.'.png', false);
            //echo $i.': success<br>';
        }catch (Exception $e) {
            //echo $e->getMessage();
            //echo $i.': failure<br>';
        }
        echo $id;
    }
?>