function level1Select(){
    var obj = document.getElementById("l1-select");
    var l1Val = obj.options[obj.selectedIndex].value;
    
    for (var i = 1; i < 4; i++){
        var idx = "l1" + i
        var ele = document.getElementById(idx)
        if (i == l1Val){
            ele.style.display = "block"
        }
        else{
            ele.style.display = "none"
        }
    }
}

function level2Select(){
    
}

function importExcelFile(obj){
    let df;
    if (!obj.files) {alert("请上传文件"); return;}
    var f = obj.files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        df = XLSX.read(data, {type: "binary"});
        var jsonDf = JSON.stringify(XLSX.utils.sheet_to_json(df.Sheets[df.SheetNames[0]]))
        console.log(jsonDf);
    }
    reader.readAsBinaryString(f);
};