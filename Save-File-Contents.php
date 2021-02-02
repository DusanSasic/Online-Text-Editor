<?php



//Get parameters & Setup path to the file
$file_name = $_GET['file'];
$file_content = $_GET['content'];
$file_path = "./MyFiles/" . $file_name;



//If file exists
if(file_exists($file_path))
{

    //Open the current file for reading 
    $myfile = fopen($file_path, "w");

    //If file opened succesfully
    if($myfile)
    {
      //Write the contents from the text area
      fwrite($myfile, $file_content);
      fclose($myfile);
      
      //Create a response
      $responseArr = array('status' => "200", 'message' => "File overwrite successful!");
      
    }else
      //Create a response
      $responseArr = array('status' => "400", 'message' => "Unable to write to a file!");
    
}else
{   
    //Create a response
    $responseArr = array('status' => "404", 'message' => "File not found!");
}


//Send back JSON formatted response
echo json_encode($responseArr);





?>

