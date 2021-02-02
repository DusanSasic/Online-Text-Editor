
<?php

//Variable to store the directory where 'MyFiles' folder should be
$dir = "./MyFiles";

// Get all the file names in the directory in ascending order
if($a = scandir($dir))
{
    //Send back JSON fromated response with all the file names from the directory 
    echo json_encode($a);
}else
{
    //Send back feedback
    print("Directory not found! Please refresh the page!");
    //Create a directory instead of the user
    mkdir($dir);
}

?>