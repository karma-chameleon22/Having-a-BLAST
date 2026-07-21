let multipleFiles = false;
let createDatabase = false;



function cleanPath(path){

    if(!path) return "";

    return path
        .trim()
        .replace(/^"+|"+$/g,"");

}



function quote(path){

    return '"' + cleanPath(path) + '"';

}




function getPlatform(){

    let selected =
    document.querySelector(
        'input[name="platform"]:checked'
    );

    return selected ? selected.value : "linux";

}





function convertPath(path, platform){

    path = cleanPath(path);


    // Windows -> WSL

    if(platform === "linux"){

        if(/^[A-Za-z]:\\/.test(path)){

            let drive =
            path[0].toLowerCase();


            path =
            "/mnt/" +
            drive +
            "/" +
            path.substring(3)
            .replace(/\\/g,"/");

        }

    }



    // WSL -> Windows

    if(platform === "windows" ||
       platform === "powershell"){


        if(path.startsWith("/mnt/")){


            let drive =
            path[5].toUpperCase();


            path =
            drive +
            ":\\" +
            path.substring(7)
            .replace(/\//g,"\\");

        }

    }


    return path;

}







document.addEventListener("DOMContentLoaded",function(){


    console.log("BLAST generator loaded");



    // ABOUT BUTTON

    const aboutButton =
    document.getElementById("aboutButton");


    const aboutContent =
    document.getElementById("aboutContent");



    aboutButton.onclick=function(){


        if(aboutContent.style.display==="block"){


            aboutContent.style.display="none";

            aboutButton.innerHTML =
            "About BLAST";

        }

        else{


            aboutContent.style.display="block";

            aboutButton.innerHTML =
            "Collapse About BLAST";

        }

    };






    // FASTA MODE

    document
    .getElementById("singleButton")
    .onclick=function(){


        multipleFiles=false;

        document.getElementById("fileMode").innerHTML =
        "Single FASTA selected";


    };





    document
    .getElementById("multipleButton")
    .onclick=function(){


        multipleFiles=true;

        document.getElementById("fileMode").innerHTML =
        "Multiple FASTA selected";


    };








    // DATABASE

    document
    .getElementById("existingDB")
    .onclick=function(){


        createDatabase=false;

        document.getElementById("dbMessage").innerHTML =
        "Using existing BLAST database";


    };





    document
    .getElementById("createDB")
    .onclick=function(){


        createDatabase=true;

        document.getElementById("dbMessage").innerHTML =
        "Creating new BLAST database";


    };






    document
    .getElementById("generateButton")
    .onclick=generateBLAST;



});









function generateBLAST(){


    console.log("Generating BLAST");



    const platform =
    getPlatform();



    const blast =
    document.getElementById("blastType").value;



    const query =
    quote(
        convertPath(
        document.getElementById("queryPath").value,
        platform)
    );



    const database =
    quote(
        convertPath(
        document.getElementById("databasePath").value,
        platform)
    );



    const databaseFasta =
    quote(
        convertPath(
        document.getElementById("databaseFastaPath").value,
        platform)
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




    let fields=[];



    document
    .querySelectorAll(".checkbox-grid input:checked")
    .forEach(function(box){

        fields.push(box.value);

    });




    let command=[];






    // MAKEBLASTDB

    if(createDatabase){


        command.push(
        `makeblastdb \\`
        );


        command.push(
        `-in ${databaseFasta} \\`
        );


        command.push(
        `-dbtype nucl \\`
        );


        command.push(
        `-out ${database}`
        );


        command.push("");

    }







    // MULTIPLE FASTA LINUX / WSL

    if(multipleFiles &&
       platform==="linux"){


        command.push(
`for file in *.fasta; do`
        );


        command.push(
`    ${blast} \\`
        );


        command.push(
`    -query "$file" \\`
        );


        command.push(
`    -db ${database} \\`
        );


        command.push(
`    -out "\${file%.fasta}_blast.${extension}" \\`
        );


        command.push(
`    -outfmt "6 ${fields.join(" ")}" \\`
        );


        command.push(
`    -word_size ${word} \\`
        );


        command.push(
`    -perc_identity ${identity} \\`
        );


        command.push(
`    -evalue ${evalue} \\`
        );


        command.push(
`    -num_threads ${threads}`
        );


        command.push(
"done"
        );

    }






    // SINGLE FILE

    else{


        command.push(
        `${blast} \\`
        );


        command.push(
        `-query ${query} \\`
        );


        command.push(
        `-db ${database} \\`
        );


        command.push(
        `-out "${output}.${extension}" \\`
        );


        command.push(
        `-outfmt "6 ${fields.join(" ")}" \\`
        );


        command.push(
        `-word_size ${word} \\`
        );


        command.push(
        `-perc_identity ${identity} \\`
        );


        command.push(
        `-evalue ${evalue} \\`
        );


        command.push(
        `-num_threads ${threads}`
        );


    }





    document
    .getElementById("result")
    .value =
    command.join("\n");

}
