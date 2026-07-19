let multiple=false;

let databaseMade=true;



function clean(path){

    return path
    .trim()
    .replace(/^"+|"+$/g,"");

}



function quote(path){

    return `"${clean(path)}"`;

}



function dbName(path){

    path=clean(path);

    path=path.replace(/\.fasta$/i,"");

    return path;

}





document.addEventListener(
"DOMContentLoaded",
()=>{


document
.getElementById("helpButton")
.onclick=function(){


let box=
document.getElementById("helpContent");


if(box.style.display==="none"){


box.style.display="block";


this.innerHTML=
"Collapse Instructions";


}

else{


box.style.display="none";


this.innerHTML=
"How to Run BLAST";


}


};






document
.getElementById("singleButton")
.onclick=function(){

multiple=false;

document
.getElementById("fileMode")
.innerHTML=
"Single FASTA mode";

};







document
.getElementById("multipleButton")
.onclick=function(){

multiple=true;

document
.getElementById("fileMode")
.innerHTML=
"Multiple FASTA mode";

};






document
.getElementById("existingDB")
.onclick=function(){

databaseMade=true;

document
.getElementById("dbMessage")
.innerHTML=
"Existing database selected";

};







document
.getElementById("createDB")
.onclick=function(){

databaseMade=false;

document
.getElementById("dbMessage")
.innerHTML=
"Database will be created";

};







document
.getElementById("generateButton")
.onclick=
generate;


});








function generate(){



let blast=
document.getElementById("blastType").value;



let query=
clean(
document.getElementById("queryPath").value
);



let database=
dbName(
document.getElementById("dbPath").value
);



let evalue=
document.getElementById("evalue").value;



let word=
document.getElementById("wordsize").value;



let identity=
document.getElementById("identity").value;



let threads=
document.getElementById("threads").value;



let output=
document.getElementById("outputName").value;



let ext=
document.getElementById("outputType").value;






let fields=[];


document
.querySelectorAll(
".checkbox-grid input:checked"
)
.forEach(x=>
fields.push(x.value)
);






let command="";





if(!databaseMade){


command+=

`makeblastdb \\
-in ${quote(database+".fasta")} \\
-dbtype nucl \\
-out ${quote(database)}

\n\n`;

}





if(multiple){


command+=

`for file in *.fasta; do
    ${blast} \\
    -query "$file" \\
    -db ${quote(database)} \\
    -out "\${file%.fasta}_blast.${ext}" \\
    -outfmt "6 ${fields.join(" ")}" \\
    -word_size ${word} \\
    -perc_identity ${identity} \\
    -evalue ${evalue} \\
    -num_threads ${threads}
done`;



}

else{


command+=

`${blast} \\
-query ${quote(query)} \\
-db ${quote(database)} \\
-out "${output}.${ext}" \\
-outfmt "6 ${fields.join(" ")}" \\
-word_size ${word} \\
-perc_identity ${identity} \\
-evalue ${evalue} \\
-num_threads ${threads}`;

}



document
.getElementById("result")
.value=
command;


}
