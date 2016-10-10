<?php

    //get the content with base64'style of the upload-picture
    $base64_image_content = $_POST['formFile'];
    //add the pic to driver
    if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64_image_content, $result)){
        $type = $result[2];
        $new_file = "./test.{$type}";
        if (file_put_contents($new_file, base64_decode(str_replace($result[1], '', $base64_image_content)))){
            echo '新文件保存成功：', $new_file;
        }
    }

?>
