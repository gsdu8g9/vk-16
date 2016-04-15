function auth() {
	VK.init({
		apiId: 5377462
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
		return getAllFiends(4289506)
	})
	.then(function(friendsList) {
		var promises = friendsList.map(function(friend) {
			return getAllFiends(friend)
		});
		Promise.all(promises)
			.then(function(result) {
				console.log(result)
			});
	})
	.catch(function(error) {
		console.error(error)
	});

function getAllFiends(userId) {
	return new Promise(function(resolve, reject) {
		VK.api('friends.getMutual', {
			'target_uid': userId
		}, function(response) {
			if (response.error) {
				if (response.error.error_code === 15) {
					resolve([]);
				} else {
					reject(new Error(response.error.error_msg));
				}
			} else {
				resolve(response.response);
			}

		})
	})

}