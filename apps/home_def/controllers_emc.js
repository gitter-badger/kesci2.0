//Home_Default controllers.js

var myAppModule = angular.module('myApp', []);

myAppModule.controller('headerCtr',
function($scope,$http) {
	$scope.isReg=false;
	$scope.showPinDiv=false;
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
        	data    : $("#login-form").serialize(), 
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
        	data    : (function(s){var r=[],n={};s=s.split("&");for(var i in s){var j=s[i].split("=");j[0].indexOf("name")<0?r.push(s[i]):n[j[0]]=j[1];}return r.join("&")+"&username="+n["name_0"]+n["name_1"];})($("#reg-form").serialize()),
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
