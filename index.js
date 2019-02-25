const request = require("request");

class Shovl {
	/**
	 @constructor
	 @param {string} email Email of account
	 @param {string} password password of account
	 */
	constructor(email,password) {
		this.email = email;
		this.password = password;
	}

	login() {
		return new Promise((resolve,reject)=>{
			this.r("/api/account/login",{"email":this.email,"password":this.password},"POST").then((res)=>{
				this.token = res.token;
				resolve();
			},(err)=>{
				reject(err);
			})
		})
	}

	list() {
		return new Promise((resolve,reject)=>{
			this.r("/api/shield/list",{},"GET").then((res)=>{
				resolve(res);
			},(err)=>{
				reject(err);
			});
		});
	}

	addRecord(options){
		return new Promise((resolve,reject)=>{
			if(!options || !options.hostname || !options.name || typeof options.securebackend == 'undefined' || typeof options.protected == 'undefined' || !options.type || !options.record_a) return reject("Missing parameters");
			this.r("/api/shield/dns/create",options,"POST").then((res)=>{
				resolve(res)
			},(err)=>{
				reject(err)
			});
		});
	}

	addDomain(domain) {
		return new Promise((resolve,reject)=>{
			if(!domain) return reject("Missing parameters");
			this.r("/api/shield/order",{"hostname":domain,"serviceid":"Free"},"POST").then((res)=>{
				if(res == "Creating Shield") resolve(true)
			},(err)=>{
				reject(err);
			});
		});
	}

	r(endpoint,data,method) {
		var headers = {
		'User-Agent':       'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
		'Content-Type':     'application/x-www-form-urlencoded'
		}

		if(this.token) headers['authorization'] = this.token;
		return new Promise((resolve,reject)=>{
			request("https://shovl.io"+endpoint,{json:data,headers:headers,method:method},function(err,res,body){
				if(err) return reject(err);
				if(res.statusCode != 200) return reject(body);
				resolve(body)
			});
		})

	}


}

module.exports = {
	Shovl
}
