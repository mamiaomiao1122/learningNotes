#!/usr/bin/perl
#==============================================================================#
#
# 描述: 列表规则页面
#
# 作者: 王琳 (WangLin), 245105947@qq.com
# 公司: capsheaf
# 历史:
#   2014.09.23 WangLin创建
#
#==============================================================================#
use Encode;

require '/var/efw/header.pl';
require 'list_panel_opt.pl';

#=====初始化全局变量到init_data()中去初始化=====================================#
my $custom_dir;         #要保存数据的目录名字
my $conf_dir;           #规则所存放的文件夹
my $conf_file;          #规则所存放的文件
my $extraheader;        #存放用户自定义JS
my %par;                #存放post方法传过来的数据的哈希
my %query;              #存放通过get方法传过来的数据的哈希
my $LOAD_ONE_PAGE = 0;
my $json = new JSON::XS;
my $cmd_str;
my $page_title = '';
#=========================全部变量定义end=======================================#
my %argsRef = (
    'interface_panel' => 'iface',
    'safeEvent_panel' => 'events',
    'list_panel'  => 'sys'
    );
&main();

sub main() {
    &init_data();
    &do_action();
}

sub init_data(){
    $page_title = '列表面板调试';
    $custom_dir = '/template';                      #要保存数据的目录名字,要配置,不然路径初始化会出问题
    $conf_dir   = "${swroot}".$custom_dir;          #规则所存放的文件夹
    $conf_file  = $conf_dir.'/config';              #规则所存放的文件
    $cmd_str    = '/usr/local/bin/main_status.py';
    #============页面要能翻页必须引用的CSS和JS-BEGIN============================================#
    #============扩展的CSS和JS放在源CSS和JS后面就像这里的extend脚本=============================#
    $extraheader = '<link rel="stylesheet" type="text/css" href="/include/add_list_base.css" />
                    <link rel="stylesheet" type="text/css" href="/include/jquery-ui.min.css" />
                    <link rel="stylesheet" type="text/css" href="/include/dev_status.css" />
                    <script language="JavaScript" src="/include/jquery-ui.js"></script>
                    <script language="JavaScript" src="/include/Tdrag.js"></script>
                    <script language="JavaScript" src="/include/list_panel.js"></script>
                    <script language="javascript" src="/include/echarts.min.js"></script>
                    <script type="text/javascript" src="/include/ESONCalendar.js"></script>
                    <script type="text/javascript" src="/include/dev_status.js"></script>';

    #============页面要能翻页必须引用的CSS和JS-END==============================================#

    #====获取通过post或者get方法传过来的值-BEGIN=======#
    &getcgihash(\%par);
    &get_query_hash(\%query);
    #====获取通过post或者get方法传过来的值-END=========#

    &make_file();#检查要存放规则的文件夹和文件是否存在
}

sub do_action() {
    my $action = $par{'ACTION'};
    my $panel_name = $par{'panel_name'};
    if( !$action ) {
        $action = $query{'ACTION'};
    }

    &showhttpheaders();

    #===根据用户提交的数据进行具体反馈,默认返回页面==#
    if ($action eq 'load_data') {
        #==下载数据==#
        &load_data();
    } 
    elsif ($action eq 'load_echart_data'){

        &load_echart_data();
    }
    elsif ($action eq 'initOption') {
        #==初始化数据==#
        &initOption();
    }
    
    else {
        #==如果用户什么都没提交，默认返回页面==#
        &show_page();
    }
}

sub show_page() {
    &openpage($page_title, 1, $extraheader);
    &display_main_body();
    &closepage();
}

sub display_main_body() {
    printf<<EOF
    <div id="module-content23">

        <div class="module">
            <div class="title-box">
                <span>系统信息</span>
                <div class="tool-box">
                    <input type="button"  onclick="refreshSys();" class="btn-class refesh">
                    <input type="button" onclick="showPanel('sys_config')"  class="btn-class setting">
                    <div class="popup-mesg-box-cover" ></div>
                    <div class="config_panel">
                        <div id="sys_config">
                            <form name="sys_config_form">
                                <div class="config-title"><span>系统信息参数配置</span></div>
                                <div class="content">
                                    <ul>
                                        <li><span>启用自动刷新:</span><input  type="checkbox" value=true checked name="isAutoFresh"/></li>
                                        <li><span>刷新间隔（s）:</span><input name="interval" type="number" value="3" min=0 class="config-number"/></li>
                                    </ul>
                                </div>
                                <div class="config-footer">
                                    <input type="button" value="提交" class="config-btn" onclick="save_config('sys_config')">
                                    <input type="button" value="取消" class="config-btn" onclick="hidePanel('sys_config');">
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="content-box">
                <div class="left-box">
                <p id="sys_info">系统信息</p>
                    <ul id="info_list">
                        <li>
                            <div class="left_value"><span>CPU</span></div>
                            <div class="center_value"><div id="cpu_bar"></div></div>
                            <div class="right_value" id="cpu_value"></div>
                           
                        </li>
                        <li>
                            <div class="left_value"><span>磁盘</span></div>
                             <div class="center_value"><div id="disk_bar"></div></div>
                            <div class="right_value" id="disk_value"></div>
                            
                        </li>
                        <li>
                            <div class="left_value"><span>内存</span></div>
                            <div class="center_value"><div id="memory_bar"></div></div>
                            <div class="right_value" id="memory_value"></div>
                            
                        </li>
                        <li>会话数:<span name="session_count"></span></li>
                        <li>在线用户数:<span name="online_users"></span></li>
                        <li>今天拦截数/记录数:<span name="block"></span></li>
                        <li>系统时间:<span name="sys_time"></span></li>
                    </ul>
                </div>
                <div class="right-box">
                    <div id="list_panel"></div>
                </div>
            </div>
        </div>
       <div class="module">
            <div class="title-box">
                <span>接口信息</span>
                <div class="tool-box">
                   <input type="button"  onclick="refreshInterface();" class="btn-class refesh">
                    <input type="button" onclick="showPanel('interface_config')"  class="btn-class setting">
                </div>
                <div class="popup-mesg-box-cover" ></div>
                <div class="config_panel">
                    <div id="interface_config">
                        <form name="interface_config_form">
                            <div class="config-title"><span>接口信息参数配置</span></div>
                            <div class="content">
                                <ul>
                                    
                                    <li><span>启用自动刷新:</span><input name="isAutoFresh" type="checkbox" value=true checked/></li>
                                    <li><span>刷新间隔（s）:</span><input name="interval" type="number" value="3"  min=0 class="config-number"/></li>
                                    <li>
                                        <span>选择流量单位:</span>
                                        <div class="radioGroup">
                                            <input type="radio" id='face_unit_B' name="face_unit" value="B"><label for='face_unit_B'>Bps</label>
                                            <input type="radio" id='face_unit_b' name="face_unit" checked value="b"><label for='face_unit_b'>bps</label>
                                        </div>
                                        
                                    </li>
                                </ul>
                            </div>
                            <div class="config-footer">
                                <input type="button" value="提交" class="config-btn" onclick="save_config('interface_config')"/>
                                <input type="button" value="取消" class="config-btn" onclick="hidePanel('interface_config');">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="content-box">
                   <div id="interface_panel"></div>
            </div>
        </div>
        <div class="module">
            <div class="title-box">
                <span>今日安全事件汇总</span>
                <div class="tool-box">
                   <input type="button"  onclick="refreshSafeEvent();" class="btn-class refesh">
                    <input type="button" onclick="showPanel('safeEvent_config')"  class="btn-class setting">
                </div>
                <div class="popup-mesg-box-cover" ></div>
                <div class="config_panel">
                    <div id="safeEvent_config">
                        <form name="safeEvent_config_form">
                            <div class="config-title"><span>今日安全事件汇总参数配置</span></div>
                            <div class="content">
                                <ul>
                                    <li><span>启用自动刷新:</span><input name="isAutoFresh" type="checkbox" value=true checked/></li>
                                    <li><span>刷新间隔（s）:</span><input name="interval" type="number" value="3"  min=0 class="config-number"/></li>
                                </ul>
                            </div>
                            <div class="config-footer">
                                <input type="button" value="提交" class="config-btn" onclick="save_config('safeEvent_config')">
                                <input type="button" value="取消" class="config-btn" onclick="hidePanel('safeEvent_config');">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="content-box">
                   <div id="safeEvent_panel"></div>
            </div>
        </div>
        <div class="module">
            <div class="title-box">
                <span>接口吞吐率折线图-<span id="throughput_config_title">所有WAN口</span>实时流量</span>
                <div class="tool-box">
                    <input type="button"  onclick="refreshChart(true,true,'click');" class="btn-class refesh">
                    <input type="button" onclick="showPanel('throughput_config')"  class="btn-class setting">
                </div>
                 <div class="popup-mesg-box-cover" ></div>
                <div class="config_panel">

                    <div id="throughput_config">
                        <form name="throughput_config_form">
                            <div class="config-title"><span>接口吞吐率折线图参数配置</span></div>
                            <div class="content">
                                <ul>
                                    <li><span>启用自动刷新:</span><input name="isAutoFresh" type="checkbox" value=true checked/></li>
                                    <li><span>刷新间隔（s）:</span><input name="interval" type="number" value="3" min=0 class="config-number"/></li>
                                    <li>
                                        <span>选择时间段:</span>
                                        <div class="radioGroup">
                                            <input type="radio" id='clock_M' name="clock" value="M" checked><label for='clock_M'>实时</label>
                                            <input type="radio" id='clock_H'  name="clock" value="H" checked><label for ='clock_H'>1小时</label>
                                            <input type="radio" id='clock_DAY' name="clock" value="DAY"><label for='clock_DAY'>24小时</label>
                                        </div>
                                        
                                    </li>
                                    <li>
                                        <span>选择流量单位:</span>
                                        <div class="radioGroup">
                                            <input type="radio" id='unit_B' name="unit" value="B"><label for='unit_B'>Bps</label>
                                            <input type="radio" id='unit_b' name="unit" checked value="b"><label for='unit_b'>bps</label>
                                        </div>
                                        
                                    </li>
                                    <li>
                                        <span>选择网口</span> 
                                        <select name="zone" id="throughtout_zone"></select>  
                                    </li>
                                </ul>
                            </div>
                            <div class="config-footer">
                                <input type="button" value="提交" class="config-btn" onclick="save_config('throughput_config')">
                                <input type="button" value="取消" class="config-btn" onclick="hidePanel('throughput_config');">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="content-box">
                 <div class="info-box">
                    实时上行：<span id="rx_value" class='rx_value'></span>
                    &nbsp;实时下行：<span id="tx_value" class='tx_value'></span>
                 </div>
                 <div id="real_time_fresh" style="height:250px"></div>   
            </div>
        </div>
        </div>

EOF
    ;

}

sub load_data(){
    my $time = time();

    my $panel_name = $par{'panel_name'};
    my %ret_data;
    my $cmd = "sudo $cmd_str -t ". $argsRef{$panel_name}; 
    my $res = `$cmd`;
    print $res; 
   
}
sub initOption {
    my $cmd = "sudo /usr/local/bin/getAllFaceJson.py --select";
    my $res = `$cmd`;
    print $res;
}
sub load_echart_data(){

    my $type = $par{'type'};
    my $clock = $par{'clock'};
    my $unit = $par{'unit'};
    my $zone = $par{'zone'};
    my $flag = ($par{'flag'} == 1 ) ? "--first" : "";
    my $cmd = "sudo $cmd_str -t $type -c $clock -u $unit -z $zone $flag";
    my $res = `$cmd`;
    print $res;
}


sub make_file(){
    if(! -e $conf_dir){
        system("mkdir -p $conf_dir");
    }
    
    if(! -e $conf_file){
        system("touch $conf_file");
    }
}
