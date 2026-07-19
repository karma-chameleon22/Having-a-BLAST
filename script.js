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



    // ABOUT BUTTON

    const aboutButton =
        document.getElementById("aboutButton");


    const aboutContent =
        document.getElementById("aboutContent");



    aboutButton.addEventListener("click", function () {


        if (aboutContent.style.display === "block") {


            aboutContent.style.display = "none";

            aboutButton.innerHTML =
                "About BLAST";


        } else {


            aboutContent.style.display = "block";

            aboutButton.innerHTML =
                "Collapse About BLAST";


        }


    });








    // FASTA MODE


    document
        .getElementById("singleButton")
        .addEventListener("click", function () {


            multipleFiles = false;


            document
                .getElementById("fileMode")
                .innerHTML =
                "Single FASTA selected";


        });







    document
        .getElementById("multipleButton")
        .addEventListener("click", function () {


            multipleFiles = true;


            document
                .getElementById("fileMode")
                .innerHTML =
                "Multiple FASTA selected";


        });









    // DATABASE MODE



    document
        .getElementById("existingDB")
        .addEventListener("click", function () {


            createDatabase = false;


            document
                .getElementById("dbMessage")
                .innerHTML =
                "Using existing BLAST database";


        });








    document
        .getElementById("createDB")
        .addEventListener("click", function () {


            createDatabase = true;


            document
                .getElementById("dbMessage")
                .innerHTML =
                "Creating new BLAST database";


        });









    // GENERATE BUTTON



    document
        .getElementById("generateButton")
        .addEventListener("click", generateBLAST);



});









function generateBLAST() {



    let blastType =
        document.getElementById("blastType").value;




    let queryPath =
        cleanPath(
            document.getElementById("queryPath").value
        );




    let databasePath =
        cleanPath(
            document.getElementById("databasePath").value
        );




    let databaseFasta =
        cleanPath(
            document.getElementById("databaseFastaPath").value
        );





    let evalue =
        document.getElementById("evalue").value;



    let wordSize =
        document.getElementById("wordsize").value;



    let identity =
        document.getElementById("identity").value;



    let threads =
        document.getElementById("threads").value;



    let outputName =
        document.getElementById("outputName").value;



    let outputType =
        document.getElementById("outputType").value;







    let fields = [];



    document
        .querySelectorAll(".checkbox-grid input:checked")
        .forEach(function (box) {


            fields.push(box.value);


        });







    let command = "";









    // DATABASE CREATION


    if (createDatabase) {


        command +=

`makeblastdb \\
-in ${quote(databaseFasta)} \\
-dbtype nucl \\
-out ${quote(databasePath)}



`;


    }









    // MULTIPLE FASTA MODE


    if (multipleFiles) {


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







    // SINGLE FASTA MODE


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
