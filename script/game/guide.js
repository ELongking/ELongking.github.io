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