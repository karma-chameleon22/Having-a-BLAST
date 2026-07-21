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



    // ABOUT COLLAPSE

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






    // FASTA MODE


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









    // DATABASE MODE


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



    // WINDOWS PATH --> WSL PATH

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






    // WSL PATH --> WINDOWS PATH


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









function continuation(platform){


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



    const line =
    continuation(platform);




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









    // DATABASE CREATION


    if(createDatabase){



        command +=

`makeblastdb ${line}
-in ${quote(databaseFasta)} ${line}
-dbtype nucl ${line}
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

`${blastType} ${line}
-query ${quote(queryPath)} ${line}
-db ${quote(databasePath)} ${line}
-out "${outputName}.${outputType}" ${line}
-outfmt "6 ${fields.join(" ")}" ${line}
-word_size ${wordSize} ${line}
-perc_identity ${identity} ${line}
-evalue ${evalue} ${line}
-num_threads ${threads}`;



    }








    document
    .getElementById("result")
    .value = command;



}
