function _custom_sort(x1, x2){
    var c1 = x1.children[0].children[1].innerText.split("/")[0].split(" ")[2]
    var c2 = x2.children[0].children[1].innerText.split("/")[0].split(" ")[2]
    if (Number(c1) != Number(c2)){
        return Number(c1) > Number(c2) ? -1 : 1
    }
    else{
        return x1.children[0].children[0].innerText < x2.children[0].children[0].innerText ? -1 : 1
    }
}

function sortAllItems(mode){
    var _childs = document.querySelectorAll(".main > div")
    var newList = [].slice.apply(_childs).slice(0, -2)
    var _aux = [].slice.apply(_childs).slice(-2, )

    var Class1List = [], Class2List = []
    var flag = -1
    for (var i = 0; i < newList.length; i++){
        if (newList[i].children[0].getAttribute("id") == "class1"){
            flag = 1
        }
        else if (newList[i].children[0].getAttribute("id") == "class2"){
            flag = 2
        }

        if (flag == 1){
            Class1List.push(newList[i])
        }
        else if (flag == 2){
            Class2List.push(newList[i])
        }
    }

    for (var i = 0; i < _childs.length; i++){
        _childs[i].remove()
    }

    if (mode == "title"){
        Class1List.sort(function (x1, x2){return x1.children[0].children[0].innerText < x2.children[0].children[0].innerText ? -1 : 1})
        Class2List.sort(function (x1, x2){return x1.children[0].children[0].innerText < x2.children[0].children[0].innerText ? -1 : 1})
    }
    else if (mode == "score"){
        Class1List.sort(function (x1, x2){
            return _custom_sort(x1, x2)
        })
        Class2List.sort(function (x1, x2){
            return _custom_sort(x1, x2)
        })

    }

    var cons_1 = false, cons_2 = false
    for (var i = 0; i < Class1List.length; i++) {
        if (Class1List[i].children[0].getAttribute("id") == "class1") {Class1List[i].children[0].removeAttribute("id"); cons_1 = true}
        if (i == 0) {Class1List[i].children[0].setAttribute("id", "class1"); cons_2 = true}
        if (cons_1 && cons_2) {break}
    }
    var cons_1 = false, cons_2 = false
    for (var i = 0; i < Class2List.length; i++) {
        if (Class2List[i].children[0].getAttribute("id") == "class2") {Class2List[i].children[0].removeAttribute("id"); cons_1 = true}
        if (i == 0) {Class2List[i].children[0].setAttribute("id", "class2"); cons_2 = true}
        if (cons_1 && cons_2) {break}
    }

    var mainElement = document.getElementsByClassName("main")[0]
    for (var i1 = 0; i1 < Class1List.length; i1++) {mainElement.appendChild(Class1List[i1])}
    for (var i2 = 0; i2 < Class2List.length; i2++) {mainElement.appendChild(Class2List[i2])}
    for (var j = 0; j < _aux.length; j++) {mainElement.appendChild(_aux[j])}

    return true
    
}


function changeItemId(items){
    var maxItems = 12
    var pageNum = 1, cnt = 0, changed = false
    var page_mem = new Array()


    for (var i = 0; i < items.length; i++){
        items[i].id = "i" + i
        if (cnt == maxItems || items[i].childNodes[1].id == "class2"){
            pageNum += 1
            var _class2_page = pageNum
            cnt = 0
            changed = true
        }
        
        if (i != items.length - 1){
            items[i].className = "item page" + pageNum
            if (pageNum != 1) {items[i].className += " page-blocked"}
            if (changed) {
                items[i].setAttribute("style", "width: 100%; margin-top: 20px;")
                changed = false
            }
            page_mem.push(pageNum)
            cnt ++
        }
    }
    page_mem.push(_class2_page)
    return page_mem
}

function _edit_disabled_conditon(after_page, page_num){
    var _prev = document.getElementById("_prev")
    var _next = document.getElementById("_next")
    if (after_page == 1) {
        _prev.setAttribute("disabled", "disabled")
        _next.removeAttribute("disabled")
    }
    else if (after_page == page_num) {
        _next.setAttribute("disabled", "disabled")
        _prev.removeAttribute("disabled")
    }
    else{
        _prev.removeAttribute("disabled")
        _next.removeAttribute("disabled")
    }
}


function pageBtnClicked(items, pageMem, pageNum, mode){
    var flag = false
    var now_page = 0

    for (var i = 0; i < items.length; i++){
        if (items[i].className.indexOf("page-blocked") == -1){
            now_page = pageMem[i]
            break
        }
    }

    if (mode == "left"){
        if (now_page != 1){
            var after_page = now_page - 1
            flag = true
        }
    }
    else if (mode == "right"){
        if (now_page != pageNum){
            var after_page = now_page + 1
            flag = true
        }
    }

    if (flag){
        for (var i = 0; i < items.length - 1; i++){
            if (pageMem[i] == after_page){
                var classname = items[i].getAttribute("class")
                var now_classname = classname.replace(" page-blocked", "")
                items[i].className = now_classname
            }
            else if (pageMem[i] == now_page){
                items[i].className += " page-blocked"
            }
        }
        flag = false
    }

    _edit_disabled_conditon(after_page, pageNum)

    window.scrollTo(0, 0)
}


function toClass(items, pageMem, pageNum, mode){
    if (mode == 1){
        var after_page = 1
    }
    else if (mode == 2){
        var after_page = pageMem[pageMem.length - 1]
    }

    var now_page = 0

    for (var i = 0; i < items.length; i++){
        if (items[i].className.indexOf("page-blocked") == -1){
            now_page = pageMem[i]
            break
        }
    }

    if (now_page != after_page){
        for (var i = 0; i < items.length - 1; i++){
            if (pageMem[i] == after_page){
                var classname = items[i].getAttribute("class")
                var now_classname = classname.replace(" page-blocked", "")
                items[i].className = now_classname
            }
            else if (pageMem[i] == now_page){
                items[i].className += " page-blocked"
            }
        }

        _edit_disabled_conditon(after_page, pageNum)
        
    }
    window.location.hash = "#class" + mode
}