/*
 * 描述: 测试添加模板和列表模板类
 *
 * 作者: WangLin，245105947@qq.com
 * 历史：
 *       2012.09.23 WangLin创建
 */

$( document ).ready(function() {
    /* 渲染面板 */
    load_init_data();
    message_manager.render();
    list_query_template.render();
    logs_event_details.render();

    logs_event_details.hide();

    list_query_template.set_ass_message_manager( message_manager );

    init_template_tab();

    list_query_template.update_info( true );

});

Ext.onReady(function() {
    // Ext.QuickTips.init();
});

/*
 * 第一步，定义全局变量
 */
Ext.require([
    'Ext.form.*',
    'Ext.window.Window'
]);
var ass_url = "/cgi-bin/logs_history_events.cgi";

var message_box_config = {
    url: ass_url,
    check_in_id: "my_message_box",
    panel_name: "my_message_box",
    self_class:"logs_history_mesg_box-class"
}

/* 公共提示文字 */
var blank_text = "此字段不能为空";
var min_length_text = "此字段长度至少为{0}";
var max_length_text = "此字段长度最大为{0}";
var tab_content_padding = "40";

var list_template_render = {
    action: {
        render: function( default_rendered_text, data_item ) {
            var query_button = {
                enable: true,
                id: "query_events",
                name: "query_events",
                button_icon: "search16x16.png",
                button_text: "查询",
                value: data_item.id,
                functions: {
                    onclick: "query_events(this);"
                }
            }
            return PagingHolder.create_action_buttons( [query_button] ) + default_rendered_text;
        }
    }
}

var list_template_config = {
    url: ass_url,
    check_in_id: "list_query_template",
    panel_name: "list_query_template",
    render: list_template_render,
    event_handler: {
        before_load_data: function( list_obj ) {
        },
        after_load_data: function ( list_obj, response ) {
        }
    },
    is_default_search: false,
    actions: {
        edit_item: function( data_item, on_finished ) {
            /* 开始书写自己的代码 */
            show_add_template( data_item );
            /* 处理完成后**必须**调用执行 */
            // on_finished();
        }
    },
    panel_header: [{
        enable: true,
        type: "checkbox",
        name: "checkbox",
        width: "5%"
    }, {
        enable: true,
        type: "text",
        title: "模板名称",
        name: "template_name",
        width: "25%"
    }, {
        enable: true,
        type: "text",
        title: "模板说明",
        name: "template_note",
        width: "60%"
    }, {
        enable: true,
        type: "action",
        name: "action",
        td_class: "align-center",
        width: "10%"
    }],
    top_widgets: [{
        enable: true,
        type: "image_button",
        button_icon: "add16x16.png",
        button_text: "新增模板",
        functions: {
            onclick: "show_add_template();"
        }
    }, {
        enable: true,
        type: "image_button",
        button_icon: "delete.png",
        button_text: "删除选中",
        functions: {
            onclick: "delete_selected_items(this);"
        }
    }]
};

var list_history_events_render = {
    event_name: {
        render: function( default_rendered_text, data_item ) {
            var rendered_text = default_rendered_text;

            if ( !default_rendered_text ) {
                return "";
            }

            if ( default_rendered_text.split( "" ).length > 15 ) {
                rendered_text = '<span class="" title="' + default_rendered_text + '">' + 
                                default_rendered_text.substring( 0, 15 ) + '...</span>';
            }

            return rendered_text;
        }
    },
    chinese_classification: {
        render: function( default_rendered_text, data_item ) {
            var level = "";
            if( data_item.priority == "高" || data_item.priority == "1" ) {
                level = "h-level";
            } else if ( data_item.priority == "中" || data_item.priority == "2" ) {
                level = "m-level";
            }
            else if ( data_item.priority == "低" || data_item.priority == "3" ) {
                level = "l-level";
            }

            return '<span class="classification-text ' + level + '" onclick="show_suggestion(\'' + data_item.sid+ '\')">' + default_rendered_text + '<img src="/images/suggestion.png" class="suggestion-img" alt="点击查看建议" title="点击查看建议"/></span>';
           
        }
    },
    priority: {
        render: function( default_rendered_text, data_item ) {
            var rendered_text = default_rendered_text;

            if ( default_rendered_text == 1 ) {
                rendered_text = '<span class="h-level">高</span>';
            } else if ( default_rendered_text == 2 ) {
                rendered_text = '<span class="m-level">中</span>';
            } else if ( default_rendered_text == 3 ) {
                rendered_text = '<span class="l-level">低</span>';
            } else if ( default_rendered_text == 4 ) {
                rendered_text = '<span class="l-level">信息</span>';
            } else {
                rendered_text = "未知";
            }

            return rendered_text;
        }
    },
    // time_start: {
    //     render: function( default_rendered_text, data_item ) {
    //         var day_time_regx = /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/;
    //         var date_start  = data_item.time_start;
    //         var date_end    = data_item.time_end;
    //         var time_start  = data_item.time_start;
    //         var time_end    = data_item.time_end;
    //         if ( data_item.time_start.match( day_time_regx) ) {
    //             date_start = RegExp.$1;
    //             time_start = RegExp.$2;
    //         }
    //         if ( data_item.time_end.match( day_time_regx) ) {
    //             date_end = RegExp.$1;
    //             time_end = RegExp.$2;
    //         }
    //         if( data_item.merge_type == 1 || data_item.merge_type == 2 || data_item.merge_type == 3 ) {
    //             // 进行时间提取
    //             if ( date_end == date_start ) {
    //                 return date_start + " " + time_start + " - " + time_end;
    //             } else {
    //                 return data_item.time_start + " - " + data_item.time_end;
    //             }
    //         } else {
    //             return data_item.time_start;
    //         }
    //     }
    // },
    sip: {
        render: function( default_rendered_text, data_item ) {
            var rendered_text = default_rendered_text;

            if ( data_item.merge_type == 1 ) {
                var merged_count =  '<span class="merged_count" onclick="show_ip_details(\'' + data_item.merge_eid + '\',\''+data_item.sid+'\')">(' + data_item.merge_count +
                                    ')</span>';
                rendered_text = '<span class="dip-merged" title="' + default_rendered_text +data_item.merge_eid+ data_item.sid+data_item.merge_count+ '">已合并 ' + merged_count +  '</span>';
                // rendered_text = '<span class="sip-merged" onclick="show_ip_details(\'' + data_item.merge_eid + '\',\''+data_item.sid+'\')">已合并</span>';
            }
            else if(data_item.merge_type == 3 ){
                var merged_count =  '<span class="merged_count" onclick="show_ip_details(\'' + data_item.merge_eid + '\',\''+data_item.sid+'\')">(' + data_item.merge_count +
                                    ')</span>';
                rendered_text = '<span class="dip-merged" title="' + default_rendered_text+ '">已合并 ' + merged_count +  '</span>';
            }
             else {
                if ( data_item.sport > 0 ) {
                    if(data_item.src_user == ""){
                         rendered_text = '<span class="sip" title="' + default_rendered_text+':'+data_item.sport+ '">' + default_rendered_text + ":"+data_item.sport+ '</span>';
                    }else{
                         rendered_text = '<span class="sip" title="' + default_rendered_text+':'+data_item.sport+'('+ data_item.src_user +')'+ '">' + default_rendered_text  + ":"+data_item.sport +"("+data_item.src_user +")"+ '</span>: ';
                    }
                }
                else if(data_item.sport == 0){
                    if(data_item.src_user !== ""){
                          rendered_text = '<span class="sip" title="' + default_rendered_text+'('+ data_item.src_user +')'+   '">' + default_rendered_text  +"("+data_item.src_user +")" + '</span> ' ;
                    }
            }

            }

            return rendered_text;
        }
    },
    dip: {
        render: function( default_rendered_text, data_item ) {
            //console.log(default_rendered_text);
            var rendered_text = default_rendered_text;

            if ( data_item.merge_type == 2 ) {
                var merged_count =  '<span class="merged_count" onclick="show_ip_details(\'' + data_item.merge_eid + '\',\''+data_item.sid+'\')">(' + data_item.merge_count +
                                    ')</span>';
                rendered_text = '<span class="dip-merged">已合并 ' + merged_count +  '</span>';
                // rendered_text = '<span class="dip-merged" onclick="show_ip_details(\'' + data_item.merge_eid + '\',\''+data_item.sid+'\')">已合并</span>';
            } 
             else if(data_item.merge_type == 3 ){
                var merged_count =  '<span class="merged_count" onclick="show_ip_details(\'' + data_item.merge_eid + '\',\''+data_item.sid+'\')">(' + data_item.merge_count +
                                    ')</span>';
                rendered_text = '<span class="dip-merged">已合并 ' + merged_count +  '</span>';
            }

            else {
                if ( data_item.dport > 0 ) {
                    if(data_item.dst_user == ""){
                         rendered_text = '<span class="dip" title="' + default_rendered_text+':'+data_item.dport+ '">' + default_rendered_text +":"+data_item.dport + '</span> ';
                    }else{
                         rendered_text = '<span class="dip" title="' + default_rendered_text+':'+data_item.dport+'('+ data_item.dst_user +')'+ '">' + default_rendered_text  +":"+ data_item.dport +"("+data_item.dst_user +")" + '</span> ';
                    }
            }
                else if(data_item.dport == 0){
                     if(data_item.dst_user !== ""){
                          rendered_text = '<span class="dip" title="' + default_rendered_text+'('+ data_item.dst_user +')'+   '">' + default_rendered_text   +"("+data_item.dst_user +")" + '</span> ';
                    }
            }
        }

            return rendered_text;
        }
    },
    merge_type: {
        render: function( default_rendered_text, data_item ) {
            var rendered_text = default_rendered_text;

            if ( default_rendered_text == 1 ) { // 按sip合并
                rendered_text = "源IP合并";
            } else if ( default_rendered_text == 2 ) { // 按dip合并
                rendered_text = "目标IP合并";
            } else if ( default_rendered_text == 3 ) { // 按sid、dip合并
                rendered_text = "源、目标IP合并";
            } else {
                rendered_text = "不合并";
            }

            return rendered_text;
        }
    },
    response_type: {
        render: function( default_rendered_text, data_item ) {
            var rendered_text = default_rendered_text;

            if ( default_rendered_text == "log" ) {
                rendered_text = "默认(日志记录)";
            } else {
                rendered_text = "未知";
            }

            return rendered_text;
        }
    },
    r_action: {
        render: function( default_rendered_text, data_item ) {
            var rendered_text = "允许";
            if ( default_rendered_text == "Drop" ) {
                rendered_text = "阻断";
            }
            return rendered_text;
        }
    }
};

var list_history_events_config = {
    url: ass_url,
    check_in_id: "list_history_events",
    panel_name: "list_history_events",
    render: list_history_events_render,
    event_handler: {
        before_load_data: function( list_obj ) {

        },
        after_load_data: function ( list_obj, response ) {
    //         console.log(list_obj);
    //         console.log(list_obj.panel_header);
    //       $("td.text-hidden").map(function() {
    //     if (this.offsetWidth < this.scrollWidth) {
    //         $(this).attr("title", $(this).text());
    //     }else{
    //         $(this).removeAttr('title');
    //     }
    // });
        }
    },
    is_default_search: false,
    is_load_all_data: false,
    panel_header: [{
        enable: false,
        type: "text",
        title: "eid",
        name: "merge_eid",
        column_cls: "align-center",
        width: "5%"
    }, {
        enable: true,
        type: "text",
        title: "发生时间",
        name: "time_start",
        column_cls: "align-center",
        td_class:"align-center",
        width: "15%"
    }, {
        enable: true,
        type: "text",
        title: "入侵事件名称",
        name: "event_name",
        column_cls: "align-center",
        width: "15%"
    }, {
        enable: true,
        type: "text",
        title: "入侵类型",
        column_cls: "align-center",
        name: "chinese_classification",
        td_class:"align-center",
        width: "10%"
    }, {
        enable: true,
        type: "text",
        title: "危险级别",
        column_cls: "align-center",
        name: "priority",
        td_class:"align-center",
        width: "10%"
    }, {
        enable: true,
        type: "text",
        title: "源",
        name: "sip",
        column_cls: "align-center",
        width: "15%"
    }, {
        enable: true,
        type: "text",
        title: "目标",
        name: "dip",
        column_cls: "align-center",
        width: "15%"
    }, {
        enable: true,
        type: "text",
        title: "合并类型",
        name: "merge_type",
        column_cls: "align-center",
        td_class:"align-center",
        width: "10%"
    }, {
        enable: true,
        type: "text",
        title: "处理动作",
        name: "r_action",
        column_cls: "align-center",
        td_class:"align-center",
        width: "10%"
    }],
    top_widgets: [{
        enable: false,
        type: "image_button",
        button_text: "今日全部日志",
        functions: {
            onclick: ""
        }
    }, {
        enable: false,
        type: "image_button",
        id: "download_history_events",
        button_icon: "download.png",
        button_text: "导出"
    }]
};

var logs_event_details_config = {
    url: ass_url,
    check_in_id: "logs_event_details",
    panel_name: "logs_event_details",
    page_size: 10,
    is_modal: true,
    modal_config: {
        modal_box_size: "m",
        modal_level: 10
    },
    is_default_search: false,
    is_load_all_data: true,
    is_panel_closable: true,
    panel_header: [{
        enable: true,
        type: "text",
        title: "发生时间",
        name: "datetime",
        column_cls: "align-center",
        width: "20%"
    }, {
        enable: true,
        type: "text",
        title: "源IP地址",
        name: "sip",
        column_cls: "align-center",
        width: "28%"
    }, {
        enable: true,
        type: "text",
        title: "源端口",
        name: "sport",
        column_cls: "align-center",
        width: "12%"
    }, {
        enable: true,
        type: "text",
        title: "目标IP地址",
        name: "dip",
        column_cls: "align-center",
        width: "28%"
    }, {
        enable: true,
        type: "text",
        title: "目的端口",
        name: "dport",
        column_cls: "align-center",
        width: "12%"
    }]
};

var list_query_template = new PagingHolder( list_template_config );
var logs_event_details = new PagingHolder( logs_event_details_config );
var message_manager = new MessageManager( message_box_config );
var global_data = new Object();

function load_init_data() {
    var sending_data = {
        ACTION: "load_init_data"
    }

    function ondatareceived( data ) {
        global_data.loaded_data = data;
    }

    list_query_template.request_for_json( sending_data, ondatareceived );
}

function delete_selected_items( element ) {
    var checked_items = list_query_template.get_checked_items();

    if ( checked_items.length == 0 ) {
        list_query_template.show_error_mesg( "请选择要删除的规则" );
        return;
    }
    var checked_items_id = new Array();
    for( var i = 0; i < checked_items.length; i++ ) {
        checked_items_id.push( checked_items[i].id );
    }

    var ids = checked_items_id.join( "&" );

    list_query_template.delete_item( ids );
}

function show_add_template( data_item ) {
    var query_tempate_add_form = Ext.getCmp( "query_tempate_add_form" )
    var event_class_items = new Array();
    var event_class_data = global_data.loaded_data.event_class;
    for ( var i = 0; i < event_class_data.length; i++ ) {
        var item = event_class_data[i];
        var event_class_item = {
            boxLabel: item.cn_name,
            id: item.en_short,
            name: "event_class",
            inputValue: item.en_short
        }
        event_class_items.push( event_class_item );
    }


    if( !query_tempate_add_form ) {
		Ext.apply(Ext.form.field.VTypes, {
			//  vtype 校验函数
			illgalchart: function(val, field) {
				return (/^[\u4e00-\u9fa5\w]+$/g.test(val));
			},
			// vtype文本属性：当验证函数返回false显示的出错文本
			illgalchartText: '非法输入!',
			validip:function(val,field){
                return (/^([1-9]|[1-9]\d|1\d{2}|2[0-1]\d|22[0-3])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/.test(val))
            },
            validipText:'IP输入有误',

            daterange: function(val, field) { // 调用 daterange   
                    var date = field.parseDate(val);  
   					// console.log(field)
                    if (!date) {  
                        return false;  
                    }  
                    if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {  
                        var start = field.up('form').down('#' + field.startDateField);  
                        start.setMaxValue(date);  
                        start.validate();  
                        this.dateRangeMax = date;  
                    }  
                    else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {  
                        var end = field.up('form').down('#' + field.endDateField);  
                        end.setMinValue(date);  
                        end.validate();  
                        this.dateRangeMin = date;  
                    }  
                    return true;  
                },
            daterangeText: '开始日期必须小于结束日期'
			// vtype Mask 属性: 按键过滤器
			// illgalchartMask: /[\d\s:amp]/i
		});
        query_tempate_add_form = Ext.create( "Ext.form.Panel",{
            id: "query_tempate_add_form",
            url: ass_url,
            buttons: [{
                text: "新增模板",
                id: "query_tempate_add_button",
                handler: function( me ){
                    var form = me.up('form').getForm();
                    if ( form.isValid() ) {
                        form.submit({
                            success: function( form, action ) {
                               message_manager.show_note_mesg( action.result.mesg );
                               list_query_template.deselect_edit_item();
                               list_query_template.update_info( true );
                               Ext.getCmp( "query_tempate_add_window" ).close();
                            },
                            failure: function( form, action ) {
                                list_query_template.show_error_mesg( action.result.mesg );
                            }
                        });
                    } else {
                        list_query_template.show_error_mesg( "请正确填写表单" );
                    }
                }
            }, {
                text: "撤销",
                handler: function( me ) {
                    me.up('window').close();
                }
            }],
            items: [{
                xtype: "container",
                height: 50,
                padding: '10 10 10 10',
                border: false,
                layout: {
                    type: 'table',
                    columns: 2
                },
                defaults: {
                    xtype: "textfield",
                    labelWidth: 80,
                    width: 250
                },
                items: [{
                    name: "ACTION",
                    value: "save_data",
                    hidden: true
                }, {
                    id: "template_id",
                    name: "id",
                    value: "",
                    hidden: true
                }, {
                    fieldLabel: "模板名称",
                    id: "template_name",
                    name: "template_name",
                    allowBlank: false,	
                    blankText: blank_text,
                    minLength: 4,
                    minLengthText: min_length_text,
                    maxLength: 20,
                    maxLengthText: max_length_text,
                      
					vtype: 'illgalchart'
                }, {
                    fieldLabel: "模板说明",
                    id: "template_note",
                    name: "template_note",
					vtype: 'illgalchart'
                }]
            }, {
                xtype: "tabpanel",
                width: 600,
                height: 300,
                layout: "fit",
                items:[{
                    title: "发生时间",
                    items: [{
                        xtype: "container",
                        padding: tab_content_padding,
                        items: [{
                            xtype: "container",
                            layout: "hbox",
                            items: [{
                                xtype: "radiofield",
                                id: "time_range1",
                                name: "time_range_radio",
                                boxLabel: "选择时间",
                                inputValue: 1,
                                checked: true,
                                // margin: " 5 10 5 10",
                                width: 80,
                                listeners: {
                                    change: {
                                        fn: function( me, newValue, oldValue ) {
                                            var time_range_choice = Ext.getCmp( "time_range_choice" );
                                            var recent_n_value = Ext.getCmp( "recent_n_value" );
                                            var value_label = Ext.getCmp( "recent_n_value_label" );
                                            if ( newValue ) {
                                                time_range_choice.enable();
                                                recent_n_value.enable();
                                                value_label.enable();
                                            } else {
                                                time_range_choice.disable();
                                                recent_n_value.disable();
                                                value_label.disable();
                                            }
                                        }
                                    }
                                }
                            }, {
                                xtype: "combobox",
                                id: "time_range_choice",
                                name: "time_range_choice",
                                displayField: 'name',
                                valueField: 'abbr',
                                value: "today",
                                width: 150,
                                store: {
                                    fields: ['abbr', 'name'],
                                    data : [
                                        { "abbr": "today",       "name": "今天" },
                                        { "abbr": "yesterday",   "name": "昨天" },
                                        { "abbr": "thisweek",    "name": "本周" },
                                        { "abbr": "lastweek",    "name": "上周" },
                                        { "abbr": "thismouth",   "name": "本月" },
                                        { "abbr": "lastmouth",   "name": "上月" },
                                        { "abbr": "thisseason",  "name": "本季度" },
                                        { "abbr": "lastseason",  "name": "上季度" },
                                        { "abbr": "lastday_N",   "name": "最近N天" },
                                        { "abbr": "lastweek_N",  "name": "最近N周" },
                                        { "abbr": "lastmonth_N", "name": "最近N月" }
                                    ]
                                },
                                listeners: {
                                    change: {
                                        fn: function( me, newValue, oldValue ) {
                                            var recent_n_value = Ext.getCmp( "recent_n_value" );
                                            var value_label = Ext.getCmp( "recent_n_value_label" );
                                            if ( newValue == "lastday_N" ) {
                                                value_label.setText( "天" );
                                                recent_n_value.show();
                                                value_label.show();
                                            } else if ( newValue == "lastweek_N" ) {
                                                value_label.setText( "周" );
                                                recent_n_value.show();
                                                value_label.show();
                                            } else if ( newValue == "lastmonth_N" ) {
                                                value_label.setText( "月" );
                                                recent_n_value.show();
                                                value_label.show();
                                            } else {
                                                recent_n_value.hide();
                                                value_label.hide();
                                            }
                                        }
                                    }
                                }
                            }, {
                                xtype: "numberfield",
                                id: "recent_n_value",
                                name: "recent_n_value",
                                value: 3,
                                minValue: 1,
                                maxValue: 31,
                                width: 50,
                                margin: "0 10 0 10",
                                hidden: true
                            }, {
                                xtype: "label",
                                forId: "recent_n_value",
                                id: "recent_n_value_label",
                                text: "天",
                                margin: "3 0 3 5",
                                hidden: true
                            }]
                        }, {
                            xtype: "container",
                            layout: "hbox",
                            margin: "20 0 0 0",
                            items: [{
                                xtype: "radiofield",
                                id: "time_range2",
                                name: "time_range_radio",
                                boxLabel: "手动配置",
                                inputValue: 2,
                                margin: " 5 10 5 10",
                                width: 80,
                                listeners: {
                                    change: {
                                        fn: function( me, newValue, oldValue ) {
                                            var start_date = Ext.getCmp( "start_date" );
                                            var start_time = Ext.getCmp( "start_time" );
                                            var end_date = Ext.getCmp( "end_date" );
                                            var end_time = Ext.getCmp( "end_time" );
                                            if ( newValue ) {
                                                start_date.enable();
                                                start_time.enable();
                                                end_date.enable();
                                                end_time.enable();
                                            } else {
                                                start_date.disable();
                                                start_time.disable();
                                                end_date.disable();
                                                end_time.disable();
                                            }
                                        }
                                    }
                                }
                            }, {
                                xtype: 'datefield',
                                id: "start_date",
                                name: 'start_date',
                                allowBlank : false,
                                fieldLabel: '开始时间',
                                format: "Y-m-d",
                                disabled: true,
                                editable:false,
                                labelWidth: 60,
                                width: 200,
                                vtype:'daterange',
                                endDateField:'end_date'
                                
                            }, {
                                xtype: 'timefield',
                                id: 'start_time',
                                name: 'start_time',
                                format: "H:i:s",
                                disabled: true,
                                editable:false,
                                 // readOnly : true,
                                width: 100,
                                margin: "0 10 0 10",
                            }]
                        }, {
                            xtype: "container",
                            layout: "hbox",
                            items: [ {
                                xtype: "label",
                                margin: " 5 10 5 10",
                                width: 80,
                            }, {
                                xtype: 'datefield',
                                id: 'end_date',
                                name: 'end_date',
                                allowBlank : false,
                                fieldLabel: '结束时间',
                                format: "Y-m-d",
                                disabled: true,
                                editable:false,
                                labelWidth: 60,
                                width: 200,
                                vtype:'daterange',
                                startDateField: 'start_date',
                                listeners:{  
                                                                                     
                                        }  
                            }, {
                                xtype: 'timefield',
                                id: 'end_time',
                                name: 'end_time',
                                format: "H:i:s",
                                disabled: true,
                                editable:false,
                                width: 100,
                                margin: "0 10 0 10",
                                listeners:{
                               
                                }
                            }]
                        }]
                    }]
                }, {
                    title: "事件类型",
                    items: [{
                        xtype: "container",
                        padding: tab_content_padding,
                        items: [{
                            xtype: "radiofield",
                            id: "ignore_event_class",
                            name: "event_class_radio",
                            boxLabel: "忽略事件类型",
                            inputValue: "ignore",
                            checked: true,
                            listeners: {
                                change: {
                                    fn: function( me, newValue, oldValue ) {
                                        var event_class_container = Ext.getCmp( "event_class_container" );
                                        if ( !newValue ) {
                                            event_class_container.enable();
                                        } else {
                                            event_class_container.disable();
                                        }
                                    }
                                }
                            }
                        }, {
                            xtype: "radiofield",
                            id: "set_event_class",
                            name: "event_class_radio",
                            boxLabel: "选择事件类型",
                            inputValue: "set",
                            listeners: {
                                change: {
                                    fn: function( me, newValue, oldValue ) {
                                        var event_class_container = Ext.getCmp( "event_class_container" );
                                        if ( newValue ) {
                                            event_class_container.enable();
                                        } else {
                                            event_class_container.disable();
                                        }
                                    }
                                }
                            }
                        }, {
                            xtype: "container",
                            padding: "20 0 0 20",
                            height:130,
                            autoScroll: true,
                            items: [{
                                xtype: "checkboxgroup",
                                layout: {
                                    type: "table",
                                    columns:3
                                },
                                defaults: {
                                    bodyStyle: 'padding:3px',
                                    height:48,
                                },
                                id: "event_class_container",
                                disabled: true,
                                defaultType: "checkboxfield",
                                // autoScroll: true,
                                items: event_class_items
                            }]
                        }]
                    }]
                }, {
                    title: "事件级别",
                    items: [{
                        xtype: "container",
                        padding: tab_content_padding,
                        items: [{
                            xtype: "radiofield",
                            id: "ignore_event_level",
                            name: "event_level_radio",
                            boxLabel  : "忽略事件级别",
                            inputValue: "ignore",
                            checked: true,
                            listeners: {
                                change: {
                                    fn: function ( me, newValue, oldValue ) {
                                        var event_level_container = Ext.getCmp( "event_level_container" );
                                        if ( !newValue ) {
                                            event_level_container.enable();
                                        } else {
                                            event_level_container.disable();
                                        }
                                    }
                                }
                            }
                        }, {
                            xtype: "radiofield",
                            id: "set_event_level",
                            name: "event_level_radio",
                            boxLabel  : "选择事件级别",
                            inputValue: "set",
                            listeners: {
                                change: {
                                    fn: function( me, newValue, oldValue ) {
                                        var event_level_container = Ext.getCmp( "event_level_container" );
                                        if ( newValue ) {
                                            event_level_container.enable();
                                        } else {
                                            event_level_container.disable();
                                        }
                                    }
                                }
                            }
                        }, {
                            xtype: "container",
                            padding: "10 0 0 20",
                            items: [{
                                xtype: "checkboxgroup",
                                // layout: {
                                //     type: "checkboxgroup",
                                // },
                                id: "event_level_container",
                                disabled: true,
                                defaultType: "checkboxfield",
                                items: [{
                                    boxLabel: "高",
                                    id: "high_level",
                                    name: "event_level",
                                    inputValue: "1"

                                }, {
                                    boxLabel: "中",
                                    id: "middle_level",
                                    name: "event_level",
                                    inputValue: "2"
                                }, {
                                    boxLabel: "低",
                                    id: "low_level",
                                    name: "event_level",
                                    inputValue: "3"
                                }, {
                                    boxLabel: "信息",
                                    id: "no_risk",
                                    name: "event_level",
                                    inputValue: "4"
                                }]
                            }]
                        }]
                    }]
                }, {
                    title: "IP地址",
                    items: [{
                        xtype: "container",
                        padding: tab_content_padding,
                        items: [{
                            xtype: "checkboxfield",
                            boxLabel: "忽略IP地址",
                            id: "ignore_ip_addr",
                            name: "ip_addr_checkbox",
                            inputValue: "ignore",
                            checked: true,
                            listeners: {
                                change: {
                                    fn: function( me, newValue, oldValue ) {
                                        var ip_addr_container = Ext.getCmp( "ip_addr_container" );
                                        var new_ip_addr_button = Ext.getCmp( "new_ip_addr" );
                                        if ( !newValue ) {
                                            ip_addr_container.enable();
                                            new_ip_addr_button.enable();
                                        } else {
                                            ip_addr_container.disable();
                                            new_ip_addr_button.disable();
                                        }
                                    }
                                }
                            }
                        }, {
                            xtype: "container",
                            padding: "0 20",
                            height: 130,
                            autoScroll: true,
                            items: [{
                                xtype: "fieldcontainer",
                                id: "ip_addr_container",
                                disabled: true,
                                layout: {
                                    type: "table",
                                    columns: 4
                                },
                                defaults: {
                                    bodyStyle: 'padding:3px'
                                },
                                items: [{
                                    xtype: "label",
                                    text: "IP地址",
                                    width: 230
                                }, {
                                    xtype: "label",
                                    text: "源",
                                    width: 80
                                }, {
                                    xtype: "label",
                                    text: "目的",
                                    width: 80
                                }, {
                                    xtype: "label",
                                    text: "操作",
                                    width: 80
                                }, {
                                    xtype: "textfield",
                                    id: "ip_addr_1",
                                    name: "ip_addr_1",
                                    width: 230,
                                    vtype:'validip'
                                }, {
                                    xtype: "checkboxfield",
                                    id: "source_ip_1",
                                    name: "source_ip_1",
                                    inputValue: 1,
                                    width: 80
                                }, {
                                    xtype: "checkboxfield",
                                    id: "destination_ip_1",
                                    name: "destination_ip_1",
                                    inputValue: 1,
                                    width: 80
                                }, {
                                    xtype: "button",
                                    id: "ip_del_button_1",
                                    width: 40,
                                    inputValue: 1,
                                    text: "删除",
                                    handler: function( me ) {
                                        Ext.getCmp( "ip_addr_1" ).destroy();
                                        Ext.getCmp( "source_ip_1" ).destroy();
                                        Ext.getCmp( "destination_ip_1" ).destroy();
                                        me.destroy();
                                        remove_serial( 1 );
                                    }
                                }]
                            }]
                        }, {
                            xtype: "button",
                            id: "new_ip_addr",
                            text: "新增IP地址",
                            disabled: true,
                            handler: function( me ) {
                                add_ip_addr_component();
                            }
                        }]
                    }]
                }, 
                {
                    title: "用户",
                    items: [{
                        xtype: "container",
                        padding: tab_content_padding,
                        items: [{
                            xtype: "checkboxfield",
                            boxLabel: "忽略用户",
                            id: "ignore_user_addr",
                            name: "user_addr_checkbox",
                            inputValue: "ignore",
                            checked: true,
                            listeners: {
                                change: {
                                    fn: function( me, newValue, oldValue ) {
                                        var user_addr_container = Ext.getCmp( "user_addr_container" );
                                        var new_user_addr_button = Ext.getCmp( "new_user_addr" );
                                        if ( !newValue ) {
                                            user_addr_container.enable();
                                            new_user_addr_button.enable();
                                        } else {
                                            user_addr_container.disable();
                                            new_user_addr_button.disable();
                                        }
                                    }
                                }
                            }
                        }, {
                            xtype: "container",
                            padding: "0 20",
                            height: 130,
                            autoScroll: true,
                            items: [{
                                xtype: "fieldcontainer",
                                id: "user_addr_container",
                                disabled: true,
                                layout: {
                                    type: "table",
                                    columns: 4
                                },
                                defaults: {
                                    bodyStyle: 'padding:3px'
                                },
                                items: [{
                                    xtype: "label",
                                    text: "用户",
                                    width: 230

                                }, {
                                    xtype: "label",
                                    text: "源",
                                    width: 80
                                }, {
                                    xtype: "label",
                                    text: "目的",
                                    width: 80
                                }, {
                                    xtype: "label",
                                    text: "操作",
                                    width: 80
                                }, {
                                    xtype: "textfield",
                                    id: "user_addr_1",
                                    name: "user_addr_1",
                                    width: 230,
                                    minLength: 4,
                                    minLengthText: min_length_text,
                                    maxLength: 10,
                                    maxLengthText: max_length_text,
                                    vtype:"illgalchart",
                                }, {
                                    xtype: "checkboxfield",
                                    id: "source_user_1",
                                    name: "source_user_1",
                                    inputValue: 1,
                                    width: 80
                                }, {
                                    xtype: "checkboxfield",
                                    id: "destination_user_1",
                                    name: "destination_user_1",
                                    inputValue: 1,
                                    width: 80
                                }, {
                                    xtype: "button",
                                    id: "user_del_button_1",
                                    width: 40,
                                    inputValue: 1,
                                    text: "删除",
                                    handler: function( me ) {
                                        Ext.getCmp( "user_addr_1" ).destroy();
                                        Ext.getCmp( "source_user_1" ).destroy();
                                        Ext.getCmp( "destination_user_1" ).destroy();
                                        me.destroy();
                                        remove_serial_user( 1 );
                                    }
                                }]
                            }]
                        }, {
                            xtype: "button",
                            id: "new_user_addr",
                            text: "新增用户",
                            disabled: true,
                            handler: function( me ) {
                                add_user_addr_component();
                            }
                        }]
                    }]
                }, 
                {
                    title: "通信端口",
                    items: [{
                        xtype: "container",
                        padding: tab_content_padding,
                        items: [{
                            xtype: "checkboxfield",
                            boxLabel: "忽略通信端口",
                            id: "ignore_communication_port",
                            name: "ignore_communication_port",
                            inputValue: "ignore_communication_port",
                            checked: true,
                            listeners: {
                                change: {
                                    fn: function( me, newValue, oldValue ) {
                                        var source_ports = Ext.getCmp( "source_ports" );
                                        var destination_ports = Ext.getCmp( "destination_ports" );
                                        if ( newValue ) {
                                            source_ports.disable();
                                            destination_ports.disable();
                                        } else {
                                            source_ports.enable();
                                            destination_ports.enable();
                                        }
                                    }
                                }
                            }
                        }, {
                            xtype: "textfield",
                            id: "source_ports",
                            name: "source_ports",
                            margin: " 20 5 5 20",
                            labelAlign: "top",
                            disabled: true,
                            fieldLabel: "源端口(多个端口请用英文逗号隔开，如：80,21,23,10443)"
                        }, {
                            xtype: "textfield",
                            id: "destination_ports",
                            name: "destination_ports",
                            margin: " 5 5 5 20",
                            labelAlign: "top",
                            disabled: true,
                            fieldLabel: "目的端口(多个端口请用英文逗号隔开，如：80,21,23,10443)"
                        }]
                    }]
                }]
            }]
        });
    }

    var query_tempate_add_window = Ext.getCmp( "query_tempate_add_window" );
    if( !query_tempate_add_window ) {
        query_tempate_add_window = Ext.create( "Ext.window.Window", {
            title: "新增模板",
            id: "query_tempate_add_window",
            width: 600,
            height: 400,
            resizable: false,
            modal: true,
            layout: 'fit',
            closeAction: 'hide',
            items: [{
                xtype: query_tempate_add_form
            }],
            listeners: {
                hide: {
                    fn: function( me ) {
                        me.down('form').getForm().reset();
                        list_query_template.deselect_edit_item();
                        list_query_template.update_info();
                        switch_to_add_status( me );
                    }
                },
                show: {
                    fn: function( me ) {

                    }
                }
            }
        });
    }

    if ( data_item !== undefined ) {
        load_data_into_template_add( query_tempate_add_window, data_item );
        switch_to_edit_status( query_tempate_add_window, data_item );
    }

    query_tempate_add_window.show();
}

function switch_to_add_status( add_window ) {
    add_window.setTitle( "新增模板" );
    add_window.down( "form" ).down( "button[id=query_tempate_add_button]" ).setText( "新增模板" );
}

function switch_to_edit_status( add_window, data_item ) {
    add_window.setTitle( "编辑" + data_item.template_name + "模板" );
    add_window.down( "form" ).down( "button[id=query_tempate_add_button]" ).setText( "更新模板" );
}

function load_data_into_template_add( add_window, data_item ) {
    Ext.getCmp( "template_id" ).setValue( data_item.id );
    Ext.getCmp( "template_name" ).setValue( data_item.template_name );
    Ext.getCmp( "template_note" ).setValue( data_item.template_note );
    /* 设置时间 */
    var time = data_item.time_range.value;
    // console.log(time);
    if ( data_item.time_range.type == 2 ) {
        Ext.getCmp( "time_range2" ).setValue( true );
        var time_start = time.time_start.split( " " );
        var time_end = time.time_end.split( " " );
        if ( time_start[0] !== undefined ) {
            Ext.getCmp( "start_date" ).setValue( time_start[0] );
        }
        if ( time_start[1] !== undefined ) {
            Ext.getCmp( "start_time" ).setValue( time_start[1] );
        }
        if ( time_end[0] !== undefined ) {
            Ext.getCmp( "end_date" ).setValue( time_end[0] );
        }
        if ( time_end[1] !== undefined ) {
            Ext.getCmp( "end_time" ).setValue( time_end[1] );
        }
    } else {
        Ext.getCmp( "time_range1" ).setValue( true );
        Ext.getCmp( "time_range_choice" ).setValue( time );
        var regx = /(last(?:day|week|month)_)(\d+)/;
        if ( time.match( regx ) ) {
            var time_choice = RegExp.$1 + "N";
            var time_n = RegExp.$2;
            Ext.getCmp( "time_range_choice" ).setValue( time_choice );
            Ext.getCmp( "recent_n_value" ).setValue( time_n );
        }
    }
    /* 设置事件类型 */
    if ( data_item.safe_type == "all" ) {
        Ext.getCmp( "ignore_event_class" ).setValue( true );
    } else {
        var safe_type = new Array();
        if ( data_item.safe_type ) {
            safe_type = data_item.safe_type.split( "," );
        }
        Ext.getCmp( "set_event_class" ).setValue( true );
        Ext.getCmp( "event_class_container" ).setValue({event_class: safe_type});
    }
    /* 设置事件级别 */
    if ( data_item.priority == "all" ) {
        Ext.getCmp( "ignore_event_level" ).setValue( true );
    } else {
        var priority = new Array();
        if ( data_item.priority ) {
            priority = data_item.priority.split( "," );
        }
        Ext.getCmp( "set_event_level" ).setValue( true );
        Ext.getCmp( "event_level_container" ).setValue({event_level: priority});
    }
    /* 设置IP地址 */
    if ( data_item.ip.length == 0 ) {
        load_ips_into_component( data_item );
        Ext.getCmp( "ignore_ip_addr" ).setValue( "ignore" );
    } else {
        load_ips_into_component( data_item );
        Ext.getCmp( "ignore_ip_addr" ).setValue( "" );
    }

     /* 设置用户 */
    if ( data_item.user.length == 0 ) {
        load_user_into_component( data_item );
        Ext.getCmp( "ignore_user_addr" ).setValue( "ignore" );
    } else {
        load_user_into_component( data_item );
        Ext.getCmp( "ignore_user_addr" ).setValue( "" );
    }

    /* 设置通信端口 */
    if ( data_item.port.sport.length == 0 && data_item.port.dport.length == 0 ) {
        Ext.getCmp( "ignore_communication_port" ).setValue( true );
    } else {
        var sport = data_item.port.sport.join( "," );
        var d = data_item.port.dport.join( "," );
        Ext.getCmp( "ignore_communication_port" ).setValue( false );
        Ext.getCmp( "source_ports" ).setValue( sport );
        Ext.getCmp( "destination_ports" ).setValue( d );
    }
}

function load_ips_into_component( data_item ) {
    /* 第一步，删除原有的IP组件 */
    for ( var i = 0; i < ip_addr_exist_sid.length; i++ ) {
        var serial = ip_addr_exist_sid[i];
        Ext.getCmp( "ip_addr_" + serial ).destroy();
        Ext.getCmp( "source_ip_" + serial ).destroy();
        Ext.getCmp( "destination_ip_" + serial ).destroy();
        Ext.getCmp( "ip_del_button_" + serial ).destroy();
    }
    ip_addr_exist_sid = new Array();

    /* 第二步，新增组件 */
    if ( data_item !== undefined ) {
        if ( data_item.ip.length > 0 ) {
            for( i = 0; i < data_item.ip.length; i++ ) {
                add_ip_addr_component( data_item.ip[i] );
            }
        } else {
            add_ip_addr_component();
        }
    } else {
        add_ip_addr_component();
    }

}

function load_user_into_component( data_item ) {
    /* 第一步，删除原有的组件 */
    for ( var i = 0; i < user_addr_exist_sid.length; i++ ) {
        var serial = user_addr_exist_sid[i];
        Ext.getCmp( "user_addr_" + serial ).destroy();
        Ext.getCmp( "source_user_" + serial ).destroy();
        Ext.getCmp( "destination_user_" + serial ).destroy();
        Ext.getCmp( "user_del_button_" + serial ).destroy();
    }
    user_addr_exist_sid = new Array();

    /* 第二步，新增组件 */
    if ( data_item !== undefined ) {
        if ( data_item.user.length > 0 ) {
            for( i = 0; i < data_item.user.length; i++ ) {
                add_user_addr_component( data_item.user[i] );
            }
        } else {
            add_user_addr_component();
        }
    } else {
        add_user_addr_component();
    }

}

var ip_addr_sid             = 2;
var ip_addr_exist_sid       = [1];
function add_ip_addr_component( ip_str ) {
    var serial = ip_addr_sid;
    ip_addr_sid++;
    var ip_addr = "", source_ip_checked = false, destination_ip_checked = false;
    if ( ip_str !== undefined ) {
        var ip_config = ip_str.split( "," );
        ip_addr = ip_config[0];
        if ( ip_config[1] == "on" ) {
            source_ip_checked = true;
        }
        if ( ip_config[2] == "on" ) {
            destination_ip_checked = true;
        }
    }
    var ip_addr = Ext.create("Ext.form.field.Text", {
        id: "ip_addr_" + serial,
        name: "ip_addr_" + serial,
        value: ip_addr,
        width: 230,
	vtype: 'validip',
    });
    var source_ip_checkbox = Ext.create("Ext.form.field.Checkbox", {
        id: "source_ip_" + serial,
        name: "source_ip_" + serial,
        inputValue: serial,
        checked: source_ip_checked,
        width: 80
    });
    var destination_ip_checkbox = Ext.create("Ext.form.field.Checkbox", {
        id: "destination_ip_" + serial,
        name: "destination_ip_" + serial,
        checked: destination_ip_checked,
        inputValue: serial,
        width: 80
    });
    var ip_del_button = Ext.create("Ext.button.Button", {
        id: "ip_del_button_" + serial,
        text: "删除",
        width: 40,
        handler: function( me ) {
            var id = me.id;
            var regx = /ip_del_button_(\d+)/;
            if ( id.match( regx ) ) {
                var serial = RegExp.$1;
                Ext.getCmp( "ip_addr_" + serial ).destroy();
                Ext.getCmp( "source_ip_" + serial ).destroy();
                Ext.getCmp( "destination_ip_" + serial ).destroy();
                Ext.getCmp( "ip_del_button_" + serial ).destroy();
                remove_serial( serial );
            }
        }
    });

    var ip_addr_container = Ext.getCmp( "ip_addr_container" );
    ip_addr_container.add( ip_addr );
    ip_addr_container.add( source_ip_checkbox );
    ip_addr_container.add( destination_ip_checkbox );
    ip_addr_container.add( ip_del_button );
    add_serial( serial );
}


var user_addr_sid             = 2;
var user_addr_exist_sid       = [1];
function add_user_addr_component( user_str ) {
    var serial = user_addr_sid;
    user_addr_sid++;
    var user_addr = "", source_user_checked = false, destination_user_checked = false;
    if ( user_str !== undefined ) {
        var user_config = user_str.split( "," );
        user_addr = user_config[0];
        if ( user_config[1] == "on" ) {
            source_user_checked = true;
        }
        if ( user_config[2] == "on" ) {
            destination_user_checked = true;
        }
    }
    var user_addr = Ext.create("Ext.form.field.Text", {
        id: "user_addr_" + serial,
        name: "user_addr_" + serial,
        value: user_addr,
        width: 230,
        minLength: 4,
        minLengthText: min_length_text,
        maxLength: 10,
        maxLengthText: max_length_text,
        vtype:"illgalchart",
	
    });
    var source_user_checkbox = Ext.create("Ext.form.field.Checkbox", {
        id: "source_user_" + serial,
        name: "source_user_" + serial,
        inputValue: serial,
        checked: source_user_checked,
        width: 80
    });
    var destination_user_checkbox = Ext.create("Ext.form.field.Checkbox", {
        id: "destination_user_" + serial,
        name: "destination_user_" + serial,
        checked: destination_user_checked,
        inputValue: serial,
        width: 80
    });
    var user_del_button = Ext.create("Ext.button.Button", {
        id: "user_del_button_" + serial,
        text: "删除",
        width: 40,
        handler: function( me ) {
            var id = me.id;
            var regx = /user_del_button_(\d+)/;
            if ( id.match( regx ) ) {
                var serial = RegExp.$1;
                Ext.getCmp( "user_addr_" + serial ).destroy();
                Ext.getCmp( "source_user_" + serial ).destroy();
                Ext.getCmp( "destination_user_" + serial ).destroy();
                Ext.getCmp( "user_del_button_" + serial ).destroy();
                remove_serial_user( serial );
            }
        }
    });

    var user_addr_container = Ext.getCmp( "user_addr_container" );
    user_addr_container.add( user_addr );
    user_addr_container.add( source_user_checkbox );
    user_addr_container.add( destination_user_checkbox );
    user_addr_container.add( user_del_button );
    add_serial_user( serial );
}

function add_serial_user( serial ) {
    user_addr_exist_sid.push( serial );

}
function add_serial( serial ) {
    ip_addr_exist_sid.push( serial );

}
function remove_serial_user( serial ) {
    var new_addr = new Array();
    for( var i = 0; i < user_addr_exist_sid.length; i++ ) {
        if ( user_addr_exist_sid[i] == serial ) {
            // deleted!
        } else {
            new_addr.push( user_addr_exist_sid[i] );
        }
    }
    user_addr_exist_sid = new_addr;
}
function remove_serial( serial ) {
    var new_addr = new Array();
    for( var i = 0; i < ip_addr_exist_sid.length; i++ ) {
        if ( ip_addr_exist_sid[i] == serial ) {
            // deleted!
        } else {
            new_addr.push( ip_addr_exist_sid[i] );
        }
    }
    ip_addr_exist_sid = new_addr;
}

var global_quering_template = {
    query_templatet_config: {
        tab_id: "query_template_tab",
        tab_text_id: "query_template_tab_text",
        page_id: "list_query_template"
    },
    page_tabs_container: "page_tabs_container",
    page_content_container: "page_content_container",
    history_list_config_name_prefix: "history_events_list_",
    get_history_list_count: function() {
        var global_quering_template = this;
        var regx = /^history_events_list_/;
        var count = 0;
        for ( var attr in global_quering_template ) {
            if ( attr.match( regx ) ) {
                count++;
            }
        }
        return count;
    }
};

function query_events( element ) {
    var query_data_item = list_query_template.get_item( element.value );
    var exit_list_count = global_quering_template.get_history_list_count(); /* 已经创建的list个数 */
    /* 第一步，创建页面元素变量 */
    var config = {
        template_name: query_data_item.template_name,
        tab_id: "history_events_tab_" + query_data_item.template_name,
        tab_text_content: query_data_item.template_name,
        tab_text_id: "history_events_tab_text_" + query_data_item.template_name,
        tab_close_button_id: "history_events_tab_button_" + query_data_item.template_name,
        page_id: "list_history_events_" + query_data_item.template_name
    }
    var list_config_name = global_quering_template.history_list_config_name_prefix + query_data_item.template_name;

    if ( global_quering_template[list_config_name] !== undefined ) {
        /* 之前已经定义过 */
    } else {
        global_quering_template[list_config_name] = config;
        /* 第二步，创建页面元素 */
        render_history_root_element( config );

        /* 第三步，创建list */
        list_history_events_config.check_in_id = config.page_id;
        list_history_events_config.panel_name = config.page_id;
        config.list_obj = new PagingHolder( list_history_events_config )
        config.list_obj.render();
        config.list_obj.set_ass_message_manager( message_manager );
        config.list_obj.extend_sending_data = {
            template_id: query_data_item.id
        }
        config.list_obj.update_info( true );

        /* 第四步，注册tab的监听函数 */
        add_listener_to_tab( config );
    }

    /* 第五步，触发点击 */
    $( "#" + config.tab_text_id ).click();
}

function render_history_root_element( config ) {
    var tab_element = '<div id="' + config.tab_id + '" class="page_tab page_tab_inactive">' +
                        '<span id="' + config.tab_text_id + '" value="' + config.template_name +
                            '" class="page-tab-text">' + config.tab_text_content + '</span>' +
                        '<span id="' + config.tab_close_button_id + '" value="' + config.template_name +
                            '" class="tab-close-button"></span>' +
                    '</div>';
    var page_element = '<div id="' + config.page_id + '" class="list_check_in_dom hidden"></div>';
    $( "#" + global_quering_template.page_tabs_container ).append( tab_element );
    $( "#" + global_quering_template.page_content_container ).append( page_element );
}

function add_listener_to_tab( config ) {

    $( "#" + config.tab_text_id ).click(function(){
        var template_name = $( this ).attr( "value" );
        click_tab_text( template_name );
    });

    $( "#" + config.tab_close_button_id ).click(function(){
        var template_name = $( this ).attr( "value" );
        click_tab_close( template_name );
    });
}

function click_tab_text( template_name ) {
    var list_config_name = global_quering_template.history_list_config_name_prefix + template_name;
    var config = global_quering_template[list_config_name];
    switch_tab( config );
    
}

function click_tab_close( template_name ) {
    var list_config_name = global_quering_template.history_list_config_name_prefix + template_name;
    var config = global_quering_template[list_config_name];
    
    /* 找到相邻的前一个tab点击click */
    var tabs = $( ".page_tab" );
    var current_pre_bro_index = -1;
    for ( var i = 0; i < tabs.length; i++ ) {
        if ( tabs[i].id == config.tab_id ) {
            break;
        }
        current_pre_bro_index++;
    }

    if ( current_pre_bro_index == 0 ) {
        $( "#" + tabs[current_pre_bro_index].id ).click();
    } else {
        $( "#" + tabs[current_pre_bro_index].id ).children( ".page-tab-text" ).click();
    }

    /* 删除本tab相关资源 */
    $( "#" + config.tab_id ).remove();
    $( "#" + config.page_id ).remove();
    delete global_quering_template[list_config_name];
}

function switch_tab( config ) {
    /* 切换tab状态 */
    /* 移除其他tab的激活状态 */
    $( ".page_tab" ).removeClass( "page_tab_active" );
    $( ".page_tab" ).addClass( "page_tab_inactive" );
    /* 将当前tab改为激活状态 */
    $( "#" + config.tab_id ).removeClass( "page_tab_inactive" );
    $( "#" + config.tab_id ).addClass( "page_tab_active" );

    /* 显示主体 */
    $( ".list_check_in_dom" ).hide();
    $( "#" + config.page_id ).show();
}

function init_template_tab( template_name ) {
    var config = global_quering_template.query_templatet_config;
    $( "#" + config.tab_id ).click(function() {
        var config = global_quering_template.query_templatet_config;
        switch_tab( config )
    });
}

function show_ip_details( eid,sid ) {
    logs_event_details.extend_sending_data = {
        eid: eid,
        sid: sid
    }
    logs_event_details.update_info( true );
    logs_event_details.show();
}

function show_suggestion( type ) {
    var sending_data = {
        ACTION: 'query_suggestion',
        type: type
    }

    function ondatareceived(data) {

        if (data == null ) {
            code = '没有具体的详细信息';
        }else{
            var suggestionArray = data.mesg;
            var code = '<TABLE>';
            for(var i = 0; i<suggestionArray.length; i++){
                
                var suggestionList = (suggestionArray[i]); 
                code = code + ('<tr class="tr_css"><td class="td_css" style="width:100px;">'+suggestionList[0]+'</td> <td class="td_css" style="">'+suggestionList[1]+'</td></tr>');
            }         
            code = code + '</TABLE>';
            
        }

        message_manager.show_details_message( code , true);
        $("#details_message_box_title_for_my_message_box").text("入侵类型详细信息");
        $("#details_message_box_button_for_my_message_box").parent().attr("id","my_button");
    }

    logs_event_details.request_for_json(sending_data, ondatareceived);

}
