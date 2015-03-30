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
  		arr.push(obj.$name+"="+encodeURIComponent(v));
  	}
  	return arr.join("&");
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
		universityList:["上海交大","复旦大学","华东师大"],
		competitionTypeList:["数据分析","数据挖掘","推荐算法","预测","数据建模","数据可视化","数据工程","数据应用构建"],
		competitionStageList:["不限","尚未开始","报名中","进行中","作品评选中","已结束"],
		competitionList:["EMC杯智慧校园数据分析大赛"]
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
    			$scope.userStatus.username=data.username;
    			$scope.userStatus.user_id=data.user_id;
    			$scope.userStatus.email=data.email;
    			$scope.userStatus.activated=data.activated;
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
/*
	$scope.competition_stage_map={"not_start":"报名中","ongoing":"进行中","finished":"作品评选中","result":"结果揭晓"}
	
	$scope.followed_competition=[{
		name:"超级码力程序设计竞赛",
		competition_id:"123213",
		stage:"not_start",
		host:"Avazu",
		type:"程序开发",
		district:"不限",
		reward:"iPhone6，实习机会",
		sign_due:"12月12日",	
		submit_due:"1月20日",
		img:"images/d.jpg",
		team_num:12
	},
	{
		name:"超级码力程序设计竞赛",
		competition_id:"123213",
		host:"Avazu",
		type:"程序开发",		
		stage:"ongoing",		
		img:"images/d.jpg",
		submit_due:"1月20日",
		team_num:12
	},
	{
		name:"超级码力程序设计竞赛",
		competition_id:"123213",
		host:"Avazu",
		type:"程序开发",		
		stage:"finished",		
		img:"images/d.jpg",
		submit_due:"1月20日",
		team_num:12
	},
	{
		name:"超级码力程序设计竞赛",
		competition_id:"123213",
		host:"Avazu",
		type:"程序开发",
		win_teams:["猪八戒背媳妇","好想吃粽子","高铁侠"],
		stage:"result",		
		img:"images/d.jpg",
		
	}];
	
	$scope.friend_news=[
	{
		friend:"萝卜",
		img:"images/d.jpg",
		time:"2014-2-16 23:11:12",
		type:"friend_win_prize",
		competition:"超级码力程序设计竞赛",
		prize:"一等奖"
	},
	{
		friend:"周小胖",
		img:"images/e.jpg",
		time:"2014-2-16 23:11:12",
		type:"friend_join_team",
		team:"猪八戒背媳妇",
		competition:"超级码力程序设计竞赛",
	},
	{
		friend:"赵信",
		img:"images/f.jpg",
		time:"2014-2-16 23:11:12",
		type:"friend_create_team",
		team:"猪八戒背媳妇",
		competition:"超级码力程序设计竞赛"
	},
	
	{
		friend:"周小胖",
		img:"images/e.jpg",
		time:"2014-2-16 23:11:12",
		type:"friend_follow_competition",
		competition:"超级码力程序设计竞赛"
	}
	];
	$scope.recommed_competition=[
	{
		name:"超级码力程序设计竞赛",
		competition_id:"123213",
		host:"Avazu",
		type:"程序开发",
		district:"不限",
		reward:"iPhone6，实习机会",
		sign_due:"12月12日",
		submit_due:"1月20日"
	},	
		];
	$scope.recommed_team=[{
		name:"梦之队",
		competition:"AVAZU Holding 程序猿的崛起",		
		members:["郭冬临","冯巩","周杰伦","东尼大木"],
		skills:["PHP","JavaScript","MySql"],
		require_skills:["Web Design","Project Manage","HTML5"],		
		requier_members:1,
		signature:"观众朋友们,我想死你们了!",
		img:"images/e.jpg"
	}];
	$scope.recommed_friend=[
	{
		name:"周小胖",
		district:"上海",
		skills:["PHP","Dota","WoW"],
		signature:"Without a sense of identity, there can be no real struggle.",
		img:"images/e.jpg"
	}
	];
	$scope.recommed_course=[
		{title:"JavaScript 教程",url:"http://www.w3school.com.cn/js/"},
		{title:"HTML 系列教程",url:"http://www.w3school.com.cn/h.asp"},
		{title:"XML 系列教程",url:"http://www.w3school.com.cn/x.asp"},
	]*/
});

myAppModule.controller('mineCtr',
function($scope,$http) {
		$scope.emc_data={is_reg:{},reg_num:{}};
		$http({
						method  : 'GET',
						url     : ' /kesci_backend/api/associations/is_registered?association_id=1,2'
    		}).success(function(data) {    		
    		 for(var k in data.data){
    		 	$scope.emc_data.is_reg["asso_"+data.data[k].association_id]=data.data[k].flag;
    		 	}
    		 
    	});
    /*	$http({
						method  : 'GET',
						url     : ' /kesci_backend/api/associations/register_num?association_id=1,2'
    		}).success(function(data) {    		
    		 for(var k in data.data){
    		 	$scope.emc_data.reg_num["asso_"+data.data[k].association_id]=data.data[k].register_num;
    		 	}
    	});*/
    	$http({
						method  : 'GET',
						url     : ' /kesci_backend/api/competitions/is_registered?competition_id=1'
    		}).success(function(data) {    		
    		 for(var k in data.data){
    		 	$scope.emc_data.is_reg["comp_"+data.data[k].competition_id]=data.data[k].flag;
    		 	}
    		 		
    	});
    
    	/*$http({
						method  : 'GET',
						url     : ' /kesci_backend/api/competitions/register_num?competition_id=1'
    		}).success(function(data) {    		
    		 for(var k in data.data){
    		 	$scope.emc_data.reg_num["comp_"+data.data[k].competition_id]=data.data[k].register_num;
    		 	}
    	});*/
		
	/*$scope.competition_stage_map={"not_start":"报名中","ongoing":"进行中","finished":"作品评选中","result":"结果揭晓"};
	$scope.my_competition=[{
		name:"超级码力程序设计竞赛",
		competition_id:"123213",
		stage:"not_start",
		host:"Avazu",
		type:"程序开发",
		district:"不限",
		reward:"iPhone6，实习机会",
		sign_due:"12月12日",	
		submit_due:"1月20日",
		img:"images/d.jpg",
		team_num:12,
		my_team:{
			name:"梦之队",
			competition:"超级码力程序设计竞赛",		
			members:["郭冬临","冯巩","周杰伦","东尼大木"],
			skills:["PHP","JavaScript","MySql"],
			require_skills:["Web Design","Project Manage","HTML5"],		
			requier_members:1,
			signature:"观众朋友们,我想死你们了!",
			img:"images/e.jpg"
		}
	},
	{
		name:"超级码力程序设计竞赛",
		competition_id:"123213",
		stage:"not_start",
		host:"Avazu",
		type:"程序开发",
		district:"不限",
		reward:"iPhone6，实习机会",
		sign_due:"12月12日",	
		submit_due:"1月20日",
		img:"images/d.jpg",
		team_num:12,
		my_team:{
			name:"梦之队",
			competition:"AVAZU Holding 程序猿的崛起",		
			members:["郭冬临","冯巩","周杰伦","东尼大木"],
			skills:["PHP","JavaScript","MySql"],
			require_skills:["Web Design","Project Manage","HTML5"],		
			requier_members:1,
			signature:"观众朋友们,我想死你们了!",
			img:"images/e.jpg"
		}
	},
	{
		name:"超级码力程序设计竞赛",
		competition_id:"123213",
		stage:"not_start",
		host:"Avazu",
		type:"程序开发",
		district:"不限",
		reward:"iPhone6，实习机会",
		sign_due:"12月12日",	
		submit_due:"1月20日",
		img:"images/d.jpg",
		team_num:12,
		my_team:{
			name:"梦之队",
			competition:"AVAZU Holding 程序猿的崛起",		
			members:["郭冬临","冯巩","周杰伦","东尼大木"],
			skills:["PHP","JavaScript","MySql"],
			require_skills:["Web Design","Project Manage","HTML5"],		
			requier_members:1,
			signature:"观众朋友们,我想死你们了!",
			img:"images/e.jpg"
		}
	}];
*/
});
myAppModule.controller('discoverCtr',
function($scope,selectSource) {
	$scope.currentTab=0;
	$scope.selectSource=selectSource;
	$scope.clearAllForms=function(){	
		$scope.competitionSearch_name="";
		$scope.competitionSearch_selectedDistrict=[];
		$scope.competitionSearch_selectedType=[];
		$scope.competitionSearch_selectedTime="不限";
		$scope.teamSearch_name="";
		$scope.teamSearch_selectedCompetition=[];
		$scope.teamSearch_selectedDistrict=[];
		$scope.teamSearch_selectedSkill=[];
		$scope.peopleSearch_name=[];
		$scope.peopleSearch_selectedCompetition=[];
		$scope.peopleSearch_selectedDistrict=[];
		$scope.peopleSearch_selectedSkill=[];
	}

	$scope.clearAllForms();

	$scope.devInfo=function(){
		alert("此功能尚处于开发之中,敬请期待.");
	}

	 
});
myAppModule.controller('usercenter_profile_edit',
function($scope,$http,selectSource,userStatus) {
  $scope.userStatus=userStatus;
  $scope.currentTab=0; 
  $scope.tabMsg={};
  $scope.tabLoadFlag=[false,false,false];
  $scope.selectSource=selectSource;

  $scope.removePfRecord=function(type,index){

    if(!confirm("删除此记录?")){
      return;
    }        
    if(type!="edu_exp" && type!="competition_exp" && type!="practice_exp"){
      console.log("removePfRecorError:",type,index);
      return;
    }
    $scope.tabMsg={};
    if(typeof($scope.detail_info[type][index][type+"_id"])=="undefined"){
      $scope.detail_info[type].splice(index,1);
    }
    else{
      $http({
                  method  : 'DELETE',
                  url     : ' /kesci_backend/api/api_users/'+type+'s/'+$scope.detail_info[type][index][type+"_id"]
              }).success(function(data) {       
              if(data.msg=="delete success"){
                $scope.detail_info[type].splice(index,1);
              }
              else{
                console.log("delete Error ",type,index,data);
              }

            });
   }   
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
  	console.log(ng_serialize($scope.basic_info_form));
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
        console.log("dirty","form_edu_exp_"+k);
        isDirty=true;
        if(typeof(jsonData["edu_exp"])=="undefined")
          jsonData["edu_exp"]=[];
        jsonData["edu_exp"].push($scope.detail_info.edu_exp[k]); 
      }
    }
    for(var k in $scope.detail_info.competition_exp){
      var obj=document.getElementById("form_competition_exp_"+k);      
      if(obj&&obj.className.indexOf("ng-dirty")>-1){             
        console.log("dirty","competition_exp"+k);
        isDirty=true;
        if(typeof(jsonData["competition_exp"])=="undefined")
          jsonData["competition_exp"]=[];
        jsonData["competition_exp"].push($scope.detail_info.competition_exp[k]); 
      }
    }

    for(var k in $scope.detail_info.practice_exp){
      var obj=document.getElementById("form_practice_exp_"+k);
      if(obj&&obj.className.indexOf("ng-dirty")>-1){        
        console.log("dirty","form_practice_exp_"+k);
        isDirty=true;
        if(typeof(jsonData["practice_exp"])=="undefined")
          jsonData["practice_exp"]=[];
        jsonData["practice_exp"].push($scope.detail_info.practice_exp[k]); 
      }
    }
  if(isDirty){
      var jsonStr=angular.toJson(jsonData);
      console.log("json:",jsonStr);
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
			url     : '../shared/data/college/'+ $scope.basic_info.university_district+'.json',

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
    				alert("密码已成功更改.");
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
    				alert(data.msg);
    				$location.path("/");
    			}
    			else if(data.errors){
    				$scope.change_email_errors=data.errors;
    			}
    	});
	};
	});

myAppModule.controller('action_competition_register',
	function($scope,$http,$routeParams,userStatus,selectSource){	
    $scope.selectSource=selectSource;
    $scope.comp_map=["EMC杯交大智慧校园数据分析大赛"];
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
      var oMyForm = new FormData();

      oMyForm.append("competition_id", $scope.form_id);
      oMyForm.append("student_flag",$scope.student_flag=="1"?1:0);
      oMyForm.append("email", $scope.default_values.email);
      oMyForm.append("mobile", $scope.default_values.mobile);
      oMyForm.append("fullname", $scope.default_values.username);
      oMyForm.append("university", $scope.tmp_university);
      oMyForm.append("major", $scope.default_values.major);
      if($scope.student_flag=="1"){ 
        oMyForm.append("grade", $scope.default_values.grade);
      }
      else{
         oMyForm.append("company", $scope.default_values.company);
         oMyForm.append("attend_reason", $scope.default_values.attend_reason);
      }
     // oMyForm.append("userfile", fileInputElement.files[0]);
      console.log($scope.default_values);

      /*$http.post({'/kesci_backend/api/auth/change_email',oMyForm, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
            }).success(function(data) {});*/
       
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
myAppModule.controller('action_association_register',
	function($scope,$http,$routeParams,userStatus,selectSource){
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
    $scope.submitForm=function(){
      var oMyForm = new FormData();
      oMyForm.append("competition_id", $scope.form_id);
      oMyForm.append("student_flag",$scope.student_flag=="1"?1:0);
      oMyForm.append("email", $scope.default_values.email);
      oMyForm.append("mobile", $scope.default_values.mobile);
      oMyForm.append("fullname", $scope.default_values.username);
      oMyForm.append("university", $scope.tmp_university);
      oMyForm.append("major", $scope.default_values.major);
      if($scope.student_flag=="1"){ 
        oMyForm.append("grade", $scope.default_values.grade);
      }
      else{
         oMyForm.append("company", $scope.default_values.company);
         oMyForm.append("attend_reason", $scope.default_values.attend_reason);
      }
     // oMyForm.append("userfile", fileInputElement.files[0]);
      console.log($scope.default_values);

      /*$http.post({'/kesci_backend/api/auth/change_email',oMyForm, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
            }).success(function(data) {});*/
       
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
myAppModule.config(['$routeProvider',function ($routeProvider) {
    $routeProvider
        .when('/news', {
            templateUrl: 'views/news.html',
            controller: 'newsCtr'
        })  
     	.when('/mine', {
            templateUrl: 'views/mine.html',
            controller: 'mineCtr'
        })  
        .when('/discover', {
            templateUrl: 'views/discover.html',
            controller: 'discoverCtr'
        }).when('/usercenter/profile', {
            templateUrl: 'views/usercenter/profile.html',
            controller: 'usercenter_profile'
        }).when('/usercenter/profile/edit', {
            templateUrl: 'views/usercenter/profile_edit.html',
            controller: 'usercenter_profile_edit'
        }).when('/usercenter/account', {
            templateUrl: 'views/usercenter/account.html',
            controller: 'usercenter_account'
        }).when('/action/competition/register/:id', {
            templateUrl: 'views/action/competition_register.html',
            controller: 'action_competition_register'
        }).when('/action/association/register/:id', {
            templateUrl: 'views/action/association_register.html',
            controller: 'action_association_register'
        }).otherwise({
            redirectTo: '/mine'
        });
}]);