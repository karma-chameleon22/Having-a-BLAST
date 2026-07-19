let databaseMade = true;
let multiple = false;



// Remove quotes only
function removeQuotes(path){

    if(!path){
        return "";
    }

    return path
        .trim()
        .replace(/^"+|"+$/g, "");

}



// Add exactly one pair of quotes
function quotePath(path){

    return `"${removeQuotes(path)}"`;

}






document.addEventListener("DOMContentLoaded", function(){



    /*
        Query buttons
    */


    document.getElementById("singleButton").onclick=function(){

        multiple=false;

        document.getElementById("fileMode").innerHTML =
        "Single FASTA file selected";

    };



    document.getElementById("multipleButton").onclick=function(){

        multiple=true;

        document.getElementById("fileMode").innerHTML =
        "Multiple FASTA files selected";

    };







    /*
        Database buttons
    */


    document.getElementById("existingDB").onclick=function(){

        databaseMade=true;

        document.getElementById("dbMessage").innerHTML =
        "Using existing BLAST database";

    };




    document.getElementById("createDB").onclick=function(){

        databaseMade=false;

        document.getElementById("dbMessage").innerHTML =
        "makeblastdb command will be generated";

    };







    /*
        Help button
    */


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
                "Collapse Instructions";

            }


        };

    }







    /*
        Generate button
    */


    document.getElementById("generateButton").onclick=function(){

        generateBLAST();

    };


});









function generateBLAST(){



    // Raw paths (no quotes)

    let queryRaw =
    removeQuotes(
        document.getElementById("queryPath").value
    );


    let dbRaw =
    removeQuotes(
        document.getElementById("dbPath").value
    );




    let blast =
    document.getElementById("blastType").value;



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







    /*
        makeblastdb
    */


    if(databaseMade===false){


        command +=

`makeblastdb \\
-in ${quotePath(dbRaw + ".fasta")} \\
-dbtype nucl \\
-out ${quotePath(dbRaw)}


\n\n`;

    }







    /*
        Multiple FASTA note
    */


    if(multiple){


        command +=

`# Multiple FASTA mode
# Repeat this command for each query file


`;

    }







    /*
        BLAST command
    */


    command +=

`${blast} \\
-query ${quotePath(queryRaw)} \\
-db ${quotePath(dbRaw)} \\
-out "${output}.${extension}" \\
-outfmt "${outfmt} ${fields.join(" ")}" \\
-evalue ${evalue} \\
-word_size ${word} \\
-perc_identity ${identity} \\
-num_threads ${threads}`;




    document.getElementById("result").value =
    command;


}
