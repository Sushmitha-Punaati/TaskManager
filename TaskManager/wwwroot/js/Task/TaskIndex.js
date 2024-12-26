
var _prevSkips = -1;
var TaskStatus =
{
    Active:1,
    Completed: 0,
    All:-1

};
$(function () {  
    LoadTasks(0);
});

$(document).on("change", ".ddlStatus", function () {
    _prevSkips = -1;
    LoadTasks(0);
});

function LoadTasks(currSkip) {    
    currSkip = currSkip > 0 ? currSkip : 0;

    if (currSkip != _prevSkips) {
        _prevSkips = currSkip;
        startLoader();
        $.ajax({
            type: "POST",
            url: '/TaskManager/GetAllTasks?skip=' + currSkip + "&StatusId=" + $(".ddlStatus").val(),
            dataType: 'html',
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                stopLoader();
                if (_prevSkips > 0) {
                    $('.secTasks .ulTasks').append(result);  
                }
                else {
                    $('.secTasks .ulTasks').empty().append(result);  
                }
            
                $('.secTasks').on('scroll', setScroll);
                SetDisplay();
            },
            error: function (msg) {
                stopLoader();
                alert('An error occured while processing your request.');
            },
        })
       
    }
}

function SetDisplay() {
    SetActionMenusAsTooltip();
    $(".spanNoOfRecords").html($("#hdnTotalCount").val());
    $(".spanActiveCount").html($("#hdnActiveCount").val());
    $(".ulTasks .liTaskNoResults .divNoResults").hide();
    if ($(".ulTasks .liTaskRow").length === 0) {
        $(".ulTasks .liTaskNoResults .divNoResults").show();
    }  
}

function setScroll(e) {
    var currSkip = parseInt($('.ulTasks .liTaskRow').length);
    if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 50) {
        LoadTasks(currSkip);
    }
    return false;
}
function SetActionMenusAsTooltip() {
    $('.list-icon-bgcss').each(function (i, ele) {

        if ($(ele).data('ui-tooltip')) {
            $(ele).tooltip('destroy');
        }
        $(ele).tooltip({

            content: function () {
                return '<ul class="ulactiomenu">' + $(ele).parents("ul:first").find(".actionuls").html() + '</ul>';
                console.log($(ele).parents("ul:first").find(".actionuls").html());
            }                    ,
            show: null,
            tooltipClass: "tooltipAction",
            track: true,
            close: function (event, ui) {

                ui.tooltip.on("mouseenter", function () {
                        var $id = $(ui.tooltip).attr('id');
                        $('div.ui-tooltip').not('#' + $id).remove();
                        $(this).stop(true);
                    }).on("mouseleave", function () {
                            $(this).remove();
                    });
            },
            position: {
                my: "right top",
                at: "left top"

            }
        });
    });
};
function AddorEditTask(ele) {

    var TaskId = 0;
    if ($(ele).attr("keyid") != undefined) {
        TaskId = $(ele).attr("keyid");
    }

    $.ajax({
        type: "GET",
        dataType: 'html',
        contentType: "application/json; charset=utf-8",
        url: "/TaskManager" + '/GetTask?TaskId=' + TaskId,
        success: function (data) {

            var div = $('<div/>');
           
            $(div).dialog({
                modal: true,
                width: 1000,
                title: TaskId > 0 ? "Edit Task" : "Create Task",
                open: function (event, ui) {
                    $(div).html(data);
                },
                buttons: {
                    Save: function () {
                        
                        var form = $("#frm_Task");
                        $(form).validate();
                        if ($(form).valid()) {
                            startLoader();
                            $("#hdnTaskDesc").val(tinymceGetContent($(".tinyTaskDesc").attr("id")));
                            $("#hdnStatusId").val($('input[id="toggleStatus"]').prop('checked') == true ? TaskStatus.Active : TaskStatus.Completed);
                                var obj = GetFormData('#frm_Task');                         
                                $.ajax({
                                    type: 'POST',
                                    url: "/TaskManager/SaveTask",
                                    data: obj,
                                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                                    dataType: "json",
                                    success: function (data) {
                                        stopLoader();
                                        $(div).remove();
                                        _prevSkips = -1;
                                        LoadTasks(0);
                                        if (TaskId > 0) {                                            
                                            alert("Task has been updated successfully");
                                        }
                                        else {                                          
                                            alert("Task has been created successfully");
                                        }                                        
                                        
                                    },
                                    error: function (error) {
                                        stopLoader();
                                        $(div).remove();
                                        alert("An error occurred while processing your request.");
                                    }

                                });

                            }                                                
                    },
                    Cancel: function () {
                        $(div).remove();
                    }
                },
                position: { at: "center top" },
                close: function (event, ui) {
                    $(div).remove();
                }

            });

        },
        error: function (data) {
            alert("An error occurred while processing your request.");
        }
    });

}

function DeleteTask(ele) {
    var TaskId = $(ele).attr("keyid");
    var taskname = $(".liTaskRow[data-itemid=" + TaskId + "] div").find(".spanTaskName").html();
    DeleteTasks(ele, TaskId, "Delete Task", `Please confirm that you want to delete the following task.<br/><br/><b>${taskname}</b>`, "Task has been deleted successfully");
}

function DeleteAllCompTasks(ele) {
    DeleteTasks(ele, -1, "Delete All Completed Tasks", "Are you sure you want to delete all completed tasks?", "All completed tasks has been deleted successfully");
}

function DeleteTasks(ele, TaskId, dialogtitle, confirmmsg, successmsg) {
    var div = $('<div/>');
    $(div).dialog({
        modal: true,
        width: 1000,
        title: dialogtitle,
        open: function (event, ui) {
            $(div).html(confirmmsg);
        },
        buttons: {
            Delete: function () {
                $(div).remove();
                startLoader();
                $.ajax({
                    type: "POST",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    url: "/TaskManager" + '/DeleteTask?TaskId=' + TaskId,
                    success: function (data) {
                        stopLoader();
                        if (TaskId > 0) {
                            var currLi = $(".liTaskRow[data-itemid=" + TaskId + "]");
                            var statusId = parseInt($(currLi).attr("data-statusid"));
                            var totalcount = parseInt($("#hdnTotalCount").val());
                            $("#hdnTotalCount").val(totalcount - 1);
                            if (statusId === TaskStatus.Active) {
                                var activecount = parseInt($("#hdnActiveCount").val());
                                $("#hdnActiveCount").val(activecount - 1);
                            }
                            $(currLi).remove();
                            SetDisplay();
                        }
                        else {
                            _prevSkips = -1;
                            LoadTasks(0);
                        }
                        alert(successmsg);
                    },
                    error: function (e) {
                        stopLoader();
                        $(div).remove();
                    }
                });
            },
            Cancel: function () {
                $(div).remove();
            }
        },
        close: function (event, ui) {
            $(div).remove();
        }
    });
}

$(document).on("click", ".liTaskRow", function () {

    var TaskId = 0;
    if ($(this).attr("data-itemid") != undefined) {
        TaskId = $(this).attr("data-itemid");
    }

    $.ajax({
        type: "GET",
        dataType: 'html',
        contentType: "application/json; charset=utf-8",
        url: "/TaskManager" + '/ViewTask?TaskId=' + TaskId,
        success: function (data) {

            var div = $('<div/>');
            $(div).html(data);
            $(div).dialog({
                modal: true,
                width: 1000,
                title: "Task Details",
                open: function (event, ui) {

                   
                },
                buttons: {
                    Ok: function () {
                        $(div).remove();
                    },
                    Cancel: function () {
                        $(div).remove();
                    }
                },
                position: { at: "center top" },
                close: function (event, ui) {
                    $(div).remove();
                }

            });

        },
        error: function (data) {
            alert("An error occurred while processing your request.");
        }
    });
});
function GetFormData(frm) {

    var formObject = $(frm).serializeArray();
    var data = {};

    $.each(formObject, function (index, ele) {
        var groupIds = [];

        var groupobjects = $.map(formObject, function (obj, index) {
            if (obj.name == ele.name) {
                groupIds.push(obj.value);
                return obj;
            }
        });
        if (groupobjects.length > 1 && groupIds.length > 1) {
            data[ele.name] = groupIds;
        }
        else {
            data[ele.name] = ele.value;
        }
    });

    return data;
}

function tinymceGetContent(tinyid) {

    return tinymce.get(tinyid).getContent().replaceAll("\n", '').replaceAll('&ndash;', '–').replaceAll("&nbsp;", ' ').replaceAll("&ldquo;", '"').replaceAll('&deg;', '°').replaceAll('&ge;', '≥').replaceAll('&le;', '≤');
}