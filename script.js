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


    const aboutButton =
        document.getElementById("aboutButton");


    const aboutContent =
        document.getElementById("aboutContent");



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





    document
    .getElementById("singleButton")
    .addEventListener("click", function(){


        multipleFiles = false;


        document.getElementById("fileMode").innerHTML =
        "Single FASTA selected";


    });






    document
    .getElementById("multipleButton")
    .addEventListener("click", function(){


        multipleFiles = true;


        document.getElementById("fileMode").innerHTML =
        "Multiple FASTA selected";


    });








    document
    .getElementById("existingDB")
    .addEventListener("click", function(){


        createDatabase = false;


        document.getElementById("dbMessage").innerHTML =
        "Using existing BLAST database";


    });








    document
    .getElementById("createDB")
    .addEventListener("click", function(){


        createDatabase = true;


        document.getElementById("dbMessage").innerHTML =
        "Creating new BLAST database";


    });







    document
    .getElementById("generateButton")
    .addEventListener("click", generateBLAST);



});








function getPlatform(){

    let selected =
    document.querySelector(
        'input[name="platform"]:checked'
    );


    return selected ? selected.value : "linux";

}








function convertPath(path, platform){

    path = cleanPath(path);



    if(platform === "linux"){


        if(/^[A-Za-z]:\\/.test(path)){


            let drive =
            path[0].toLowerCase();


            path =
            "/mnt/" +
            drive +
            "/" +
            path
            .substring(3)
            .replace(/\\/g,"/");


        }


    }





    if(platform === "windows" || platform === "powershell"){


        if(path.startsWith("/mnt/")){


            let drive =
            path[5].toUpperCase();


            path =
            drive +
            ":\\" +
            path
            .substring(7)
            .replace(/\//g,"\\");


        }


    }



    return path;

}








function lineBreak(platform){


    if(platform === "windows"){

        return "^";

    }


    if(platform === "powershell"){

        return "`";

    }


    return "\\";

}









function generateBLAST(){


    const platform =
    getPlatform();



    const continuation =
    lineBreak(platform);





    const blastType =
    document.getElementById("blastType").value;





    const queryPath =
    convertPath(
        document.getElementById("queryPath").value,
        platform
    );





    const databasePath =
    convertPath(
        document.getElementById("databasePath").value,
        platform
    );





    const databaseFasta =
    convertPath(
        document.getElementById("databaseFastaPath").value,
        platform
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










    // MAKEBLASTDB


    if(createDatabase){


        command +=

`makeblastdb ${continuation}
-in ${quote(databaseFasta)} ${continuation}
-dbtype nucl ${continuation}
-out ${quote(databasePath)}


`;

    }










    // MULTIPLE FASTA


    if(multipleFiles){



        if(platform === "linux"){


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






        else if(platform === "windows"){


command +=

`for %f in (*.fasta) do (
    ${blastType} ^
    -query "%f" ^
    -db ${quote(databasePath)} ^
    -out "%~nf_blast.${outputType}" ^
    -outfmt "6 ${fields.join(" ")}" ^
    -word_size ${wordSize} ^
    -perc_identity ${identity} ^
    -evalue ${evalue} ^
    -num_threads ${threads}
)`;


        }







        else {


command +=

`Get-ChildItem *.fasta | ForEach-Object {

${blastType} `
-query $_.FullName `
-db ${quote(databasePath)} `
-out "$($_.BaseName)_blast.${outputType}" `
-outfmt "6 ${fields.join(" ")}" `
-word_size ${wordSize} `
-perc_identity ${identity} `
-evalue ${evalue} `
-num_threads ${threads}

}`;


        }



    }









    // SINGLE FASTA


    else {



        command +=

`${blastType} ${continuation}
-query ${quote(queryPath)} ${continuation}
-db ${quote(databasePath)} ${continuation}
-out "${outputName}.${outputType}" ${continuation}
-outfmt "6 ${fields.join(" ")}" ${continuation}
-word_size ${wordSize} ${continuation}
-perc_identity ${identity} ${continuation}
-evalue ${evalue} ${continuation}
-num_threads ${threads}`;



    }








    document
    .getElementById("result")
    .value = command;



}
