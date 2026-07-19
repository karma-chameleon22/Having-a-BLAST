let multipleFiles=false;

let createDatabase=false;



function cleanPath(path){

return path
.trim()
.replace(/^"+|"+$/g,"");

}



function quote(path){

return `"${cleanPath(path)}"`;

}






document.addEventListener(
"DOMContentLoaded",
function(){



const helpButton=
document.getElementById("helpButton");


const helpContent=
document.getElementById("helpContent");



helpButton.onclick=function(){


if(helpContent.style.display==="none"){


helpContent.style.display="block";

helpButton.innerHTML=
"Collapse Instructions";


}

else{


helpContent.style.display="none";

helpButton.innerHTML=
"How to Run BLAST";


}


};








document.getElementById("singleButton").onclick=function(){

multipleFiles=false;

document.getElementById("fileMode").innerHTML=
"Single FASTA selected";

};






document.getElementById("multipleButton").onclick=function(){

multipleFiles=true;

document.getElementById("fileMode").innerHTML=
"Multiple FASTA selected";

};







document.getElementById("existingDB").onclick=function(){

createDatabase=false;

document.getElementById("dbMessage").innerHTML=
"Using existing database";

};







document.getElementById("createDB").onclick=function(){

createDatabase=true;

document.getElementById("dbMessage").innerHTML=
"Creating database";

};







document.getElementById("generateButton").onclick=
generateBLAST;



});









function generateBLAST(){


let blast=
document.getElementById("blastType").value;



let query=
cleanPath(
document.getElementById("queryPath").value
);



let db=
cleanPath(
document.getElementById("databasePath").value
);



let dbFasta=
cleanPath(
document.getElementById("databaseFastaPath").value
);




let fields=[];


document
.querySelectorAll(".checkbox-grid input:checked")
.forEach(function(x){

fields.push(x.value);

});



let command="";



if(createDatabase){


command+=

`makeblastdb \\
-in ${quote(dbFasta)} \\
-dbtype nucl \\
-out ${quote(db)}

\n\n`;

}







if(multipleFiles){


command+=

`for file in *.fasta; do
    ${blast} \\
    -query "$file" \\
    -db ${quote(db)} \\
    -out "\${file%.fasta}_blast.tsv" \\
    -outfmt "6 ${fields.join(" ")}" \\
    -word_size ${document.getElementById("wordsize").value} \\
    -perc_identity ${document.getElementById("identity").value} \\
    -evalue ${document.getElementById("evalue").value} \\
    -num_threads ${document.getElementById("threads").value}
done`;



}

else{


command+=

`${blast} \\
-query ${quote(query)} \\
-db ${quote(db)} \\
-out "${document.getElementById("outputName").value}.tsv" \\
-outfmt "6 ${fields.join(" ")}" \\
-word_size ${document.getElementById("wordsize").value} \\
-perc_identity ${document.getElementById("identity").value} \\
-evalue ${document.getElementById("evalue").value} \\
-num_threads ${document.getElementById("threads").value}`;


}



document.getElementById("result").value=
command;


}
