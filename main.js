var APIKEY = 5377462;


function auth() {
	VK.init({
		apiId: APIKEY
	});
	return new Promise(function(resolve, reject) {
			VK.Auth.login(function(response) {
				if (response.session) {
					resolve(response);
				} else {
					reject(new Error('auth error'));
				}
			}, 2);
		}
	);
}

auth()
	.then(function() {
		return getAllFiends(4289506);
	})
	.then(function(friendsList) {
		var secondLevelMutual = [];
		friendsList.sub.forEach(function(item) {
			secondLevelMutual = secondLevelMutual.concat(item.mutualList);
		});
		secondLevelMutual = secondLevelMutual.filter(function(id, i) {
			return id && !(secondLevelMutual.indexOf(id, i + 1) > i);
		});
		console.log('Mutual friends with this user ' + friendsList.self.length);
		console.log('Mutual friends with this his friends ' + secondLevelMutual.length);


	})
	.catch(function(error) {
		console.error(error)
	});


function getAllFiends(userId) {
	var code =
		'var a=API.friends.getMutual({"target_uid": "' + userId + '"});' +
		'var len = a.length -1 ;' +
		'var c = []; c.sub = [];' +
		'c.self = API.friends.getMutual({"target_uid":"' + userId + '"});' +
		'while(len>0){' +
		'var friend = []; friend.id = a[len]; friend.mutualList = API.friends.getMutual({"target_uid":a[len]}); '+
		'c.sub.push(friend);' +
		'len = len - 1;}' +
		'return c;';

	return new Promise(function(resolve, reject) {
		VK.Api.call("execute", {code: code}, callback);
		function callback(response) {
			if (response.error) {
				reject(new Error(response.error.error_msg));
			} else {
				resolve(response.response);
			}
		}
	});
}




