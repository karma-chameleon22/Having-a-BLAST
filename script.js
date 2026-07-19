let multipleFiles = false;
let createDatabase = false;



function cleanPath(value){

    if(!value){
        return "";
    }


    return value
    .trim()
    .replace(/^"+|"+$/g,"");

}



function quote(value){

    return `"${cleanPath(value)}"`;

}






document.addEventListener("DOMContentLoaded", function(){



const helpButton =
document.getElementById("helpButton");


const helpContent =
document.getElementById("helpContent");



helpButton.addEventListener("click", function(){


if(helpContent.style.display === "none"){


helpContent.style.display="block";

helpButton.innerHTML=
"Collapse Instructions";


}

else{


helpContent.style.display="none";


helpButton.innerHTML=
"How to Run BLAST";


}


});








document
.getElementById("singleButton")
.addEventListener("click",function(){


multipleFiles=false;


document.getElementById("fileMode").innerHTML=
"Single FASTA selected";


});







document
.getElementById("multipleButton")
.addEventListener("click",function(){


multipleFiles=true;


document.getElementById("fileMode").innerHTML=
"Multiple FASTA selected";


});








document
.getElementById("existingDB")
.addEventListener("click",function(){


createDatabase=false;


document.getElementById("dbMessage").innerHTML=
"Using existing BLAST database";


});







document
.getElementById("createDB")
.addEventListener("click",function(){


createDatabase=true;


document.getElementById("dbMessage").innerHTML=
"Creating new BLAST database";


});







document
.getElementById("generateButton")
.addEventListener("click",generateBLAST);



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
document.getElementById("databasePath").value
);



let dbFasta =
cleanPath(
document.getElementById("databaseFastaPath").value
);



let fields=[];


document
.querySelectorAll(".checkbox-grid input:checked")
.forEach(function(box){

fields.push(box.value);

});




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


let ext =
document.getElementById("outputType").value;





let command="";





if(createDatabase){


command +=

`makeblastdb \\
-in ${quote(dbFasta)} \\
-dbtype nucl \\
-out ${quote(db)}


\n\n`;

}








if(multipleFiles){


command +=

`for file in *.fasta; do
    ${blast} \\
    -query "$file" \\
    -db ${quote(db)} \\
    -out "\${file%.fasta}_blast.${ext}" \\
    -outfmt "6 ${fields.join(" ")}" \\
    -word_size ${word} \\
    -perc_identity ${identity} \\
    -evalue ${evalue} \\
    -num_threads ${threads}
done`;



}

else{


command +=

`${blast} \\
-query ${quote(query)} \\
-db ${quote(db)} \\
-out "${output}.${ext}" \\
-outfmt "6 ${fields.join(" ")}" \\
-word_size ${word} \\
-perc_identity ${identity} \\
-evalue ${evalue} \\
-num_threads ${threads}`;


}





document.getElementById("result").value =
command;



}
