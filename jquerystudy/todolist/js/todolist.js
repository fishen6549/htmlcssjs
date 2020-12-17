$(function(){
    let local = getData()
    load();
    $('#title').on('keydown',function(e){
        if(e.keyCode === 13){
            if($(this).val() === ""){
                alert('请输入待办事项')
            } else {
                local.push({title:$('#title').val(),done:false})
                saveData(local)
                load()
                $(this).val('')
            }            
        }
    })

    $('#todolist,#donelist').on('click','a',function(e){
        let i = $(this).attr('data-id')
        console.log('当前点击index',i,e);
        local.splice(i,1)
        saveData(local)
        load() 
        
    })
    //错了
    // $('#todolist input').change(function(){
    //     // console.log($(this));
    //    let i = $(this).siblings('a').attr('data-id')
    //    console.log(i);
    //    local[i].done = true
    //    saveData(local)
    //    load()
    // })

    $('ol,ul').on('click','input',function(){
        //console.log($(this));
        let i = $(this).siblings('a').attr('data-id')
        local[i].done = this.checked
        saveData(local)
        load()
    })

    function getData(){
        let temp = localStorage.getItem('todolist');
        if(temp !== null){
            return JSON.parse(temp)
        } else {
            return []
        }
    }

    function saveData(obj){
        // let title = $('#title').val()
        localStorage.setItem('todolist',JSON.stringify(obj))
        //local = getData()
    }

    function load(){
        let todoCount=0,doneCount=0
        local = getData()
        console.log('load');
        $('#todolist,#donelist').empty()
        $.each(local,function(i,item) {
            let li = `<li><input type="checkbox" ${item.done ? 'checked':''}><p>${item.title}</p><a href="#" data-id="${i}"></a></li>`
            if(item.done){
                //已完成
                $('#donelist').prepend($(li))
                doneCount++;
            }else{
                //未完成
                $('#todolist').prepend($(li))
                todoCount++;
            }
        });

        $('#todocount').text(todoCount)
        $('#donecount').text(doneCount)
    }

    
})