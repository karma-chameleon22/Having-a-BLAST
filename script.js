
let multiple=false;
let databaseMade=true;


function setMultiple(value){

multiple=value;

if(value){

document.getElementById("fileMode").innerHTML =
"Multiple FASTA mode selected";

}

else{

document.getElementById("fileMode").innerHTML =
"Single FASTA mode selected";

}

}



function setDB(value){

databaseMade=value;


if(value){

document.getElementById("dbMessage").innerHTML =
"Using existing BLAST database";

}

else{

document.getElementById("dbMessage").innerHTML =
"makeblastdb command will be generated";

}

}



function generate(){


let blast=
document.getElementById("blastType").value;


let query=
document.getElementById("queryPath").value;


let db=
document.getElementById("dbPath").value;


let evalue=
document.getElementById("evalue").value;


let word=
document.getElementById("wordsize").value;


let identity=
document.getElementById("identity").value;


let threads=
document.getElementById("threads").value;


let output=
document.getElementById("output").value;



let command="";



if(!databaseMade){

command +=
`makeblastdb \\
-in ${db}.fasta \\
-dbtype nucl \\
-out ${db}

\n\n`;

}



if(multiple){


command +=
`FOR each FASTA file:

${blast} \\
-query FILE.fasta \\
-db ${db} \\
-out ${output} \\
-outfmt 6 \\
-evalue ${evalue} \\
-word_size ${word} \\
-perc_identity ${identity} \\
-num_threads ${threads}`;


}

else{


command +=
`${blast} \\
-query ${query} \\
-db ${db} \\
-out ${output} \\
-outfmt 6 \\
-evalue ${evalue} \\
-word_size ${word} \\
-perc_identity ${identity} \\
-num_threads ${threads}`;

}


document.getElementById("result").value=command;


}
