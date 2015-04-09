//Home_Default controllers.js

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
var myAppModule = angular.module('myApp', []);

myAppModule.controller('headerCtr',
function($scope,$http) {
	$scope.isReg=false;
	$scope.showPinDiv=false;
    $http({
          method  : 'GET',
          url     : '/kesci_backend/api/auth/check_status'
      }).success(function(data) {
        if(data.is_login){
          window.location.href="../home_log/index.html";
        } 
      });
	$scope.updateCaptchaUrl=function(){
		$scope.captcha_url="";
		$http({
        	method  : 'GET',
        	url     : '/kesci_backend/api/auth/create_captcha'
    	}).success(function(data) {
    		if(data.captcha_html&&data.captcha_html.indexOf("http")>-1){
    			$scope.captcha_url=data.captcha_html.slice(data.captcha_html.indexOf("http"),data.captcha_html.indexOf("jpg")+3);
    		}
    	});}
	$scope.submitLoginForm=function(){
		$scope.login_errors={};
		$http({
        	method  : 'POST',
        	url     : '/kesci_backend/api/auth/login',
        	data    : ng_serialize($scope.login_form), 
        	headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    	}).success(function(data) {
    		if(data.show_captcha){    			
    			$scope.require_login_captcha=true;
				$scope.captcha_url=data.captcha_html.slice(data.captcha_html.indexOf("http"),data.captcha_html.indexOf("jpg")+3);
			}
    		if(data.status=="success"||data.status=="login success"){
    			window.location.href="../home_log/index.html";
    		}
    		if(data.status=="not_activated"){
    			alert("您试图登录的账户尚未通过邮箱激活,请登录邮箱验证您的帐户后登录.")
    		}
    		else if(data.errors&&data.errors.errors){
    			$scope.login_errors=data.errors.errors;
    		}
    		else if(data.errors){$scope.login_errors=data.errors;}

    	});

	};

		$scope.submitRegForm=function(){
		$scope.reg_errors={};
		$http({
        	method  : 'POST',
        	url     : '/kesci_backend/api/auth/register',
        	data    : (function(s){var r=[],n={};s=s.split("&");for(var i in s){var j=s[i].split("=");j[0].indexOf("name")<0?r.push(s[i]):n[j[0]]=j[1];}return r.join("&")+"&username="+n["name_0"]+n["name_1"];})(ng_serialize($scope.reg_form)),
        	headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
    	}).success(function(data) {    		
    		if(data.msg&&data.msg.indexOf("successfully")>0){
    			alert("注册成功,请登录邮箱验证您的帐户.");
    			$("#reg-form")[0].reset();
    			$scope.isReg=false;
    			return;
    		}
    		else if(data.errors&&data.errors.errors){
    			$scope.reg_errors=data.errors.errors;
    		}
    		else if(data.errors){$scope.reg_errors=data.errors;}
    		if(data.captcha_html&&data.captcha_html.indexOf("http")>-1){    			
				$scope.captcha_url=data.captcha_html.slice(data.captcha_html.indexOf("http"),data.captcha_html.indexOf("jpg")+3);
			}

    	});
	};
});
myAppModule.controller('emcCtr',
function($scope) {

$scope.teachers=[{
   "name":"金耀辉",
   "desc":["电子信息与电气工程学院，教授","网络信息中心副主任","博士生导师"],
   "img": "./images/emc/jinyaohui.jpg"
},{
   "name":"张鹏翥",
   "desc":["安泰经管学院，教授","管理信息系统专业主任","博士生导师"],
   "img": "./images/emc/zhangpengzhu.jpg"
},{
   "name":"韩东",
   "desc":["交大数学系，副系主任","博士生导师"],
   "img": "./images/emc/handong.jpg"
},{
   "name":"韩挺",
   "desc":["交大媒体与设计学院，副院长","工业设计专业主任"],
   "img": "./images/emc/hanting.jpg"
},{
   "name":"郑磊",
   "desc":["复旦大学数字与移动治理实验室主任","国际关系与公共事务学院院长助理","副教授"],
   "img": "./images/emc/zhenglei.jpg"
},{
   "name":"张娅",
   "desc":["交大电子学院，副教授","博士生导师"],
   "img": "./images/emc/zhangya.jpg"
},{
   "name":"符冰",
   "desc":["上海交通大学网络信息中心","服务部主管"],
   "img": "./images/emc/fubing.jpg"
},{
   "name":"陈春曦",
   "desc":["EMC中国卓越研发集团","上海公司总经理"],
   "img": "./images/emc/chenchunxi.jpg"
},{
   "name":"蔡远进",
   "desc":["上海交大后勤集团","财务总监"],
   "img": "./images/emc/caiyuanjin.jpg"
}
]

});