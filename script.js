document.addEventListener("DOMContentLoaded", function(){

    console.log("DOM loaded");


    const button = document.getElementById("generateButton");


    if(button){

        console.log("Generate button found");


        button.onclick = function(){

            console.log("Generate button clicked");


            document.getElementById("result").value =
            "BLAST BUTTON WORKS";

        };

    }

    else {

        console.log("Generate button NOT found");

    }


});
