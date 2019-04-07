$("button[type='submit']").each(function(index, elem){
    $(elem).attr('type', 'button');
});

for (var i=0; i<2; i++){
    var sel = $("select[id$='heading']").eq(i);
    var opts = $(sel).find('option');
    for (var j=0; j<$(opts).length; j++){
        var opt = $(opts).eq(j);
        $(opt).remove();
    }
    $(sel).load('myphp.php', {'category':'ok'});
}

function success(el){
    $(el).next('div.form-validator').text("");
    $(el).removeClass("error");
};

function fail(el){
    var text = $(el).prev('label').text();
    $(el).next('div.form-validator').text(`Неккоректно введен ${text}`);
    $(el).addClass("error");
};

function check(el, pat){
    if (pat.test($(el).val())) {
        success(el);
        return $(el).val();
    }
    else {
        fail(el);
        return "";
    }
};

var update = $("input[class='form-control error']");
success(update);

var type = $('ul.list-tabs li.active a');
$('ul.list-tabs li a').click(function(){
    type = $(this);    
});

$("button[type='button']").click(function(){
    var user_type = type.text();
    var id_type_arr = type.attr('href').split("-");
    var id_type = id_type_arr[0];
    var email = $('input'+id_type+'-email');
    var email_pattern = /^[a-z0-9_\.\-]+@([a-z0-9\-]+\.)+[a-z]{2,6}$/i;
    var emailRes = check(email, email_pattern);
    var tel = $('input'+id_type+'-tel');
    var tel_pattern = /^\+[0-9]{1,4}\([0-9]{2,4}\)[0-9]{7,9}$/;
    var telRes = check(tel, tel_pattern);
    var town = $('input'+id_type+'-town').val();
    var heading = $('select'+id_type+'-heading option:selected').text();

    if (emailRes != "" && telRes != "") {
        console.log (user_type);
        console.log (emailRes);
        console.log (telRes);
        console.log (town);
        console.log (heading);
        $.post('myphp.php', {'user_type': user_type, 'emailRes': emailRes, 'telRes': telRes, 'town': town, 'heading': heading},
            function(data){
                console.log(data);
                $('div#modal-message').modal();
                switch(data){
                    case "Беларусь":
                        var count = $('div'+id_type+'-tab div.country-block').eq(0).find('div.count');
                        var new_count = parseInt(count.text().replace(' ', ''))+1;
                        console.log(new_count);
                        $(count).text(new_count);
                        break;
                        case "Россия":
                        var count = $('div'+id_type+'-tab div.country-block').eq(1).find('div.count');
                        var new_count = parseInt(count.text().replace(' ', ''))+1;
                        console.log(new_count);
                        $(count).text(new_count);
                        break;
                        case "Украина":
                        var count = $('div'+id_type+'-tab div.country-block').eq(2).find('div.count');
                        var new_count = parseInt(count.text().replace(' ', ''))+1;
                        console.log(new_count);
                        $(count).text(new_count);
                        break;
                        case "Казахстан":
                        var count = $('div'+id_type+'-tab div.country-block').eq(3).find('div.count');
                        var new_count = parseInt(count.text().replace(' ', ''))+1;
                        console.log(new_count);
                        $(count).text(new_count);
                        break;
                }
            });
    }
 });

$("input[id$='town']").keyup(function(){
    var fTown = $(this).val();
    if (fTown.length == 3){
        var attr_list = 'list-' + $(this).prop('id');
        $(this).attr('list', attr_list);
        $(this).after('<datalist id='+attr_list+'></datalist>');
        $('#'+attr_list).load('myphp.php', {'fTown':fTown});
    }
});