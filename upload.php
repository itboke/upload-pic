<?php
    /*
     * 保存图片
    */
    $pic_dir = '/upload-pic/upload/';

    //判断图片是否存在
    $local_pic = $_SERVER['DOCUMENT_ROOT'].$pic_dir.$_FILES["file"]["name"];
    if(file_exists($local_pic)){
        $data = array(
            'code' => '88888',
            'msg'  => '上传失败',
            'data' => array('error'=>'该文件已存在')
        );
        echo json_encode($data,JSON_UNESCAPED_SLASHES);
    }else{
        $img = './upload/'.$_FILES["file"]["name"];
        move_uploaded_file($_FILES["file"]["tmp_name"],$img);
        //返回图片保存服务器的目录
        $pic_root = $_SERVER['HTTP_ORIGIN'].$pic_dir.$_FILES["file"]["name"];
        $data = array(
            'code' => '00000',
            'msg'  => '上传成功',
            'data' => array('pic_url'=>$pic_root)
        );
        echo json_encode($data,JSON_UNESCAPED_SLASHES);
    }
?>
