var chart;
window.onbeforeunload = clsSessionInfo()

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

function sibConditionChanged(exp){
    var allSiblings = $(exp).siblings()
    console.log(allSiblings);
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
    var exp = sessionStorage.getItem("exp")
    var xScaleMode = JSON.parse(sessionStorage.getItem("x-cfg"))["axis-zoom"]
    var yScaleMode = JSON.parse(sessionStorage.getItem("y-cfg"))["axis-zoom"]

    if (sessionStorage.getItem("grade") == 2){
        range = JSON.parse(sessionStorage.getItem("df"))['x']
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

        return res
    }
}

function sheet2Data(){
    var df = JSON.parse(sessionStorage.getItem("df"))
    var labels = JSON.parse(sessionStorage.getItem("labels"))["key"]
    var styles = JSON.parse(sessionStorage.getItem("styles"))["key"]
    var xScaleMode = JSON.parse(sessionStorage.getItem("x-cfg"))["axis-zoom"]
    var yScaleMode = JSON.parse(sessionStorage.getItem("y-cfg"))["axis-zoom"]
    var res = {}

    if (sessionStorage.getItem("grade") == 2){
        if (!(styles[0] == "value" && styles[1] == "value")){
            var a1 = []
            var a2 = []
            $.each(df, function(idx, item){
                a1.push(item[labels[0]])
                a2.push(item[labels[1]])
            })
            if (styles[0] == "value"){a1 = dataScale(a1, xScaleMode, "x")}
            else if (styles[1] == "value"){a2 = dataScale(a2, yScaleMode, "y")}
            res = {"x": a1, "y": a2, "all":[]}
        }
        else{
            var ans = [], xRes = [], yRes = []
            $.each(df, function(idx, item){
                xRes.push(item[labels[0]])
                yRes.push(item[labels[1]])
            })
            xRes = dataScale(xRes, xScaleMode, "x")
            yRes = dataScale(yRes, yScaleMode, "y")
            for (var i = 0; i < xRes.length; i++){
                ans.push([xRes[i], yRes[i]])
            }

            res = {"x":[], "y":[], "all": ans}
        }
        return res
    }
}

function dataScale(data, mode, tag){
    var minVal = Math.min.apply(Math, data)
    var maxVal = Math.max.apply(Math, data)
    var minMaxRange = {"min": minVal * 0.8, "max": maxVal * 1.2}
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
    var grade = 1
    if (expression.indexOf("x") > -1){
        grade += 1
    }
    else if (expression.indexOf("y") > -1){
        grade += 1
    }

    if (grade < 2){alert("请至少填入x y里的前一项"); return;}

    sessionStorage.setItem("mode", "exp")
    sessionStorage.setItem("exp", expression)
    sessionStorage.setItem("grade", grade)

    $("#l11-l21").css("display", "block");
    var symbol = ["x", "y", "z"];
    $.each(symbol, function(s_idx, s){
        if (s_idx < grade){
            $("#l3-text-" + s).css("display", "incline")
        }
        else{
            $("#l3-text-" + s).css("display", "none")
        }
    })
    $("#l3-text-z").css("display", "none")
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
    var mode = sessionStorage.getItem("mode")
    if (mode == "exp"){
        var df = {}
        var symbol = ["x", "y", "z"];
        var grade = sessionStorage.getItem("grade")
        for (var i = 0; i < grade; i++){
            df[symbol[i]] = $("#l3-text-" + symbol[i]).val()
        }
        sessionStorage.setItem("df", JSON.stringify(df))
    }
    else{
        var symbol = ["x", "y", "z"]
        var _mem = []
        var labels = []
        var df = JSON.parse(sessionStorage.getItem("df"))

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
    var symbol = ["x", "y", "z"]
    var symbol = symbol.slice(0, sessionStorage.getItem("grade"))

    $.each(symbol, function(s_idx, s){
        $("#l4-var-select").append("<option value='" + Number(s_idx) + "'>"+ s + "</option>")
    })
}

function optSave(mode){
    if (mode == "l4"){
        var symbol = ["x", "y", "z"]
        var selected = $("#l4-var-select  option:selected").val()
        var varCfg = {}
        var fig = sessionStorage.getItem("fig")
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
        var fig = sessionStorage.getItem("fig")
        if (fig == "line"){  
            line_id = ["line-width", "line-cat", "line-color", "line-smooth", "line-symbol"]
            varCfg[line_id[0]] = $("#" + line_id[0]).val()
            varCfg[line_id[1]] = $("#" + line_id[1] + " option:selected").val()
            varCfg[line_id[2]] = $("#" + line_id[2]).val()
            varCfg[line_id[3]] = $("#" + line_id[3] + " option:selected").val()
            varCfg[line_id[4]] = $("#" + line_id[4] + " option:selected").val()
        }

        var varCfg = JSON.stringify(varCfg)
        sessionStorage.setItem("pub-cfg", varCfg)
        alert("公有配置已保存")
    }
    
}

function level4ToLevel5(){
    var symbol = ["x", "y", "z"]
    for (var i = 0; i < Number(essionStorage.getItem("grade")); i++){
        if (sessionStorage.getItem(symbol[i] + "-cfg") == null){
            alert(symbol[i] + "并未设置, 请重试")
            return
        }
    }

    $("#l11-x-x-x").css("display", "block")
}

function mergeOption(){
    var fig = sessionStorage.getItem("fig")
    var grade = sessionStorage.getItem("grade")
    var pubCfg = JSON.parse(sessionStorage.getItem("pub-cfg"))

    if (fig == "line"){

        var xCfg = JSON.parse(sessionStorage.getItem("x-cfg"))
        var yCfg = JSON.parse(sessionStorage.getItem("y-cfg"))

        if (sessionStorage.getItem("mode") == "file"){
            if (grade == 3){
                var option = {
                    grid3D: {},
                }
            }
            else{
                var res = sheet2Data()
                var styles = JSON.parse(sessionStorage.getItem("styles"))["key"]
                var labels = JSON.parse(sessionStorage.getItem("labels"))["key"]
                var flag;
                if (styles[0] == "value" && styles[1] == "value") {flag = "all"}
                else if (styles[0] == "value" && styles[1] != "value") {flag = "x"}
                else {flag = "y"}

                var option = {
                    tooltip:{
                        show: true,
                        trigger: 'axis',
                        formatter: '{b0}: {c0}<br />{x}: {y}'
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
                        min: (styles[0] == "value") ? JSON.parse(sessionStorage.getItem("x-range"))["min"] : undefined,
                        max: (styles[0] == "value") ? JSON.parse(sessionStorage.getItem("x-range"))["max"] : undefined,
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
                        min: (styles[1] == "value") ? JSON.parse(sessionStorage.getItem("y-range"))["min"] : undefined,
                        max: (styles[1] == "value") ? JSON.parse(sessionStorage.getItem("y-range"))["max"] : undefined,
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
                            data: res[flag], 
                            smooth: (pubCfg["line-smooth"] == "1") ? true: false,
                            center: ['50%', '50%'],
                            showSymbol: (pubCfg["line-symbol"] == "1") ? true: false,
                            lineStyle: {
                                normal:{
                                    width: pubCfg["line-width"],
                                    type: pubCfg["line-cat"],
                                    color: pubCfg["line-color"]
                                }
                            }
                        }
                    ],
                    
                }
                console.log(option);
            }
        }
        else{
            if (grade == 3){
                var option = {

                }
            }
            else{
                var res = range2ContiData()

                var option = {
                    tooltip:{
                        show:true,
                        trigger: 'axis',
                        formatter: '{b0}: {c0}<br />{b1}: {c1}'
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
                        min: JSON.parse(sessionStorage.getItem("x-range"))["min"],
                        max: JSON.parse(sessionStorage.getItem("x-range"))["max"],
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
                        min: JSON.parse(sessionStorage.getItem("y-range"))["min"],
                        max: JSON.parse(sessionStorage.getItem("y-range"))["max"],
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
                            data: res,
                            smooth: (pubCfg["line-smoooth"] == "1") ? true: false,
                            center: ['50%', '50%'],
                            showSymbol: (pubCfg["line-symbol"] == "1") ? true: false,
                            lineStyle: {
                                normal: {
                                    width: pubCfg["line-width"],
                                    type: pubCfg["line-cat"],
                                    color: pubCfg["line-color"]
                                }
                            }
                        }
                    ]
                }
            }
        }
    }

    // ---------------------

    return option
}

function canvasResultPlot(){
    if (chart != null && chart != "" && chart != undefined) {
        chart.dispose();
    }

    var fig = sessionStorage.getItem("fig")
    if (sessionStorage.getItem(fig + "-cfg") == null){
        alert("LEVEL 5未保存, 请重试")
        return
    }

    option = mergeOption()
    chart = echarts.init(document.getElementById("result"))
    chart.setOption(option)

    window.addEventListener("resize", function () {
        chart.resize();
    });
}




