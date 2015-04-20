//Home_Login controllers.js

function ng_serialize(ng_form){
  	var arr=[];
  	for (var k in ng_form){
  		var v ="";
  		var obj = ng_form[k];
  		if(! ng_form.hasOwnProperty(k)||!obj||!obj.$name)
  			continue;  	
  		if(obj.$viewValue){
  			v=obj.$viewValue.join?obj.$viewValue.join(","):obj.$viewValue;
  		}  		
  		if(v==="")
  			continue;
  		else if(v===true)
  			v="1";
  		else if(v===false)
  			v="0"
  		arr.push(obj.$name+"="+encodeURIComponent(v));
  	}
  	return arr.join("&");
  }
function swal_mutex(){
	if(!window.swal_mutex_lock){
		$("button.confirm").text("Processing...")
		window.swal_mutex_lock=true,
		window.setTimeout(function(){window.swal_mutex_lock=false;},4000);
		return false;
	}
	console.log("swal_mutex_reject");
	return true;
	}

var myAppModule = angular.module('myApp', ['ngRoute']);

myAppModule.value('userStatus', {
  username: "",
  user_id: "",
  email:"",
  img:"images/de.png",
});
myAppModule.constant('selectSource', {
		skillList:["数学模型","推荐系统","回归","分类","聚类","主成分分析","因子分析","数据清洗","SQL","Hadoop","Spark","自然语言处理","图像处理","机器学习","最优化","R Programming","Python","SAS","SPSS","数据可视化","Tableau","RapidMiner","Weka","Excel","数据分析写作","商业分析","web开发"],
		districtList:["北京","天津","河北","山西","内蒙古","辽宁","吉林","黑龙江","上海","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","广西","海南","重庆","四川","贵州","云南","西藏","陕西","甘肃","青海","宁夏","新疆","台湾","香港","澳门"],
		competitionTypeList:["数据分析","数据挖掘","推荐算法","预测","数据建模","数据可视化","数据工程","数据应用构建"],
		competitionStageList:["不限","尚未开始","报名中","进行中","作品评选中","已结束"],
		competitionList:[{name:"EMC杯智慧校园开放数据大赛",id:1}]
});
myAppModule.controller('navbarCtr',
function($scope,$rootScope,$http,userStatus) { 
	$scope.userStatus=userStatus; 
	$http({
				method  : 'GET',
				url     : '/kesci_backend/api/auth/check_status',

    		}).success(function(data) {   
    		if(data.is_login===false){
    			window.location.href="../home_def/"
    		}
    		if(typeof(data.username)!="undefined"){
    			for(var k in data){
	    			if(!data.hasOwnProperty(k))
	    				continue;
	    			$scope.userStatus[k]=data[k];
    			}

    		}
    });
	$rootScope.$on('$routeChangeSuccess', function(){
        if(arguments[1]&&arguments[1].$$route&&arguments[1].$$route.controller){
       		$scope.ctrName=arguments[1].$$route.controller;
       		if ($scope.ctrName.indexOf("usercenter")>-1) {
       			$scope.ctrName="usercenterCtr";
       		};
       	}
            
    }); 
	$scope.doLogout=function(){
			$http({
						method  : 'POST',
						url     : '/kesci_backend/api/auth/logout',
						data    : "",
						headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    		}).success(function(data) {    		
    		if(data.msg&&data.msg.indexOf("successfully")>-1){
    			window.location.href="../home_def/";
    		}
    	});
	}
});
myAppModule.controller('newsCtr',
function($scope) {
});

myAppModule.controller('mineCtr',
function($scope,$http,userStatus) {
		$scope.emc_data={is_reg:{},reg_num:{},is_admit:{}};
    	$scope.userStatus=userStatus;
    	$scope.markRead=function(noticeIdx){
			var tmp=[];
			tmp.push($scope.userStatus.unread_notices[noticeIdx]["id"]);
			$scope.userStatus.unread_notices.splice(noticeIdx,1);
			$http({
							method  : 'POST',
							url     : '/kesci_backend/api/notifications/official_notice',
							data    : "json_data="+encodeURIComponent(JSON.stringify(tmp)),
							headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	    		}).success(function(data) {});
		}
		$http({
						method  : 'GET',
						url     : ' /kesci_backend/api/associations/is_registered?association_id=1,2'
    		}).success(function(data) {    		
    		 for(var k in data.data){
    		 	$scope.emc_data.is_reg["asso_"+data.data[k].association_id]=data.data[k].flag;
    		 	$scope.emc_data.is_admit["asso_"+data.data[k].association_id]=data.data[k].admit;
    		 	}
    		 
    	});
    	$http({
						method  : 'GET',
						url     : ' /kesci_backend/api/competitions/is_registered?competition_id=1'
    		}).success(function(data) {    		
    		 for(var k in data.data){
    		 	$scope.emc_data.is_reg["comp_"+data.data[k].competition_id]=data.data[k].flag;
    		 	}
    		 		
    	});    
    
});
myAppModule.controller('discoverCtr',
function($scope,$http,selectSource,userStatus) {
	$scope.currentTab=1;
	$scope.selectSource=selectSource;


	$scope.clearAllForms=function(){	
		//$scope.competitionSearch_name="";
		//$scope.competitionSearch_selectedDistrict=[];
		//$scope.competitionSearch_selectedType=[];
		//$scope.competitionSearch_selectedTime="不限";
		$scope.tmp_team_teamname="";
		$scope.tmp_team_competition=[];
		$scope.tmp_team_district=[];
		$scope.tmp_team_skill=[];
		$scope.tmp_people_username="";
		$scope.tmp_people_competition=[];
		$scope.tmp_people_district=[];
		$scope.tmp_people_skill=[];		
	}
	$http({
				method  : 'GET',
				url     : '/kesci_backend/api/teams/basic_info'	
      	}).success(function(data) {      		
           if(data.teams.length>0)
           		$scope.userTeam=data.teams[0];
    });

	$scope.updatePageNumber=function(page_no,per_page,total_num){
		var p=Math.ceil(total_num/per_page);
		$scope.pageInfo={
			total:Number(total_num),
			show:p>1?true:false,
			current:Number(page_no),
			array:(function(n){var tmp=[];for(var x=0;x<Number(n);x++){tmp.push(x+1)}return tmp})(p)
		}    

	}
	$scope.pageAction=function(pageNumber){
		if(!$scope.pageInfo)
			return;		
		if(pageNumber=="prev"){
			if($scope.pageInfo.current<=1)
				return;
			pageNumber=$scope.pageInfo.current-1;
		}
		else if(pageNumber=="next"){
			if($scope.pageInfo.current>=$scope.pageInfo.array.length)
				return;
			pageNumber=$scope.pageInfo.current+1;
		}
		else if(pageNumber==$scope.pageInfo.current){
			return;
		}
		if($scope.currentTab==2){
			$scope.peopleFormSubmit(true,pageNumber);
		}
    else if($scope.currentTab==1){
      $scope.teamFormSubmit(true,pageNumber);
    }
	}
	$scope.clearResult=function(){
		$scope.people_result=undefined;
		$scope.team_result=undefined;
		$scope.pageInfo=undefined;
	}
	$scope.findCompetitionName=function(id){
		for(var idx in $scope.selectSource.competitionList){
			if (id==$scope.selectSource.competitionList[idx]["id"]) {
				return $scope.selectSource.competitionList[idx]["name"];
			};
		}
		return '';
	}

	$scope.peopleFormSubmit=function(isPageAction,targetPage){	
		
		var queryStr;
		if(isPageAction){			
			queryStr=$scope.lastQuery_people+"&page_no="+targetPage;
      var a=document.getElementById("scroll_anchor");
      if(a.scrollIntoView)
        a.scrollIntoView(); 
		}
		else{
			$scope.clearResult();
			$scope.lastQuery_people=ng_serialize($scope.discover_people_form);
			queryStr=$scope.lastQuery_people;
		}			
		$http({
				method  : 'POST',
				url     : '/kesci_backend/api/api_users/listing',
				data    : queryStr	,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	    	}).success(function(data) {
	    		$scope.people_result=data;
	    		$scope.updatePageNumber(data.page_no,data.per_page,data.total_num);
	    	});		
	}
	$scope.teamFormSubmit=function(isPageAction,targetPage){
		var queryStr;
		if(isPageAction){			
			queryStr=$scope.lastQuery_team+"&page_no="+targetPage;
      var a=document.getElementById("scroll_anchor");
      if(a.scrollIntoView)
        a.scrollIntoView(); 
		}
		else{
			$scope.clearResult();
			$scope.lastQuery_team=ng_serialize($scope.discover_team_form);
			queryStr=$scope.lastQuery_team;
		}			
		$http({
				method  : 'POST',
				url     : '/kesci_backend/api/teams/listing',
				data    : queryStr	,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	    	}).success(function(data) {
	    		$scope.team_result=data;
	    		$scope.updatePageNumber(data.page_no,data.per_page,data.total_num);
	    	});		
	}
  $scope.sendMsg=function(user_id,name){
  	if(user_id==userStatus.user_id){
  		swal("你好无聊 (﹁\"﹁)","为什么会有人给自己发私信啊啊啊啊啊","warning");
  		return;
  	}
  	swal({   
  		title: "发送私信",   
  		text: "请输入发送给 "+name+" 的私信内容",   
  		type: "input",   
  		showCancelButton: true,   
  		closeOnConfirm: false
  		}, function(msg){ 
  		   if(msg===false){
      			return;
    	   }
    	   else if(msg==""){
      			swal("出错了...","私信内容不能为空.","error");
      			return;
    	   }
    	  if(swal_mutex()) 
    	  	return;
    	  $http({
		        method  : 'POST',
		        url     : '/kesci_backend/api/messages/person_to_person',
		        data    : "receiver_id="+user_id+"&"+"content="+encodeURIComponent(msg),
		        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		        }).success(function(data) {
		          if(data.msg&&data.msg.indexOf("success")>-1){
		            swal("成功!", "私信已发送", "success") ;
		            } 
		          else{
		            swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"发送私信时出现问题","error");   
		            console.log(data);
		          }
		        });  
		  return;
  		});
  }
  $scope.inviteUser=function(user_id,name){
  /*	if($scope.userTeam&&$scope.userTeam.team_member.indexOf(user_id)>-1){
  		swal("出错了...",name+" 已经在你的队伍里了.","warning");
  		return;
  	}*/
  	swal({   
  		title: "邀请 "+name+" 加入团队 "+$scope.userTeam.team_name,   
  		text: "请输入邀请信息 :",   
  		type: "input",   
  		showCancelButton: true,   
  		closeOnConfirm: false
  		}, function(msg){ 
  		   if(msg===false){
      			return;
    	   }
    	   else if(msg==""){
      			swal("出错了...","邀请信息不能为空.","error");
      			return;
    	   }
    	   if(swal_mutex()) 
    	  	return;
    	   $http({
			        method  : 'POST',
			        url     : '/kesci_backend/api/teams/invitation',
			        data    : "invite_user_id="+user_id+"&invitation_msg="+encodeURIComponent(msg)+"&team_id="+$scope.userTeam.team_id,
					headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		        }).success(function(data) {
		          console.log(data);	
		          if(data.msg&&data.msg.indexOf("success")>-1){
		            swal("成功!", "邀请已发送", "success") 
		          }
		          else{ 
		          	swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"邀请时出错","error");  
		          	console.log(data);
		          }
		        });  
  		});   
  }

$scope.applyTeam=function(team_id,team_name) {	
	swal({   
  		title: "申请加入团队 "+team_name,   
  		text: "请输入申请信息 :",   
  		type: "input",   
  		showCancelButton: true,   
  		closeOnConfirm: false
  		}, function(msg){ 
  		   if(msg===false){
      			return;
    	   }
    	   else if(msg==""){
      			swal("出错了...","申请信息不能为空.","error");
      			return;
    	   }
    	   if(swal_mutex()) 
    	  	return;
    	   $http({
			        method  : 'POST',
			        url     : '/kesci_backend/api/teams/application',
			        data    : "team_id="+team_id+"&application_msg="+encodeURIComponent(msg)+"&competition_id=1",
					headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		        }).success(function(data) {	
		          if(data.msg&&data.msg.indexOf("success")>-1){
		            swal("成功!", "申请已发送", "success") 
		          }
		          else{ 
		          	swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"申请时出错","error");  
		          	console.log(data);
		          }
		        });  
  		});   
}
$scope.sendMsgToTeam=function(team_id,name){
	/*if($scope.userTeam&&$scope.userTeam.team_member.indexOf(userStatus.user_id)>-1){
  		swal("出错了...","不能给自己所在的团队发送信息","warning");
  		return;
  	}*/
  	swal({   
  		title: "发送团队消息",   
  		text: "请输入发送给团队 "+name+" 的消息 : ",   
  		type: "input",   
  		showCancelButton: true,   
  		closeOnConfirm: false
  		}, function(msg){ 
  		   if(msg===false){
      			return;
    	   }
    	   else if(msg==""){
      			swal("出错了...","消息不能为空.","error");
      			return;
    	   }
    	   if(swal_mutex()) 
    	  	return;
    	   $http({
			        method  : 'POST',
			        url     : '/kesci_backend/api/messages/person_to_team',
			        data    : "team_id="+team_id+"&"+"content="+encodeURIComponent(msg),
					headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		        }).success(function(data) {
		          console.log(data);	
		          if(data.msg&&data.msg.indexOf("success")>-1){
		            swal("成功!", "团队消息已发送", "success") 
		          }
		          else{ 
		          	swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"团队消息发送时出错","error");  
		          	console.log(data);
		          }
		        });  
  		});   
}
	 
});
myAppModule.controller('myteamCtr',
function($scope,$http,$window,selectSource) {
	$scope.selectSource=selectSource;
	$scope.findCompetitionName=function(id){
		for(var idx in $scope.selectSource.competitionList){
			if (id==$scope.selectSource.competitionList[idx]["id"]) {
				return $scope.selectSource.competitionList[idx]["name"];
			};
		}
		return '';
	}
	$scope.clearTeamCreate=function(){
		$scope.tmp_team_teamname="";
		$scope.tmp_team_competition="";
		$scope.short_description="";
		$scope.tmp_team_description="";
		$scope.tmp_team_skill=[];
	}
	$scope.submitTeamCreate=function(){
	    if(swal_mutex()) 
    	  	return;
		$http({
				method  : 'POST',
				url     : '/kesci_backend/api/teams/create',
				data    : ng_serialize($scope.create_team_form),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	    }).success(function(data) {
	    	   if(data.errors.length<1){
	    			swal("创建成功","团队已创建 : "+data.data.team_name,"success");
	    			$scope.clearTeamCreate();
	    			$scope.show_create_form=false;
            $scope.loadTeamData();
	    		}
	    		else{
	    			swal("出错了...",data.errors.join(","),"error");
	    			console.log("创建团队时出现问题",data);
	    		}	    	
	    }).error(function(data){
	    			swal("出错了...","HTTP Code:"+arguments[1],"error");
	    			//console.log("创建团队时出现问题",data);
	    });
	}
  $scope.rejectInvitation=function(record_id){
     sweetAlert({
        title: "拒绝邀请",
        text: "请输入拒绝理由 : ",
        type: "input",
        showCancelButton: true,   
        closeOnConfirm: false   
      },function(msg){
        if(swal_mutex()) 
    	  	return;
        $http({
            method  : 'POST',
            url     : '/kesci_backend/api/teams/decline_invitation',
            data    : "record_id="+record_id+"&decline_reason="+encodeURIComponent(msg),
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).success(function(data) {
          if(data.msg&&data.msg.indexOf("success")>-1){
                swal("成功!", "拒绝邀请成功", "success") ;
                $window.setTimeout($scope.loadTeamData,1000);               
           }
          else{ 
                swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"拒绝邀请时出错","error");  
                console.log(data);
          }
          });
      });
  }
  $scope.acceptInvitation=function(record_id){
    sweetAlert({
        title: "接受邀请",
        text: "确认接受此邀请?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "接受",
        closeOnConfirm: false,
        html: false
      },function(){
        if(swal_mutex()) 
    	  	return;
        $http({
        method  : 'POST',
        url     : '/kesci_backend/api/teams/agree_invitation',
        data    : "record_id="+record_id,
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data) {
          if(data.msg&&data.msg.indexOf("success")>-1){
                swal("成功!", "接受邀请成功", "success") ;
                $window.setTimeout($scope.loadTeamData,1000);     
           }
          else{ 
                swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"接受邀请时出错","error");  
                console.log(data);
          }
      });
      });
  }
   $scope.sendMsgToTeam=function(team_id,name){
    swal({   
      title: "发送团队消息",   
      text: "请输入发送给团队 "+name+" 的消息 : ",   
      type: "input",   
      showCancelButton: true,   
      closeOnConfirm: false
      }, function(msg){ 
         if(msg===false){
            return;
         }
         else if(msg==""){
            swal("出错了...","消息不能为空.","error");
            return;
         }
         if(swal_mutex()) 
    	  	return;
         $http({
              method  : 'POST',
              url     : '/kesci_backend/api/messages/person_to_team',
              data    : "team_id="+team_id+"&"+"content="+encodeURIComponent(msg),
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
              console.log(data);  
              if(data.msg&&data.msg.indexOf("success")>-1){
                swal("成功!", "团队消息已发送", "success") ;            
              }
              else{ 
                swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"团队消息发送时出错","error");  
                console.log(data);
              }
            });  
      });   
}
	$scope.loadTeamData=function(){	
		$http({
				method  : 'GET',
				url     : '/kesci_backend/api/teams/my_team'				
	    }).success(function(data) {
        $scope.teamData={};
        $scope.teamData.teams=data.teams;
        $scope.teamData.applyTeams=[];
        $scope.teamData.inviteTeams=[];      
        for(var i in data.zudui_msg){
          if(data.zudui_msg[i].type==2&&data.zudui_msg[i].readtime==0){
          	for(var x in data.zudui_team_info){
          		if (data.zudui_team_info[x].team_id==data.zudui_msg[i].team_id) {
          			data.zudui_msg[i].team_info=data.zudui_team_info[x];
          			break;
          		};
          	}
            $scope.teamData.applyTeams.push(data.zudui_msg[i]);
          }
          else if(data.zudui_msg[i].type==1&&data.zudui_msg[i].readtime==0){
          	for(var x in data.zudui_team_info){
          		if (data.zudui_team_info[x].team_id==data.zudui_msg[i].team_id) {
          			data.zudui_msg[i].team_info=data.zudui_team_info[x];
          			break;
          		};
          	}
            $scope.teamData.inviteTeams.push(data.zudui_msg[i]);
          }
        }
      })
	 }
	$scope.loadTeamData();
});
myAppModule.controller('usercenter_profile_edit',
function($scope,$http,selectSource,userStatus) {
  $scope.userStatus=userStatus;
  $scope.currentTab=0; 
  $scope.tabMsg={};
  $scope.tabLoadFlag=[false,false,false];
  $scope.selectSource=selectSource;

  $scope.removePfRecord=function(type,index){
  sweetAlert({
    title: "删除",
    text: "确认删除此记录?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "删除",
    closeOnConfirm: true,
    html: false
  }, function(){
     if(type!="edu_exp" && type!="competition_exp" && type!="practice_exp" && type!="other_honor"){
      console.log("removePfRecorError:",type,index);
      return;
    }
    $scope.tabMsg={};
    var idk=type+"_id";
    if(type=="other_honor")
    	idk="honor_id";
    if(typeof($scope.detail_info[type][index][idk])=="undefined"){
      $scope.$apply(function(){$scope.detail_info[type].splice(index,1);});      
    }
    else{
      $http({
                  method  : 'DELETE',
                  url     : ' /kesci_backend/api/api_users/'+type+'s/'+$scope.detail_info[type][index][idk]
              }).success(function(data) {       
              if(data.msg=="delete success"){
                $scope.detail_info[type].splice(index,1);
              }
              else{
                console.log("delete Error ",type,index,data);
              }

            });
   }   
  });
};
  $scope.addPfRecord=function(type){
    switch(type){
      case "edu_exp":
        $scope.detail_info.edu_exp.push({university:"",start_time:"",end_time:"",major:"",department:"",level:"",university_district:""});
        break;
      case "competition_exp":
        $scope.detail_info.competition_exp.push({competition_name:"",start_time:"",end_time:"",awards:"",project_url:"",competition_id:0,verified:0});
        break;
      case "practice_exp":
        $scope.detail_info.practice_exp.push({practice_name:"",start_time:"",end_time:"",detail:"",practice_type:3});
        break;
      case "other_honor":
      	$scope.detail_info.other_honor.push({honor_name:"",start_time:"",end_time:""});
        break;
      default:
        console.log("addPfRecorError:",type);
      }
  }

  $scope.modelLoader=function(idx,force){
  	$scope.tabMsg={};
  	var modelname=["basic_info","contact_info","detail_info"];
  	if(!(idx<3 && idx>-1))
  		return;
  	if(!force && $scope.tabLoadFlag[idx])
  		return;  	
  	$http({
        method  : 'GET',
        url     : '/kesci_backend/api/api_users/'+[modelname[idx]]
        }).success(function(data) {   
          $scope.tabLoadFlag[idx]=true;
          $scope[modelname[idx]]=data;
          if(idx==0)
          	$scope.updateUniversityList();  
    });
  }
  $scope.modelLoader(0);

  $scope.checkAndSubmit_basic=function(){
  //	console.log(ng_serialize($scope.basic_info_form));
    $scope.tabMsg={};
  	if(!$scope.basic_info_form.$dirty){
  		$scope.tabMsg={warn:true};
  		return;
  	}
	$http({
        	method  : 'POST',
        	url     : '/kesci_backend/api/api_users/basic_info',
        	data    : ng_serialize($scope.basic_info_form), 
        	headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    	}).success(function(data) {
    		if(data.university){
    			$scope.contact_info=data.data;
    			$scope.tabMsg={succ:true};
    		}
    		else{
    			$scope.tabMsg={errors:["调试信息已输出"]};
    			$scope.tabMsg.errors.push(data.error);
    			console.log(data);
    		}
    	});
  };
  $scope.checkAndSubmit_contact=function(){
    $scope.tabMsg={};
  	if(!$scope.contact_info_form.$dirty){
  		$scope.tabMsg={warn:true};
  		return;
  	}
	$http({
        	method  : 'POST',
        	url     : '/kesci_backend/api/api_users/contact_info',
        	data    : ng_serialize($scope.contact_info_form), 
        	headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    	}).success(function(data) {
    		if(data.msg=="success"){
    			$scope.contact_info=data.data;
    			$scope.tabMsg={succ:true};
    		}
    		else{
    			$scope.tabMsg={errors:["调试信息已输出"]};
    			$scope.tabMsg.errors.push(data.error);
    			console.log(data);
    		}
    	});
  };
  $scope.checkAndSubmit_detail=function(){
    $scope.tabMsg={};
    var jsonData={};   
    var isDirty=false;
    for(var k in $scope.detail_info.edu_exp){
      var obj=document.getElementById("form_edu_exp_"+k);
      if(obj&&obj.className.indexOf("ng-dirty")>-1){      
       // console.log("dirty","form_edu_exp_"+k);
        isDirty=true;
        if(typeof(jsonData["edu_exp"])=="undefined")
          jsonData["edu_exp"]=[];
        jsonData["edu_exp"].push($scope.detail_info.edu_exp[k]); 
      }
    }
    for(var k in $scope.detail_info.competition_exp){
      var obj=document.getElementById("form_competition_exp_"+k);      
      if(obj&&obj.className.indexOf("ng-dirty")>-1){             
        //console.log("dirty","competition_exp"+k);
        isDirty=true;
        if(typeof(jsonData["competition_exp"])=="undefined")
          jsonData["competition_exp"]=[];
        jsonData["competition_exp"].push($scope.detail_info.competition_exp[k]); 
      }
    }

    for(var k in $scope.detail_info.practice_exp){
      var obj=document.getElementById("form_practice_exp_"+k);
      if(obj&&obj.className.indexOf("ng-dirty")>-1){        
        //console.log("dirty","form_practice_exp_"+k);
        isDirty=true;
        if(typeof(jsonData["practice_exp"])=="undefined")
          jsonData["practice_exp"]=[];
        jsonData["practice_exp"].push($scope.detail_info.practice_exp[k]); 
      }
    }
     for(var k in $scope.detail_info.other_honor){
      var obj=document.getElementById("form_other_honor_"+k);
      if(obj&&obj.className.indexOf("ng-dirty")>-1){        
       // console.log("dirty","form_other_honor_"+k);
        isDirty=true;
        if(typeof(jsonData["other_honor"])=="undefined")
          jsonData["other_honor"]=[];
        jsonData["other_honor"].push($scope.detail_info.other_honor[k]); 
      }
    }
  if(isDirty){
      var jsonStr=angular.toJson(jsonData);
      //console.log("json:",jsonStr);
      $http({
            method  : 'POST',
            url     : '/kesci_backend/api/api_users/detail_info',
            data    : "json_data="+encodeURIComponent(jsonStr), 
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function(data) {
          if(typeof(data.edu_exp)!="undefined"){
            $scope.tabMsg={succ:true};
            $scope.detail_info=data;
          }
          else{
            $scope.tabMsg={errors:["保存时出错."]};
            console.log(data);
          }
        });
  }
  else{
    $scope.tabMsg={warn:true};
  }
  };

  $scope.updateUniversityList=function(){
	if($scope.basic_info && $scope.basic_info.university_district){
		$http({
			method  : 'GET',
			url     : '../shared/data/college/'+ $scope.basic_info.university_district+'.json'
		}).success(function(data) {   
			for(var c in data){
				if(data.hasOwnProperty(c)){
					$scope.tmp_universityList=data[c];    					
					$scope.tmp_university=$scope.basic_info.university;
				}
			}
		});	
	}	
  }
});

myAppModule.controller('usercenter_profile',
function($scope,$http,userStatus) {
  $scope.userStatus=userStatus;
  $scope.practice_type_map=["校内","实习","其它"];
	$scope.modelLoader=function(idx,force){
	  	var modelname=["basic_info","contact_info","detail_info"];
	  	if(!(idx<3 && idx>-1))
	  		return;
	  	if(!force && $scope[modelname[idx]])
	  		return;  	
	  	$http({
	        method  : 'GET',
	        url     : '/kesci_backend/api/api_users/'+[modelname[idx]]
	        }).success(function(data) {   
	          $scope[modelname[idx]]=data;
	    });
	  }     
	  $scope.modelLoader(0);
	  $scope.modelLoader(1);
	  $scope.modelLoader(2);

});
myAppModule.controller('usercenter_account',
	function($scope,$http,$location,userStatus){
		$scope.userStatus=userStatus;
		$scope.currentTab=0;
		$scope.change_password_errors={};
		$scope.change_email_errors={};
	$scope.doChangePassword=function(){
		$scope.change_password_errors={};
		$http({
        	method  : 'POST',
        	url     : '/kesci_backend/api/auth/change_password',
        	data    : $("#change-password-form").serialize(), 
        	headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    	}).success(function(data) {
    			if(data.msg&&data.msg.indexOf("successfully")>-1){
    				swal("成功","密码已更改.","success");
    				$location.path("/");
    			}
    			else if(data.errors){
    				$scope.change_password_errors=data.errors;
    			}
    	});
	};
	$scope.doChangeEmail=function(){
			$scope.change_email_errors={};
			$http({
        	method  : 'POST',
        	url     : '/kesci_backend/api/auth/change_email',
        	data    : $("#change-email-form").serialize(), 
        	headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    	}).success(function(data) {    			
    			if(data.msg&&data.msg.indexOf("confirmation")>-1){
    				swal("成功","邮箱已更改,激活邮件已发送到新邮箱,请查收","success");
    				$location.path("/");
    			}
    			else if(data.errors){
    				$scope.change_email_errors=data.errors;
    			}
    	});
	};
	});
myAppModule.controller('usercenter_msg',
	function($scope,$http,$location,userStatus){
    $scope.chatWinFlag={};
		$scope.userStatus=userStatus;
		$scope.currentTab=0;
    $scope.tabLoadFlag=[false,false,false,false];
    $http({
        method  : 'GET',
        url     : '/kesci_backend/api/teams/basic_info' 
        }).success(function(data) {         
           if(data.teams.length>0)
              $scope.userTeam=data.teams[0];
    });

    $scope.modelLoader=function(idx,force,refresh){
      $scope.tabMsg={};      
      var models=["/api/notifications/official_notice",
                  "/api/messages/insite_msg",
                  "/api/messages/team_insite_msg/",
                  "/api/messages/zudui_msg"];
      if(!(idx<4 && idx>-1))
        return;
      if(!force && $scope.tabLoadFlag[idx]){
      	if(idx==1||idx==2)
      		$scope.scrollChat();
      	return;
      }
        
      if(!models[idx]){ 
        console.log("载入model出错",idx); 
        return;
      }    
      if(idx==2){
        if(!$scope.userTeam){
          $scope.insiteTeamEmpty=true;
          return;
        }          
        models[2]=models[2]+$scope.userTeam.team_id;
      }  

      $http({
          method  : 'GET',
          url     : "/kesci_backend"+models[idx]
          }).success(function(data) {   
            $scope.tabLoadFlag[idx]=true;
            if(idx==0){
              $scope.official_notice=data;
            }  
            else if(idx==1){ 
              if(data.p2p_msg.length==0&&data.t2p_msg.length==0)
                $scope.insiteEmpty=true;
              else
                $scope.insiteEmpty=false;
              var tmp_p2p={};       		  
              for (var i in data.p2p_msg){
                var f_id=data.p2p_msg[i].friend_id;
                if(tmp_p2p[f_id]===undefined){
                	tmp_p2p[f_id]=[];
                	data.p2p_msg[i].friend_name="undefined";
                	for(var j in data.friend_name){if(data.friend_name[j].id==f_id) {data.p2p_msg[i].friend_name=data.friend_name[j].username;break;}}
                }
              tmp_p2p[f_id].push(data.p2p_msg[i]);                
              }
              var tmp_t2p={};
              for (var i in data.t2p_msg){
                var t_id=data.t2p_msg[i].team_id;
                if(tmp_t2p[t_id]===undefined){
                  tmp_t2p[t_id]=[];
                  data.t2p_msg[i].team_name="undefined";
                  for(var j in data.team_name_list){if(data.team_name_list[j].team_id==t_id) { data.t2p_msg[i].team_name=data.team_name_list[j].team_name;break;}}
                }
              tmp_t2p[t_id].push(data.t2p_msg[i]);                
              }
              $scope.p2pChatData=tmp_p2p;
              $scope.t2pChatData=tmp_t2p;
              if(refresh)
                swal('刷新完成!');
    		      $scope.scrollChat();
            }
          else if(idx==2){
             if(data.p2t_msg.length==0)
                $scope.insiteTeamEmpty=true;
              else
                $scope.insiteTeamEmpty=false;

              var tmp_p2t={};
              for (var i in data.p2t_msg){
                var f_id=data.p2t_msg[i].user_id;
                if(tmp_p2t[f_id]===undefined){
                  tmp_p2t[f_id]=[];
                  data.p2t_msg[i].user_name="undefined";
                  for(var j in data.friend_name){if(data.friend_name[j].id==f_id) { data.p2t_msg[i].user_name=data.friend_name[j].username;break;}}
                }
              tmp_p2t[f_id].push(data.p2t_msg[i]);                
              }
            $scope.p2tChatData=tmp_p2t;
            if(refresh)
                swal('刷新完成!');
            $scope.scrollChat();
          }
        else if(idx==3){
          for(var i in data.zudui_msg){
            var t_id=data.zudui_msg[i].team_id;
            data.zudui_msg[i].team_name="undefined";
            for(var j in data.team_name_list){if(data.team_name_list[j].team_id==t_id) { data.zudui_msg[i].team_name=data.team_name_list[j].team_name;break;}}
           }
          $scope.zudui_msg=data.zudui_msg;
        }      
      });

    }
   $scope.modelLoader(0);
   $scope.markRead=function(noticeType,noticeIdx){
			var tmp=[];
			tmp.push($scope.official_notice.notices[noticeIdx]["id"]);
			$scope.official_notice.notices[noticeIdx]["read_flag"]=1;
			$http({
							method  : 'POST',
							url     : '/kesci_backend/api/notifications/official_notice',
							data    : "json_data="+encodeURIComponent(JSON.stringify(tmp)),
							headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	    		}).success(function(data) {});
		}
   $scope.sendMsg=function(user_id,name){
  	if(user_id==userStatus.user_id){
  		swal("你好无聊 (﹁\"﹁)","为什么会有人给自己发私信啊啊啊啊啊","warning");
  		return;
  	}
  	swal({   
  		title: "发送私信",   
  		text: "请输入发送给 "+name+" 的私信内容",   
  		type: "input",   
  		showCancelButton: true,   
  		closeOnConfirm: false
  		}, function(msg){ 
  		 
  		   if(msg===false){
      			return;
    	   }
    	   else if(msg==""){
      			swal("出错了...","私信内容不能为空.","error");
      			return;
    	   }
    	  if(swal_mutex()) 
    	  	return;
    	  $http({
		        method  : 'POST',
		        url     : '/kesci_backend/api/messages/person_to_person',
		        data    : "receiver_id="+user_id+"&"+"content="+encodeURIComponent(msg),
		        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		        }).success(function(data) {
		          if(data.msg&&data.msg.indexOf("success")>-1){
		            swal("成功!", "私信已发送", "success") ;
		           	$scope.p2pChatData[user_id].push({content:msg,friend_id:user_id,sender_id:$scope.userStatus.user_id,user_id:$scope.userStatus.user_id,sendtime:Math.floor((new Date()).valueOf()/1000)});
		            $scope.scrollChat();
		            } 
		          else{
		            swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"发送私信时出现问题","error");   
		            console.log(data);
		          }
		        });  
		  return;
  		});
  }
  $scope.sendMsgByTeam=function(user_id,name){
    if($scope.userTeam.admin_flag!=2){
      swal("没有权限","只有队长有权限代表团队发送信息","warning");
      return;
    }
    swal({   
      title: "代表团队发送消息",   
      text: "请输入发送给 "+name+" 的消息内容",   
      type: "input",   
      showCancelButton: true,   
      closeOnConfirm: false
      }, function(msg){ 
         if(msg===false){
            return;
         }
         else if(msg==""){
            swal("出错了...","消息内容不能为空.","error");
            return;
         }
        if(swal_mutex()) 
    	  	return;
        $http({
            method  : 'POST',
            url     : '/kesci_backend/api/messages/team_to_person',
            data    : "receiver_id="+user_id+"&"+"content="+encodeURIComponent(msg)+"&team_id="+$scope.userTeam.team_id,
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
              if(data.msg&&data.msg.indexOf("success")>-1){
                swal("成功!", "消息已发送", "success") ;
                $scope.p2tChatData[user_id].push({content:msg,friend_id:user_id,direction:1,sendtime:Math.floor((new Date()).valueOf()/1000)});
                $scope.scrollChat();
                } 
              else{
                swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"发送消息时出现问题","error");   
                console.log(data);
              }
            });  
      return;
      });
  }
  $scope.sendMsgToTeam=function(team_id,name){
  if($scope.userTeam&&$scope.userTeam.team_member.indexOf(userStatus.user_id)>-1){
      swal("出错了...","不能给自己所在的团队发送信息","warning");
      return;
    }
    swal({   
      title: "发送团队消息",   
      text: "请输入发送给团队 "+name+" 的消息 : ",   
      type: "input",   
      showCancelButton: true,   
      closeOnConfirm: false
      }, function(msg){ 
         if(msg===false){
            return;
         }
         else if(msg==""){
            swal("出错了...","消息不能为空.","error");
            return;
         }
         if(swal_mutex()) 
    	  	return;
         $http({
              method  : 'POST',
              url     : '/kesci_backend/api/messages/person_to_team',
              data    : "team_id="+team_id+"&"+"content="+encodeURIComponent(msg),
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data) {
             
              if(data.msg&&data.msg.indexOf("success")>-1){
                swal("成功!", "团队消息已发送", "success") ;
                $scope.t2pChatData[team_id].push({content:msg,team_id:team_id,direction:0,sendtime:Math.floor((new Date()).valueOf()/1000)});
                $scope.scrollChat();
              }
              else{ 
                swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"团队消息发送时出错","error");  
                console.log(data);
              }
            });  
      });   
}
  $scope.scrollChat=function (){
  	window.setTimeout(function(){
  		var a=$(".usercenter-msg-container");
  		for (var i in a){a[i].scrollTop=a[i].scrollHeight}
  	},300);
  }
});
myAppModule.controller('entity_user',
  function($scope,$http,$routeParams,userStatus){
  $scope.userID=$routeParams.id;

 $http({
        method  : 'GET',
        url     : '/kesci_backend/api/api_users/show/'+$scope.userID     
        }).success(function(data) {
        	$scope.detail_info=data;
        	         
    });

  });
myAppModule.controller('entity_team',
  function($scope,$http,$routeParams,$window,$location,selectSource,userStatus){
    $scope.userStatus=userStatus;
  	$scope.selectSource=selectSource;  	
    $scope.teamID=$routeParams.id;
    $scope.manageMode=$routeParams.manage==1?true:false;
    $scope.sendMsgToTeam=function(team_id,name){

  	swal({   
  		title: "发送团队消息",   
  		text: "请输入发送给团队 "+name+" 的消息 : ",   
  		type: "input",   
  		showCancelButton: true,   
  		closeOnConfirm: false
  		}, function(msg){ 
  		   if(msg===false){
      			return;
    	   }
    	   else if(msg==""){
      			swal("出错了...","消息不能为空.","error");
      			return;
    	   }
    	   if(swal_mutex()) 
    	  	return;
    	   $http({
			        method  : 'POST',
			        url     : '/kesci_backend/api/messages/person_to_team',
			        data    : "team_id="+team_id+"&"+"content="+encodeURIComponent(msg),
					headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		        }).success(function(data) {
		          console.log(data);	
		          if(data.msg&&data.msg.indexOf("success")>-1){
		            swal("成功!", "团队消息已发送", "success") 
		          }
		          else{ 
		          	swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"团队消息发送时出错","error");  
		          	console.log(data);
		          }
		        });  
  		});   
}
	 
$scope.loadTeamData=function(){
    $http({
				method  : 'GET',
				url     : '/kesci_backend/api/teams/details?team_id='+$scope.teamID			
      	}).success(function(data) {         
          if(data.errors.length>0){
          	swal("出错了...","加载团队信息时出错,团队不存在或已解散","error");
          	$location.path("/");
          }
          $scope.teamData=data.data;
          $scope.is_team_member=data.is_team_member;
          $scope.admin_flag=data.admin_flag;
    });

    if($scope.manageMode){ 
    	$http({
				method  : 'GET',
				url     : '/kesci_backend/api/messages/team_zudui_msg/'+$scope.teamID			
      	}).success(function(data) {
        for(var idx in data.zudui_msg){
        	data.zudui_msg[idx].user_name="undefined";
        	for(var x in data.user_name){
        		if(data.user_name[x].id==data.zudui_msg[idx].user_id){
        			data.zudui_msg[idx].user_name=data.user_name[x].username;
        			break;
        		}
        	}
        }
      	$scope.zudui_msg=data.zudui_msg;
       
   	 });
    }
  }
	$scope.loadTeamData();
	$scope.findCompetitionName=function(id){
		for(var idx in $scope.selectSource.competitionList){
			if (id==$scope.selectSource.competitionList[idx]["id"]) {
				return $scope.selectSource.competitionList[idx]["name"];
			};
		}
		return '';
	}
	 $scope.rejectApplication=function(record_id,team_id,idx){
     sweetAlert({
        title: "拒绝申请",
        text: "请输入拒绝理由 : ",
        type: "input",
        showCancelButton: true,   
        closeOnConfirm: false 
      },function(msg){
      	if(msg===false){
            return;
         }
         else if(msg==""){
            swal("出错了...","拒绝理由不能为空.","error");
            return;
         }
      	if(swal_mutex()) 
    	  	return;
        $http({
            method  : 'POST',
            url     : '/kesci_backend/api/teams/decline_application',
            data    : "record_id="+record_id+"&decline_reason="+encodeURIComponent(msg)+"&team_id="+team_id,
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
          }).success(function(data) {
          if(data.msg&&data.msg.indexOf("success")>-1){
                swal("成功!", "拒绝申请成功", "success") ;
                $scope.zudui_msg[idx].readtime=1;
                $window.setTimeout($scope.loadTeamData,1000);
                
           }
          else{ 
                swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"拒绝邀请时出错","error");  
                console.log(data);
          }
          });
      });
  }
  $scope.acceptApplication=function(record_id,team_id,idx){
    sweetAlert({
        title: "接受申请",
        text: "确认接受此申请?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "接受",
        closeOnConfirm:false,
        html: false
      },function(){
      	if(swal_mutex()) 
    	  	return;
        $http({
        method  : 'POST',
        url     : '/kesci_backend/api/teams/agree_application',
        data    : "record_id="+record_id+"&team_id="+team_id,
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data) {
          if(data.msg&&data.msg.indexOf("success")>-1){
                swal("成功!", "接受申请成功", "success") ;
                $scope.zudui_msg[idx].readtime=1;
                $window.setTimeout($scope.loadTeamData,1000);
           }
          else{ 
                swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"接受邀请时出错","error");  
               
          }
      });
      });
  }
  $scope.leaveTeam=function(){
  sweetAlert({
    title: "离开团队",
    text: "确认离开此团队?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "离开",
    closeOnConfirm: false,
    html: false
  }, function(){
  	if(swal_mutex()) 
    	  	return;
    $http({
        method  : 'POST',
        url     : '/kesci_backend/api/teams/leave/'+$scope.teamID,
        data    : "",
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data) {
          if(data.msg&&data.msg.indexOf("success")>-1){
                swal("成功!", "离开团队成功", "success") ;
                $window.setTimeout($scope.loadTeamData,1000);              
           }
          else{ 
                swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"离开团队时出错","error");  
               
          }
      });  	
  });
  }
  $scope.dismissTeam=function(){
 sweetAlert({
    title:"解散团队",
    text: "确认解散此团队?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "解散",
    closeOnConfirm: false,
    html: false
  }, function(){
  	if(swal_mutex()) 
    	  	return;
    $http({
        method  : 'POST',
        url     : '/kesci_backend/api/teams/dismiss/'+$scope.teamID,
        data    : "",
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).success(function(data) {
          if(data.msg&&data.msg.indexOf("success")>-1){
                swal("成功!", "解散团队成功", "success") ;                
                $location.path("/");          
           }
          else{ 
                swal("出错了...",data.error||(data.errors&&data.errors.join(","))||"解散团队时出错","error");  
               
          }
      });  	
  });
  }

  });

myAppModule.controller('action_competition_register',
	function($scope,$http,$routeParams,$location,userStatus,selectSource){	
    $scope.selectSource=selectSource;
    $scope.comp_map=["EMC杯智慧校园开放数据大赛"];
    $scope.form_id=$routeParams.id;
    $scope.default_values={student_flag:"1"};
    $scope.updateUniversityList=function(){        
            if($scope.default_values.university_district){
            $http({
              method  : 'GET',
              url     : '../shared/data/college/'+ $scope.default_values.university_district+'.json',

            }).success(function(data) {   
              for(var c in data){
                if(data.hasOwnProperty(c)){
                  $scope.tmp_universityList=data[c];                   
                  $scope.tmp_university=$scope.default_values.university;
                }
              }
            }); 
          } 
    }
    $scope.submitForm=function(){
      var arr=[],tmp=[];
      arr.push(["competition_id", $scope.form_id]);
      arr.push(["student_flag",$scope.default_values.student_flag]);
      arr.push(["email", $scope.default_values.email]);
      arr.push(["mobile", $scope.default_values.mobile]);
      arr.push(["fullname", $scope.default_values.username]);
      arr.push(["university", $scope.tmp_university]);
      arr.push(["university_district", $scope.default_values.university_district]);
      arr.push(["major", $scope.default_values.major]);
      if($scope.default_values.student_flag=="1"){ 
        arr.push(["grade", $scope.default_values.grade]);
      }
      else{
         arr.push(["company", $scope.default_values.company]);
         arr.push(["attend_reason", $scope.default_values.attend_reason]);
      }
      for(var k in arr){
      	if(typeof(arr[k][1])=="undefined"||arr[k][1].length===0){
      		swal("请完整填写表单 : "+arr[k][0]);
      		return;
      	}
      	if(arr[k][0]=="mobile"&&arr[k][1]<100000){
      		swal("请正确填写手机号");
      		return;
      	}
      	tmp.push(arr[k][0]+"="+encodeURIComponent(arr[k][1]));
      }
      $http({
        	method  : 'POST',
        	url     : '/kesci_backend/api/competitions/register',
        	data    : tmp.join("&"), 
        	headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    	}).success(function(data) {
    		if(data.msg=="insert successful"||data.msg=="record exists"){
    			swal("申请成功","审核结果将于近日通知您.","success");
    			$location.path("/");
    		}
    		else{
    			swal("报名出错.");
    			console.log(data);
    		}
    	});        
    }
    $http({
          method  : 'GET',
          url     : '/kesci_backend/api/api_users/basic_info'
          }).success(function(data) {   
           $scope.default_values.university=data.university;
           $scope.default_values.university_district=data.university_district;
           $scope.default_values.major=data.major;
           $scope.default_values.username=data.username;
           $scope.default_values.email=userStatus.email;
           $scope.default_values.self_intro=data.brief_intro;
           $scope.updateUniversityList();
      });
    $http({
          method  : 'GET',
          url     : '/kesci_backend/api/api_users/contact_info'
          }).success(function(data) {   
           $scope.default_values.mobile=data.mobile;          
      });			
	});

/*
myAppModule.controller('action_association_register',
	function($scope,$http,$routeParams,$location,userStatus,selectSource){
    $scope.selectSource=selectSource;
    $scope.asso_map=["数据科学训练营","数据分析训练营"];
    $scope.form_id=$routeParams.id;
    $scope.default_values={student_flag:"1"};
    $scope.updateUniversityList=function(){        
        if($scope.default_values.university_district){
            $http({
              method  : 'GET',
              url     : '../shared/data/college/'+ $scope.default_values.university_district+'.json',

            }).success(function(data) {   
              for(var c in data){
                if(data.hasOwnProperty(c)){
                  $scope.tmp_universityList=data[c];                   
                  $scope.tmp_university=$scope.default_values.university;
                }
              }
            }); 
          } 
    }
   $scope.uploadResume=function(eid){  
      formMsg={};
      var fileInputElement=document.getElementById(eid);
      console.log(fileInputElement,fileInputElement.files);
      if(!fileInputElement)
      	return;
      if(fileInputElement.files.length<1){
      		swal("请选择文件");
	  		return;
	  	}
	  if(fileInputElement.files[0].size<10000000){
	  		swal("上传文件过大,请重新选择.");
	  		return;
	  	}

      	var oMyForm = new FormData();
      	oMyForm.append("userfile", fileInputElement.files[0]);
      	formMsg={upload_ing:true};
      	$http.post({'/kesci_backend/api/auth/change_email',oMyForm, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
            }}).success(function(data) {});      	
      	}
    $scope.submitForm=function(){
      var arr=[],tmp=[];
      arr.push(["association_id", $scope.form_id]);
      arr.push(["student_flag",$scope.default_values.student_flag]);
      arr.push(["email", $scope.default_values.email]);
      arr.push(["mobile", $scope.default_values.mobile]);
      arr.push(["fullname", $scope.default_values.username]);
      arr.push(["university", $scope.tmp_university]);
      arr.push(["university_district", $scope.default_values.university_district]);
      arr.push(["major", $scope.default_values.major]);
      arr.push(["wechat", $scope.default_values.wechat]);
      arr.push(["self_intro", $scope.default_values.self_intro]);
      arr.push(["expectation", $scope.default_values.expectation]);
      if($scope.default_values.student_flag=="1"){ 
        arr.push(["grade", $scope.default_values.grade]);
      }
      else{
        arr.push(["company", $scope.default_values.company]);
      }
      for(var k in arr){
      	if(typeof(arr[k][1])=="undefined"||arr[k][1].length===0){
      		swal("请完整填写表单 : "+arr[k][0]);
      		return;
      	}
      	if(arr[k][0]=="mobile"&&arr[k][1]<100000){
      		swal("请正确填写手机号");
      		return;
      	}
      	tmp.push(arr[k][0]+"="+encodeURIComponent(arr[k][1]));
      }
      	$http({
        	method  : 'POST',
        	url     : '/kesci_backend/api/associations/register',
        	data    : tmp.join("&"), 
        	headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    	}).success(function(data) {
    		if(data.msg=="insert successful"||data.msg=="record exists"){
    			swal("申请成功","审核结果将于近日通知您.","success");
    			$location.path("/");
    		}
    		else{
    			swal("报名出错.");
    			console.log(data);
    		}});
     }
            
    $http({
          method  : 'GET',
          url     : '/kesci_backend/api/api_users/basic_info'
          }).success(function(data) {   
           $scope.default_values.university=data.university;
           $scope.default_values.university_district=data.university_district;
           $scope.default_values.major=data.major;
           $scope.default_values.username=data.username;
           $scope.default_values.email=userStatus.email;
           $scope.updateUniversityList();
      });
    $http({
          method  : 'GET',
          url     : '/kesci_backend/api/api_users/contact_info'
          }).success(function(data) {   
           $scope.default_values.mobile=data.mobile;  
           $scope.default_values.wechat=data.wechat;  
                           
      });
	});
*/
myAppModule.controller('emcCtr',
function($scope) {
$scope.teachers=[{
   "name":"金耀辉",
   "desc":["电子信息与电气工程学院，教授","网络信息中心副主任","博士生导师"],
   "img": "../home_def/images/emc/jinyaohui.jpg"
},{
   "name":"张鹏翥",
   "desc":["安泰经管学院，教授","管理信息系统专业主任","博士生导师"],
   "img": "../home_def/images/emc/zhangpengzhu.jpg"
},{
   "name":"韩东",
   "desc":["交大数学系，副系主任","博士生导师"],
   "img": "../home_def/images/emc/handong.jpg"
},{
   "name":"韩挺",
   "desc":["交大媒体与设计学院，副院长","工业设计专业主任"],
   "img": "../home_def/images/emc/hanting.jpg"
},{
   "name":"郑磊",
   "desc":["复旦数字与移动治理实验室主任","国际关系与公共事务学院院长助理","副教授"],
   "img": "../home_def/images/emc/zhenglei.jpg"
},{
   "name":"张娅",
   "desc":["交大电子学院，副教授","博士生导师"],
   "img": "../home_def/images/emc/zhangya.jpg"
},{
   "name":"符冰",
   "desc":["上海交通大学网络信息中心","服务部主管"],
   "img": "../home_def/images/emc/fubing.jpg"
},{
   "name":"陈春曦",
   "desc":["EMC中国卓越研发集团","上海公司总经理"],
   "img": "../home_def/images/emc/chenchunxi.jpg"
},{
   "name":"蔡远进",
   "desc":["上海交大后勤集团","财务总监"],
   "img": "../home_def/images/emc/caiyuanjin.jpg"
}
];
});
myAppModule.controller('emc_qaCtr',
function($scope,$http) {
		$http({
				method  : 'GET',
				url     : './data/q_a.json',

    		}).success(function(data) {   
    			$scope.qaData=data;
    	});
});
myAppModule.controller('trainingCtr',
function($scope,$routeParams) {
	$scope.trainingType=$routeParams.id;
});
myAppModule.controller('emc_dataCtr',
function($scope) {  
});
myAppModule.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/news', {
            templateUrl: 'views/news.html',
            controller: 'newsCtr'
        }).when('/mine', {
            templateUrl: 'views/mine.html',
            controller: 'mineCtr'
        }).when('/discover', {
            templateUrl: 'views/discover.html',
            controller: 'discoverCtr'
        }).when('/myteam', {
            templateUrl: 'views/myteam.html',
            controller: 'myteamCtr'
        }).when('/usercenter/profile', {
            templateUrl: 'views/usercenter/profile.html',
            controller: 'usercenter_profile'
        }).when('/usercenter/profile/edit', {
            templateUrl: 'views/usercenter/profile_edit.html',
            controller: 'usercenter_profile_edit'
        }).when('/usercenter/account', {
            templateUrl: 'views/usercenter/account.html',
            controller: 'usercenter_account'
        }).when('/usercenter/msg', {
            templateUrl: 'views/usercenter/msg.html',
            controller: 'usercenter_msg'
        }).when('/entity/team/:id', {
            templateUrl: 'views/entity/team.html',
            controller: 'entity_team'
        }).when('/entity/user/:id', {
            templateUrl: 'views/entity/user.html',
            controller: 'entity_user'
      }).when('/action/competition/register/:id', {
            templateUrl: 'views/action/competition_register.html',
            controller: 'action_competition_register'
       /*   }).when('/action/association/register/:id', {
            templateUrl: 'views/action/association_register.html',
            controller: 'action_association_register'*/
        }).when('/static/training/:id', {
            templateUrl: 'views/static/training.html',
            controller: 'trainingCtr'
        }).when('/static/emc', {
            templateUrl: 'views/static/emc.html',
            controller: 'emcCtr'
        }).when('/static/emc_data', {
            templateUrl: 'views/static/emc_data.html',
            controller: 'emc_dataCtr'    
        }).when('/static/emc_qa', {
            templateUrl: 'views/static/emc_qa.html',
            controller: 'emc_qaCtr'
        }).otherwise({
            redirectTo: '/mine'
        });
}]);	