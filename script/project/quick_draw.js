function sibConditionChanged(exp){
    var allSiblings = $(exp).siblings()
    console.log(allSiblings);
}

// ------------------------------------

function level1Select(){
    sessionStorage.clear()
    var obj = document.getElementById("l1-select");
    var l1Val = obj.options[obj.selectedIndex].value;

    var val2fig = {1: "line", 2: "bar", 3: "scatter"}
    sessionStorage.setItem("fig", val2fig[l1Val])

    for (var i = 1; i < 2; i++){
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

function level2ExpClicked(){
    var expression = $("#l2-exp-text").val().toLowerCase()
    var grade = 0
    if (expression.indexOf("x")){
        grade += 1
    }
    else if (expression.indexOf("y")){
        grade += 1
    }
    else if (expression.indexOf("z")){
        grade += 1
    }
    sessionStorage.setItem("mode", "exp")
    sessionStorage.setItem("exp", expression)
    sessionStorage.setItem("grade", grade)

    $("#l11-l21").css("display", "block");
    var symbol = ["x", "y", "z"];
    $.each(symbol, function(s_idx, s){
        if (s_idx < _grade){
            $("#l3-text-" + s).css("display", "none")
        }
        else{
            $("#l3-text-" + s).css("display", "incline")
        }
    })

}

function level3SelectAppend(jsonDf){
    var symbol = ["x", "y", "z"];
    $.each(symbol,function(s_idx, s){
        $("#l3-select-" + s).empty()
    })

    var category = ["---" ,...Object.keys(jsonDf[0])];
    $.each(symbol, function(s_idx, s){
        $.each(category, function(c_idx, c){
            $("#l3-select-" + s).append("<option value='" + Number(c_idx - 1) + "'>"+ c + "</option>")
        })  
    })
}


function importExcelFile(obj){
    
    if (!obj.files) {alert("请上传文件"); return;}
    var f = obj.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        var data = e.target.result;
        var df = XLSX.read(data, {type: "binary"});
        var jsonDf = XLSX.utils.sheet_to_json(df.Sheets[df.SheetNames[0]])

        sessionStorage.setItem("mode", "file")
        sessionStorage.setItem("df", jsonDf)

        $("#l11-l22").css("display", "block")
        level3SelectAppend(jsonDf);
    }
    
    reader.readAsBinaryString(f);
};

function level3ToLevel4(){
    var mode = sessionStorage.getItem("mode")
    if (mode == "exp"){}
    else{
        var symbol = ["x", "y", "z"]
        var _mem = []
        $.each(symbol, function(s_idx, s){
            var ans = $("#l3-select-" + s).val()
            if (_mem.indexOf(ans) == -1 && ans != "-1"){
                _mem.push(ans)
            }
            else if (_mem.indexOf(ans) != -1){
                alert("不同的两个轴上存在相同的变量, 请更改")
                return
            }
        })
    }
    
    if (_mem.length == 0) {alert("无有效变量, 请检查"); return;} 
    sessionStorage.setItem("grade", _mem.length) = 
    $("#l11-x-x").css("display", "block")
    level4SetIndexCfg()
}

function level4SetIndexCfg(){
    var symbol = ["x", "y", "z"]
    var symbol = symbol.slice(0, sessionStorage.getItem("grade"))

    $.each(symbol, function(s_idx, s){
        $("#l4-var-select").append("<option value='" + Number(s_idx) + "'>"+ s + "</option>")
    })
}