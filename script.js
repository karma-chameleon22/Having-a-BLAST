let databaseMade = true;
let multiple = false;


/*
    Removes existing quotes from user paths
    and adds exactly one pair of quotes.
*/
function cleanPath(path){

    if(!path){
        return "";
    }


    path = path.trim();


    // Remove any existing quotation marks
    path = path.replace(/^"+|"+$/g, "");


    return `"${path}"`;

}





document.addEventListener("DOMContentLoaded", function(){



    /*
        Query mode buttons
    */

    const singleButton =
    document.getElementById("singleButton");


    const multipleButton =
    document.getElementById("multipleButton");



    if(singleButton){

        singleButton.onclick = function(){

            multiple = false;

            document.getElementById("fileMode").innerHTML =
            "Single FASTA file selected";

        };

    }





    if(multipleButton){

        multipleButton.onclick = function(){

            multiple = true;

            document.getElementById("fileMode").innerHTML =
            "Multiple FASTA files selected";

        };

    }







    /*
        Database buttons
    */


    const existingDB =
    document.getElementById("existingDB");


    const createDB =
    document.getElementById("createDB");





    if(existingDB){

        existingDB.onclick = function(){

            databaseMade = true;

            document.getElementById("dbMessage").innerHTML =
            "Using existing BLAST database";

        };

    }





    if(createDB){

        createDB.onclick = function(){

            databaseMade = false;

            document.getElementById("dbMessage").innerHTML =
            "makeblastdb command will be generated";

        };

    }







    /*
        Help menu
    */


    const helpButton =
    document.getElementById("helpButton");



    if(helpButton){


        helpButton.onclick=function(){


            const help =
            document.getElementById("helpContent");



            if(help.style.display === "block"){


                help.style.display="none";


                helpButton.innerHTML =
                "How to Run BLAST on Your Computer";


            }

            else{


                help.style.display="block";


                helpButton.innerHTML =
                "Hide BLAST Instructions";


            }


        };


    }







    /*
        Generate BLAST command
    */


    const generateButton =
    document.getElementById("generateButton");



    if(generateButton){


        generateButton.onclick=function(){

            generateBLAST();

        };


    }



});









function generateBLAST(){



    let blast =
    document.getElementById("blastType").value;




    let query =
    cleanPath(
        document.getElementById("queryPath").value
    );



    let db =
    cleanPath(
        document.getElementById("dbPath").value
    );



    let evalue =
    document.getElementById("evalue").value;



    let word =
    document.getElementById("wordsize").value;



    let identity =
    document.getElementById("identity").value;



    let threads =
    document.getElementById("threads").value;



    let output =
    document.getElementById("outputName").value;



    let extension =
    document.getElementById("outputType").value;







    /*
        Collect selected BLAST output fields
    */


    let fields=[];



    document
    .querySelectorAll(".checkbox-grid input:checked")
    .forEach(function(box){


        fields.push(box.value);


    });






    /*
        BLAST output format

        6 = tabular
        10 = CSV
    */


    let outfmt="6";


    if(extension === "csv"){

        outfmt="10";

    }







    let command="";







    /*
        Add makeblastdb if user does not already
        have a formatted database
    */


    if(databaseMade === false){


        let rawDB =
        db.replace(/"/g,"");



        command +=

`makeblastdb \\
-in "${rawDB}.fasta" \\
-dbtype nucl \\
-out "${rawDB}"


`;

    }








    /*
        Multiple FASTA reminder
    */


    if(multiple){


        command +=

`# Multiple FASTA mode
# Run this command for each query file


`;

    }







    /*
        BLAST command
    */


    command +=


`${blast} \\
-query ${query} \\
-db ${db} \\
-out "${output}.${extension}" \\
-outfmt "${outfmt} ${fields.join(" ")}" \\
-evalue ${evalue} \\
-word_size ${word} \\
-perc_identity ${identity} \\
-num_threads ${threads}`;







    document
    .getElementById("result")
    .value = command;



}
