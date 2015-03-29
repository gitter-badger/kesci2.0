//Home_Login controllers.js

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
function($scope,$http,selectSource) {
  $scope.dirtyFlag={};
  $scope.setDirtyFlag=function(type,index){
   
    $scope.dirtyFlag[type+","+index]=true;
    console.log("setDirtyFlag:",type,index);
  }
	
	$scope.removePfRecord=function(type,index){
    //confirm("删除此记录?")?model.splice(index,1):0
    switch(type){
      case "edu_exp":
        break;
      case "competition_exp":
        break;
      case "practice_exp":
        break;
      default:
        console.log("removePfRecorError:",type);
      }

  };
  $scope.addPfRecord=function(type){
    switch(type){
      case "edu_exp":
        break;
      case "competition_exp":
        break;
      case "practice_exp":
        break;
      default:
        console.log("addPfRecorError:",type);
      }
  }

  $scope.checkAndSubmit_basic=function(){
    alert("basic");
  };
  $scope.checkAndSubmit_detail=function(){
    alert("detail");
  };
  $scope.currentTab=0;

  $scope.tmp_universityList=[];
	$scope.updateUniversityList=function(){
		if($scope.myprofile && $scope.myprofile.university_district){
			$http({
				method  : 'GET',
				url     : '../shared/data/college/'+$scope.myprofile.university_district+'.json',

    		}).success(function(data) {   
    			for(var c in data){
    				if(data.hasOwnProperty(c)){
    					$scope.tmp_universityList=data[c];    					
    					$scope.tmp_university=$scope.myprofile.university;
    				}
    			}
    });

		}
	}
	$scope.selectSource=selectSource;	
	$scope.myprofile={
            "user_id":"1111",
            "name":"周小胖",
            "district":"上海",
            "university_district":"上海",
            "university":"上海交通大学",
            "skills":["主成分分析","Python","Spark"],
            "interests":["数据分析","数据挖掘","推荐算法"],
            "bref_intro":"Without a sense of identity, there can be no real struggle.",
            "current_competition":"Avazu编程大赛",
            "last_online":"一天前",
            "reply_rate":"90%",
            "avg_reply_time":"24小时",
            "img":"images/de.png",    
            "competitions_exps":[{
				    "start_date":"2014-01-02",
				    "end_date":"2014-02-04",
					"competition_name":"美国数学建模大赛",
					"award":"一等奖",
				    "project_url":"www.baidu.com",
				    "kesci_competition":"True",
				},{
				    "start_date":"2014-01-02",
				    "end_date":"2014-02-04",
					"competition_name":"美国数学建模大赛",
					"award":"二等奖",
				    "project_url":"www.baidu.com",
				    "kesci_competition":"True",
				},{
				    "start_date":"2014-01-02",
				    "end_date":"2014-02-04",
					"competition_name":"美国数学建模大赛",
					"award":"三等奖",
				    "project_url":"www.baidu.com",
				    "kesci_competition":"True",
				}],
			"edu_exps":[{
			    "start_date":"2014-01-02",
			    "end_date":"2014-02-04",
			    "university":"上海交通大学",
			    "department":"数学系",
			    "major":"应用统计",
			    "level":"研究生"    
				},
				{
			    "start_date":"2014-01-02",
			    "end_date":"2014-02-04",
			    "university":"上海交通大学",
			    "department":"数学系",
			    "major":"应用统计",
			    "level":"研究生"    
			}],
			"practice_exps":[{
	            "id":"111",
	            "start_date":"2014-01-02",
	            "end_date":"2014-02-04",
	            "organzition":"中国银联信用卡中心",
	            "job":"数据分析实习生",
	            "description":"数据分析和建模"
            },
            {
	            "id":"111",
	            "start_date":"2014-01-02",
	            "end_date":"2014-02-04",
	            "organzition":"中国银联信用卡中心",
	            "job":"数据分析实习生",
	            "description":"数据分析和建模"
            }]                   
};
$scope.updateUniversityList();
});

myAppModule.controller('usercenter_profile',
function($scope,$http,userStatus) {
    $scope.userStatus=userStatus;
    $http({
        method  : 'GET',
        url     : '/kesci_backend/api/api_users/basic_info'
        }).success(function(data) {   
          $scope.basic_info=data;
    });

    $http({
        method  : 'GET',
        url     : '/kesci_backend/api/api_users/detail_info'
        }).success(function(data) {   
          $scope.detail_info=data;
    });
	          

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
    			console.log(data);
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
	function($scope,$http,$routeParams,userStatus){	
		console.log($routeParams);
		$scope.default_values={
			email:userStatus.email,
			username:userStatus.username
		}
		$scope.userStatus=userStatus;
		$scope.form_id=$routeParams.id;

	});
myAppModule.controller('action_association_register',
	function($scope,$http,$routeParams,userStatus){
		$scope.userStatus=userStatus;
		$scope.form_id=$routeParams.id;

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