<?php

    //保存图片
    if(file_exists($_FILES["file"]["name"])){
        echo $_FILES["file"]["name"].'already exists';
    }else{
        move_uploaded_file($_FILES["file"]["tmp_name"],$_FILES["file"]["name"]);
        echo '上传成功';
    }
?>
