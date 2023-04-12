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

    var xCfg = JSON.parse(getParams("x-cfg"))
    var yCfg = JSON.parse(getParams("y-cfg"))
    var yCfg = JSON.parse(getParams("z-cfg"))

    if (fig == "line"){


        if (getParams("mode") == "file"){
            if (grade == 3){

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
                        name: zCfg["axis-name"],
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
                        show: true,
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

    else if (fig == "scatter"){
        if (grade == 3){
            var option = {
                grid3D: {
                    show: true,
                    axisLine: {
                        show: true,
                    },
                },
                xAxis3D: {
                    type: styles[0],
                    name: xCfg["axis-name"],
                    data: res["x"],
                    min: (styles[0] == "value") ? JSON.parse(getParams("y-range"))["min"] : undefined,
                    max: (styles[0] == "value") ? JSON.parse(getParams("y-range"))["max"] : undefined,
                    axisLine: {
                        symbol: ["none", "arrow"],
                        lineStyle:{
                            type: "dashed"
                        }
                    }
                },
                yAxis3D: {
                    type: styles[1],
                    name: yCfg["axis-name"],
                    data: res["y"],
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
                    name: zCfg["axis-name"],
                    data: res["z"],
                    min: (styles[2] == "value") ? JSON.parse(getParams("y-range"))["min"] : undefined,
                    max: (styles[2] == "value") ? JSON.parse(getParams("y-range"))["max"] : undefined,
                    axisLine: {
                        symbol: ["none", "arrow"],
                        lineStyle:{
                            type: "dashed"
                        }
                    }
                },
                series: [
                    {
                        type: "scatter3D", 
                        data: res["all"],
                        symbolSize: (pubCfg["point-size"] == "Scalable") ? function(value, params){params.symbolSize = size[params.dataIndex]; return params.symbolSize;} : pubCfg["point-size"],
                        center: ['50%', '50%'],
                        itemStyle: {
                            color: pubCfg["point-color"]
                        }
                    }
                ],
                blendMode: pubCfg["point-blend"],
            }
        }

        else{
            var option = {
                tooltip:{
                    show: true,
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
                    type: styles[0],
                    name: xCfg["axis-name"],
                    data: res["x"],
                    min: (styles[0] == "value") ? JSON.parse(getParams("y-range"))["min"] : undefined,
                    max: (styles[0] == "value") ? JSON.parse(getParams("y-range"))["max"] : undefined,
                    axisLine: {
                        symbol: ["none", "arrow"],
                        lineStyle:{
                            type: "dashed"
                        }
                    }
                },
                yAxis: {
                    type: styles[1],
                    name: yCfg["axis-name"],
                    data: res["y"],
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
                        type: "scatter", 
                        data: res["all"],
                        symbolSize: (typeof(pubCfg["point-size"]) == Number) ? pubCfg["point-size"] : function(value){value * 0.1},
                        center: ['50%', '50%'],
                        colorBy: pubCfg["point-dif"],
                        itemStyle: {
                            color: pubCfg["point-color"]
                        },
                    }
                ],
            }
        }
    }

    console.log(option);
    return option
}


// -------------------
// -------------------