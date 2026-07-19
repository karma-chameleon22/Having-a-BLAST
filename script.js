let multipleFiles = false;

let createDatabase = false;



function cleanPath(path) {

    if (!path) {
        return "";
    }

    return path
        .trim()
        .replace(/^"+|"+$/g, "");

}



function quote(path) {

    return `"${cleanPath(path)}"`;

}





document.addEventListener("DOMContentLoaded", function () {


    // ABOUT BLAST COLLAPSE


    const aboutButton =
        document.getElementById("aboutButton");


    const aboutContent =
        document.getElementById("aboutContent");



    // Always start collapsed

    aboutContent.style.display = "none";



    aboutButton.addEventListener("click", function () {


        if (aboutContent.style.display === "none") {


            aboutContent.style.display = "block";

            aboutButton.innerHTML =
                "Collapse About BLAST";


        } else {


            aboutContent.style.display = "none";

            aboutButton.innerHTML =
                "About BLAST";


        }


    });






    // SINGLE FASTA


    document
    .getElementById("singleButton")
    .addEventListener("click", function(){


        multipleFiles = false;


        document.getElementById("fileMode").innerHTML =
        "Single FASTA selected";


    });







    // MULTIPLE FASTA


    document
    .getElementById("multipleButton")
    .addEventListener("click", function(){


        multipleFiles = true;


        document.getElementById("fileMode").innerHTML =
        "Multiple FASTA selected";


    });








    // EXISTING DATABASE


    document
    .getElementById("existingDB")
    .addEventListener("click", function(){


        createDatabase = false;


        document.getElementById("dbMessage").innerHTML =
        "Using existing BLAST database";


    });








    // CREATE DATABASE


    document
    .getElementById("createDB")
    .addEventListener("click", function(){


        createDatabase = true;


        document.getElementById("dbMessage").innerHTML =
        "Creating new BLAST database";


    });








    // GENERATE


    document
    .getElementById("generateButton")
    .addEventListener("click", generateBLAST);



});









function generateBLAST(){



    const blastType =
    document.getElementById("blastType").value;



    const queryPath =
    cleanPath(
        document.getElementById("queryPath").value
    );



    const databasePath =
    cleanPath(
        document.getElementById("databasePath").value
    );



    const databaseFasta =
    cleanPath(
        document.getElementById("databaseFastaPath").value
    );



    const evalue =
    document.getElementById("evalue").value;



    const wordSize =
    document.getElementById("wordsize").value;



    const identity =
    document.getElementById("identity").value;



    const threads =
    document.getElementById("threads").value;



    const outputName =
    document.getElementById("outputName").value;



    const outputType =
    document.getElementById("outputType").value;





    let fields = [];



    document
    .querySelectorAll(".checkbox-grid input:checked")
    .forEach(function(box){


        fields.push(box.value);


    });







    let command = "";








    // CREATE DATABASE


    if(createDatabase){


        command +=

`makeblastdb \\
-in ${quote(databaseFasta)} \\
-dbtype nucl \\
-out ${quote(databasePath)}


`;

    }









    // MULTIPLE FASTA


    if(multipleFiles){


        command +=

`for file in *.fasta; do
    ${blastType} \\
    -query "$file" \\
    -db ${quote(databasePath)} \\
    -out "\${file%.fasta}_blast.${outputType}" \\
    -outfmt "6 ${fields.join(" ")}" \\
    -word_size ${wordSize} \\
    -perc_identity ${identity} \\
    -evalue ${evalue} \\
    -num_threads ${threads}
done`;



    }








    // SINGLE FASTA


    else {


        command +=

`${blastType} \\
-query ${quote(queryPath)} \\
-db ${quote(databasePath)} \\
-out "${outputName}.${outputType}" \\
-outfmt "6 ${fields.join(" ")}" \\
-word_size ${wordSize} \\
-perc_identity ${identity} \\
-evalue ${evalue} \\
-num_threads ${threads}`;

    }







    document
    .getElementById("result")
    .value = command;


}
