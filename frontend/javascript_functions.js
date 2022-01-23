
$(document).ready(function(){

    showNavbar();  // dispaly navigation bar hacky way, added quickly.

    var path = window.location.pathname;
    var page = path.split("/").pop();
    console.log('page name');
    console.log(page);


     /* User create button action */
    $('#usercreatebtn').click(function(){
        var form = $('#createformid');

        $.ajax({
            'type': 'POST',
            'url': 'http://localhost:8000/app/create',
            'data': form.serialize(),
            crossDomain: false,
            success: function(xhr, status, message){
                displayResponseMsg(xhr['message'], 'success');
                console.log('success');
                alert('Request was successfull\n Now log in.');
            },
            error: function(xhr, status, error){    
                console.log('error');
                displayResponseMsg(xhr.responseText, 'error');
                alert('Something went wrong\n Check errors.');
            }
        });
        
    });



    /* User login button action */
    $('#userloginbtn').click(function(){
        var form = $('#loginformid');
        
        $.ajax({  // on login button click, call the api and get token.
            'type': 'POST',
            'url': 'http://localhost:8000/app/login',
            'data': form.serialize(),
            crossDomain: false,
            success: function(xhr, status, message){
                    console.log('success');
                    window.localStorage.setItem('token', xhr['token'])
                    displayResponseMsg(xhr['message'], 'success');
            },
            error: function(xhr, status, error){     
                    console.log('error');
                    displayResponseMsg(xhr.responseText, 'error');
                    alert('something went wrong\n Check errors.');
            }
        });
        

    });



    /* User update button action */
    $('#userupdatebtn').click(function(){
        if (window.localStorage.getItem('token') == null){
            console.log('token is null');
            alert('Sorry, Looks like you are not logged in.')
        } else {

            var form = $('#updateformid');
            $.ajax({
                url: 'http://localhost:8000/app/update',
                type: 'PATCH',
                headers: {Authorization: 'Token '+window.localStorage.getItem('token')},
                dataType: 'json',
                crossDomain: false,
                data: form.serialize(),
                success: function(xhr, status, message){
                    console.log('success');
                    console.log(xhr);
                    displayResponseMsg(xhr['message'], 'success')
                },
                error: function(xhr,textstatus, errorThrown){
                    console.log('error');
                    console.log(xhr);
                    displayResponseMsg(xhr['error'], 'error')
                    alert('something went wrong'); 
                },
            });
    }  // else ends here
    });

    /* On page load bring logged in user details. */
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if (page == 'update.html'){
        console.log('you are on update page');
        // try to get token check if its null
        if (window.localStorage.getItem('token') == null){
            console.log('token is null');
            alert('Sorry, login first to update user details.')
        } else{
            var header = {'Authorization': 'Token '+window.localStorage.getItem('token')}
            $.ajax({
                url: 'http://localhost:8000/app/get',
                type: 'GET',
                headers: header,
                dataType: 'json',
                crossDomain: false,
                success: function(xhr, status, message){
                    console.log('success');
                    $('#ufirst_name').val(xhr['data']['first_name']);
                    $('#ulast_name').val(xhr['data']['last_name']);
                },
                error: function(xhr,textstatus, errorThrown){
                    console.log('error');
                    console.log(xhr);
                    
                },
            });  
        }
    }



    /* Check if logged in user then show details of user before deleting. */
    var path = window.location.pathname;
    var page = path.split("/").pop();
    if (page == 'remove.html'){
        console.log('you are on remove page');
        // try to get token check if its null
        if (window.localStorage.getItem('token') == null){
            alert('Sorry, login first to remove your profile.')
        } else{
            $.ajax({
                url: 'http://localhost:8000/app/get',
                type: 'GET',
                headers: {'Authorization': 'Token '+window.localStorage.getItem('token')},
                dataType: 'json',
                crossDomain: false,
                success: function(xhr, status, message){
                    console.log('success');
                    $('#labelusername').html(xhr['data']['username']);
                },
                error: function(xhr,textstatus, errorThrown){
                    console.log('error');
                    alert('something went wrong, please contact admin.'); 
                },
            });  
        }
    }

    /* User remove button action */
    $('#userremovebtn').click(function(){
        console.log('btn clicked remove');
        if (window.localStorage.getItem('token') == null){  // Check token may be no logged in user.
            alert('Sorry, Looks like you are not logged in.')
        } else {

            if ( $('#rusername').val() == $('#labelusername').text()){
                console.log('yes both values match');
                console.log($('#rusername').val());
                console.log( $('#labelusername').text());

                $.ajax({
                    url: 'http://localhost:8000/app/remove',
                    type: 'DELETE',
                    headers: {Authorization: 'Token '+window.localStorage.getItem('token')},
                    dataType: 'json',
                    crossDomain: false,
                    success: function(xhr, status, message){
                        window.localStorage.removeItem('token');
                        console.log('success');
                        console.log(xhr);
                        alert('user is deleted.');
                        displayResponseMsg(xhr['message'], 'success')
                        window.location.replace("login.html");
                    },
                    error: function(xhr,textstatus, errorThrown){
                        console.log('error');
                        console.log(xhr);
                        displayResponseMsg(xhr['error'], 'error')
                        alert('something went wrong'); 
                    },
                });  //ajax call ends here

            } else {
                alert(' Username values do not match, \n please make sure you are logged in, \n and typed correct usrename.');
            }
    }  // else ends here
    }); // user remove button click function ends here



});


/* Function to display error or success message wherever appropriate. */
function displayResponseMsg(message, type){
    var msg_lines = ''
    if (type == 'error'){
        msg_lines +=   "<p class='errors'>"+message+"</p>"
    } else {
        msg_lines +=   "<p class='success'>"+message+"</p>"
    }
    
    document.getElementById("errorlines").innerHTML = msg_lines;
    console.log('finished');
}

/* to display navbar in all pages. */
function showNavbar(){

    var mainnavbar = '';
    mainnavbar += '<nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">';
    mainnavbar += '<div class="container-fluid">';
    mainnavbar += '<a class="navbar-brand">Django Authentication</a>';       
    mainnavbar += '<div class="collapse navbar-collapse" id="navbarCollapse">';

    mainnavbar +=   '<div class="navbar-nav">';
    mainnavbar +=       '<a href="home.html" class="nav-item nav-link active">Home</a>';
    mainnavbar +=       '<a href="create.html" class="nav-item nav-link active">Create</a>';
    mainnavbar +=       '<a href="login.html" class="nav-item nav-link active">Login</a>';
    mainnavbar +=       '<a href="update.html" class="nav-item nav-link active">Update</a>';
    mainnavbar +=       '<a href="remove.html" class="nav-item nav-link active">Remove</a>';
    mainnavbar +=   '</div>';
    mainnavbar +=     '</div>';
    mainnavbar +=  '</div>';
    mainnavbar +=   '</nav>';

    document.getElementById('nav-placeholder').innerHTML +=mainnavbar;
}


// remove the token when window is closed.
// $(window).on('beforeunload', function(){
//     window.localStorage.removeItem('token');
// });
