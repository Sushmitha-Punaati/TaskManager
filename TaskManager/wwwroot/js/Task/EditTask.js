var tinyMCECount = 1;
$(function () {

    $('#toggleStatus').bootstrapToggle();
    $("#txtDueDate").datepicker({
        startDate: new Date(),
    });
    $("#frm_Task").validate({
        rules: {
            Name: {
                required: true
            }
        },
        messages: {
            name: {
                required: "This field is required"
            }
        },
        errorElement: "div",
        errorPlacement: function (error, element) {
            error.addClass("error");
            error.insertAfter(element);
        }
    });

    $("#frm_Task").on("submit", function (event) {
        event.preventDefault();
    });
    var ele = $(".tinyTaskDesc").first();

    if (ele.id == undefined) {

        var id = "txtTiny_" + tinyMCECount;
        $(ele).attr("id", id);
        tinyMCECount++;
        var itemText = $(ele).attr('data-origtext');
        IntiateTinyMceBasic("#" + id, itemText);

    }
});
var IntiateTinyMceBasic = function (id, itemText) {

    var el = document.createElement('div');
    $(el).insertBefore(id);
    var toolbar = "undo redo | link image table | styleselect fontsizeselect forecolor backcolor| bold italic Underline | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent| charmap |";
    tinymce.init({
        selector: id,
        menubar: false,
        statusbar: false,
        toolbar: toolbar,
        fixed_toolbar_container_target: el,        
        fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 18pt 24pt 30pt 36pt 48pt 60pt 72pt 96pt",
        min_height: 200,
        height: 250,
        max_height: 350,
        plugins: [
            "lists","autoresize"
        ],
        setup: function (ed) {

            ed.on('init', function (e) {

                ed.setContent(itemText);
                $('em').replaceWith(function () {
                    return $("<i />", { html: $(this).html() });
                });
            });
        }
    });

};


