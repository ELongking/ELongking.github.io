function getParams(k){
    if (sessionStorage.getItem(k)){
        return sessionStorage.getItem(k)
    }
    else{
        return "{}"
    }
}

function mergeOption(){
    var fig = getParams("fig")
    var grade = getParams("grade")
    var lineSub = getParams("line-sub")
    if (lineSub == "line" && grade == 3) {lineSub = "line3D"}
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
                        type: lineSub,
                        data: res["all"],
                        lineStyle: {
                            width: pubCfg["line-width"],
                            color: pubCfg["line-color"]
                        },
                        itemStyle:{
                            color: pubCfg["surface-color"]
                        },
                        shading: pubCfg["surface-shade"]
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
                            type: lineSub, 
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
                        type: lineSub,
                        data: res['key'],
                        itemStyle:{
                            color: pubCfg["surface-color"]
                        }
                    },
                    shading: pubCfg["surface-shade"]
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
                            type: lineSub, 
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