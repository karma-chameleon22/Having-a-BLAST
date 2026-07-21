let multipleFiles = false;
let createDatabase = false;


// -----------------------------
// PATH HANDLING
// -----------------------------

function cleanPath(path) {

    if (!path) return "";

    return path.trim().replace(/^"+|"+$/g, "");

}


function quote(path) {

    return '"' + cleanPath(path) + '"';

}



function getPlatform() {

    const selected =
        document.querySelector('input[name="platform"]:checked');

    return selected ? selected.value : "linux";

}




function convertPath(path, platform) {

    path = cleanPath(path);


    // Windows path -> WSL path

    if (platform === "linux") {

        if (/^[A-Za-z]:\\/.test(path)) {

            let drive = path[0].toLowerCase();

            path =
                "/mnt/" +
                drive +
                "/" +
                path.substring(3).replace(/\\/g, "/");

        }

    }



    // WSL path -> Windows path

    if (platform === "windows" || platform === "powershell") {


        if (path.startsWith("/mnt/")) {


            let drive =
                path[5].toUpperCase();


            path =
                drive +
                ":\\" +
                path.substring(7).replace(/\//g, "\\");

        }

    }


    return path;

}




function continuation(platform) {

    if (platform === "windows") return "^";

    if (platform === "powershell") return "`";

    return "\\";

}








// -----------------------------
// PAGE BUTTONS
// -----------------------------

document.addEventListener("DOMContentLoaded", function(){



    // ABOUT

    const aboutButton =
        document.getElementById("aboutButton");


    const about =
        document.getElementById("aboutContent");


    about.style.display = "none";


    aboutButton.onclick = function(){


        if (about.style.display === "none") {

            about.style.display = "block";

            aboutButton.innerHTML =
                "Collapse About BLAST";

        }

        else {

            about.style.display = "none";

            aboutButton.innerHTML =
                "About BLAST";

        }

    };






    // FASTA MODE

    document.getElementById("singleButton").onclick = function(){

        multipleFiles = false;

        document.getElementById("fileMode").innerHTML =
            "Single FASTA selected";

    };




    document.getElementById("multipleButton").onclick = function(){

        multipleFiles = true;

        document.getElementById("fileMode").innerHTML =
            "Multiple FASTA selected";

    };







    // DATABASE MODE

    document.getElementById("existingDB").onclick = function(){

        createDatabase = false;

        document.getElementById("dbMessage").innerHTML =
            "Using existing BLAST database";

    };





    document.getElementById("createDB").onclick = function(){

        createDatabase = true;

        document.getElementById("dbMessage").innerHTML =
            "Creating new BLAST database";

    };







    document
    .getElementById("generateButton")
    .onclick = generateBLAST;


});









// -----------------------------
// BLAST GENERATOR
// -----------------------------

function generateBLAST(){


    const platform =
        getPlatform();



    const slash =
        continuation(platform);



    const blastType =
        document.getElementById("blastType").value;




    const query =
        quote(
            convertPath(
                document.getElementById("queryPath").value,
                platform
            )
        );



    const database =
        quote(
            convertPath(
                document.getElementById("databasePath").value,
                platform
            )
        );



    const databaseFasta =
        quote(
            convertPath(
                document.getElementById("databaseFastaPath").value,
                platform
            )
        );



    const evalue =
        document.getElementById("evalue").value;



    const word =
        document.getElementById("wordsize").value;



    const identity =
        document.getElementById("identity").value;



    const threads =
        document.getElementById("threads").value;



    const output =
        document.getElementById("outputName").value;



    const extension =
        document.getElementById("outputType").value;






    let fields = [];


    document
    .querySelectorAll(".checkbox-grid input:checked")
    .forEach(function(box){

        fields.push(box.value);

    });





    let lines = [];







    // DATABASE CREATION

    if(createDatabase){


        lines.push(
            "makeblastdb " + slash
        );


        lines.push(
            "-in " + databaseFasta + " " + slash
        );


        lines.push(
            "-dbtype nucl " + slash
        );


        lines.push(
            "-out " + database
        );


        lines.push("");

    }









    // MULTIPLE FILES

    if(multipleFiles){



        if(platform === "linux"){


            lines.push(
`for file in *.fasta; do`
            );


            lines.push(
`    ${blastType} \\`
            );


            lines.push(
`    -query "$file" \\`
            );


            lines.push(
`    -db ${database} \\`
            );


            lines.push(
`    -out "\${file%.fasta}_blast.${extension}" \\`
            );


            lines.push(
`    -outfmt "6 ${fields.join(" ")}" \\`
            );


            lines.push(
`    -word_size ${word} \\`
            );


            lines.push(
`    -perc_identity ${identity} \\`
            );


            lines.push(
`    -evalue ${evalue} \\`
            );


            lines.push(
`    -num_threads ${threads}`
            );


            lines.push(
"done"
            );


        }






        else if(platform === "windows"){


            lines.push(
"for %f in (*.fasta) do ("
            );


            lines.push(
`    ${blastType} ^`
            );


            lines.push(
`    -query "%f" ^`
            );


            lines.push(
`    -db ${database} ^`
            );


            lines.push(
`    -out "%~nf_blast.${extension}" ^`
            );


            lines.push(
`    -outfmt "6 ${fields.join(" ")}" ^`
            );


            lines.push(
`    -word_size ${word} ^`
            );


            lines.push(
`    -perc_identity ${identity} ^`
            );


            lines.push(
`    -evalue ${evalue} ^`
            );


            lines.push(
`    -num_threads ${threads}`
            );


            lines.push(
")"
            );


        }







        else {


            lines.push(
"Get-ChildItem *.fasta | ForEach-Object {"
            );


            lines.push(
"    " + blastType
            );


            lines.push(
"    -query $_.FullName"
            );


            lines.push(
"    -db " + database
            );


            lines.push(
`    -out "$($_.BaseName)_blast.${extension}"`
            );


            lines.push(
`    -outfmt "6 ${fields.join(" ")}"`
            );


            lines.push(
"    -word_size " + word
            );


            lines.push(
"    -perc_identity " + identity
            );


            lines.push(
"    -evalue " + evalue
            );


            lines.push(
"    -num_threads " + threads
            );


            lines.push(
"}"
            );


        }



    }









    // SINGLE FILE

    else {



        lines.push(
`${blastType} ${slash}`
        );


        lines.push(
`-query ${query} ${slash}`
        );


        lines.push(
`-db ${database} ${slash}`
        );


        lines.push(
`-out "${output}.${extension}" ${slash}`
        );


        lines.push(
`-outfmt "6 ${fields.join(" ")}" ${slash}`
        );


        lines.push(
`-word_size ${word} ${slash}`
        );


        lines.push(
`-perc_identity ${identity} ${slash}`
        );


        lines.push(
`-evalue ${evalue} ${slash}`
        );


        lines.push(
`-num_threads ${threads}`
        );


    }






    document.getElementById("result").value =
        lines.join("\n");


}
