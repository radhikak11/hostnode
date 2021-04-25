
//List createion for each document
function eachItem_Prpare(each)
{
 return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
 <span class="item-text">${each.lanname}</span>              
 <span class="item-desc mr-1">${each.desc}</span>
 <div>
   <button data-id="${each._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
   <button data-id="${each._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
 </div>
</li>`
}

if( each_collcitems != undefined && each_collcitems != null && each_collcitems != "")
{
    let displaylist = each_collcitems.map(function(itm){
        return eachItem_Prpare(itm)
    }).join(' ')
    document.getElementById('item-list').insertAdjacentHTML("beforeend",displaylist)
    each_collcitems="";
}


//Form Submit events for create new item.
document.getElementById('create-form').addEventListener('submit',function(e)
{
    e.preventDefault();
    debugger
    let lt_insertitem = {iptext:document.getElementById('iptext').value, ipdesc:document.getElementById('ipdesc').value};
    lt_insertitem.ipdesc = lt_insertitem.ipdesc != undefined && lt_insertitem.ipdesc != null && lt_insertitem.ipdesc != "" ? lt_insertitem.ipdesc : "";

    if(lt_insertitem.iptext != undefined && lt_insertitem.iptext != null && lt_insertitem.iptext != "")
    {
        axios.post('/create-item',lt_insertitem).then(function(response)
        {
            document.getElementById('item-list').insertAdjacentHTML("beforeend",eachItem_Prpare(response.data))
            iptext.value="";
            ipdesc.value="";
        })
    }    
})


//Edit and Delete function Click Events
document.addEventListener('click',function(e){
    let cur_tar_class = e.target.classList;
    cur_tar_class = cur_tar_class != undefined && cur_tar_class != null ? cur_tar_class : "";
    if(cur_tar_class.contains('edit-me'))
    {
        editme_click_Event(e)
    }
    else if(cur_tar_class.contains('delete-me'))
    {
        deleteme_click_event(e)
    }
})


//Edit me button click event logic
function editme_click_Event(e)
{
    let lan_name = e.target.parentElement.parentElement.querySelector(".item-text").innerHTML;
    lan_name = lan_name != undefined && lan_name != null ? lan_name :"";

    let lan_desc = e.target.parentElement.parentElement.querySelector(".item-desc").innerHTML;
    lan_desc = lan_desc != undefined && lan_desc != null ? lan_desc :"";

    let cur_lan_name =  prompt('Enter Language Name', lan_name)    
    let cur_desc_name =  prompt('Enter the language desciption', lan_desc)

    if(cur_lan_name || cur_desc_name)
    {        
        if(cur_lan_name == lan_name && cur_desc_name == lan_desc)    
        {
            alert("No chanes in edit buttons")
        }
        else{         
            cur_lan_name = cur_lan_name != undefined && cur_lan_name!= null && cur_lan_name != ""?cur_lan_name:lan_name;
            cur_desc_name = cur_desc_name != undefined && cur_desc_name!= null && cur_desc_name != ""?cur_desc_name:lan_desc;

            axios.post('/update-item',{id:e.target.getAttribute('data-id'), iptext : cur_lan_name, ipdesc :cur_desc_name })
            .then(function(){
                e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = cur_lan_name
                e.target.parentElement.parentElement.querySelector('.item-desc').innerHTML = cur_desc_name
            })
            .catch(function(e_exceptionval)
            {
                console.log(e_exceptionval)
            })
        }
    }    
}

//Delete me button click event logic
function deleteme_click_event(e)
{
    if(confirm("Do you want delete this item"))
    {        
        axios.post('/delete-item',{id:e.target.getAttribute('data-id')}).then(function(){     
            e.target.parentElement.parentElement.remove()
        })
        .catch(function(e_exceptionval)
        {
                console.log(e_exceptionval)
        })
    }
}
