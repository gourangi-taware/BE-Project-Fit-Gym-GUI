$(document).ready(function () {

    $("#loginSubmit").click(function (event) {
        event.preventDefault();

        var loginemail=$("#login-email").val();
        var loginpassword=$("#login-password").val();
        if(loginemail=="")
        {
            
        }
        else if(loginpassword=="")
        {

        }
        else{
        console.log(loginemail);
        console.log(loginpassword);
        console.log("In login js");
        var formData = {
           loginemail:loginemail,
           loginpassword:loginpassword
           };
       
           // DO POST
           $.ajax({
             type: "POST",
             contentType: "application/json",
             url: "register/login",
             data: JSON.stringify(formData),
             dataType: "json",
             success: function (answers) {
                console.log("In Login Success");
                location.href="/";
                console.log(answers);
                //removeClass(self.element, 'cd-signin-modal--is-visible');
             },
             error: function (e) {
            //    alert("Error!");
               console.log("ERROR: ", e);
             },
           });
         }
      });
});