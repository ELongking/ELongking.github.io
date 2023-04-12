var chart;
window.onbeforeunload = clsSessionInfo()

function getParams(k){
    if (sessionStorage.getItem(k)){
        return sessionStorage.getItem(k)
    }
    else{
        return "{}"
    }
}

function dim3sort(x, y){
    if (x[0] >= y[0]) {return 1}
    else if (x[0] < y[0]) {return -1}
    else if (x[1] >= y[1]) {return 1}
    else if (x[1] < y[1]) {return -1}
    else if (x[2] >= y[2]) {return 1}
    else if (x[2] < y[2]) {return -1}
    else {return 0}
}

function advancedExpression(expStr){
    var ori = ["sin", "cos", "tan", "e", "pi", "log"]
    var math = ["Math.sin", "Math.cos","Math.tan", "Math.E", "Math.PI", "Math.log"]
    for (var i =0 ; i < ori.length; i++){
        expStr = expStr.replace(new RegExp(ori[i], 'g'), math[i])
    }
    return expStr;
}


function clsSessionInfo(){
    sessionStorage.clear()
    $(".setting").each(function(){
        if ($(this).attr("class").indexOf("lev-1") == -1){
            $(this).css("display", "none")
        }
    })
    if (chart != null && chart != "" && chart != undefined) {
        chart.dispose();
    }
}


function checkNumeric(df, labels){
    var styles = []
    $.each(labels, function(l_idx, label){
        styles.push("value")
        $.each(df, function(d_idx, item){
            if (isNaN(Number(item[label]))){
                styles.splice(l_idx, 1, "category")
                
                return
            }
        })
    })
    sessionStorage.setItem("styles", JSON.stringify({"key": styles}))
}

function range2ContiData(){
    var exp = getParams("exp")
    var xScaleMode = JSON.parse(getParams("x-cfg"))["axis-zoom"]
    var yScaleMode = JSON.parse(getParams("y-cfg"))["axis-zoom"]
    var zScaleMode = JSON.parse(getParams("z-cfg"))["axis-zoom"]

    if (getParams("grade") == 2){
        var range = JSON.parse(getParams("df"))['x']
        var res = [], xRes = [], yRes = []

        try {
            [x, end, interval] = range.split(" ")
            var x = Number(x)
            var end = Number(end)
            var interval = Number(interval)

            while (x <= end){
                xRes.push(x)
                yRes.push(eval(exp))
                x += interval
            }
        } catch (error) {
            console.log(error);
            alert("第三步填入有误, 请检查")
            return
        }

        xRes = dataScale(xRes, xScaleMode, "x")
        yRes = dataScale(yRes, yScaleMode, "y")

        for (var i = 0; i < xRes.length; i++){
            res.push([xRes[i], yRes[i]])
        }
    }
    else if (getParams("grade") == 3){
        df = JSON.parse(getParams("df"))
        var xrange = df['x']
        var yrange = df['y']
        var res = [], xRes = [], yRes = [], zRes = []
        try {
            var xx = xrange.split(" ")
            var xstart = Number(xx[0])
            var xend = Number(xx[1])
            var xinterval = Number(xx[2])

            var yy = yrange.split(" ")
            var y = Number(yy[0])
            var yend = Number(yy[1])
            var yinterval = Number(yy[2])

            while (y <= yend){
                var x = xstart
                while (x <= xend){
                    xRes.push(x)
                    yRes.push(y)
                    zRes.push(eval(exp))
                    x += xinterval
                }
                y += yinterval
            }
        } catch (error) {
            console.log(error);
            alert("第三步填入有误, 请检查")
            return
        }

        xRes = dataScale(xRes, xScaleMode, "x")
        yRes = dataScale(yRes, yScaleMode, "y")
        zRes = dataScale(zRes, zScaleMode, "z")

        for (var i = 0; i < xRes.length; i++){
            res.push([xRes[i], yRes[i], zRes[i]])
        }
    }
    sessionStorage.setItem("res", JSON.stringify({"key": res})) 
}

function sheet2Data(){
    var df = JSON.parse(getParams("df"))
    var labels = JSON.parse(getParams("labels"))["key"]
    var styles = JSON.parse(getParams("styles"))["key"]
    var xScaleMode = JSON.parse(getParams("x-cfg"))["axis-zoom"]
    var yScaleMode = JSON.parse(getParams("y-cfg"))["axis-zoom"]
    var res = {}

    var xRes = [], yRes = [], ans = []
        $.each(df, function(idx, item){
            xRes.push(item[labels[0]])
            yRes.push(item[labels[1]])
        })
    if (styles[0] == "value"){xRes = dataScale(xRes, xScaleMode, "x")}
    else if (styles[1] == "value"){yRes = dataScale(yRes, yScaleMode, "y")}

    if (getParams("grade") == 2){
        resLst = [xRes, yRes]
        for (var i = 0; i < xRes.length; i++){
            var part = []
            for (var j = 0; j < resLst.length; j++){
                // if (styles[j] == "value") {part.push(resLst[j][i])}
                part.push(resLst[j][i])
            }
            ans.push(part)
        }
        res = {"x": xRes, "y": yRes, "all": ans}
    }

    else{
        var zScaleMode = JSON.parse(getParams("z-cfg"))["axis-zoom"]
        var zRes = []
        $.each(df, function(idx, item){
            zRes.push(item[labels[2]])
        })
        resLst = [xRes, yRes, zRes]
        if (styles[2] == "value"){zRes = dataScale(zRes, zScaleMode, "z")}
        for (var i = 0; i < xRes.length; i++){
            var part = []
            for (var j = 0; j < resLst.length; j++){
                // if (styles[j] == "value") {part.push(resLst[j][i])}
                part.push(resLst[j][i])
            }
            ans.push(part)
        }
        if (getParams("lineSub") == "surface") {ans.sort(dim3sort)}
        res = {"x": xRes, "y": yRes, "z": zRes, "all": ans}
    }

    sessionStorage.setItem("res", JSON.stringify(res))
}

function dataScale(data, mode, tag){
    var minVal = Math.min.apply(Math, data)
    var maxVal = Math.max.apply(Math, data)
    var minMaxRange = {"min": minVal - 1, "max": maxVal + 1}
    sessionStorage.setItem(tag + "-range", JSON.stringify(minMaxRange))

    if (mode == "ori"){return data}
    else if (mode == "log"){
        var res = []
        for (var n in data){
            res.push((n>0) ? Math.log(n): 0)
        }
        return res
    }
    else if (mode == "minmax"){
        var res = []
        for (var n in data){
            res.push((n- minVal) / (maxVal- minVal))
        }
        return res
    }
}

// ------------------------------------
// ------------------------------------


function level1Select(){
    sessionStorage.clear()
    var obj = document.getElementById("l1-select");
    var l1Val = obj.options[obj.selectedIndex].value;

    var val2fig = {1: "line", 2: "scatter", 3: "bar"}
    sessionStorage.setItem("fig", val2fig[l1Val])

    for (var i = 1; i < 3; i++){
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
    var grade = 1
    if (expression.indexOf("x") > -1){
        grade += 1
    }
    if (expression.indexOf("y") > -1){
        grade += 1
    }

    if (grade < 2){alert("请至少填入x y里的前一项"); return;}

    sessionStorage.setItem("mode", "exp")
    sessionStorage.setItem("exp", advancedExpression(expression))
    sessionStorage.setItem("grade", grade)

    $("#l11-l21").css("display", "block");
    var symbol = ["x", "y", "z"];
    $.each(symbol, function(s_idx, s){
        if (s_idx < grade - 1){
            $("#l3-group-" + s).css("display", "block")
        }
        else{
            $("#l3-group-" + s).css("display", "none")
        }
    })
    $("#l3-text-z").css("display", "none")
    if (grade == 3){$("#line-type option[value='line']").remove()}
    if (grade == 2){$("#line-type option[value='surface']").remove()}
    
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
        sessionStorage.setItem("df", JSON.stringify(jsonDf))
        $("#l22").css("display", "block")
        
        level3SelectAppend(jsonDf);
    }
    
    reader.readAsBinaryString(f);
};

function level3ToLevel4(){
    var flag = true
    var mode = getParams("mode")
    if (mode == "exp"){
        var df = {}
        var symbol = ["x", "y", "z"];
        var grade = getParams("grade")
        for (var i = 0; i < grade; i++){
            df[symbol[i]] = $("#l3-text-" + symbol[i]).val()
        }
        sessionStorage.setItem("df", JSON.stringify(df))
    }
    else{
        var symbol = ["x", "y", "z"]
        var _mem = []
        var labels = []
        var df = JSON.parse(getParams("df"))

        $.each(symbol, function(s_idx, s){
            var ans = $("#l3-select-" + s + " option:selected").val()
            var label = $("#l3-select-" + s + " option:selected").text()
            if (_mem.indexOf(ans) == -1 && ans != "-1"){
                _mem.push(ans)
                labels.push(label)
            }
            else if (_mem.indexOf(ans) != -1){
                alert("不同的两个轴上存在相同的变量, 请更改")
                flag = false
                return
            }
        })

        if (flag){
            if (_mem.length == 0) {alert("无有效变量, 请检查"); return;} 
            sessionStorage.setItem("grade", _mem.length)
            sessionStorage.setItem("labels", JSON.stringify({"key": labels}))
            checkNumeric(df, labels)
        }
        
    }
    
    if (flag){
        $("#l11-x-x").css("display", "block")
        level4SetIndexCfg()
    }
    
}

function level4SetIndexCfg(){
    $("#l4-var-select").empty()

    var symbol = ["x", "y", "z"]
    var symbol = symbol.slice(0, getParams("grade"))

    $.each(symbol, function(s_idx, s){
        $("#l4-var-select").append("<option value='" + Number(s_idx) + "'>"+ s + "</option>")
    })
}

function lineOrSurface(){
    var lineNsurface = $("#line-type option:selected").val()
    sessionStorage.setItem("line-sub", lineNsurface)

    if (lineNsurface == "line"){
        $("#line-line").css("display", "block")
        $("#line-surface").css("display", "none")
    }
    else if (lineNsurface == "surface"){
        $("#line-line").css("display", "none")
        $("#line-surface").css("display", "block")
    }
    else{
        $("#line-line").css("display", "none")
        $("#line-surface").css("display", "none")
    }
    
}

function optSave(mode){
    if (mode == "l4"){
        var symbol = ["x", "y", "z"]
        var selected = $("#l4-var-select  option:selected").val()
        var varCfg = {}
        
        axis_id = ["axis-name", "axis-zoom", "axis-theme"]
        varCfg[axis_id[0]] = $("#" + axis_id[0]).val()
        varCfg[axis_id[1]] = $("#" + axis_id[1] + " option:selected").val()
        sessionStorage.setItem("theme", $("#" + axis_id[2] + " option:selected").val())

        var varCfg = JSON.stringify(varCfg)
        sessionStorage.setItem(symbol[Number(selected)] + "-cfg", varCfg)
        alert("第" + (Number(selected) + 1).toString() + "个配置已保存")
    }

    else{
        var varCfg = {}
        var fig = getParams("fig")
        if (fig == "line"){
            
            var lineNsurface = getParams("line-sub")

            if (lineNsurface == "line"){
                var line_id = ["line-width", "line-cat", "line-color", "line-smooth", "line-symbol"]
                varCfg[line_id[0]] = $("#" + line_id[0]).val()
                varCfg[line_id[1]] = $("#" + line_id[1] + " option:selected").val()
                varCfg[line_id[2]] = $("#" + line_id[2]).val()
                varCfg[line_id[3]] = $("#" + line_id[3] + " option:selected").val()
                varCfg[line_id[4]] = $("#" + line_id[4] + " option:selected").val()
            }
            else if (lineNsurface == "surface"){
                var surface_id = ["surface-shade", "surface-color"]
                varCfg[surface_id[0]] = $("#" + surface_id[0] + " option:selected").val()
                varCfg[surface_id[1]] = $("#" + surface_id[1]).val()
            }
            else{
                alert("请选择线还是面")
                return
            }
        }

        else if (fig =="scatter"){
            var grade = getParams("grade")
            if (grade == 2){
                var scatter_id = ["point-size", "point-shape", "point-color", "point-dif"]
                var shape = $("#" + scatter_id[0]).val()
                if (typeof(shape) == String) {}  // Todo
                varCfg[scatter_id[1]] = $("#" + scatter_id[1] + " option:selected").val()
                varCfg[scatter_id[2]] = $("#" + scatter_id[2]).val()
                varCfg[scatter_id[3]] = $("#" + scatter_id[3] + " option:selected").val()
            }
            else{
                var scatter_id = ["point-blend", "point-color"]
                varCfg[scatter_id[0]] = $("#" + scatter_id[0] + " option:selected").val()
                varCfg[scatter_id[1]] = $("#" + scatter_id[1]).val()
            }
        }

        var varCfg = JSON.stringify(varCfg)
        sessionStorage.setItem("pub-cfg", varCfg)
        alert("公有配置已保存")
    }
    
}

function level4ToLevel5(){
    var symbol = ["x", "y", "z"]
    var fig = getParams("fig")
    var grade = getParams("grade")

    for (var i = 0; i < Number(getParams("grade")); i++){
        if (getParams(symbol[i] + "-cfg") == "{}"){
            alert(symbol[i] + "并未设置, 请重试")
            return
        }
    }
    if (fig == "line") {$("#l11-x-x-x").css("display", "block")}
    else if (fig == "scatter") {
        $("#l12-x-x-x").css("display", "block")
        if (grade == 3){
            $("#scatter-3D").css("display", "block")
        }
        else{
            $("#scatter-2D").css("display", "block")
        }
    }
        
}

// -------------------
// -------------------



function canvasResultPlot(){
    if (chart != null && chart != "" && chart != undefined) {
        chart.dispose();
    }

    if (getParams("pub-cfg") == "{}"){
        alert("公有配置未保存, 请重试")
        return
    }

    if (getParams("fig") == "line"){
        if (getParams("mode") == "exp") {range2ContiData()}
        else {sheet2Data()}
    }
    else if(getParams("fig") == "scatter") {sheet2Data()}

    option = mergeOption()
    chart = echarts.init(document.getElementById("result"), getParams("theme"))
    chart.setOption(option)

    window.addEventListener("resize", function () {
        chart.resize();
    });
}




