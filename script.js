let databaseMade = true;
let multiple = false;


document.addEventListener("DOMContentLoaded", function () {


    // Query selection buttons

    const singleButton = document.getElementById("singleButton");
    const multipleButton = document.getElementById("multipleButton");


    if(singleButton){

        singleButton.onclick = function(){

            multiple = false;

            document.getElementById("fileMode").innerHTML =
            "Single FASTA selected";

        };

    }



    if(multipleButton){

        multipleButton.onclick = function(){

            multiple = true;

            document.getElementById("fileMode").innerHTML =
            "Multiple FASTA files selected";

        };

    }




    // Database buttons


    const existingDB =
    document.getElementById("existingDB");


    const createDB =
    document.getElementById("createDB");



    if(existingDB){

        existingDB.onclick=function(){

            databaseMade=true;

            document.getElementById("dbMessage").innerHTML =
            "Using existing BLAST database";

        };

    }




    if(createDB){

        createDB.onclick=function(){

            databaseMade=false;

            document.getElementById("dbMessage").innerHTML =
            "makeblastdb command will be generated";

        };

    }






    // Generate command button


    const generateButton =
    document.getElementById("generateButton");



    if(generateButton){


        generateButton.onclick=function(){

            generateBLAST();

        };


    }







    // Help menu


    const helpButton =
    document.getElementById("helpButton");



    if(helpButton){


        helpButton.onclick=function(){


            const help =
            document.getElementById("helpContent");



            if(help.style.display==="block"){


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




});







function generateBLAST(){



    let blast =
    document.getElementById("blastType").value;



    let query =
    document.getElementById("queryPath").value;



    let db =
    document.getElementById("dbPath").value;



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





    // Collect output columns


    let fields=[];



    document
    .querySelectorAll(".checkbox-grid input:checked")
    .forEach(function(box){


        fields.push(box.value);


    });





    let outfmt="6";



    if(extension==="csv"){

        outfmt="10";

    }





    let command="";





    // Add database creation if needed


    if(databaseMade===false){


        command +=

`makeblastdb \\
-in "${db}.fasta" \\
-dbtype nucl \\
-out "${db}"


`;

    }







    // Multiple file warning


    if(multiple){


        command +=

`# Multiple FASTA mode

# Run this command for each FASTA file


`;

    }







    command +=


`${blast} \\
-query "${query}" \\
-db "${db}" \\
-out "${output}.${extension}" \\
-outfmt "${outfmt} ${fields.join(" ")}" \\
-evalue ${evalue} \\
-word_size ${word} \\
-perc_identity ${identity} \\
-num_threads ${threads}`;






    document.getElementById("result").value =
    command;



}
