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
                    //Make it so the Connected Users column shows                    
                    $("#connected_peeps").css("visibility", "visible");
                    //Show the username
                    $("#connected_peeps").append('\n');
                    $("#connected_peeps").append('</br>' + res);  
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
                    //Make it so messages are visible
                    $("#messages").css("visibility", "visible");
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
                //Make it so the Connected Users column shows                    
                $("#connected_peeps").css("visibility", "visible");
                //Show the username
                $("#connected_peeps").append('\n');
                $("#connected_peeps").append('</br>' + res);  
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
                //Make it so messages are visible
                $("#messages").css("visibility", "visible");
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

//JS FUNCTIONS FOR INDEX PAGE***********************************
//Compare messagage id with stored user's id
function compareId(m_id, s_id) {
    if(m_id != s_id) {
        return false;
    } else {
        return true;
    }
};

//See if user exists in array, if it doesn't put it there. 
function putStoredUserInArray(stored_user) {
    //Check to see if stored_user is already in array
    var exists = false;
    for(x in clients){
        if(clients[x] == stored_user){
        exists = true;
        
        } else {
            exists = false;
        }   
    } 
    
    //check to see if its null or undefined
    if(stored_user != null || stored_user != 'undefined'){
        //put stored_user in array
        clients.push(stored_user);
        stored_user_is_in_array = true;
    }
    //Check the array for console
    clientCheck();
    
};
    
//Check who is in clients[]
function clientCheck() {
    //Now loop through and print out who is in the array
    for(x in clients){
        console.log("Client: " + clients[x] + " is in clients list.");
    }

};

//Put user in array
function putUserInArray(user) {
    //Check to see if user is already in array
    var exists = false;
    for(x in clients){
        if(clients[x] == user){
        exists = true;
        
        } else {
            exists = false;
        }   
    }
    //If they're not in there, put them in and update Connected Users column
    if (exists == false && user != stored_user) {
        clients.push(user);
        //update column
        $("#connected_peeps").append('</br>' + user); 
        $("#messages").append('</br><span id="connect_message"><img src="favicon-32x32.png" alt="favicon">' + " " + user + ' has connected.</span></br>'); 
    } else { return; }
};
//Set up scrolling. Pass in message.
function scroll(message) {
        //Scroll
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
        var pass = {msg: message, id: stored_user};
        //Weird, I have to have this too
        $display = $('#messages');
        $display.animate({ scrollTop: $display[0].scrollHeight }, 'fast');
};

//Check if input zone is set to visible
function inputZoneIsVisible() {
    var x = document.getElementById("visible");
    console.log("Computed Visibility: " + window.getComputedStyle(x).visibility);
    if (window.getComputedStyle(x).visibility === "hidden") {
        return false;
    } else {
        return true;
    }
};

//Append message
function appendMessage(id, message, time, new_message_audio) {
    $('#messages').append($('<span id="chat_name">').text(id), $('<span id="chat_message"></br>').text(message)
            , $('<span id="chat_time">').text(time), ($('</br>')));
        //play cute sound https://freesound.org/s/448084/
        new_message_audio.play();
        //Call the scroll function
        scroll(message);
}