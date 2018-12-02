<?php
    for ($i=0; $i<100; $i++) {
        $im = new Imagick();  
        try {
            $im->readImage('scores/'.$i.'.pdf[0]');
            $im->scaleImage(0, 200);
            $im->writeImages('thumbnails/'.$i.'.png', false);
            echo $i.': success<br>';
        }catch (Exception $e) {
            //echo $e->getMessage();
            echo $i.': failure<br>';
        }
    }
?>