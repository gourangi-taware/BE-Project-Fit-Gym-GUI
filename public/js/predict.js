

/*
  Purpose: Pass information to other helper functions after a user clicks 'Predict'
  Args:
    value - Actual filename or URL
    source - 'url' or 'file'
    */
function predict_click(value, source) {
  var preview = $(".food-photo");
  var file    = document.querySelector("input[type=file]").files[0];
  var loader  = "https://s3.amazonaws.com/static.mlh.io/icons/loading.svg";
  var reader  = new FileReader();

  // load local file picture
  reader.addEventListener("load", function () {
    preview.attr('style', 'background-image: url("' + reader.result + '");');
    var formData={ base64: reader.result.split("base64,")[1] };
    
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "register/diet",
        data: JSON.stringify(formData),
        dataType: "json",
        success: function (item) {
           console.log("In Diet Frontend Success");
        //    location.href="/";
        $('#concepts').html('<h3>'+ item.label + '</h3>');
        $('#concepts').append('<h3>'+ item.nutrients.ENERC_KCAL + '</h3>');
        $('#concepts').append('<h3>'+ item.nutrients.PROCNT + '</h3>');
        $('#concepts').append('<h3>'+ item.nutrients.FAT + '</h3>');
        $('#concepts').append('<h3>'+ item.nutrients.CHOCDF + '</h3>');
        $('#concepts').append('<h3>'+ item.nutrients.FIBTG + '</h3>'); 
        },
        error: function (e) {
       //    alert("Error!");
          console.log("ERROR: ", e);
        },
      });
    // doPredict({ base64: reader.result.split("base64,")[1] });
  }, false);

  if (file) {
    reader.readAsDataURL(file);
    $('#concepts').html('<img src="' + loader + '" class="loading" />');
  } else { alert("No file selcted!"); }
}

/*
  Purpose: Does a v2 prediction based on user input
  Args:
    value - Either {url : urlValue} or { base64 : base64Value }
*/
function doPredict(value) {
  app.models.predict(Clarifai.FOOD_MODEL, value).then(function(response) {
      if(response.rawData.outputs[0].data.hasOwnProperty("concepts")) {
        var tag = response.rawData.outputs[0].data.concepts[0].name;
        var url = 'http://api.wolframalpha.com/v2/query?input='+tag+'%20nutrition%20facts&appid='+myWolframAppId;

        getNutritionalInfo(url, function (result) {
          console.log("In nutrition");
          
          $('#concepts').html('<h3>'+ tag + '</h3>' + "<img src='"+result+"'>");
        });
      }
    }, function(err) { console.log(err); }
  );
}