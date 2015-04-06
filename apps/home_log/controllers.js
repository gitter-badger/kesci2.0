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
  		v=v+"";
  		if(v.length>0)
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
		$scope.emc_data={is_reg:{},reg_num:{}};
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
function($scope,$http,selectSource) {
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
	$scope.clearAllForms();
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
	}
	$scope.clearResult=function(){
		$scope.people_result=undefined;
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
		}
		else{
			$scope.clearResult();
			$scope.lastQuery_people=ng_serialize($scope.discover_people_form);
			queryStr=$scope.lastQuery_people;
		}
			
		$http({
				method  : 'GET',
				url     : '/kesci_backend/api/api_users/listing?'+queryStr						
	    	}).success(function(data) {
	    		$scope.people_result=data;
	    		$scope.updatePageNumber(data.page_no,data.per_page,data.total_num);
	    	});		
	}
	$scope.teamFormSubmit=function(){
		//console.log($scope);
		console.log(ng_serialize($scope.discover_team_form));
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
myAppModule.controller('usercenter_msg',
	function($scope,$http,$location,userStatus){
		$scope.userStatus=userStatus;
		$scope.currentTab=0;
		$http({
				method  : 'GET',
				url     : '/kesci_backend/api/notifications/official_notice',
	    }).success(function(data) {
	    	$scope.official_notices=data.notices;
	    });
	    $scope.markRead=function(noticeType,noticeIdx){
			var tmp=[];
			tmp.push($scope.official_notices[noticeIdx]["id"]);
			$scope.official_notices[noticeIdx]["read_flag"]=1;
			$http({
							method  : 'POST',
							url     : '/kesci_backend/api/notifications/official_notice',
							data    : "json_data="+encodeURIComponent(JSON.stringify(tmp)),
							headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
	    		}).success(function(data) {});
		}
	})
myAppModule.controller('entity_team',
  function($scope,$http,$routeParams,userStatus){ 
    $scope.teamID=$routeParams.id;
    $scope.teaminfo={
      name:"天热吃饺子",
      brief_intro:"天热吃饺子,吃了更热",
      competition_name:"EMC杯智慧校园开放数据大赛",
      skills:["MySQL","PHP","DEMO","DOTA"],
      require_skills:["MySQL","PHP","DEMO","DOTA"],  
      members:[{
        name:"胡老板",
        is_leader:1,
        brief_intro:"您吃了么",
        district:"弗兰",
        university:"新东方",
        department:"厨师部",
        major:"掂勺",
        level:"本科",
        skills:["MySQL","EAT","DOTA"],
        rollin_date:"2014-7-1"
      },{
        name:"胡老板",
        brief_intro:"您吃了么",
        district:"弗兰",
        university:"新东方",
        department:"厨师部",
        major:"掂勺",
        level:"本科",
        skills:["MySQL","EAT","DOTA"],
        rollin_date:"2014-7-1"
      },{
        name:"胡老板",
        brief_intro:"您吃了么",
        district:"弗兰",
        university:"新东方",
        department:"厨师部",
        major:"掂勺",
        level:"本科",
        skills:["MySQL","EAT","DOTA"],
        rollin_date:"2014-7-1"
      }]
    }

  })
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
      		alert("请完整填写表单 : "+arr[k][0]);
      		return;
      	}
      	if(arr[k][0]=="mobile"&&arr[k][1]<100000){
      		alert("请正确填写手机号");
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
    			alert("申请成功,审核结果将于近日通知您.");
    			$location.path("/");
    		}
    		else{
    			alert("报名出错.");
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
  /*  $scope.uploadResume=function(eid){  
      formMsg={};
      var fileInputElement=document.getElementById(eid);
      console.log(fileInputElement,fileInputElement.files);
      if(!fileInputElement)
      	return;
      if(fileInputElement.files.length<1){
      		alert("请选择文件");
	  		return;
	  	}
	  if(fileInputElement.files[0].size<10000000){
	  		alert("上传文件过大,请重新选择.");
	  		return;
	  	}

      	var oMyForm = new FormData();
      	oMyForm.append("userfile", fileInputElement.files[0]);
      	formMsg={upload_ing:true};
      	$http.post({'/kesci_backend/api/auth/change_email',oMyForm, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
            }}).success(function(data) {});      	
      	}*/
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
      		alert("请完整填写表单 : "+arr[k][0]);
      		return;
      	}
      	if(arr[k][0]=="mobile"&&arr[k][1]<100000){
      		alert("请正确填写手机号");
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
    			alert("申请成功,审核结果将于近日通知您.");
    			$location.path("/");
    		}
    		else{
    			alert("报名出错.");
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
        }).when('/action/competition/register/:id', {
            templateUrl: 'views/action/competition_register.html',
            controller: 'action_competition_register'
        }).when('/action/association/register/:id', {
            templateUrl: 'views/action/association_register.html',
            controller: 'action_association_register'
        }).when('/static/training/:id', {
            templateUrl: 'views/static/training.html',
            controller: 'trainingCtr'
        }).when('/static/emc', {
            templateUrl: 'views/static/emc.html',
            controller: 'emcCtr'
        }).when('/static/emc_qa', {
            templateUrl: 'views/static/emc_qa.html',
            controller: 'emc_qaCtr'
        }).otherwise({
            redirectTo: '/mine'
        });
}]);