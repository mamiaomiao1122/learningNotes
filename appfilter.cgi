#!/usr/bin/perl
#==============================================================================#
#
# 描述: 添加规则列表规则页面
#
# 作者: 王琳 (WangLin), 245105947@qq.com
# 公司: capsheaf
# 历史:
#   2014.09.23 WangLin创建
#
#==============================================================================#
use Encode;
use Data::Dumper;
use List::Util qw(max);
require '/var/efw/header.pl';
require 'list_panel_opt.pl';

#=================初始化全局变量到init_data()中去初始化========================#
my $custom_dir;         #要保存数据的目录名字
my $conf_dir;           #规则所存放的文件夹
my $conf_file;          #规则所存放的文件
my $need_reload_tag;    #规则改变时需要重新应用的标识
my $extraheader;        #存放用户自定义CSS,JS
my %par;                #存放post方法传过来的数据的哈希
my %query;              #存放通过get方法传过来的数据的哈希
my $LOAD_ONE_PAGE = 0;  #是否只load一页的数据，0表示全部加载
my $json = new JSON::XS;#处理json数据的变量，一般不变

my $CUR_PAGE = "应用控制策略" ;  #当前页面名称，用于记录日志
my $log_oper ;                   #当前操作，用于记录日志，
                                 # 新增：add，编辑：edit，删除：del，应用：apply，启用：enable，禁用：disable，移动：move
my $rule_or_congfig = '0';       #当前页面是规则还是配置，用于记录日志，0为规则，1为配置

#=========================全部变量定义end=======================================#

&main();

sub main() {
    #获取post请求传过来的变量
    &getcgihash(\%par);
    #获取get请求传过来的变量
    &get_query_hash(\%query);
    #初始化变量值
    &init_data();
    &make_file();
    #做出响应
    &do_action();
}

sub init_data(){
    $custom_dir         = '/appfilter';
    $conf_dir           = "${swroot}".$custom_dir;
    $conf_file          = $conf_dir.'/config';
    $need_reload_tag    = $conf_dir.'/add_list_need_reload';
	
	$sourceip_file      = '/var/efw/objects/ip_object/ip_group';#源IP配置文件路径
	$targetip_file      = '';#目标IP配置文件路径
	$service_sys_file   = '/var/efw/objects/service/system_service';#预定义服务配置文件路径
	$service_cus_file   = '/var/efw/objects/service/custom_service';#自定义服务配置文件路径
    $app_file           = '/var/efw/objects/application/app_rule';#应用配置(系统内置)文件路径
	$app_custom_file    = '/var/efw/objects/application/app_custom';#应用配置(自定义)文件路径
	$singletime_file    = '/var/efw/objects/time_plan/single';#单次生效时间配置文件路径
#	$looptime_file      = '/var/efw/objects/time_plan/circle';#循环生效时间配置文件路径
    $looptime_file      = '/var/efw/objects/time_plan/around';#循环生效时间配置文件路径
	
	$userlist           = '/usr/local/bin/getGroupUserTree.py';#获取用户组数据python文件路径
	$applist			= '/usr/local/bin/application_get_tree.py';#获取应用数据PYthon文件路径
	$apply_file         = '/usr/local/bin/app_ctrl.py';#用户点击应用按钮调用PY文件路径	
    $cmd_set_appctrlIsactive = "/usr/local/bin/appctrlIsactive";
	#============要使用添加面板和翻页列表面板必须引用的CSS和JS-BEGIN============================#
    #============扩展的CSS和JS放在源CSS和JS后面就像这里的add_list_demo.js脚本===================#
    $extraheader = '<link rel="stylesheet" type="text/css" href="/include/add_list_base.css" />
					<link rel="stylesheet" type="text/css" href="/include/appfilter.css" />
					<link rel="stylesheet" type="text/css" href="/include/style.min.css" />
                    <script language="JavaScript" src="/include/jquery-3.1.0.min.js"></script>
                    <script language="JavaScript" src="/include/jstree.min.js"></script>
                    <script language="JavaScript" src="/include/message_manager.js"></script>
                    <script language="JavaScript" src="/include/add_panel.js"></script>
                    <script language="JavaScript" src="/include/list_panel.js"></script>
                    <script language="JavaScript" src="/include/appfilter.js"></script>
                    <script language="JavaScript" src="/include/add_panel_include_config.js"></script>';
    #============要使用添加面板和翻页列表面板必须引用的CSS和JS-END==============================#
}

sub do_action() {
    #==一般ACTION只会通过一种方式传过来，开发者需要自己判断从哪种方式传过来==#
    my $action = $par{'ACTION'};
    my $query_action = $query{'ACTION'};
    my $panel_name = $par{'panel_name'};

    if($action ne 'export_data' && $query_action ne 'export_data' && $query_action ne 'export_selected') {
        &showhttpheaders();
    }

    #===根据用户提交的数据进行具体反馈,默认返回页面==#
    if ( $action eq 'save_data' && $panel_name eq 'add_panel'  ) {
        &save_data();
    }
    elsif ( $action eq 'load_data' && $panel_name eq 'list_panel' ) {
        &load_data();
    }
    elsif ($action eq "top" || $action eq "bottom" || $action eq "up" || $action eq "down"){
        &changsort();
    }
	elsif ( $action eq 'load_data' && $panel_name eq 'SrcIPGroup_panel' ) {
		&load_settingdata($sourceip_file);
	}
	elsif ( $action eq 'load_data' && $panel_name eq 'DestIPGroup_panel' ) {
		&load_settingdata($sourceip_file);
	}
	elsif ( $action eq 'load_data' && $panel_name eq 'ServiceName_panel' ) {
		&load_service();
	}
	elsif ( $action eq 'load_data' && $panel_name eq 'Appid_panel' ) {
		&load_settingdata($sourceip_file);
	}
	elsif ($action eq 'load_userlist') {
		&load_userlist();
	}
	elsif ($action eq 'load_app') {
		&load_app();
	}
    elsif ($action eq 'select_app') {
        &select_app();
    }  
	elsif ($action eq 'singletime_data' ) {
		&time_data($singletime_file);
	}
	elsif ($action eq 'looptime_data' ) {
		&time_data($looptime_file);
	}
    elsif ($action eq 'area_data' ) {
        &area_data($area_data);
    }
    elsif ( $action eq 'apply_data' && $panel_name eq 'mesg_box' ) {
        &apply_data();
    }
    elsif ($action eq 'delete_data') {
        &delete_data();
    }
    elsif ($action eq 'enable_data') {
        &toggle_enable( "on" );
    }
    elsif ($action eq 'disable_data') {
        &toggle_enable( "off" );
    }
    else {
        &show_page();
    }
}

sub show_page() {
    &openpage($page_config{'page_title'}, 1, $extraheader);
    &display_main_body();
    &closepage();
}

sub display_main_body() {
    printf<<EOF
    <div id="mesg_box" class="container"></div>
    <div id="add_panel" class="container"></div>
    <div id="list_panel" class="container"></div>
	<div id="SrcIPGroup_panel" class="container"></div>
	<div id="DestIPGroup_panel" class="container"></div>
	<div id="ServiceName_panel" class="container"></div>
	<div id="Appid_panel" class="container"></div>
	<div id="SrcUserlist_panel" class="container"></div>
EOF
    ;
}



sub get_config_hash($) {
    my $line_content = shift;
    chomp($line_content);
    my %config;
    $config{'valid'} = 1;#默认是合法的行，如果有不合法的，将该字段置为0
    if ($line_content eq '') {
        $config{'valid'} = 0;
        return %config;
    }
    #============自定义字段组装-BEGIN=========================#
    my @temp = split(/,/, $line_content);
    $config{'name'}              = $temp[0];
    $config{'description'}       = $temp[1];
    $config{'SrcIPGroupIds'}        = $temp[2];
	$config{'SrcUserlistIds'}       = $temp[3];
	$config{'DestIPGroupIds'}       = $temp[4];
	$config{'Appid'}             = $temp[5];
	$config{'ServiceName'}       = $temp[6];
	$config{'TimeName'}          = $temp[7];
	$config{'SingleOrCircle'}    = $temp[8];
	$config{'action_permission'} = $temp[9];
    $config{'isLog'}             = $temp[10];
    $config{'enable'}            = $temp[11];
    $config{'s_area'}            = $temp[12];
    $config{'d_area'}            = $temp[13];

    $config{'sour_mac_text'}            = $temp[14];
    $config{'sour_netip_text'}            = $temp[15];
    $config{'dest_ip_text'}            = $temp[16];
	
    $config{'sour_port_text'}            = $temp[17];

    #============自定义字段组装-END===========================#
    return %config;
}

sub get_config_record($) {
    my $hash_ref = shift;
    # print $hash_ref;
    my @record_items = ();
    push( @record_items, $hash_ref->{'name'} );
	push( @record_items, $hash_ref->{'description'} );

	push( @record_items, &datas_hander( $hash_ref->{'SrcIPGroupIds'},'save' ) );
    push( @record_items, &datas_hander( $hash_ref->{'SrcUserlistIds'},'save' ) );
    push( @record_items, &datas_hander( $hash_ref->{'DestIPGroupIds'},'save' ) );

	push( @record_items, $hash_ref->{'Appid'} );
	push( @record_items, $hash_ref->{'ServiceName'} );
    push( @record_items, $hash_ref->{'TimeName'} );
    my $isCircle ;
    if ($hash_ref->{'time_plan'} eq 'single_plan') {
        $isCircle = 0;
    }elsif($hash_ref->{'time_plan'} eq 'circle_plan'){
        $isCircle = 1;
    }
	push( @record_items, $isCircle );
    

	push( @record_items, $hash_ref->{'action_permission'} );
    push( @record_items, $hash_ref->{'isLog'} );
    push( @record_items, $hash_ref->{'enable'} );
    push( @record_items, $hash_ref->{'s_area'} );
    push( @record_items, $hash_ref->{'d_area'} );

    my $sour_mac_text = $hash_ref->{'sour_mac_text'};
    $sour_mac_text =~ s/\r\n/&/g;
    push( @record_items, $sour_mac_text );

    my $sour_netip_text = $hash_ref->{'sour_netip_text'};
    $sour_netip_text =~ s/\r\n/&/g;
    push( @record_items, $sour_netip_text );

    my $dest_ip_text = $hash_ref->{'dest_ip_text'};
    $dest_ip_text =~ s/\r\n/&/g;
    push( @record_items, $dest_ip_text );
    
    my $sour_port = $hash_ref->{'sour_port'};

    my $sour_port_text ;
    if ($sour_port eq 'port_any') {
        $sour_port_text = '';
    }elsif($sour_port eq 'port_icmp'){
        $sour_port_text = 'icmp:any';
    }elsif($sour_port eq 'port_tcp'){
        $sour_port_text = $hash_ref->{'port_tcp_text'};
        if ($sour_port_text eq '') {
            $sour_port_text = 'any';
        }
        $sour_port_text =~ s/\r\n/&/g;
        $sour_port_text =~ s/\:/\-/g;
        $sour_port_text = 'tcp:'.$sour_port_text;
    }elsif($sour_port eq 'port_udp'){
        $sour_port_text = $hash_ref->{'port_udp_text'};
        if ($sour_port_text eq '') {
            $sour_port_text = 'any';
        }
        $sour_port_text =~ s/\r\n/&/g;
        $sour_port_text =~ s/\:/\-/g;
        $sour_port_text = 'udp:'.$sour_port_text;
    }elsif($sour_port eq 'port_tu'){
        $sour_port_text = $hash_ref->{'port_tu_text'};
        if ($sour_port_text eq '') {
            $sour_port_text = 'any';
        }
        $sour_port_text =~ s/\r\n/&/g;
        $sour_port_text =~ s/\:/\-/g;
        $sour_port_text = 'tcp:'.$sour_port_text.';'.'udp:'.$sour_port_text;
    }
    push( @record_items, $sour_port_text );
    return join ",", @record_items;

}

sub get_compare_record($) {
    my $hash_ref = shift;
    my @record_items = ();
    #============自定义比较字段-BEGIN=========================#
    #一般来说比较的字段和保存的字段几乎都一致，但是存在保存时，
    #要更新修改时间等就不一样了，需要自己定义比较哪些字段=====#
    push( @record_items, $hash_ref->{'name'} );
    push( @record_items, $hash_ref->{'description'} );
    push( @record_items, $hash_ref->{'SrcIPGroup'} );
    push( @record_items, $hash_ref->{'SrcUserlist'} );
    push( @record_items, $hash_ref->{'DestIPGroup'} );
    push( @record_items, $hash_ref->{'Appid'} );
    push( @record_items, $hash_ref->{'ServiceName'} );
    push( @record_items, $hash_ref->{'TimeName'} );
    my $isCircle ;
    if ($hash_ref->{'time_plan'} eq 'single_plan') {
        $isCircle = 0;
    }elsif($hash_ref->{'time_plan'} eq 'circle_plan'){
        $isCircle = 1;
    }
    push( @record_items, $isCircle );
    push( @record_items, $hash_ref->{'action_permission'} );
    push( @record_items, $hash_ref->{'isLog'} );
    push( @record_items, $hash_ref->{'enable'} );
    push( @record_items, $hash_ref->{'s_area'} );
    push( @record_items, $hash_ref->{'d_area'} );

    my $sour_mac_text = $hash_ref->{'sour_mac_text'};
    $sour_mac_text =~ s/\r\n/&/g;
    push( @record_items, $sour_mac_text );

    my $sour_netip_text = $hash_ref->{'sour_netip_text'};
    $sour_netip_text =~ s/\r\n/&/g;
    push( @record_items, $sour_netip_text );

    my $dest_ip_text = $hash_ref->{'dest_ip_text'};
    $dest_ip_text =~ s/\r\n/&/g;
    push( @record_items, $dest_ip_text );

    my $sour_port = $hash_ref->{'sour_port'};
    my $sour_port_text ;
    if ($sour_port eq 'port_any') {
        $sour_port_text = '';
    }elsif($sour_port eq 'port_icmp'){
        $sour_port_text = 'icmp:any';
    }elsif($sour_port eq 'port_tcp'){
        $sour_port_text = $hash_ref->{'port_tcp_text'};
        if ($sour_port_text eq '') {
            $sour_port_text = 'any';
        }
        $sour_port_text =~ s/\r\n/&/g;
        $sour_port_text = 'tcp:'.$sour_port_text;
    }elsif($sour_port eq 'port_udp'){
        $sour_port_text = $hash_ref->{'port_udp_text'};
        if ($sour_port_text eq '') {
            $sour_port_text = 'any';
        }
        $sour_port_text =~ s/\r\n/&/g;
        $sour_port_text = 'udp:'.$sour_port_text;
    }elsif($sour_port eq 'port_tu'){
        $sour_port_text = $hash_ref->{'port_tu_text'};
        if ($sour_port_text eq '') {
            $sour_port_text = 'any';
        }
        $sour_port_text =~ s/\r\n/&/g;
        $sour_port_text = 'tcp:'.$sour_port_text.';'.'udp:'.$sour_port_text;
    }
    push( @record_items, $sour_port_text );
    return join ",", @record_items;

    #============自定义比较字段-END===========================#
    return join ",", @record_items;
}

sub save_data_handler() {
    my ( $status, $mesg ) = ( -1, "未开始检测各项的合法性" );

    #===第一步，检查名称是否重名===#
    my $name_exist_line_num = "";
    ( $status, $mesg, $name_exist_line_num ) = &where_is_field( $conf_file, ",", 0, $par{'name'} );
    if ( $name_exist_line_num ne "" ) {
        #===如果检测到已存在，则允许是编辑的情况，并且只能是原来的行===#
        if ( $par{'id'} ne "" && $par{'id'} eq $name_exist_line_num ) {
            #===允许通过===#
        } else {
            $status = -1;
            $mesg = "名称已存在";
            return ( $status, $mesg );
        }
    }

    #===第二步，判定用户传入的值的类型，并处理一个字段中的多个值，并用&连接===#
	if( $par{'ip_or_user'} eq 'sour_ip' ) {
		$par{'SrcIPGroup'} = &datas_hander( $par{'SrcIPGroup'},'save' );
		$par{'SrcUserlist'} = '';
	}elsif($par{'ip_or_user'} eq 'sour_user' ) {
		$par{'SrcUserlist'} = &datas_hander( $par{'SrcUserlist'},'save' );
		$par{'SrcIPGroup'} = '';
	}

	$par{'DestIPGroup'} = &datas_hander( $par{'DestIPGroup'},'save' );

	if( $par{'service_or_app'} eq 'service' ) {
		$par{'ServiceName'} = &datas_hander( $par{'ServiceName'},'save' );
		$par{'Appid'} = '';
	}else {
		$par{'Appid'} = &datas_hander( $par{'Appid'},'save' );
		$par{'ServiceName'} = '';
	}

    #===第三步，处理日志记录AND启用禁用===#
    if( $par{'isLog'} ne 'on' ) {
        $par{'isLog'} = 'off';
    }
    if ( $par{'enable'} ne "on" ) {
        $par{'enable'} = "off";
    }

    #===如果当前是编辑状态，检测传上来的字段与现有字段是否一致，一致就不在进行更改===#
    if ( $par{'id'} ne "" ) {
        # my $exist_record = &get_one_record( $conf_file, $par{'id'} );
        # my %exist_record_hash = &get_config_hash( $exist_record );
        # my $compare_record_old = &get_compare_record( \%exist_record_hash );
        # my $compare_record_new = &get_compare_record( \%par );
        # if ( $compare_record_old eq $compare_record_new ) {
            # $status = -1;
            # $mesg = "配置未改变";
        # } else {
            $status = 0;
            $mesg = "检测合格";
        # }
    } else {
        $status = 0;
        $mesg = "检测合格";
    }

    return ( $status, $mesg );
}

sub save_data() {
    
    my ( $status, $reload, $mesg ) = ( -1, 0, "未保存" );
    #===检测字段合法性===#
    ( $status, $mesg ) = save_data_handler();
    if ( $status != 0 ) {
        &send_status( $status, $reload, $mesg );
        return;
    }

    my $record = &get_config_record( \%par );
    my $item_id = $par{'id'};
    if( $item_id eq '' ) {
        ( $status, $mesg ) = &append_one_record( $conf_file, $record );
        $log_oper = "add";
    } else {
        ( $status, $mesg ) = &update_one_record( $conf_file, $item_id, $record );
        $log_oper = "edit";
    }
    if( $status == 0 ) {
        $reload = 1;
        &create_need_reload_tag();
        $mesg = "保存成功";
    } else {
        $mesg = "保存失败";
    }
    
    
    &send_status( $status, $reload, $mesg );
    
}

#更改配置文件存储顺序
sub changsort() {
    $log_oper = 'move' ;
    my ( $status, $reload, $error_mesg ) = &change_arrangement($par{'ACTION'},$par{'id'},$conf_file);
    &send_status($status, $reload, $error_mesg);
}
sub load_data(){
    my %ret_data;
    my @content_array = ();
    my ( $status, $error_mesg, $total_num ) = &get_detail_data( \@content_array );

    %ret_data->{'detail_data'} = \@content_array;
    %ret_data->{'total_num'} = $total_num;
    if ( -e $need_reload_tag ) {
        %ret_data->{'reload'} = 1;
    } else {
        %ret_data->{'reload'} = 0;
    }

    my $ret = $json->encode(\%ret_data);
    print $ret; 
}

sub get_detail_data($) {
    my $content_array_ref = shift;
    my $currpagepage = int( $par{'currpagepage'} );
    my $page_size = int( $par{'page_size'} );
    my $from_num = ( $currpagepage - 1 ) * $page_size;
    # my $search = &prepare_search( $par{'search'} );
    my $is_active = ModIsOK();
    my $search = $par{'search'};
    my @lines = ();
    my ( $status, $mesg, $total_num ) = ( -1, "未读取", 0 );
    my $max_id;
    #==判断是否只加载一页====#
    if( !$LOAD_ONE_PAGE ) {
        ( $status, $mesg, $total_num ) = &read_config_lines( $conf_file, \@lines);
        $max_id = @lines -1;
    } else {
        ( $status, $mesg, $total_num ) = &get_one_page_records( $conf_file, $page_size, $currpagepage, \@lines );
        $max_id = @lines -1;
    }

    $total_num = 0; #重新初始化总数
    
    for( my $i = 0; $i < @lines; $i++ ) {
        my $id = $from_num + $i;
        if( !$LOAD_ONE_PAGE ) {
            $id = $i;
        }
        my %hash = &get_config_hash( $lines[$i] );

        if ( !$hash{'valid'} ) {
            next;
        }

           
		    $hash{'ip_or_user'} = 'sour_ip';
            $hash{'SrcIPGroup'} = &datas_hander( $hash{'SrcIPGroup'},'load' );
            $hash{'IpOrUser'} = $hash{'SrcIPGroup'};
		#===加载IP或用户===#
		if( $hash{'SrcUserlistIds'} eq '' ) {
            if ($hash{'sour_mac_text'} eq '') {
                if ($hash{'sour_netip_text'} eq '') {
                    if ($hash{'SrcIPGroupIds'} eq '') {
                        $hash{'IpOrUser'} = '任意';   
                        $hash{'ip_or_user'} = 'sour_any';
                    }else{
                        $hash{'ip_or_user'} = 'sour_ip';
                        $hash{'SrcIPGroupIds'} = &datas_hander( $hash{'SrcIPGroupIds'},'load' );
                        $hash{'SrcIPGroup'} = &get_item_by_ids('/var/efw/objects/ip_object/ip_group',$hash{'SrcIPGroupIds'},1);
                        $hash{'IpOrUser'} = $hash{'SrcIPGroup'};                    
                    }
                }else{
                    $hash{'ip_or_user'} = 'sour_netip';
                    $hash{'sour_netip_text'} = &datas_hander( $hash{'sour_netip_text'},'load' );
                    $hash{'IpOrUser'} = $hash{'sour_netip_text'};
                }
            }else{
                $hash{'ip_or_user'} = 'sour_mac';
                $hash{'sour_mac_text'} = &datas_hander( $hash{'sour_mac_text'},'load' );
                $hash{'IpOrUser'} = $hash{'sour_mac_text'};
            }
		}else {
			$hash{'ip_or_user'} = 'sour_user';
            $hash{'SrcUserlistIds'} = &datas_hander( $hash{'SrcUserlistIds'},'load' );
            $hash{'SrcUserlist'} = &get_item_by_ids('/var/efw/AAA/user',$hash{'SrcUserlistIds'},1);
            $hash{'IpOrUser'} = $hash{'SrcUserlist'};
		}
		
		#===处理目标IP数据===#
		
        if ($hash{'DestIPGroupIds'} eq '') {
            if ($hash{'dest_ip_text'} eq '') {
                $hash{'Dest_IP_Group'} = '任意';
                $hash{'dest_ipgroup'} = 'dest_any';
            }else{
                $hash{'dest_ip_text'} = &datas_hander( $hash{'dest_ip_text'},'load' );
                $hash{'Dest_IP_Group'} = $hash{'dest_ip_text'};
                $hash{'dest_ipgroup'} = 'dest_group';
            }
        }else{
            $hash{'DestIPGroupIds'} = &datas_hander( $hash{'DestIPGroupIds'},'load' );
            $hash{'DestIPGroup'} = &get_item_by_ids('/var/efw/objects/ip_object/ip_group',$hash{'DestIPGroupIds'},1);
            $hash{'Dest_IP_Group'} = $hash{'DestIPGroup'};
            $hash{'dest_ipgroup'} = 'dest_ip';
        }
        #===处理源端口===#
		
        if ($hash{'sour_port_text'} eq '') {
            $hash{'sour_port'} = 'any'; 
            $hash{'sour_port_text'} = 'any';
        }else{
            my @sour_port_text_arr = split(/\;/,$hash{'sour_port_text'});
            my @sour_port_detail = split(/\:/,$sour_port_text_arr[0]);
            $hash{'sour_port'} = $sour_port_detail[0]; 
            $hash{'sour_port_text'} = $sour_port_detail[1];

            my $sour_port_text_arr_len = scalar(@sour_port_text_arr);
            if ($sour_port_text_arr_len eq 2) {
                
                $hash{'sour_port'} = 'tu'; 
            }
        }
        $hash{'sour_port'} ='port_'.$hash{'sour_port'};
        $hash{'sour_port_text'} = &datas_hander( $hash{'sour_port_text'},'load' );
		#===加载服务或应用===#
		if( $hash{'ServiceName'} eq '' ) {
			$hash{'service_or_app'} = 'app';
			$hash{'Appname'} = &get_appName( $hash{'Appid'} );
			$hash{'Appid'} = &datas_hander( $hash{'Appid'},'load' );
			$hash{'ServiceOrApp'} = $hash{'Appname'};
		}else {
			$hash{'service_or_app'} = 'service';
			$hash{'ServiceName'} = &datas_hander( $hash{'ServiceName'},'load' );
			$hash{'ServiceOrApp'} = $hash{'ServiceName'};
		}
		if ($hash{'TimeName'} eq '') {
            $hash{'TimeName'} = '无';
        }
        if ($hash{'SingleOrCircle'} eq '0') {
            $hash{'time_plan'} = 'single_plan';
        }elsif ($hash{'SingleOrCircle'} eq '1'){
            $hash{'time_plan'} = 'circle_plan';
        }
		#===将ACTION转化为中文===#
		if( $hash{'action_permission'} == 0 ) {
			$hash{'actionView'} = '允许';
		}
		if( $hash{'action_permission'} == 1 ) {
			$hash{'actionView'} = '丢弃';
		}
		if( $hash{'action_permission'} == 2 ) {
			$hash{'actionView'} = '切段会话';
		}		

        my @search_items = ('name','IpOrUser','Dest_IP_Group','ServiceOrApp');
        my $search_status = &search_data($search,\%hash,\@search_items);
        if ($search_status) {
            next;
        }
        $hash{'id'} = $id; #自定义id，id可以是任何字符，只要能唯一区别每一条数据
        $hash{'is_active'} = $is_active;
		$hash{'idView'} = $id + 1;#定义用户可见的序号
        push( @$content_array_ref, \%hash );
        $total_num++;
    }

    return ( $status, $mesg, $total_num );
}

sub delete_data() {
    $log_oper = 'del';
    my $reload = 0;
    my ( $status, $mesg ) = &delete_several_records( $conf_file, $par{'id'} );

    if( $status == 0 ) {
        $reload = 1;
        $mesg = "删除成功"
        &create_need_reload_tag();
    }

     &send_status( $status, $reload, $mesg );
}

sub toggle_enable($) {
    my $enable = shift;
    my $operation = "启用";
    $log_oper = 'enable';
    if ( $enable ne "on" ) {
        $operation = "禁用";
        $log_oper = 'disable';
    }
    my @lines = ();
    my $reload = 0;

    my ( $status, $mesg ) = &read_config_lines( $conf_file, \@lines );
    if( $status != 0 ) {
        $mesg = "$operation失败";
        &send_status( $status, $reload, $mesg );
        return;
    }

    my %item_id_hash;
    my @item_ids = split( "&", $par{'id'} );
    foreach my $id ( @item_ids ) {
        $item_id_hash{$id} = $id;
    }

    my $len = scalar( @lines );

    for ( my $i = 0; $i < $len; $i++ ) {
        if( $item_id_hash{$i} eq "$i" ) {
            my %config = &get_config_hash( $lines[$i] );
            $config{'enable'} = $enable;
            if ($config{'SingleOrCircle'} eq '1') {
                $config{'time_plan'} = 'circle_plan';
            }elsif($config{'SingleOrCircle'} eq '0'){
                $config{'time_plan'} = 'single_plan';
            }
            $lines[$i] = &get_config_record(\%config);
        }
    }

    my ( $status, $mesg ) = &write_config_lines( $conf_file, \@lines );
    if( $status != 0 ) {
        $mesg = "$operation失败";
    } else {
        $mesg = "$operation成功";
        $reload = 1;
        &create_need_reload_tag();
    }

    &send_status( $status, $reload, $mesg );
    return;
}

sub apply_data() {
    $log_oper = 'apply';
	`sudo $apply_file`;
    &clear_need_reload_tag();
    &send_status( 0, 0, "应用成功" );
}

sub send_status($$$) {
    #==========状态解释=========================#
    # => $status: 0 表示成功，其他表示不成功
    # => $reload: 1 表示重新应用，其他表示不应用
    # => $mesg: 相关错误的消息
    #===========================================#
    my ($status, $reload, $mesg) = @_;
    my %hash;
    %hash->{'status'} = $status;
    %hash->{'reload'} = $reload;
    %hash->{'mesg'} = $mesg;
    my $result = $json->encode(\%hash);
    print $result;
    
    &write_log($CUR_PAGE,$log_oper,$status,$rule_or_congfig);

}

sub prepare_search($) {
    my $search = shift;

    $search =~ s/\^/\\\^/g;
    $search =~ s/\$/\\\$/g;
    $search =~ s/\./\\\./g;
    $search =~ s/\|/\\\|/g;
    $search =~ s/\(/\\\(/g;
    $search =~ s/\)/\\\)/g;
    $search =~ s/\[/\\\[/g;
    $search =~ s/\]/\\\]/g;
    $search = lc $search;

    return $search;
}

sub prepare_note($) {
    my $note = shift;
    $note =~ s/\n/ /g;
    $note =~ s/,/，/g;
    return $note;
}

sub create_need_reload_tag() {
    system( "touch $need_reload_tag" );
}

sub clear_need_reload_tag() {
    system( "rm $need_reload_tag" );
}

sub make_file(){
    if(! -e $conf_dir){
        system("mkdir -p $conf_dir");
    }
    
    if(! -e $conf_file){
        system("touch $conf_file");
    }
}

#加载配置面板数据
sub load_settingdata() {
    my $file = shift;
	
	my %ret_data;
    my @content_array;
    my @lines = ();
    my ( $status, $error_mesg, $total_num );
    ( $status, $error_mesg) = &read_config_lines( $file, \@lines );    
    my $record_num = @lines;
    $total_num = $record_num;
    
    for ( my $i = 0; $i < $record_num; $i++ ) {
        my %config;
        my @data_line = split(",",$lines[$i]);
        %config->{'name'} = $data_line[1];
        %config->{'id'} = $data_line[0];
        %config->{'valid'} = 1;
        push( @content_array, \%config );
    }
    
    %ret_data->{'detail_data'} = \@content_array;
    %ret_data->{'total_num'} = $total_num;
    %ret_data->{'status'} = $status;
    %ret_data->{'error_mesg'} = $error_mesg;
    %ret_data->{'page_size'} = $total_num;
    

    my $ret = $json->encode(\%ret_data); 
    print $ret; 
}

#加载服务数据 
sub load_service() {
	
	my %ret_data;
    my @content_array;
    my @linesSys = ();
	my @linesCus = ();
    my ( $status, $error_mesg, $total_num );
    ( $status, $error_mesg ) = &read_config_lines( $service_cus_file, \@linesSys );
	( $status, $error_mesg ) = &read_config_lines( $service_sys_file, \@linesCus );	
    $total_num = 0;
    
	#===载入预定义服务数据===#
	for ( my $i = 0; $i < @linesCus; $i++ ) {
		my %config;
		my @data_line = split(",",$linesCus[$i]);
		%config->{'name'} = $data_line[1];
		%config->{'id'} = $total_num;
		%config->{'type'} = '预定义服务';
		%config->{'valid'} = 1;
        if($data_line[1] eq "any") {
            %config->{'type'} = '所有服务';
        }
		push( @content_array, \%config );
		$total_num++;
    }
	
	#===载入自定义服务数据===#
	for ( my $i = 0; $i < @linesSys; $i++ ) {
        my %config;
        my @data_line = split(",",$linesSys[$i]);
        %config->{'name'} = $data_line[1];
        %config->{'id'} = $total_num;
		%config->{'type'} = '自定义服务';
        %config->{'valid'} = 1;
        push( @content_array, \%config );
		$total_num++;
    }
    

    
    %ret_data->{'detail_data'} = \@content_array;
    %ret_data->{'total_num'} = $total_num;
    %ret_data->{'status'} = $status;
    %ret_data->{'error_mesg'} = $error_mesg;
    %ret_data->{'page_size'} = $total_num;
    

    my $ret = $json->encode(\%ret_data); 
    print $ret;
}

#加载生效时间
sub time_data() {
	my $time_file = shift;
    my %ret_data; 
    my @lines;
	my @lines_name;
    my ( $status, $error_mesg)= &read_config_lines($time_file ,\@lines);

    foreach(@lines){
        push( @lines_name,(split(",",$_))[1]);
    }

    %ret_data->{'time_data'} = \@lines_name;
    %ret_data->{'status'} = $status;
    %ret_data->{'mesg'} = $error_mesg;
    my $ret = $json->encode(\%ret_data);
    print $ret; 

}
#加载区域数据
sub area_data(){
    %ret_data->{'area_s'} = `sudo /usr/local/bin/getZoneJson.py -z`;
    %ret_data->{'area_d'} = `sudo /usr/local/bin/getZoneJson.py`;
    my $ret = $json->encode(\%ret_data);
    print $ret;
}

#将同一字段中的多个值进行处理
sub datas_hander() {
    my ($data,$act) = @_;
    if( $act eq 'save' ) {
        $data =~ s/\ //g;
        $data =~ s/\,|\，/&/g;
    }
    if($act eq 'load') {
        $data =~ s/&/\, /g;
    }
    return $data;
    
}

#加载用户组
sub load_userlist() {
    my $edit_id = $par{'edit_id'};
    my %ret_data;
    my $str_json;
    if($edit_id eq ""){
         $str_json = `sudo $userlist`;
    }
    else{
        my $cmd_str = $userlist.' -n '.$edit_id;
        $str_json = `sudo $cmd_str`;
    }
   
    print $str_json;
}

#加载应用组
sub load_app() {
	system "$applist";
}

#通过Appid查询得到Appname
sub get_appName() {
	my $appids = shift;
	my @appid  = split("&",$appids);
	my @lines;
	my @appname;
    my %id_ref_name;
	my ( $status,$mesg ) = &read_config_lines( $app_file,\@lines );
        ( $status,$mesg ) = &read_config_lines( $app_custom_file,\@lines);
    #组装hash;id与name的相关联
    for(my $i = 0; $i < @lines; $i++){
        my @line_data = split(",",$lines[$i]);
        %id_ref_name->{$line_data[0]} = $line_data[1];
    }
    for(my $j = 0; $j < @appid; $j++){
        my $key = $appid[$j];
        push(@appname,$id_ref_name{$key});
    }
	
	return join ",", @appname;	
}
sub select_app(){

    my $dest=ModIsOK();

    print $dest;
}
sub ModIsOK()
{  
    my $result;
    $result =`sudo $cmd_set_appctrlIsactive`;
    chomp($result);
    if ($result eq '1'){
        return 1;
    }else{
        return 0;
    }
}
