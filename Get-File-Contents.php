
<?php

 //Gets file name from GET method into string
$file_name = $_GET['file'];

//Create a file path using a file name
$file_path = "./MyFiles/" . $file_name;

//If file exits
if(file_exists($file_path) == true)
{
    //Open file for reading
    $myfile = fopen($file_path, "r");

    //Save read string into a variable
    $file_contents = fread($myfile,filesize($file_path));
    
    //Close the file
    fclose($myfile);

    //If file not empty
    if( strlen($file_contents) > 0)
    {
      //Create an array response that will be converted into JSON 
      $responseArr = array('status' => "200", 'message' => "File read successful!", 'content' => $file_contents);
    }
    else
    {
      //Create an array response that will be converted into JSON 
      $responseArr = array('status' => "200", 'message' => "File read successful!", 'content' => "");
    }


}else
{
  //Create an array response that will be converted into JSON 
  $responseArr = array('status' => "400", 'message' => "File does not exist!", 'content' => "");
}
  

//Send back JSON formatted response
echo json_encode($responseArr);

?>
