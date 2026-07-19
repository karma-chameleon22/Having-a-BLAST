let multiple=false;

let databaseMade=true;



function setMultiple(value){

multiple=value;


document.getElementById("fileMode").innerHTML =

value ?

"Multiple FASTA files selected"

:

"Single FASTA file selected";

}




function setDB(value){

databaseMade=value;


document.getElementById("dbMessage").innerHTML =

value ?

"Using existing BLAST database"

:

"makeblastdb will be included";

}






function generate(){


let blast=document.getElementById("blastType").value;

let query=document.getElementById("queryPath").value;

let db=document.getElementById("dbPath").value;

let evalue=document.getElementById("evalue").value;

let word=document.getElementById("wordsize").value;

let identity=document.getElementById("identity").value;

let threads=document.getElementById("threads").value;

let output=document.getElementById("outputName").value;

let extension=document.getElementById("outputType").value;



let fields=[];


document
.querySelectorAll(".checkbox-grid input:checked")
.forEach(x=>{

fields.push(x.value);

});



let outfmt="6";


if(extension==="csv"){

outfmt="10";

}




let command="";




if(!databaseMade){


command +=

`makeblastdb \\
-in ${db}.fasta \\
-dbtype nucl \\
-out ${db}


\n\n`;

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



document.getElementById("result").value=command;


}
