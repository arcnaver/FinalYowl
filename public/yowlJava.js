//Hook up the button for Login
$(document).ready(function(){
    $("#getLogin").click(function(){
        //Post to server
        $.ajax({
            url: `/getlogin?user_name=${$('#user_name').val()}&password=${$('#password').val()}`,
            type: "POST",
            success: res => {
                //Check for err
                if (res == 'pw') {
                     //We failed
                     $("#error").text("Improper password. Please try again.");
                     $("#password").val("");
                }else if (res == 'nameerr'){
                   //We failed, no name match
                   $("#error").text("Username doesn't exist. Please try again.");
                   $("#user_name").val("");
                   $("#password").val("");
                }else{
                    //Change the name of the message_pane
                    $("#message_pane").text("Messages");
                    //Get rid of the login forms
                    $("#login_form").remove();
                    //Show connections column
                    $("#current_users").text("Connected Users");
                    //Show the username
                    $("#connected_peeps").append('\n');
                    $("#connected_peeps").append(res); 
                    //Incase sessions break, store username here
                    $("#stored_user").append(res);   
                    
                    //Connection msg
                    $("#connect_message").append('\n');
                    $("#connect_message").append('<img src="favicon-32x32.png" alt="favicon"> ' + res + ' has connected.'); 
                    //Cause the input zone to appear, like magic
                    $(".input_zone").css("visibility", "visible");
                }              
            }
        });
        
    });
});


//Hook up the button for New Users
$(document).ready(function(){
    $("#signUp").click(function(){
        //Post to server
        $.ajax({
            url: `/signUp?new_user_name=${$('#new_user_name').val()}&new_password=${$('#new_password').val()}&first_name=${$('#first_name').val()}&last_name=${$('#last_name').val()}`,
            type: "POST",
            success: res => {
                //Remove login form and reset text
                $("#login_form").remove();
                $("#message_pane").text("Messages");
    
                //Show connections column
                $("#current_users").text("Connected Users");
                //Show the username
                $("#connected_peeps").append('\n');
                $("#connected_peeps").append(res);   
                
                //Connection msg
                $("#connect_message").append('\n');
                $("#connect_message").append('<img src="favicon-32x32.png" alt="favicon"> ' + res + ' has connected.'); 
                //Cause the input zone to appear, like magic
                $(".input_zone").css("visibility", "visible");

                //Set up the username
                $("#user_name").text('Bill');
            }
        });
        
    });
});


