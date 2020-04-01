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
                     playError();
                }else if (res == 'nameerr'){
                   //We failed, no name match
                   $("#error").text("Username doesn't exist. Please try again.");
                   $("#user_name").val("");
                   $("#password").val("");
                   playError();
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
                    //Adjust #connected_peeps to scroll
                    $("#connected_peeps").css("overflow", "auto");
                    $("#connected_peeps").css("height", "25em");                   
                    //Incase sessions break, store username here
                    $("#stored_user").append(res);   
                    
                    //Connection msg
                    $("#connect_message").append('\n');
                    $("#connect_message").append('<img src="favicon-32x32.png" alt="favicon"> ' + res + ' has connected.'); 
                    //Cause the input zone to appear, like magic
                    $(".input_zone").css("visibility", "visible");
                    playWelcome();
                    //Adjust #messages to scroll
                    $("#messages").css("overflow", "auto");
                    $("#messages").css("height", "25em");
                    
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
                //Adjust #connected_peeps to scroll
                $("#connected_peeps").css("overflow", "auto");
                $("#connected_peeps").css("height", "25em");
                //Incase sessions break, store username here
                $("#stored_user").append(res);   
                
                //Connection msg
                $("#connect_message").append('\n');
                $("#connect_message").append('<img src="favicon-32x32.png" alt="favicon"> ' + res + ' has connected.'); 
                //Cause the input zone to appear, like magic
                $(".input_zone").css("visibility", "visible");
                playWelcome();
                //Adjust #messages to scroll
                $("#messages").css("overflow", "auto");
                $("#messages").css("height", "25em");
            }
        });
        
    });
});

//Welcome sound
function playWelcome() {
    var audio = new Audio('welcome-cat.wav');
    audio.play();
}
//Error sound
function playError() {
    var audio = new Audio('error-hiss.wav');
    audio.play();
}