<?php
    //$dsn = 'mysql:host=bluemedia1.cism30bqpd7x.us-west-1.rds.amazonaws.com;dbname=connect';
    //$username = 'bluemedia';
    //$password = 'egrant1385';
    $dsn = 'mysql:host=database-2.ci2fm22a4hms.us-west-2.rds.amazonaws.com;dbname=innodb';
    $username = 'admin';
    $password = 'Egrant1385';
    $dbh = new PDO($dsn, $username, $password);
?>