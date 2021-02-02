
<?php


//Get parameters & Setup path to the file
$file_name = $_GET['file'];
$file_content = $_GET['content'];
$file_path = "./MyFiles/" . $file_name;


//$path_parts = pathinfo($file_path);
//$modified_path = "./MyFiles/" . $path_parts['filename'];



if(file_exists($file_path) == false)
{
    //Create and open file for writing
    $myfile = fopen($file_path, "w");

    //If file opened succesfully
    if($myfile)
    {
        //Write contents from a text area to a file
        fwrite($myfile, $file_content);
        fclose($myfile);

        //Create a response
        $responseArr = array('status' => "200", 'message' => "New file craeted!");

    }else
    {
        //Create a response
        $responseArr = array('status' => "500", 'message' => "Internal Server Error!");
    }
}else
{
    $responseArr = array('status' => "400", 'message' => "File with that name already exists, please use 'Save' button.");
}

//Send back JSON formatted response
echo json_encode($responseArr);

?>

