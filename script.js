let databaseMade = true;



document.addEventListener("DOMContentLoaded", function(){


let multiple = false;



document.getElementById("singleButton")
.onclick=function(){

multiple=false;

document.getElementById("fileMode").innerHTML =
"Single FASTA selected";

};



document.getElementById("multipleButton")
.onclick=function(){

multiple=true;

document.getElementById("fileMode").innerHTML =
"Multiple FASTA files selected";

};





document.getElementById("existingDB")
.onclick=function(){

databaseMade=true;

document.getElementById("dbMessage").innerHTML =
"Using existing BLAST database";

};





document.getElementById("createDB")
.onclick=function(){

databaseMade=false;

document.getElementById("dbMessage").innerHTML =
"makeblastdb command will be included";

};






document.getElementById("generateButton")
.onclick=function(){



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



let fields=[];



document
.querySelectorAll(".checkbox-grid input:checked")
.forEach(function(item){

fields.push(item.value);

});





let outfmt="6";

if(extension==="csv"){

outfmt="10";

}





let command="";




if(!databaseMade){


command +=

`makeblastdb \\
-in "${db}.fasta" \\
-dbtype nucl \\
-out "${db}"


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



};



});
