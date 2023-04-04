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
        range = JSON.parse(getParams("df"))['x']
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
        res = {"x": xRes, "y":yRes, "z": zRes, "all": ans}
    }
    sessionStorage.setItem("res", res)
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
    var grade = 1
    if (expression.indexOf("x") > -1){
        grade += 1
    }
    if (expression.indexOf("y") > -1){
        grade += 1
    }

    if (grade < 2){alert("请至少填入x y里的前一项"); return;}

    sessionStorage.setItem("mode", "exp")
    sessionStorage.setItem("exp", expression)
    sessionStorage.setItem("grade", grade)

    $("#l11-l21").css("display", "block");
    var symbol = ["x", "y", "z"];
    $.each(symbol, function(s_idx, s){
        if (s_idx < grade - 1){
            $("#l3-text-" + s).css("display", "incline")
        }
        else{
            $("#l3-text-" + s).css("display", "none")
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

        $("#l11-l22").css("display", "block")
        level3SelectAppend(jsonDf);
    }
    
    reader.readAsBinaryString(f);
};

function level3ToLevel4(){
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
                return
            }
        })

        if (_mem.length == 0) {alert("无有效变量, 请检查"); return;} 
        sessionStorage.setItem("grade", _mem.length)
        sessionStorage.setItem("labels", JSON.stringify({"key": labels}))
        checkNumeric(df, labels)
    }
    
    $("#l11-x-x").css("display", "block")
    level4SetIndexCfg()
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
        var fig = getParams("fig")

        if (fig == "line"){
            axis_id = ["axis-name", "axis-zoom"]
            varCfg[axis_id[0]] = $("#" + axis_id[0]).val()
            varCfg[axis_id[1]] = $("#" + axis_id[1] + " option:selected").val()

        var varCfg = JSON.stringify(varCfg)
        sessionStorage.setItem(symbol[Number(selected)] + "-cfg", varCfg)
        alert("第" + (Number(selected) + 1).toString() + "个配置已保存")
        }
    }

    else{
        var varCfg = {}
        var fig = getParams("fig")
        if (fig == "line"){
            
            var lineNsurface = getParams("line-sub")

            if (lineNsurface == "line"){
                $("#line-surface").css("display", "none")
                line_id = ["line-width", "line-cat", "line-color", "line-smooth", "line-symbol"]
                varCfg[line_id[0]] = $("#" + line_id[0]).val()
                varCfg[line_id[1]] = $("#" + line_id[1] + " option:selected").val()
                varCfg[line_id[2]] = $("#" + line_id[2]).val()
                varCfg[line_id[3]] = $("#" + line_id[3] + " option:selected").val()
                varCfg[line_id[4]] = $("#" + line_id[4] + " option:selected").val()
            }
            else if (lineNsurface == "surface"){
                surface_id = ["surface-shade", "surface-color"]
                varCfg[surface_id[0]] = $("#" + surface_id[0] + " option:selected").val()
                varCfg[surface_id[1]] = $("#" + surface_id[1]).val()
            }
            else{
                alert("请选择线还是面")
                return
            }
        }

        var varCfg = JSON.stringify(varCfg)
        sessionStorage.setItem("pub-cfg", varCfg)
        alert("公有配置已保存")
    }
    
}

function level4ToLevel5(){
    var symbol = ["x", "y", "z"]
    for (var i = 0; i < Number(getParams("grade")); i++){
        if (getParams(symbol[i] + "-cfg") == null){
            alert(symbol[i] + "并未设置, 请重试")
            return
        }
    }
    $("#l11-x-x-x").css("display", "block")
}

// -------------------
// -------------------

function mergeOption(){
    var fig = getParams("fig")
    var grade = getParams("grade")
    var lineSub = getParams("line-sub")
    var pubCfg = JSON.parse(getParams("pub-cfg"))
    var styles = JSON.parse(getParams("styles"))["key"]
    var res = JSON.parse(getParams("res"))

    if (fig == "line"){

        var xCfg = JSON.parse(getParams("x-cfg"))
        var yCfg = JSON.parse(getParams("y-cfg"))

        if (getParams("mode") == "file"){
            if (grade == 3){

                var zCfg = JSON.parse(getParams("z-cfg"))

                var option = {
                    tooltip:{
                        show: true,
                        trigger: 'axis',
                        formatter: '{b0}: {c0}: {d0}<br />x, y, z'
                    },
                    grid3D: {
                        show: true,
                        axisLine: {
                            show: true,
                        },
                    },
                    xAxis3D: {
                        type: styles[0],
                        data: res["x"],
                        name: xCfg["axis-name"],
                        min: (styles[0] == "value") ? JSON.parse(getParams("x-range"))["min"] : undefined,
                        max: (styles[0] == "value") ? JSON.parse(getParams("x-range"))["max"] : undefined,
                        axisLine: {
                            symbol: ["none", "arrow"],
                            lineStyle:{
                                type: "dashed"
                            }
                        }
                    },
                    yAxis3D: {
                        type: styles[1],
                        data: res["y"],
                        name: yCfg["axis-name"],
                        min: (styles[1] == "value") ? JSON.parse(getParams("y-range"))["min"] : undefined,
                        max: (styles[1] == "value") ? JSON.parse(getParams("y-range"))["max"] : undefined,
                        axisLine: {
                            symbol: ["none", "arrow"],
                            lineStyle:{
                                type: "dashed"
                            }
                        }
                    },
                    zAxis3D: {
                        type: styles[2],
                        data: res["z"],
                        name: zCfg["axis-name"],
                        min: (styles[2] == "value") ? JSON.parse(getParams("z-range"))["min"] : undefined,
                        max: (styles[2] == "value") ? JSON.parse(getParams("z-range"))["max"] : undefined,
                        axisLine: {
                            symbol: ["none", "arrow"],
                            lineStyle:{
                                type: "dashed"
                            }
                        }
                    },
                    series: [
                        {
                        type: "line3D",
                        data: res["all"],
                        lineStyle: {
                            width: pubCfg["line-width"],
                            color: pubCfg["line-color"]
                        }
                    }
                ]
            }
        }
            else{
                var styles = JSON.parse(getParams("styles"))["key"]

                var option = {
                    tooltip:{
                        show: true,
                        trigger: 'axis',
                        formatter: '{b0}: {c0}<br />x, y'
                    },
                    dataZoom:[
                        {
                            type: 'inside',
                            orient: 'vertical',
                        },{
                            type: 'inside', 
                        }
                    ],
                    xAxis: {
                        type: styles[0], 
                        data: res["x"],
                        name: xCfg["axis-name"],
                        min: (styles[0] == "value") ? JSON.parse(getParams("x-range"))["min"] : undefined,
                        max: (styles[0] == "value") ? JSON.parse(getParams("x-range"))["max"] : undefined,
                        axisLine: {
                            symbol: ["none", "arrow"],
                            lineStyle:{
                                type: "dashed"
                            }
                        }
                    },
                    yAxis: {
                        type: styles[1], 
                        data: res["y"],
                        name: yCfg["axis-name"],
                        min: (styles[1] == "value") ? JSON.parse(getParams("y-range"))["min"] : undefined,
                        max: (styles[1] == "value") ? JSON.parse(getParams("y-range"))["max"] : undefined,
                        axisLine: {
                            symbol: ["none", "arrow"],
                            lineStyle:{
                                type: "dashed"
                            }
                        }
                    },
                    series: [
                        {
                            type: "line", 
                            data: res["all"], 
                            smooth: (pubCfg["line-smooth"] == "1") ? true: false,
                            center: ['50%', '50%'],
                            showSymbol: (pubCfg["line-symbol"] == "1") ? true: false,
                            lineStyle: {
                                width: pubCfg["line-width"],
                                type: pubCfg["line-cat"],
                                color: pubCfg["line-color"]
                            }
                        }
                    ],
                    
                }
            }
        }
        else{
            // exp
            if (grade == 3){
                var option = {
                    grid3D: {
                        show: true,
                        axisLine: {
                            show: true,
                        },
                    },
                    xAxis3D: {
                        type: "value",
                        name: xCfg["axis-name"],
                        axisLine: {
                            symbol: ["none", "arrow"],
                            lineStyle:{
                                type: "dashed"
                            }
                        }
                    },
                    yAxis3D: {
                        type: "value",
                        name: yCfg["axis-name"],
                        axisLine: {
                            symbol: ["none", "arrow"],
                            lineStyle:{
                                type: "dashed"
                            }
                        }
                    },
                    zAxis3D: {
                        type: "value",
                        name: yCfg["axis-name"],
                        axisLine: {
                            symbol: ["none", "arrow"],
                            lineStyle:{
                                type: "dashed"
                            }
                        }
                    },
                    series:{
                        type: "surface",
                        data: res['key'],
                        itemStyle:{
                            color: lineSub["surface-color"]
                        }
                    },
                    shading: lineSub["surface-shade"]
                }
            }
            else{
                var option = {
                    tooltip:{
                        show:true,
                        trigger: 'axis',
                        formatter: '{b0}: {c0}<br />x: y'
                    },
                    dataZoom:[
                        {
                            type: 'inside',
                            orient: 'vertical',
                        },{
                            type: 'inside', 
                        }
                    ],
                    xAxis: {
                        type: "value",
                        name: xCfg["axis-name"],
                        min: JSON.parse(getParams("x-range"))["min"],
                        max: JSON.parse(getParams("x-range"))["max"],
                        axisLine: {
                            symbol: ["none", "arrow"],
                            lineStyle:{
                                type: "dashed"
                            }
                        }
                    },
                    yAxis: {
                        type: "value",
                        name: yCfg["axis-name"],
                        min: JSON.parse(getParams("y-range"))["min"],
                        max: JSON.parse(getParams("y-range"))["max"],
                        axisLine: {
                            symbol: ["none", "arrow"],
                            lineStyle:{
                                type: "dashed"
                            }
                        }
                    },
                    series: [
                        {
                            type: "line", 
                            data: res["key"],
                            smooth: (pubCfg["line-smoooth"] == "1") ? true: false,
                            center: ['50%', '50%'],
                            showSymbol: (pubCfg["line-symbol"] == "1") ? true: false,
                            lineStyle: {
                                width: pubCfg["line-width"],
                                type: pubCfg["line-cat"],
                                color: pubCfg["line-color"]
                            }
                        }
                    ]
                }
            }
        }
    }

    // ---------------------

    console.log(option);
    return option
}


// -------------------
// -------------------

function canvasResultPlot(){
    if (chart != null && chart != "" && chart != undefined) {
        chart.dispose();
    }

    if (getParams("pub-cfg") == null){
        alert("公有配置未保存, 请重试")
        return
    }

    try{range2ContiData()}catch{}
    try{sheet2Data()}catch{}

    option = mergeOption()
    chart = echarts.init(document.getElementById("result"))
    chart.setOption(option)

    window.addEventListener("resize", function () {
        chart.resize();
    });
}




