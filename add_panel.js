/*
 * 描述: 用于创建添加规则的添加面板
 * 参数：panel_config -- 添加面板所需的所有配置，具体使用见add_panel_extend.js文件
 *
 * 作者: WangLin，245105947@qq.com
 * 公司: capsheaf
 * 历史：
 *       2014.09.18 WangLin创建
 */
function RuleAddPanel(panel_config) {
    /* 第一步，初始化本panel_config */
    this.init_panel_config(panel_config);
    /* 第二步，创建面板相关变量 */
    this.init_panel_control_variable();
    /* 第三步，创建面板 */
    // this.render();//留给用户去渲染
}

RuleAddPanel.prototype.render = function() {
    var rule_add_panel = this;

    /* 第一步，创建面板 */
    this.display_add_panel();
    /* 第二步，增加监听 */
    this.add_listener_to_panel();
    /* 第三步，初始化表单检查 */
    this.init_check_input_data();
}

RuleAddPanel.prototype.init_panel_config = function(panel_config) {
    var rule_add_panel = this;
    rule_add_panel.panel_config = panel_config;

    rule_add_panel.init_widget_attr_sets();

    /* 添加规则的标题提示图片，默认是"add.png" */
    rule_add_panel.panel_config.is_rule_title_icon = panel_config.is_rule_title_icon !== undefined ? panel_config.is_rule_title_icon : true;
    rule_add_panel.panel_config.rule_title_adding_icon = panel_config.rule_title_adding_icon !== undefined ? panel_config.rule_title_adding_icon : "add.png";
    rule_add_panel.panel_config.rule_title_editing_icon = panel_config.rule_title_editing_icon !== undefined ? panel_config.rule_title_editing_icon : "del.png";
    /* 添加规则的提示标题，默认是"规则" */
    rule_add_panel.panel_config.rule_title = panel_config.rule_title !== undefined ? panel_config.rule_title : "规则";
    /* 添加和编辑两个状态的相关提示文字 */
    rule_add_panel.panel_config.rule_title_adding_prefix = panel_config.rule_title_adding_prefix !== undefined ? panel_config.rule_title_adding_prefix : "添加";
    rule_add_panel.panel_config.rule_title_editing_prefix = panel_config.rule_title_editing_prefix !== undefined ? panel_config.rule_title_editing_prefix : "编辑";
    rule_add_panel.panel_config.button_adding_text = panel_config.button_adding_text !== undefined ? panel_config.button_adding_text : "添加";
    rule_add_panel.panel_config.button_editing_text = panel_config.button_editing_text !== undefined ? panel_config.button_editing_text : "编辑";
    rule_add_panel.panel_config.button_cancel_text = panel_config.button_cancel_text !== undefined ? panel_config.button_cancel_text : "撤销";
    rule_add_panel.panel_config.button_import_text = panel_config.button_import_text !== undefined ? panel_config.button_import_text : "导入";
    /* 面板名字,默认为"my_add_panel" */
    rule_add_panel.panel_config.panel_name = panel_config.panel_name !== undefined ? panel_config.panel_name : "my_add_panel";
    rule_add_panel.panel_config.is_modal = panel_config.is_modal !== undefined ? panel_config.is_modal : false;
    /* 定义面板是否可关闭 */
    rule_add_panel.panel_config.is_panel_closable = panel_config.is_panel_closable !== undefined ? panel_config.is_panel_closable : false;
    /* 定义面板是否可伸缩 */
    rule_add_panel.panel_config.is_panel_stretchable = panel_config.is_panel_stretchable !== undefined ? panel_config.is_panel_stretchable : true;
    /* 定义面板是否可拖拽 */
    rule_add_panel.panel_config.is_popup_tip = panel_config.is_popup_tip !== undefined ? panel_config.is_popup_tip : true;
    /* 定义面板是否可拖拽 */
    rule_add_panel.panel_config.is_panel_draggable = panel_config.is_panel_draggable !== undefined ? panel_config.is_panel_draggable : true;
    /*定义面板是否有透明边框*/
    rule_add_panel.panel_config.border_transparent = panel_config.border_transparent !== undefined ? panel_config.border_transparent : true;
    /* 定义页脚按钮 */
    rule_add_panel.panel_config.footer_buttons = panel_config.footer_buttons !== undefined ? panel_config.footer_buttons : {
        add: true,
        cancel: true
    };

    rule_add_panel.panel_config.ass_list_panel = panel_config.ass_list_panel !== undefined ? panel_config.ass_list_panel : null;
    rule_add_panel.panel_config.ass_message_manager = panel_config.ass_message_manager !== undefined ? panel_config.ass_message_manager : null;
    /* 外接事件处理函数 */
    rule_add_panel.panel_config.event_handler = panel_config.event_handler !== undefined ? panel_config.event_handler : null;

    /*检查输入正确与否的工具*/
    rule_add_panel.check_tool = new ChinArk_forms();
}

RuleAddPanel.prototype.set_ass_list_panel = function(list_panel) {
    var rule_add_panel = this;

    rule_add_panel.panel_config.ass_list_panel = list_panel;
}

RuleAddPanel.prototype.set_ass_message_manager = function(message_manager) {
    var rule_add_panel = this;

    rule_add_panel.panel_config.ass_message_manager = message_manager;
}

RuleAddPanel.clone = function(obj) {
    if (typeof(obj) != 'object') {
        return obj;
    }
    if (obj == null) {
        return obj;
    }

    var new_obj = new Object();
    for (var key in obj) {
        new_obj[key] = RuleAddPanel.clone(obj[key]);
    }

    return new_obj;
}

RuleAddPanel.prototype.init_widget_attr_sets = function() {
    var rule_add_panel = this;

    function default_render(attr_name, attr_value) {
        var render_text = "";
        if (attr_value !== undefined && attr_value) {
            render_text += attr_name + '="' + attr_value + '" ';
        }
        return render_text;
    }

    function class_render(attr_name, attr_value, default_value) {
        var render_text = "";

        if (attr_value !== undefined && attr_value) {
            if (default_value) {
                attr_value = default_value + ' ' + attr_value;
            }
        } else {
            if (default_value) {
                attr_value = default_value;
            }
        }
        if (attr_value) {
            render_text += attr_name + '="' + attr_value + '" ';
        }

        return render_text;
    }

    function functions_render(functions) {
        var render_text = "";
        if (functions !== undefined && functions) {
            for (var key in functions) {
                render_text += key + '="' + functions[key] + '" ';
            }
        }
        return render_text;
    }

    rule_add_panel.panel_config.widget_standard_attr = {
        id: {
            render: default_render
        },
        name: {
            render: default_render
        },
        "class": {
            render: function(attr_name, attr_value, item) {
                return class_render(attr_name, attr_value, item.class_default_value);
            }
        },
        value: {
            render: default_render
        },
        disabled: {
            render: default_render
        },
        readonly: {
            render: default_render
        },
        maxlength: {
            render: default_render
        },
        size: {
            render: default_render
        },
        cols: {
            render: default_render
        },
        rows: {
            render: default_render
        },
        multiple: {
            render: default_render
        },
        selected: {
            render: default_render
        },
        checked: {
            render: default_render
        },
        placeholder: {
            render: default_render
        },
        split: {
            render: default_render
        },
        style: {
            render: default_render
        },
        functions: {
            render: function(attr_name, attr_value, item) {
                if (attr_value !== undefined && attr_value) {
                    return functions_render(item.functions);
                } else {
                    return "";
                }
            }
        }
    };

    rule_add_panel.panel_config.widget_label_standard_attr = {
        label_id: {
            render: function(attr_name, attr_value, item) {
                return default_render("id", attr_value);
            }
        },
        label_name: {
            render: function(attr_name, attr_value, item) {
                return default_render("name", attr_value);
            }
        },
        label_class: {
            render: function(attr_name, attr_value, item) {
                return class_render("class", attr_value, item.label_class_default_value);
            }
        },
        label_style: {
            render: function(attr_name, attr_value, item) {
                return default_render("style", attr_value);
            }
        },
        label_functions: {
            render: function(attr_name, attr_value, item) {
                if (attr_value !== undefined && attr_value) {
                    return functions_render(item.label_functions);
                } else {
                    return "";
                }
            }
        }
    }

    rule_add_panel.panel_config.widget_tip_standard_attr = {
        tip_id: {
            render: function(attr_name, attr_value, item) {
                return default_render("id", attr_value);
            }
        },
        tip_name: {
            render: function(attr_name, attr_value, item) {
                return default_render("name", attr_value);
            }
        },
        tip_class: {
            render: function(attr_name, attr_value, item) {
                return class_render("class", attr_value, item.tip_class_default_value);
            }
        },
        tip_style: {
            render: function(attr_name, attr_value, item) {
                return default_render("style", attr_value);
            }
        },
        tip_functions: {
            render: function(attr_name, attr_value, item) {
                if (attr_value !== undefined && attr_value) {
                    return functions_render(item.tip_functions);
                } else {
                    return "";
                }
            }
        }
    }

    rule_add_panel.panel_config.widget_item_standard_attr = {
        item_id: {
            render: function(attr_name, attr_value, item) {
                return default_render("id", attr_value);
            }
        },
        item_name: {
            render: function(attr_name, attr_value, item) {
                return default_render("name", attr_value);
            }
        },
        item_class: {
            render: function(attr_name, attr_value, item) {
                return class_render("class", attr_value, item.item_class_default_value);
            }
        },
        item_style: {
            render: function(attr_name, attr_value, item) {
                return default_render("style", attr_value);
            }
        },
        item_functions: {
            render: function(attr_name, attr_value, item) {
                if (attr_value !== undefined && attr_value) {
                    return functions_render(item.item_functions);
                } else {
                    return "";
                }
            }
        }
    }
}

RuleAddPanel.prototype.init_panel_control_variable = function() {
    var rule_add_panel = this;
    var panel_name = rule_add_panel.panel_config.panel_name;

    var panel_id = "add_panel_id_for_" + panel_name;
    var panel_TB_id = "TransparentBorder_" + panel_name;
    var panel_div_id = 'modal_border_box_' + panel_name;
    var panel_popup_id = 'add_panel_popup_id_for_' + panel_name;
    var panel_header_id = "add_panel_header_id_for_" + panel_name;
    var panel_title_id = "add_panel_title_for_" + panel_name;
    var panel_title_img_id = "add_panel_title_img_for_" + panel_name;
    var panel_title_text_id = "add_panel_title_text_for_" + panel_name;
    var panel_close_id = "add_panel_close_for_" + panel_name;
    var panel_body_id = "add_panel_body_id_for_" + panel_name;
    var panel_body_form_id = "add_panel_body_form_id_for_" + panel_name;
    var panel_body_form_name = "add_panel_body_form_name_for_" + panel_name;
    var form_text_class = "add-panel-form-text";
    var form_button_class = "add-panel-form-button";
    var form_textarea_class = "add-panel-form-textarea";
    var form_select_class = "add-panel-form-select";
    var form_m_select_class = "add-panel-form-multiple-select";
    var form_choice_class = "add-panel-form-choice";
    var form_label_class = "add-panel-form-label";
    var form_item_class = "add-panel-form-item";
    var panel_item_id = "add_panel_item_id_for_" + panel_name;
    var panel_add_button_id = "add_panel_add_button_id_for_" + panel_name;
    var panel_cancel_button_id = "add_panel_cancel_button_id_for_" + panel_name;
    var panel_import_button_id = "add_panel_import_button_id_for_" + panel_name;

    var panel_control = {
        panel_id: panel_id,
        panel_TB_id: panel_TB_id,
        panel_div_id: panel_div_id,
        panel_popup_id: panel_popup_id,
        panel_header_id: panel_header_id,
        panel_title_id: panel_title_id,
        panel_title_img_id: panel_title_img_id,
        panel_title_text_id: panel_title_text_id,
        panel_close_id: panel_close_id,
        panel_body_id: panel_body_id,
        panel_body_form_id: panel_body_form_id,
        panel_body_form_name: panel_body_form_name,
        form_text_class: form_text_class,
        form_button_class: form_button_class,
        form_textarea_class: form_textarea_class,
        form_select_class: form_select_class,
        form_m_select_class: form_m_select_class,
        form_choice_class: form_choice_class,
        form_label_class: form_label_class,
        form_item_class: form_item_class,
        panel_item_id: panel_item_id,
        panel_add_button_id: panel_add_button_id,
        panel_cancel_button_id: panel_cancel_button_id,
        panel_import_button_id: panel_import_button_id,
    }
    rule_add_panel.panel_control = panel_control;
}

RuleAddPanel.prototype.add_listener_to_panel = function() {
    var rule_add_panel = this;

    rule_add_panel.add_listener_to_panel_title();
    if (rule_add_panel.panel_config.is_panel_draggable && rule_add_panel.panel_config.is_modal) {
        rule_add_panel.add_listener_to_panel_header();
    }
    rule_add_panel.add_listener_to_panel_buttons();
    rule_add_panel.add_listener_to_popup_img();
    rule_add_panel.add_listener_to_choice_for_popup();
}

RuleAddPanel.prototype.add_listener_to_choice_for_popup = function() {
    var rule_add_panel = this;
    var form_name = rule_add_panel.panel_control.panel_body_form_name;
    var text_obj = rule_add_panel.get_input_check_obj('popup');
    for(var item in text_obj){
        var ele = 'form[name="'+form_name+'"] [name="'+ text_obj[item].name +'"]';
        if (text_obj[item].type == 'radio' || text_obj[item].type == 'select') {
            $(ele).change(function(event) {
                var ele_name_arr =[];
                $(this).parents('.add-panel-section').find('input,textarea').each(function(index, el) {
                    ele_name_arr.push($(el).attr('name'));
                });
                var popup_ele_name_arr = ele_name_arr.map(function(elem,index,input) {
                    return '#popup_item_id_for_' + elem;
                });
                for (var i = 0; i < popup_ele_name_arr.length; i++) {
                    $(popup_ele_name_arr[i]).hide();
                }
            });
        }
        if (text_obj[item].check || text_obj[item].popup_cont != false) {
            $(ele).focus(function(event) {
                var popup_item_id = '#popup_item_id_for_' + this.name; //整个包裹层
                var popup_img_id = '#popup_img_for_' + this.name; //图片
                var popup_img = document.querySelector(popup_img_id);
                if ($(popup_img_id).attr('src') == '../images/error_note.png') {
                    $(popup_item_id).css('z-index', '10000').children().children('.popup-check').show();                
                    rule_add_panel.control_display_for_popup_box(popup_img,'show');
                }   
            });
            $(ele).blur(function(event) {
                var popup_item_id = '#popup_item_id_for_' + this.name; //整个包裹层
                var popup_img_id = '#popup_img_for_' + this.name; //图片
                var popup_img = document.querySelector(popup_img_id);
                if (popup_img !== null) {
                    $(popup_item_id).css('z-index', '9999');
                    rule_add_panel.control_display_for_popup_box(popup_img,'hide'); 
                }
            });
        }
        
    }
}
RuleAddPanel.prototype.add_listener_to_popup_img = function() {
    var rule_add_panel = this;
    var panel_config = rule_add_panel.panel_config;
    var panel_control = rule_add_panel.panel_control;

    var popup_obj = rule_add_panel.get_input_check_obj('popup');
    var popup_img_name_arr = [];
    for(var item in popup_obj){
        if (popup_obj[item].popup_cont != false) {
            popup_img_name_arr.push(popup_obj[item].name);
        }
    }
    var popup_img_id_arr = popup_img_name_arr.map(function(item,index,input) {
        return '#popup_img_for_'+item;
    })
    for (var i = 0; i < popup_img_id_arr.length; i++) {
        var popup_img = document.querySelector(popup_img_id_arr[i])
        if (popup_img) {
            popup_img.addEventListener('mouseenter',function(){
                rule_add_panel.control_display_for_popup_box(this,'show');
            })
            popup_img.addEventListener('mouseleave',function(){
                rule_add_panel.control_display_for_popup_box(this,'hide');
            })

        }
    }
}
RuleAddPanel.prototype.control_display_for_popup_box = function(ele,status) {
    var rule_add_panel = this;

    var temp_name_arr = ele.id.split('_for_');
    var popup_cont_id = '#popup_item_id_for_' + temp_name_arr[1];
    var ele_site = rule_add_panel.get_ele_left_top(ele);
    if (status == 'show') {
        $(popup_cont_id).css({
            left: ele_site.left +58,
            top: ele_site.top-20,
            display:'inline-block'
        });
        var errror_info=$('#error_item_id_for_'+temp_name_arr[1]+' .error-info').text()
        if (errror_info===''||errror_info==='此项输入正确') {
            $('#error_item_id_for_'+temp_name_arr[1]).css('display', 'none');
        }
    }else{
        $(popup_cont_id).hide();
    }

}
RuleAddPanel.prototype.get_ele_left_top = function(ele) {
    var actualLeft = ele.offsetLeft;　　
    var actualTop = ele.offsetTop;

    　　
    var current = ele.offsetParent;

    　　
    while (current !== null) {　　　　
        actualLeft += current.offsetLeft;　　　　
        actualTop += current.offsetTop;

        　　　　
        current = current.offsetParent;　　
    }

    　　
    if (document.compatMode == "BackCompat") {　　　　
        var elementScrollLeft = document.body.scrollLeft;　　　　
        var elementScrollTop = document.body.scrollTop;

        　　
    } else {　　　　
        var elementScrollLeft = document.documentElement.scrollLeft;　　　　
        var elementScrollTop = document.documentElement.scrollTop;

        　　
    }

    　　
    return {
        left: actualLeft - elementScrollLeft,
        top: actualTop - elementScrollTop
    }
}
RuleAddPanel.prototype.add_listener_to_panel_header = function() {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;

    var panel_header = panel_control.panel_header_id;
    var panel_container = panel_control.panel_id;
    var panel_TB_id = panel_control.panel_TB_id;
    var panel_container_father;
    if (rule_add_panel.panel_config.border_transparent) {
        panel_container_father = document.querySelector('#' + panel_TB_id);
    } else {
        panel_container_father = document.querySelector('#' + panel_container).parentElement;
    }
    // if (rule_add_panel.panel_config.is_modal) {
        panel_container_father.style.margin = '0';
        panel_container_father.style.left = '12%';
        panel_container_father.style.top = '12%';

        document.querySelector('#' + panel_header).className += ' add_panel_header_move';

        document.querySelector('#' + panel_header).onmousedown = function(ev) {　　　　
            var oevent = ev || event;

            　　　　
            var distanceX = oevent.clientX - panel_container_father.offsetLeft;　　　　
            var distanceY = oevent.clientY - panel_container_father.offsetTop;

            　　　　
            document.onmousemove = function(ev) {
                $('.popup-tip').hide()　　　　
                var oevent = ev || event;
                var ele_left = oevent.clientX - distanceX;
                var ele_left_down = document.body.scrollWidth - panel_container_father.offsetWidth - 20;
                var ele_top = oevent.clientY - distanceY;
                var ele_top_down = document.body.scrollHeight - panel_container_father.offsetHeight - 40;
                if (ele_left < 0) {
                    ele_left = 0;
                } else if (ele_left > ele_left_down) {
                    ele_left = ele_left_down;
                }
                if (ele_top < 0) {
                    ele_top = 0
                } else if (ele_top > ele_top_down) {
                    ele_top = ele_top_down;
                }

                　　　　
                panel_container_father.style.left = ele_left + 'px';　　　　
                panel_container_father.style.top = ele_top + 'px';　　　　
            };　　　　
            document.onmouseup = function() {　　　　　　
                document.onmousemove = null;　　　　　　
                document.onmouseup = null;　　　　
            };　　
        };
    // }
    
}

RuleAddPanel.prototype.add_listener_to_panel_title = function() {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var panel_title_selector = "#" + panel_control.panel_title_id;
    var panel_body_selector = "#" + panel_control.panel_body_id;
    $(panel_title_selector).click(function() {
        if ($(panel_body_selector).css('display') == 'none') {
            rule_add_panel.slide_down_add_panel_body();
        } else {
            rule_add_panel.slide_up_add_panel_body();
        }
    });
}

RuleAddPanel.prototype.init_check_input_data = function() {
    var rule_add_panel = this;

    var check_obj = rule_add_panel.get_input_check_obj('render');
    var check_tool = rule_add_panel.check_tool;

    if (check_obj !== null && check_obj !== undefined) {

        check_tool._main(check_obj);

    }

}

RuleAddPanel.prototype.is_input_data_correct = function() {
    var rule_add_panel = this;
    var panel_TB_id = rule_add_panel.panel_control.panel_TB_id;
    var panel_div_id = rule_add_panel.panel_control.panel_div_id ;

    /*默认没有要检查的数据，给予通过*/
    var check_result = true;
    var check_obj = rule_add_panel.get_input_check_obj('check');
    var check_tool = rule_add_panel.check_tool;

    if (check_obj !== null && check_obj !== undefined) {
        if (check_tool._submit_check(check_obj, check_tool,panel_TB_id,panel_div_id)) {
            check_result = false;
        }
    }

    return check_result;
}

RuleAddPanel.prototype.get_input_check_obj = function(is_check) {
    var is_check = {'check':true,'render':false,'popup':'popup'}[is_check]; 
    var rule_add_panel = this;
    var panel_config = rule_add_panel.panel_config;
    var panel_control = rule_add_panel.panel_control;
    var panel_name = panel_config.panel_name;
    var TB_id = 'TransparentBorder_' + panel_name;
    var panel_div_id = 'modal_border_box_' + panel_name;

    var items_list = panel_config.items_list;

    if (items_list === undefined) {
        return null;
    }

    var check_count = 0;
    var check_option = new Object();
    var popup_option = new Object();
    for (var i = 0; i < items_list.length; i++) {
        var sub_items = items_list[i].sub_items;
        for (var j = 0; j < sub_items.length; j++) {
            var sub_item = sub_items[j];
            if (sub_item.type != "items_group") {
                popup_option[sub_item.name] = {
                        type: sub_item.type,
                        name: sub_item.name,
                        popup_cont: sub_item.popup !== undefined ? sub_item.popup : false,
                        check: sub_item.check !== undefined  ? true :false
                    };
                if (sub_item.check !== undefined) {
                    if (sub_item.name === undefined) {
                        rule_add_panel.show_error_mesg("获取检查对象失败，请检查各字段name属性是否填写");
                        return null;
                    } else {
                        if (panel_config.border_transparent) {
                            sub_item.check.is_transparent_border = 1;
                            sub_item.check.border_id = TB_id;
                            sub_item.check.panel_div_id = panel_div_id;
                        }

                        if (is_check) {
                                var item = document.querySelector('#'+panel_control.panel_body_form_id+' [name="'+sub_item.name+'"]');
                                if (item != null && item.style.display != 'none' && item.disabled == false) {
                                    check_option[sub_item.name] = sub_item.check;
                                    check_count++;
                                }
                        }else{
                            check_option[sub_item.name] = sub_item.check;
                            check_count++;
                        }
                        
                        
                        
                    }
                }
            } else {
                for (var k = 0; k < sub_item.sub_items.length; k++) {
                    var sub_sub_item = sub_item.sub_items[k];
                    popup_option[sub_sub_item.name] = {
                            type: sub_sub_item.type,
                            name: sub_sub_item.name,
                            popup_cont: sub_sub_item.popup !== undefined ? sub_sub_item.popup : false,
                            check: sub_sub_item.check !== undefined  ? true :false

                        };
                    if (sub_sub_item.check !== undefined) {
                        if (sub_sub_item.name === undefined) {
                            rule_add_panel.show_error_mesg("获取检查对象失败，请检查各字段name属性是否填写");
                            return null;
                        } else {
                            if (panel_config.border_transparent) {
                                sub_sub_item.check.is_transparent_border = 1;
                            }

                            if (is_check) {
                                    var item = document.querySelector('#'+panel_control.panel_body_form_id+' [name="'+sub_sub_item.name+'"]');
                                    if (item != null && item.style.display != 'none' && item.disabled == false) {
                                        check_option[sub_sub_item.name] = sub_sub_item.check;
                                        check_count++;
                                    }
                            }else{
                                check_option[sub_sub_item.name] = sub_sub_item.check;
                                check_count++;
                            }
                            
                         
                        }
                    }
                }
            }
        }
    }

    var check_obj = null;
    if (check_count > 0) {
        check_obj = new Object();
        check_obj.form_name = panel_control.panel_body_form_name;
        check_obj.option = check_option;
        
    }
    if (is_check == 'popup') {return popup_option}else{return check_obj};
    
}

RuleAddPanel.prototype.slide_up_add_panel_body = function() {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var panel_config = rule_add_panel.panel_config;
    var adding_icon = '/images/' + panel_config.rule_title_adding_icon;

    var panel_title_img_selector = "#" + panel_control.panel_title_img_id;
    var panel_body_selector = "#" + panel_control.panel_body_id;
    if (panel_config.is_panel_stretchable) {
        $(panel_body_selector).slideUp('1000');
        $(panel_title_img_selector).attr('src', adding_icon);
    }
}

RuleAddPanel.prototype.slide_down_add_panel_body = function() {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var panel_config = rule_add_panel.panel_config;
    var editting_icon = '/images/' + panel_config.rule_title_editing_icon;

    var panel_title_img_selector = "#" + panel_control.panel_title_img_id;
    var panel_body_selector = "#" + panel_control.panel_body_id;
    if (panel_config.is_panel_stretchable) {
        $(panel_body_selector).slideDown('1000');
        $(panel_title_img_selector).attr('src', editting_icon);
    }
}

RuleAddPanel.prototype.add_listener_to_panel_buttons = function() {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;

    var panel_close_selector = "#" + panel_control.panel_close_id;
    var add_button_selector = "#" + panel_control.panel_add_button_id;
    var cancel_button_selector = "#" + panel_control.panel_cancel_button_id;
    var import_button_selector = "#" + panel_control.panel_import_button_id;

    /* 关闭按钮 */
    if ($(panel_close_selector).length > 0) {
        $(panel_close_selector).click(function() {
            rule_add_panel.cancel_edit_box();
        });
    }

    /* 添加按钮 */
    if ($(add_button_selector).length > 0) {
        $(add_button_selector).click(function() {
            rule_add_panel.save_data();
        });
    }

    /* 撤销按钮 */
    if ($(cancel_button_selector).length > 0) {
        $(cancel_button_selector).click(function() {
            rule_add_panel.cancel_edit_box();
        });
    }

    /* 导入按钮 */
    if ($(import_button_selector).length > 0) {
        $(import_button_selector).click(function() {
            rule_add_panel.import_data();
        });
    }
}

RuleAddPanel.prototype.save_data = function() {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var panel_config = rule_add_panel.panel_config;
    var panel_name = panel_config.panel_name;
    var event_handler = panel_config.event_handler;

    var form_selector = "#" + panel_control.panel_body_form_id;
    var sending_data = $(form_selector).serialize();
    sending_data = sending_data + "&ACTION=save_data";
    sending_data = sending_data + "&panel_name=" + panel_name;

    function ondatareceived(data) {
        if (rule_add_panel.is_operation_succeed(data)) {
            if (data.mesg !== undefined && data.mesg != "") {
                rule_add_panel.show_note_mesg(data.mesg);
            }
            rule_add_panel.cancel_edit_box();
            var ass_list_panel = rule_add_panel.panel_config.ass_list_panel;
            if (ass_list_panel !== undefined && ass_list_panel !== null) {
                ass_list_panel.reset_selected_item();
                ass_list_panel.update_info(true);
            }
            /* 调用外接函数 */
            if (event_handler !== null && event_handler.after_save_data !== undefined) {
                event_handler.after_save_data(rule_add_panel, data);
            }
        } else {
            rule_add_panel.show_error_mesg(data.mesg);
        }
    }

    if (rule_add_panel.is_input_data_correct()) {
        /* 调用外接函数 */

        if (event_handler !== null && event_handler.before_save_data !== undefined) {
            var result = event_handler.before_save_data(rule_add_panel, sending_data)
            if (result == false) {
                return;
            } else if (result) {
                sending_data = result;
            }
        }
        rule_add_panel.request_for_json(sending_data, ondatareceived);
    } else {
        rule_add_panel.show_error_mesg("请正确填写各字段");
    }
}

RuleAddPanel.prototype.import_data = function() {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var form_selector = "#" + panel_control.panel_body_form_id;
    $(form_selector).submit();
}

RuleAddPanel.prototype.edit_data = function(data_item) {
    var rule_add_panel = this;
    rule_add_panel.load_data_into_add_panel(data_item);
}

RuleAddPanel.prototype.load_data_into_add_panel = function(data_item) {
    var rule_add_panel = this;
    var panel_config = rule_add_panel.panel_config;
    var panel_control = rule_add_panel.panel_control;
    var event_handler = panel_config.event_handler;

    /* 第零步，调用可能的外接函数 */
    if (event_handler !== null && event_handler.before_load_data !== undefined) {
        event_handler.before_load_data(rule_add_panel, data_item);
    }

    var form_selector = "#" + panel_control.panel_body_form_id;
    var item_id_selector = "#" + panel_control.panel_item_id;
    /* 第一步，装载数据项的ID */
    $(item_id_selector).val(data_item.id);
    /* 第二步，将text类型的的输入框的数据装载进去 */
    var form_text_selector = form_selector + ' .' + panel_control.form_text_class;
    var form_texts = $(form_text_selector);
    form_texts.each(function() {
        var text = this;
        if (data_item[$(text).attr("name")] !== undefined) {
            $(text).val(data_item[$(text).attr("name")]);
        }
    });
    /* 第三步，将textarea类型的输入的数据装载进去 */
    var form_textarea_selector = form_selector + ' .' + panel_control.form_textarea_class;
    var form_textareas = $(form_textarea_selector);
    form_textareas.each(function() {
        var textarea = this;
        if (data_item[$(textarea).attr("name")] !== undefined) {
            $(textarea).val(data_item[$(textarea).attr("name")]);
        }
    });
    /* 第四步，将select类型的输入框的数据装载进去 */
    var form_select_selector = form_selector + ' .' + panel_control.form_select_class;
    var form_selects = $(form_select_selector);
    form_selects.each(function() {
        var select = this;
        if (data_item[select.name] === undefined) {
            return;
        }
        for (var j = 0; j < select.length; j++) {
            if (select[j].value == data_item[select.name]) {
                select[j].selected = true;
                break;
            }
        }
    });
    /* 第五步，将select多选类型的输入框的数据装载进去 */
    form_select_selector = form_selector + ' .' + panel_control.form_m_select_class;
    form_selects = $(form_select_selector);
    form_selects.each(function() {
        var select = this;
        if (data_item[select.name] === undefined) {
            return;
        }
        var value = data_item[select.name];
        var values = data_item[select.name].split("|");
        for (var j = 0; j < select.length; j++) {
            var selected = false;
            for (var k = 0; k < values.length; k++) {
                if (select[j].value == values[k]) {
                    selected = true;
                    break;
                }
            }
            select[j].selected = selected;
        }
    });

    /* 第六步，将checkbox，radio类型的输入框的数据装载进去 */
    var form_choice_selector = form_selector + ' .' + panel_control.form_choice_class;
    var form_choices = $(form_choice_selector);
    form_choices.each(function() {
        var choice = this;
        if (data_item[choice.name] === undefined) {
            return;
        }
        var value = data_item[choice.name];
        var checked = false;
        if (value == "on") {
            checked = true;
        } else {
            var splitor = $(choice).attr("split");
            if (splitor === undefined) {
                splitor = "|";
            }
            var values = value.split(splitor);
            for (var k = 0; k < values.length; k++) {
                if (choice.value == values[k]) {
                    checked = true;
                    break;
                }
            }
        }
        choice.checked = checked;
    });

    /* 第七步，将按钮提示文字等改成编辑状态并下拉编辑窗口 */
    rule_add_panel.switch_to_editing_status();
    rule_add_panel.slide_down_add_panel_body();

    if (panel_config.is_modal) {
        rule_add_panel.show();
    }

    /* 最后一步，调用可能的外接函数 */
    if (event_handler !== null && event_handler.after_load_data !== undefined) {
        event_handler.after_load_data(rule_add_panel, data_item);
    }
}

RuleAddPanel.prototype.switch_to_adding_status = function() {
    var rule_add_panel = this;
    var panel_config = rule_add_panel.panel_config;
    var panel_control = rule_add_panel.panel_control;
    var rule_title = panel_config.rule_title;
    var rule_title_prefix = panel_config.rule_title_adding_prefix;
    var button_text = panel_config.button_adding_text;

    var title = rule_title_prefix + rule_title;
    var title_selector = "#" + panel_control.panel_title_text_id;
    var button_selector = "#" + panel_control.panel_add_button_id;

    $(title_selector).text(title);
    $(button_selector).val(button_text);
}

RuleAddPanel.prototype.switch_to_editing_status = function() {
    var rule_add_panel = this;
    var panel_config = rule_add_panel.panel_config;
    var panel_control = rule_add_panel.panel_control;
    var rule_title = panel_config.rule_title;
    var rule_title_prefix = panel_config.rule_title_editing_prefix;
    var button_text = panel_config.button_editing_text;

    var title = rule_title_prefix + rule_title;
    var title_selector = "#" + panel_control.panel_title_text_id;
    var button_selector = "#" + panel_control.panel_add_button_id;

    $(title_selector).text(title);
    $(button_selector).val(button_text);
}

RuleAddPanel.prototype.cancel_edit_box = function() {
    var rule_add_panel = this;
    var panel_config = rule_add_panel.panel_config;
    var event_handler = panel_config.event_handler;

    /* 调用可能的外接函数 */
    if (event_handler !== null && event_handler.before_cancel_edit !== undefined) {
        event_handler.before_cancel_edit(rule_add_panel);
    }

    rule_add_panel.reset_edit_box();
    rule_add_panel.slide_up_add_panel_body();
    rule_add_panel.switch_to_adding_status();

    if (panel_config.is_modal) {
        if (panel_config.border_transparent) {
            rule_add_panel.HideForBorder();
        }
        else {
            rule_add_panel.hide();
        }
    }

    var ass_list_panel = rule_add_panel.panel_config.ass_list_panel;
    if (ass_list_panel !== undefined && ass_list_panel !== null && rule_add_panel.panel_config.cancel_refresh === undefined) {
        ass_list_panel.reset_selected_item();
        ass_list_panel.update_info();
    }

    /* 调用可能的外接函数 */
    if (event_handler !== null && event_handler.after_cancel_edit !== undefined) {
        event_handler.after_cancel_edit(rule_add_panel);
    }

    if ($(".userTipRight")) {
        $(".userTipRight").remove();
    }
    if ($(".userTipError")) {
        $(".userTipError").remove();
    }

}

RuleAddPanel.prototype.reset_edit_box = function() {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;

    var form_selector = "#" + panel_control.panel_body_form_id;
    var item_id_selector = "#" + panel_control.panel_item_id;

    $(form_selector)[0].reset();
    $(item_id_selector).val("");

}

RuleAddPanel.prototype.request_for_json = function(sending_data, ondatareceived) {
    var rule_add_panel = this;
    var panel_config = rule_add_panel.panel_config;
    var url = panel_config.url;
    $.ajax({
        type: 'POST',
        url: url,
        data: sending_data,
        dataType: 'json',
        async: false,
        error: function(request) {
            rule_add_panel.show_error_mesg("返回数据格式有误,请检查");
        },
        success: ondatareceived
    });
}

RuleAddPanel.prototype.is_operation_succeed = function(data) {
    if (data.status == "0") {
        return true;
    } else {
        return false;
    }
}

RuleAddPanel.prototype.show_note_mesg = function(mesg) {
    var rule_add_panel = this;
    var message_manager = rule_add_panel.panel_config.ass_message_manager;

    if (message_manager !== undefined && message_manager !== null) {
        message_manager.show_note_mesg(mesg);
    } else {
        alert(mesg);
    }
}

RuleAddPanel.prototype.show_warn_mesg = function(mesg) {
    var rule_add_panel = this;
    var message_manager = rule_add_panel.panel_config.ass_message_manager;

    if (message_manager !== undefined && message_manager !== null) {
        message_manager.show_popup_error_mesg(mesg);
    } else {
        alert(mesg);
    }
}

RuleAddPanel.prototype.show_error_mesg = function(mesg) {
    var rule_add_panel = this;
    var message_manager = rule_add_panel.panel_config.ass_message_manager;

    if (message_manager !== undefined && message_manager !== null) {
        message_manager.show_popup_error_mesg(mesg);
    } else {
        alert(mesg);
    }
}

RuleAddPanel.prototype.show = function() {
    var rule_add_panel = this;
    var panel_config = rule_add_panel.panel_config;
    var panel_control = rule_add_panel.panel_control;
    var panel_id = panel_control.panel_id;
    var panel_name = panel_config.panel_name;

    var TB_id = 'TransparentBorder_' + panel_name;
    var box_cover_id = 'popup-mesg-border-box-cover-' + panel_name;
    var box_cover_id_for_jquery = '#' + box_cover_id;
    var check_in_selector = "#" + panel_config.check_in_id;

    $(check_in_selector).show();
	if(panel_config.is_modal){
		setTimeout(function() {
			document.getElementById(box_cover_id).setAttribute('class','open-dialog__overlay');
		},0);

		// document.getElementById(box_cover_id).style.display = '';
		// document.getElementById(box_cover_id).setAttribute('class','open-dialog__overlay');
		

		if (panel_config.border_transparent) {

			if(panel_config.modal_config !== undefined) {
				var modal_config = panel_config.modal_config;
				var close_class_name = 'close_TransparentBorder_' + modal_config.modal_box_size;
				var open_class_name = 'open_TransparentBorder_' + modal_config.modal_box_size;
				document.getElementById(TB_id).setAttribute('class',open_class_name);
			
    			var boder_height = document.getElementById(panel_id).offsetHeight;
    			// var boder_width = document.getElementById(panel_id).offsetWidth;
    			document.getElementById(TB_id).style.height = boder_height + 'px';
    			// document.getElementById('TransparentBorder').style.width = boder_width + 'px';

    			var cover_height = parseInt(document.getElementById(box_cover_id).offsetHeight);
    			var cover_width = parseInt(document.getElementById(box_cover_id).offsetWidth);

    			var border_height = parseInt(document.getElementById(TB_id).offsetHeight);
    			var border_width = parseInt(document.getElementById(TB_id).offsetWidth);

    			var temp_top = (cover_height - border_height) / 2 - 78;
    			var temp_left = (cover_width - border_width) / 2;

    			document.getElementById(TB_id).style.top = temp_top + 'px';
    			document.getElementById(TB_id).style.left = temp_left + 'px';


    			$(box_cover_id_for_jquery).on('click', function() {
    				// document.getElementById(box_cover_id).setAttribute('class','dialog__overlay');
    				// document.getElementById(TB_id).setAttribute('class',close_class_name);
    				// setTimeout(function(){
    				// 	$(check_in_selector).hide();
    				// },300);
                    rule_add_panel.cancel_edit_box();
    			})

    			$(window).resize(function() {
    				if ($(check_in_selector).css("display") == 'block') {
    					var cover_height = parseInt(document.getElementById(box_cover_id).offsetHeight);
    					var cover_width = parseInt(document.getElementById(box_cover_id).offsetWidth);

    					var border_height = parseInt(document.getElementById(TB_id).offsetHeight);
    					var border_width = parseInt(document.getElementById(TB_id).offsetWidth);

    					var temp_top = (cover_height - border_height) / 2 - 78;
    					var temp_left = (cover_width - border_width) / 2;

    					document.getElementById(TB_id).style.top = temp_top + 'px';
    					document.getElementById(TB_id).style.marginTop = 0 + 'px';
    					document.getElementById(TB_id).style.left = temp_left + 'px';
    					document.getElementById(TB_id).style.marginLeft = 0 + 'px';

                        var boder_height = document.getElementById(panel_id).offsetHeight;
                        var boder_width = document.getElementById(panel_id).offsetWidth;
                        document.getElementById(TB_id).style.height = boder_height + 'px';
                        document.getElementById(TB_id).style.width = boder_width + 'px';
    				}

    			})
            }
		}
	}
    
	
}

RuleAddPanel.prototype.hide = function() {
    var rule_add_panel = this;
    var panel_config = rule_add_panel.panel_config;

    var check_in_selector = "#" + panel_config.check_in_id;
    $(check_in_selector).hide();
}

RuleAddPanel.prototype.HideForBorder = function() {
    var rule_add_panel = this;
    var panel_config = rule_add_panel.panel_config;
    var panel_control = rule_add_panel.panel_control;
    var panel_id = panel_control.panel_id;
    var panel_name = panel_config.panel_name;


    var TB_id = 'TransparentBorder_' + panel_name;
    var box_cover_id = 'popup-mesg-border-box-cover-' + panel_name;
    var box_cover_id_for_jquery = '#' + box_cover_id;
    var check_in_selector = "#" + panel_config.check_in_id;

    if(panel_config.modal_config !== undefined){
        $('.popup-check,.popup-tip').hide();
        $('.popup-img-class').attr('src', '/images/linkna.png');
        $('.popup-error-tip').remove();
        var modal_config = panel_config.modal_config;
        var close_class_name = 'close_TransparentBorder_' + modal_config.modal_box_size;
        var open_class_name = 'open_TransparentBorder_' + modal_config.modal_box_size;
        if (panel_config.border_transparent) {
            document.getElementById(TB_id).setAttribute('class',close_class_name);
            document.getElementById(box_cover_id).setAttribute('class','dialog__overlay');
            setTimeout(function(){
                $(check_in_selector).hide();
            },300);
        }
        else {
            $(check_in_selector).hide();
        }
    }
    else {
        $(check_in_selector).hide();
    }
}

RuleAddPanel.prototype.display_add_panel = function() {
    var rule_add_panel = this;
    var panel_config = rule_add_panel.panel_config;
    var panel_control = rule_add_panel.panel_control;
    var add_panel = "";

    add_panel += '<div id="' + panel_control.panel_id + '" class="add-panel">';
    add_panel += rule_add_panel.create_panel_header();
    add_panel += rule_add_panel.create_panel_body();

    add_panel += '</div>';

    if (panel_config.is_modal) {
        add_panel = rule_add_panel.get_modaled_panel(add_panel);
    }
    add_panel += rule_add_panel.create_popup_body();
    var check_in_selector = "#" + panel_config.check_in_id;
    $(check_in_selector).empty().html(add_panel);
}
RuleAddPanel.prototype.create_popup_body = function(add_panel) {
    var rule_add_panel = this;

    var panel_config = rule_add_panel.panel_config;
    var panel_control = rule_add_panel.panel_control;

    var panel_popup = '<div ';
    var panel_popup_id = panel_control.panel_popup_id;
    panel_popup += 'id="' + panel_popup_id +'">';

    var popup_obj = rule_add_panel.get_input_check_obj('popup');
    var popup_item = '';
    for(var item in popup_obj){
        popup_item += '<div onclick="$(this).hide();"';
        var attr_obj = {
            id : 'popup_item_id_for_' + popup_obj[item].name,
            class : 'popup-tip'
        }
        popup_item += rule_add_panel.add_attr_to_item(attr_obj);
        popup_item += '><ul class="cont" >';
        var popup_item_detail ='';
        if (popup_obj[item].check || popup_obj[item].popup_cont != false) {
            popup_item_detail = rule_add_panel.create_popup_item_detail(popup_obj[item]);
        }
        popup_item += popup_item_detail ;
        popup_item += '</ul><b class="out" ></b><b class="in" ></b></div>';
    }
    panel_popup += popup_item + '</div>';
    return panel_popup;
}
RuleAddPanel.prototype.create_popup_item_detail = function(popup_obj) {
    var rule_add_panel = this;

    var popup_item_detail ='';

    var cont = popup_obj.popup_cont ;
    var is_check = popup_obj.check ;
    if (typeof(cont) == 'string') {
        popup_item_detail += '<li><span class="tip-title">提示信息:</span>'+cont+'</li>';
    }else{
        for (var i = 0; i < cont.length; i++) {
            cont[i] = cont[i].replace(/\}\}/g, '</font>');
            cont[i] = cont[i].replace(/\{r\{/g, '<font style="color:green;">');
            cont[i] = cont[i].replace(/\{g\{/g, '<font style="color:green;">');
            if (i==0) {
                popup_item_detail += '<li class="popup-cont"><span class="tip-title">提示信息:</span>' + cont[i] + '</li>';
            }else{
                popup_item_detail += '<li class="popup-cont"><span class="tip-title"></span>' + cont[i] + '</li>';
            }
        }
        if (is_check) {
            popup_item_detail += '<li ';
            var check_attr_obj = {
                id : 'error_item_id_for_' + popup_obj.name,
                class : 'popup-check'
            }
            popup_item_detail += rule_add_panel.add_attr_to_item(check_attr_obj);
            popup_item_detail += '><span class="error-title">错误信息: </span><span class="error-info"></span></li>';
        }
    }

    return popup_item_detail;
}
RuleAddPanel.prototype.add_attr_to_item = function(attr_obj) {
    var item_str ='';
    for(var attr in attr_obj){
        item_str += attr+'='+attr_obj[attr]+ ' ';
    }
    return item_str ;
}
RuleAddPanel.prototype.get_modaled_panel = function(add_panel) {
    var rule_add_panel = this;
    var panel_config = rule_add_panel.panel_config;
    var panel_control = rule_add_panel.panel_control;
    var panel_id = panel_control.panel_id;
    var panel_name = panel_config.panel_name;

    if (panel_config.is_modal) {
        if (panel_config.border_transparent) {

            if (panel_config.modal_config !== undefined) {
                var modal_config = panel_config.modal_config;
                var modal_cover = '<div id="popup-mesg-border-box-cover-' + panel_name + '"' + 'class="dialog__overlay" style="display:block;"';
                var modal_body = '<div id="TransparentBorder_' + panel_name + '"class="TransparentBorder-' + modal_config.modal_box_size + '"><div id="modal_border_box_' + panel_name + '"';
                var modal_cover_class = 'popup-mesg-box-cover';
                var modal_body_class = 'popup-mesg-border-box-body';
                var modal_cover_style = '';
                var modal_body_style = '';

                if (modal_config.modal_box_size !== undefined) {
                    modal_body_class += ' ' + "mesg-border-box-" + modal_config.modal_box_size;
                }
                if (modal_config.modal_level !== undefined) {
                    var level = modal_config.modal_level * 10;
                    modal_cover_style = 'z-index: ' + (level - 1) + '; ';
                    modal_body_style = 'z-index: ' + level + '; ';
                }
                if (modal_config.modal_box_position !== undefined) {
                    modal_body_style += 'position: ' + modal_config.modal_box_position + '; ';
                }
            }

            modal_cover += 'class="' + modal_cover_class + '" ';
            modal_cover += 'style="' + modal_cover_style + '" ';
            modal_cover += '></div>';
            modal_body += 'class="' + modal_body_class + '" ';
            modal_body += 'style="' + modal_body_style + '" ';;
            modal_body += '>' + add_panel + '</div></div>';

        } else {
            var modal_cover = '<div ';
            var modal_body = '<div ';
            var modal_cover_class = 'popup-mesg-box-cover';
            var modal_body_class = 'popup-mesg-box-body';
            var modal_cover_style = '';
            var modal_body_style = '';

            if (panel_config.modal_config !== undefined) {
                var modal_config = panel_config.modal_config;
                if (modal_config.modal_box_size !== undefined) {
                    modal_body_class += ' ' + "mesg-box-" + modal_config.modal_box_size;
                }
                if (modal_config.modal_level !== undefined) {
                    var level = modal_config.modal_level * 10;
                    modal_cover_style = 'z-index: ' + (level - 1) + '; ';
                    modal_body_style = 'z-index: ' + level + '; ';
                }
                if (modal_config.modal_box_position !== undefined) {
                    modal_body_style += 'position: ' + modal_config.modal_box_position + '; ';
                }
            }

            modal_cover += 'class="' + modal_cover_class + '" ';
            modal_cover += 'style="' + modal_cover_style + '" ';
            modal_cover += '></div>';
            modal_body += 'class="' + modal_body_class + '" ';
            modal_body += 'style="' + modal_body_style + '" ';;
            modal_body += '>' + add_panel + '</div>';
        }
        add_panel = modal_cover + modal_body;
    }
    
    return add_panel;
}

RuleAddPanel.prototype.create_panel_header = function() {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var panel_config = rule_add_panel.panel_config;
    var adding_rule_title = panel_config.rule_title_adding_prefix + panel_config.rule_title;
    var adding_icon = '/images/' + panel_config.rule_title_adding_icon;

    var panel_title = "";
    panel_title += '<div id="' + panel_control.panel_header_id + '" class="add-panel-header">' +
        '<div id="' + panel_control.panel_title_id + '" class="add-panel-title">';
    if (panel_config.is_rule_title_icon) {
        panel_title += '<img id="' + panel_control.panel_title_img_id + '" src="' + adding_icon + '"/>';
    }
    panel_title += '<span id="' + panel_control.panel_title_text_id + '" class="add-panel-title-text">' + adding_rule_title + '</span>' +
        '</div>';
    if (panel_config.is_panel_closable) {
        panel_title += '<span id="' + panel_control.panel_close_id + '" class="add-panel-close-button"></span>'
    }
    panel_title += '</div>';

    return panel_title;
}

RuleAddPanel.prototype.create_panel_body = function() {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var panel_config = rule_add_panel.panel_config;
    var items_list = panel_config.items_list;

    var panel_body = "";

    var panel_class = "";
    if (panel_config.is_panel_stretchable) {
        panel_class = "add-panel-content hidden";
    } else {
        panel_class = "add-panel-content";
    }
    panel_body += '<div id="' + panel_control.panel_body_id + '" class="' + panel_class + '">' +
        '<form id="' + panel_control.panel_body_form_id + '" name="' + panel_control.panel_body_form_name +
        '" action="' + rule_add_panel.panel_config.url + '" enctype="multipart/form-data" method="POST" onsubmit="return false;">';
    panel_body += '<table></table>'; //解决chromeform下第一个div漂移问题
    var container_class = 'container-main-body';
    if (panel_config.modal_config !== undefined) {
        var modal_config = panel_config.modal_config;
        if (modal_config.modal_box_size !== undefined) {
            container_class += ' ' + "container-main-body-" + modal_config.modal_box_size;
        }
    }
    panel_body += '<div class="' + container_class + '">' +
        '<input type="hidden" id="' + panel_control.panel_item_id + '" name="id" />' +
        '<table>' +
        '<tbody>';
    for (var i = 0; i < items_list.length; i++) {
        var items_list_item = items_list[i];

        var bgcolor = "add-panel-even-line";
        if (i % 2 == 0) {
            bgcolor = "add-panel-odd-line"
        }
        items_list_item.class_default_value = bgcolor;

        panel_body += rule_add_panel.create_add_panel_line(items_list_item);
    }

    panel_body += '</tbody>' +
        '</table>' +
        '</div>';
    panel_body += rule_add_panel.create_panel_footer();
    panel_body += '</form>' +
        '</div>';

    return panel_body;
}

RuleAddPanel.prototype.create_add_panel_line = function(item) {
    var rule_add_panel = this;
    var form_line = "";

    if (item === undefined || item.enable === false) {
        return form_line;
    }

    form_line += '<tr ';

    form_line += rule_add_panel.create_widget_standard_attr(item);

    form_line += '>';


    var star = '' ;
    if (/\*/g.test(item.title)) {
        item.title = item.title.replace(/\*/,'');
        star = '<font class="required-star">*</font>' ;
    }
    if (item.sub_items[0].check) {
        var item_check = item.sub_items[0].check.required;
        if (item_check == 1) {
            star = '<font class="required-star">*</font>' ;
        }
    }
    if (/描述|备注/g.test(item.title) && star != '') {
        console.log('描述或备注为必填，请修改！');
    }
    form_line += '<td class="add-panel-subtitle">' + item.title+ star + '</td>' +
        '<td class="add-panel-section">';
    form_line += rule_add_panel.create_form_items(item.sub_items);
    form_line += '</td>' +
        '</tr>';

    return form_line;
}

RuleAddPanel.prototype.create_form_items = function(items) {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var form_items = "";

    if (items === undefined) {
        return form_items;
    }

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        if (item.enable === undefined || !item.enable) {
            continue;
        }

        form_items += '<div ';

        /* 添加默认样式 */
        item.item_class_default_value = panel_control.form_item_class;

        form_items += rule_add_panel.create_widget_item_standard_attr(item);

        form_items += '>';
        if (item.type !== undefined && (item.type == "text" || item.type == "password" || item.type == "button" || item.type == "file")) {
            /* 单行文本输入框 */
            form_items += rule_add_panel.create_input_widget(item);
        } else if (item.type !== undefined && item.type == "textarea") {
            /* 多行行文本输入框 */
            form_items += rule_add_panel.create_textarea_widget(item);
        } else if (item.type !== undefined && item.type == "select") {
            /* 单多选select */
            form_items += rule_add_panel.create_select_widget(item);
        } else if (item.type !== undefined && (item.type == "checkbox" || item.type == "radio")) {
            /* 单多选按钮组 */
            form_items += rule_add_panel.create_choice_widget(item);
        } else if (item.type !== undefined && item.type == "label") {
            /* 只有文字提示 */
            form_items += rule_add_panel.create_label_widget(item);
        } else if (item.type !== undefined && item.type == "items_group") {
            /* 一组组件 */
            form_items += rule_add_panel.create_items_group_widget(item);
        } else {
            item.type = "text";
            form_items += rule_add_panel.create_input_widget(item);
        }
        form_items += rule_add_panel.create_widget_popup_img(item);

        form_items += '</div>';
    }

    return form_items;
}

RuleAddPanel.prototype.create_input_widget = function(item) {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var text_widget = "";

    if (item === undefined) {
        return text_widget; /*如果没有定义相应的对象，直接返回*/
    }

    /* 添加默认样式类名 */
    item.class_default_value = panel_control.form_text_class;
    if (item.type == "button") {
        item.class_default_value = panel_control.form_button_class;
    }
    /* 添加前导label */
    text_widget += rule_add_panel.create_widget_prefix_label(item);
    /* 创建元素-BEGIN */
    text_widget += '<input type="' + item.type + '"';
    /* 添加标准属性 */
    text_widget += rule_add_panel.create_widget_standard_attr(item);
    /* 创建元素-END */
    text_widget += '/>';
    /* 添加后缀提示 */
    text_widget += rule_add_panel.create_widget_postfix_tip(item);

    return text_widget;
}

RuleAddPanel.prototype.create_textarea_widget = function(item) {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var textarea_widget = "";

    if (item === undefined) {
        return textarea_widget; /*如果没有定义相应的对象，直接返回*/
    }

    /* 添加默认样式类名 */
    item.class_default_value = panel_control.form_textarea_class;
    /* 添加前导label */
    textarea_widget += rule_add_panel.create_widget_prefix_label(item);
    /* 创建元素-BEGIN */
    textarea_widget += '<textarea ';
    /* 添加标准属性 */
    textarea_widget += rule_add_panel.create_widget_standard_attr(item);
    /* 创建元素-END */
    textarea_widget += '>';
    if (item.value !== undefined) {
        textarea_widget += item.value;
    }
    textarea_widget += '</textarea>';
    /* 添加后缀提示 */
    textarea_widget += rule_add_panel.create_widget_postfix_tip(item);

    return textarea_widget;
}

RuleAddPanel.prototype.create_select_widget = function(item) {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;

    var select_widget = "";

    if (item === undefined) {
        return select_widget; /*如果没有定义相应的对象，直接返回*/
    }

    /* 添加默认样式类名 */
    if (item.multiple !== undefined && item.multiple) {
        item.class_default_value = panel_control.form_m_select_class;
    } else {
        item.class_default_value = panel_control.form_select_class;
    }
    /* 添加前导label */
    select_widget += rule_add_panel.create_widget_prefix_label(item);
    /* 创建元素-BEGIN */
    select_widget += '<select ';
    /* 添加标准属性 */
    select_widget += rule_add_panel.create_widget_standard_attr(item);
    /* 添加选项 */
    select_widget += '>';
    if (item.options !== undefined && item.options) {
        for (var j = 0; j < item.options.length; j++) {
            var option = item.options[j];
            /* 创建元素-BEGIN */
            select_widget += '<option ';
            /* 添加标准属性 */
            select_widget += rule_add_panel.create_widget_standard_attr(option);
            select_widget += '>';
            /* 添加选项提示 */
            if (option.text !== undefined && option.text) {
                select_widget += option.text;
            }
            /* 创建元素-END */
            select_widget += '</option>';
        }
    }
    /* 创建元素-END */
    select_widget += '</select>';
    /* 添加后缀提示 */
    select_widget += rule_add_panel.create_widget_postfix_tip(item);

    return select_widget;
}

RuleAddPanel.prototype.create_choice_widget = function(item) {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var choice_widget = "";

    if (item === undefined) {
        return choice_widget; /*如果没有定义相应的对象，直接返回*/
    }

    /* 添加默认样式类名 */
    item.class_default_value = panel_control.form_choice_class;
    /* 添加前导提示 */
    choice_widget += rule_add_panel.create_widget_prefix_tip(item);
    /* 创建元素-BEGIN */
    choice_widget += '<input type="' + item.type + '"';
    /* 添加标准属性 */
    choice_widget += rule_add_panel.create_widget_standard_attr(item);
    /* 创建元素-END */
    choice_widget += '/>';
    /* 添加后缀label */
    choice_widget += rule_add_panel.create_widget_postfix_label(item);

    return choice_widget;
}

RuleAddPanel.prototype.create_label_widget = function(item) {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var label_widget = "";

    if (item === undefined) {
        return label_widget; /*如果没有定义相应的对象，直接返回*/
    }

    /* 添加默认样式类名 */
    item.class_default_value = panel_control.form_label_class;
    /* 添加前导label */
    label_widget += rule_add_panel.create_widget_prefix_label(item);
    /* 创建元素-BEGIN */
    label_widget += '<span ';
    /* 添加标准属性 */
    label_widget += rule_add_panel.create_widget_standard_attr(item);
    /* 创建元素-END */
    label_widget += '>';
    if (item.value !== undefined && item.value) {
        label_widget += item.value;
    }
    label_widget += '</span>';
    /* 添加后缀提示 */
    label_widget += rule_add_panel.create_widget_postfix_tip(item);

    return label_widget;
}

RuleAddPanel.prototype.create_items_group_widget = function(item) {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var items_group_widget = "";

    if (item === undefined) {
        return items_group_widget; /*如果没有定义相应的对象，直接返回*/
    }

    /* 添加默认样式类名 */
    item.class_default_value = panel_control.form_item_class;
    /* 添加前导label */
    items_group_widget += rule_add_panel.create_widget_prefix_label(item);
    /* 创建元素-BEGIN */
    items_group_widget += '<div ';
    /* 添加标准属性 */
    items_group_widget += rule_add_panel.create_widget_standard_attr(item);
    /* 创建元素-END */
    items_group_widget += '>';
    items_group_widget += rule_add_panel.create_form_items(item.sub_items);
    items_group_widget += '</div>';
    /* 添加后缀提示 */
    items_group_widget += rule_add_panel.create_widget_postfix_tip(item);

    return items_group_widget;
}

RuleAddPanel.prototype.create_panel_footer = function() {
    var rule_add_panel = this;
    var panel_control = rule_add_panel.panel_control;
    var panel_config = rule_add_panel.panel_config;
    var footer_buttons = panel_config.footer_buttons;

    var add_button_id = panel_control.panel_add_button_id;
    var cancel_button_id = panel_control.panel_cancel_button_id;
    var import_button_id = panel_control.panel_import_button_id;

    var button_adding_text = panel_config.button_adding_text;
    var button_cancel_text = panel_config.button_cancel_text;
    var button_import_text = panel_config.button_import_text;

    var panel_footer = "";
    panel_footer += '<div class="add-panel-footer">';

    if (footer_buttons.add !== undefined && footer_buttons.add) {
        panel_footer += '<input type="button" id="' + add_button_id + '" class="' + panel_control.form_button_class + '" value="' + button_adding_text + '"/>';
    }

    if (footer_buttons.import !== undefined && footer_buttons.import) {
        panel_footer += '<input type="button" id="' + import_button_id + '" class="' + panel_control.form_button_class + '" value="' + button_import_text + '"/>';
        panel_footer += '<input type="hidden" name="ACTION"  value="import_data"/>';
        panel_footer += '<input type="hidden" name="panel_name"  value="' + panel_config.panel_name + '"/>';
    }

    if (footer_buttons.cancel !== undefined && footer_buttons.cancel) {
        panel_footer += '<input type="button" id="' + cancel_button_id + '" class="' + panel_control.form_button_class + '" value="' + button_cancel_text + '"/>';
    }

    if (footer_buttons.sub_items !== undefined) {
        var items = footer_buttons.sub_items;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            if (item.enable === undefined || !item.enable) {
                continue;
            }

            panel_footer += rule_add_panel.create_input_widget(item);
        }
    }

    // panel_footer +=     '<span class="add-panel-tips-text">* 表示必填项</span>';
    panel_footer += '</div>';

    return panel_footer;
}

RuleAddPanel.prototype.create_widget_label = function(item) {
    var rule_add_panel = this;
    var widget_label = "";

    widget_label += '<label ';
    if (item.id !== undefined && item.id) {
        widget_label += 'for="' + item.id + '" ';
    }
    widget_label += rule_add_panel.create_widget_label_standard_attr(item);
    widget_label += '>';
    widget_label += item.label;
    widget_label += '</label>';

    return widget_label;
}

RuleAddPanel.prototype.create_widget_prefix_label = function(item) {
    var rule_add_panel = this;
    var widget_label = "";

    if (item.label !== undefined && item.label) {
        item.label_class_default_value = 'add-panel-prefix-label';
        widget_label = rule_add_panel.create_widget_label(item);
    }

    return widget_label;
}

RuleAddPanel.prototype.create_widget_postfix_label = function(item) {
    var rule_add_panel = this;
    var widget_label = "";

    if (item.label !== undefined && item.label) {
        item.label_class_default_value = 'add-panel-postfix-label';
        widget_label = rule_add_panel.create_widget_label(item);
    }

    return widget_label;
}
RuleAddPanel.prototype.create_widget_popup_img = function(item) {
    var rule_add_panel = this;
    var widget_popup = "";

    if (item.popup !== undefined && item.popup) {
        widget_popup += '<img src="/images/linkna.png" alt="帮助" class="popup-img-class" ';
        item.tip_click_tip_img_id = 'popup_img_for_' + item.name;
        widget_popup += 'id="' + item.tip_click_tip_img_id + '"';

        widget_popup += '>';
    }

    return widget_popup;
}


RuleAddPanel.prototype.create_widget_tip = function(item) {
    var rule_add_panel = this;
    var widget_tip = "";

    widget_tip += '<span ';
    item.tip_class_default_value = 'add-panel-prefix-tip';
    widget_tip += rule_add_panel.create_widget_tip_standard_attr(item);
    widget_tip += '>';
    widget_tip += item.tip;
    widget_tip += '</span>';

    return widget_tip;
}

RuleAddPanel.prototype.create_widget_prefix_tip = function(item) {
    var rule_add_panel = this;
    var widget_tip = "";

    if (item.tip !== undefined && item.tip) {
        item.label_class_default_value = 'add-panel-prefix-tip';
        widget_tip = rule_add_panel.create_widget_tip(item);
    }

    return widget_tip;
}

RuleAddPanel.prototype.create_widget_postfix_tip = function(item) {
    var rule_add_panel = this;
    var widget_tip = "";

    if (item.tip !== undefined && item.tip) {
        item.label_class_default_value = 'add-panel-postfix-tip';
        widget_tip = rule_add_panel.create_widget_tip(item);
    }

    return widget_tip;
}

RuleAddPanel.prototype.create_standard_attr = function(item, type) {
    var rule_add_panel = this;
    var panel_config = rule_add_panel.panel_config;

    var widget_standard_attr = panel_config.widget_standard_attr;

    if (type == "widget_label") {
        widget_standard_attr = panel_config.widget_label_standard_attr;
    } else if (type == "widget_tip") {
        widget_standard_attr = panel_config.widget_tip_standard_attr;
    } else if (type == "widget_item") {
        widget_standard_attr = panel_config.widget_item_standard_attr;
    }

    var widget_attr = "";

    for (var attr_name in widget_standard_attr) {
        if (attr_name in item) {
            widget_attr += widget_standard_attr[attr_name].render(attr_name, item[attr_name], item);
        } else {
            widget_attr += widget_standard_attr[attr_name].render(attr_name, false, item); //false代表外界没有传入相应值
        }
    }

    return widget_attr;
}

RuleAddPanel.prototype.create_widget_standard_attr = function(item) {
    var rule_add_panel = this;

    return rule_add_panel.create_standard_attr(item, "widget")
}

RuleAddPanel.prototype.create_widget_label_standard_attr = function(item) {
    var rule_add_panel = this;

    return rule_add_panel.create_standard_attr(item, "widget_label")
}

RuleAddPanel.prototype.create_widget_tip_standard_attr = function(item) {
    var rule_add_panel = this;

    return rule_add_panel.create_standard_attr(item, "widget_tip")
}

RuleAddPanel.prototype.create_widget_item_standard_attr = function(item) {
    var rule_add_panel = this;

    return rule_add_panel.create_standard_attr(item, "widget_item")
}