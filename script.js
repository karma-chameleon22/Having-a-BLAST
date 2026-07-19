let databaseMade = true;
let multiple = false;



function cleanPath(path){

    if(!path){
        return "";
    }


    return path
        .trim()
        .replace(/^"+|"+$/g,"");

}




function quote(path){

    return `"${cleanPath(path)}"`;

}






document.addEventListener("DOMContentLoaded", function(){



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






document.getElementById("generateButton").onclick=function(){

    generateBLAST();

};



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







// Create database if needed

if(databaseMade===false){


command +=

`makeblastdb \\
-in ${quote(db + ".fasta")} \\
-dbtype nucl \\
-out ${quote(db)}


\n\n`;

}









// MULTIPLE FASTA MODE

if(multiple){



command +=

`for file in *.fasta; do
    ${blast} \\
    -query "$file" \\
    -db ${quote(db)} \\
    -out "\${file%.fasta}_blast.${extension}" \\
    -outfmt "${outfmt} ${fields.join(" ")}" \\
    -word_size ${word} \\
    -perc_identity ${identity} \\
    -evalue ${evalue} \\
    -num_threads ${threads}
done`;



}







// SINGLE FASTA MODE

else{



command +=

`${blast} \\
-query ${quote(query)} \\
-db ${quote(db)} \\
-out "${output}.${extension}" \\
-outfmt "${outfmt} ${fields.join(" ")}" \\
-word_size ${word} \\
-perc_identity ${identity} \\
-evalue ${evalue} \\
-num_threads ${threads}`;



}






document.getElementById("result").value =
command;



}
