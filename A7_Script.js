/*
FILE			: A7_Script.js
PROJECT			: A07 - WDD Assignment
FIRST VERSION	: 2020-12-7 
AUTHOR			: Dusan Sasic & Kevin Downer
DESCRIPTION		: Script file for the Text Editor project, this file handles
                all the event that happen on the page. On user's action
                appropriate PHP scripts are being executet in order to CRAETE
                NEW, LOAD EXISTINg, SAVE and SAVE AS files the user is working on.
                In the text are user can perform minimalistic text editings.  
*/




//CONSTANTS
var TIMEOUT = 3000;
var NEW_FILE_CHAR = "|";


//GLOBAL VARIABLES
var jQueryXMLHttpRequest;
var selected;
var SelectedFile = NEW_FILE_CHAR;



    





//When document is ready
$(document).ready(function () 
{



    //ELEMENTS
    var TEXT_AREA       = document.getElementById("txt_main");
    var MAIN_FEEDBACK   = document.getElementById("overall_feedback");
    var FILE_LIST       = document.getElementById("lst_files");





    //Send get request to recieve file names
    jQueryXMLHttpRequest = $.getJSON("Get-Directory-Details.php?", LoadFilesSucces) .fail (LoadFilesError);
    
    

    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : LoadFilesSucces
    DESCRIPTION : On success of executing PHP for retrieving folder file names
                the <select> drop down list will be populated with the file names.
    PARAMETERS  : response - recieved JSON object
    RETURNS     : void
    */
    function LoadFilesSucces(response)
    {
    
        //Clear old lis values
        FILE_LIST.innerHTML = "";

        //Go throug each elemtn in JSON array and add them to the list
        for (var i = 1; i < response.length; i++) {
            
            //Set the first option to be calle "NewFile..."
            if(response[i] == ".." || response[i] == ".")
                FILE_LIST.innerHTML += "<option value=\"" + NEW_FILE_CHAR + "\">New File...</option><br>";
            else
                FILE_LIST.innerHTML += "<option value=\"" + response[i] + "\">" + response[i] + "</option><br>";
        
        }

        $("#lst_files").val(SelectedFile);

    }



    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : LoadFilesError
    DESCRIPTION : On fail of executing PHP for retrieving folder file names
                the the error message is displayed to inform the user.
    PARAMETERS  : response - recieved JSON object
    RETURNS     : void
    */
    function LoadFilesError(response)
    {
        MAIN_FEEDBACK.innerHTML = "<p style=\"color:red;\">" +jQueryXMLHttpRequest.responseText+ "</p>";
    }










    //When list item is being changed
    $("#lst_files").change(ListItemEvent);

    

    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : ListItemEvent
    DESCRIPTION : Function that will try to execute PHP
                script to get selected file's contents and
                display it in the main text editing area.
    PARAMETERS  : void
    RETURNS     : void
    */
    function ListItemEvent()
    {
    
        //Selected value in the list
        selected = document.getElementById('lst_files');
        var CustomGet = "Get-File-Contents.php?file=" + selected.value;
            
        if(selected.value != NEW_FILE_CHAR)
            jQueryXMLHttpRequest = $.getJSON(CustomGet, ListGetSuccess) .fail(ListGetFail);
        else
            TEXT_AREA.value = "";
        
    }



    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : ListGetSuccess
    DESCRIPTION : This function is executed When getting file's content is 
                succesfull and it populates the main editing area on the screen.
    PARAMETERS  : response - recieved JSON object
    RETURNS     : void
    */
    function ListGetSuccess(response)
    {
        //Sort out JSON response object values
        var content = response.content;
        var status = response.status;
        var msg = response.message;

        //On success
        if(status == "200")
        {
            //Populate text area with the contents
            TEXT_AREA.value = content;
        }else
        {
            //Inform a user what problem occured
            MAIN_FEEDBACK.innerHTML =  "<p style=\"color:red;\">"+msg+"</p>";
            //Hide error message after specified time
            setTimeout(ClearFeedback, TIMEOUT);
        }

    }



    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : ListGetFail
    DESCRIPTION : In case the get request fails, the appropriate message is displayed
                to the user informing about the problem that occured.
    PARAMETERS  : response - recieved JSON object
    RETURNS     : void
    */
    function ListGetFail(response)
    {
        var msg = response.message;
        MAIN_FEEDBACK.innerHTML =  "<p style=\"color:red;\">"+msg+"</p>";
        setTimeout(ClearFeedback, TIMEOUT);
    }











    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : anonymous
    DESCRIPTION : When user clicks the 'Save' button on the ;eft hand side
                this function is executed. In this function current file 
                selected in the dropdown list and it's contents will be 
                sent over GET to the PHP script
    PARAMETERS  : void
    RETURNS     : void
    */
    $("#btn_save").click(function()
    {

        //Currently Selectedected value in the list
        var file = document.getElementById('lst_files').value;
        //Creation of GET string
        var CustomGet = "Save-File-Contents.php?file=" + file + "&content=" + TEXT_AREA.value;

        //CHchecking if selected value is not the first in the list or "New File..."
        if(file != NEW_FILE_CHAR)
        {
            //Sending GET requestg to overwrite selected file
            jQueryXMLHttpRequest = $.getJSON(CustomGet,SaveSuccess) .fail(SaveFail);
            
        }else
        {
            //File is new, and function under 'Save As' button is executed
            document.getElementById("btn_saveAs").click();
        }

    });



    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : SaveSuccess
    DESCRIPTION : This function displays feedback to the user
                if there was a problem with file I/O or if everything
                went well.
    PARAMETERS  : response - recieved JSON object
    RETURNS     : void
    */
    function SaveSuccess(response)
    {

        //Sort JSON response variables
        var status = response.status;
        var resp = response.message;

        //If everything went well
        if(status != "200")
            MAIN_FEEDBACK.innerHTML =  "<p style=\"color:red;\">"+resp+"</p>";
        //Otherwise
        else
            MAIN_FEEDBACK.innerHTML =  "<p style=\"color:green;\">"+resp+"</p>";

        //Repopulate the list
        SelectedFile = file;
        jQueryXMLHttpRequest = $.getJSON("Get-Directory-Details.php?", LoadFilesSucces) .fail (LoadFilesError);  
        setTimeout(ClearFeedback, TIMEOUT);

    }




    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : SaveFail
    DESCRIPTION : This function displays feedback to the user
                when there was a problem on server side.
    PARAMETERS  : response - recieved JSON object
    RETURNS     : void
    */
    function SaveFail(response)
    {
        var resp = response.message;
        MAIN_FEEDBACK.innerHTML =  "<p style=\"color:red;\">"+resp+"</p>";
        setTimeout(ClearFeedback, TIMEOUT);
    }
    
    






    //Save as button event handler
    $("#btn_BoxSaveAs").click(function()
    {
        var new_file_name = document.getElementById("txt_saveAsName").value;
        var CustomGet = "SaveAs-File-Contents.php?file=" +new_file_name+ "&content=" +TEXT_AREA.value;

        if(new_file_name.length <= 0 || ContainsInvalid(new_file_name) == true)
        {
            document.getElementById("p_saveAsError").innerHTML = "Field empty or it contains invalid charachters.";
            setTimeout(ClearFeedback, TIMEOUT);
        }else
        {
            jQueryXMLHttpRequest = $.getJSON(CustomGet, SaveAsSuccess) .fail(SaveAsFail);        
        }

        
    });




    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : SaveAsSuccess
    DESCRIPTION : This function runs php script that is responsible for
                creating a new file with specified name and it's contents.
    PARAMETERS  : response - recieved JSON object
    RETURNS     : void
    */
    function SaveAsSuccess(response)
    {
        //JSON object separation of data
        var status = response.status;
        var resp = response.message;

        //Currentlu selected list value
        SelectedFile = document.getElementById("txt_saveAsName").value;

        //If file already exists
        if(status == "400")
        {
            //Display pop up window to choose YES or NO to owerwrite existing file
            $('.popup_yesno').show();
        }
        //If everythin OK
        else if(status == "200")
        {
            //Rell user that function was successful
            MAIN_FEEDBACK.innerHTML =  "<p style=\"color:green;\">"+resp+"</p>";
            //Populate the list with the new file
            jQueryXMLHttpRequest = $.getJSON("Get-Directory-Details.php?", LoadFilesSucces) .fail (LoadFilesError);
            //Hide the window
            $('.popup_box').hide();
        }
        //Other errors on the server-side
        else
        {
            MAIN_FEEDBACK.innerHTML =  "<p style=\"color:red;\">"+resp+"</p>";
            $('.popup_box').hide();
        }

        //Clear feedback messages after specified time
        setTimeout(ClearFeedback, TIMEOUT);
        //Reset textbox
        $("#txt_saveAsName").val("");

    }



    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : SaveAsFail
    DESCRIPTION : When SaveAs files, user is informed and the values are reset
    PARAMETERS  : response - recieved JSON object
    RETURNS     : void
    */
    function SaveAsFail(response)
    {
        var resp = response.message;
        MAIN_FEEDBACK.innerHTML =  "<p style=\"color:red;\">"+resp+"</p>";
        setTimeout(ClearFeedback, TIMEOUT);
        $("#txt_saveAsName").val("");
    }






    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : anonymous
    DESCRIPTION : When a 'New File' button is clicked, the text area is cleard out
                and the dropdown list item switched to 'New File...'.
    PARAMETERS  : void
    RETURNS     : void
    */
    $("#btn_newFile").click(function()
    {
        TEXT_AREA.value = "";
        $("#lst_files").val(NEW_FILE_CHAR);
    });








    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : anonymous
    DESCRIPTION : Whem SaveAs button is clicked, message box for entering
                file name and saving it as a new file is displayed.
    PARAMETERS  : void
    RETURNS     : void
    */
    $("#btn_saveAs").click(function()
    {
        document.getElementById("p_saveAsError").innerHTML = "";
        document.getElementById("p_notExistHelp").innerHTML = "";
        $('.popup_box').show();
    });

    





    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : anonymous
    DESCRIPTION : Close button for 'Save As' pop up window.
    PARAMETERS  : void
    RETURNS     : void
    */
    $('.popupCloseButton').click(function()
    {
        $('.popup_box').hide();
    });







    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : anonymous
    DESCRIPTION : Yes button click on the Pop up box that asks user 
                either to YES-overwrite the existing file or NO-and change
                the name of it. After execution, bot pop up boxser are closed.
    PARAMETERS  : void
    RETURNS     : void
    */
    $('#btn_BoxYes').click(function()
    {
        document.getElementById("btn_save").click();
        jQueryXMLHttpRequest = $.getJSON("Get-Directory-Details.php?", LoadFilesSucces) .fail (LoadFilesError);

        $('.popup_yesno').hide();
        $('.popup_box').hide();
    });






    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : anonymous
    DESCRIPTION : Yes button click on the Pop up box that asks user 
                either to YES-overwrite the existing file or NO-and change
                the name of it. After execution, bot pop up boxser are closed.
    PARAMETERS  : void
    RETURNS     : void
    */
    $('#btn_BoxNo').click(function()
    {
        $('.popup_yesno').hide();
        document.getElementById("btn_saveAs").click();
    });


    
    
    


    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : ClearFeedback
    DESCRIPTION : Function that clears feedback messages together with
                the timer after the specified time. 
    PARAMETERS  : void
    RETURNS     : void
    */
    function ClearFeedback()
    {
        MAIN_FEEDBACK.innerHTML =  "";
        document.getElementById("p_saveAsError").innerHTML = "";
    }







    /*
    FUNCTION HEADER COMMENT
    FUNCTION    : ContainsInvalid
    DESCRIPTION : Function that checks if the user entered invalid charachters
                for a new file name.
    PARAMETERS  : str - string to be checked
    RETURNS     : true - if the string contains invalid characters
                  false - if the string does not contain invalid charachters
    */
    function ContainsInvalid(str)
    {
        var contains = false;


        if(str.includes("<") == true)
        {
            contains = true;
        }else if(str.includes(">") == true)
        {
            contains = true;
        }else if(str.includes(":") == true)
        {
            contains = true;
        }else if(str.includes("\"") == true)
        {
            contains = true;
        }else if(str.includes("/") == true)
        {
            contains = true;
        }else if(str.includes("\\") == true)
        {
            contains = true;
        }else if(str.includes("|") == true)
        {
            contains = true;
        }else if(str.includes("?") == true)
        {
            contains = true;
        }else if(str.includes("*") == true)
        {
            contains = true;
        }else{
            contains = false;
        }

        
        return contains;

    }


});