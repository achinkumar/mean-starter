var name = "achin";
var email = "achin@roof.com";
var pwd = "achin";
var newPwd = "12345";
describe('genAppApp', function () {

	it('ensures user has access to homepage', function () {
		browser().navigateTo('/');
		expect(browser().location().path()).toBe('/');
		expect(element(".jumbotron").text()).toContain("'Allo, 'Allo !");

	});


	it('ensures user can register', function () {
		browser().navigateTo('/api/dbinit');
		browser().navigateTo('/signup');
		expect(browser().location().path()).toBe('/signup');
		expect(element('#login').text()).toContain("Log in.");
		expect(element("#signup").text()).toContain("Sign up");
		// assuming inputs have ng-model specified, and this combination will successfully create an account for this user
		input('user.name').enter('');
		expect(element('.help-block').text()).toContain("A name is required");
		input('user.email').enter(name);
		expect(element('.help-block').text()).toContain("Doesn't look like a valid email.");
		input('user.password').enter('ab');
		expect(element('.help-block').text()).toContain('Password must be at least 3 characters.');
		input('user.name').enter(name);
		input('user.email').enter(email);
		input('user.password').enter(pwd);
		element('#signupbtn').click();
		expect(browser().location().path()).toBe('/');


		(browser().navigateTo('/login'));
		input('user.email').enter(email);
		input('user.password').enter(pwd);
		element('#loginbtn').click();
		expect(element('.help-block').text()).toContain('User status found to be inactive.');
		expect(browser().location().path()).toBe('/login');
		browser().navigateTo('/api/getLastAk');
	})


	it('ensures user can login', function () {
		browser().navigateTo('/');
		browser().navigateTo('/login');
		expect(element("#login").text()).toContain("Login");

		// assuming inputs have ng-model specified, and this combination will successfully login
		input('user.email').enter(email);
		input('user.password').enter(pwd);
		element('#loginbtn').click();
		expect(browser().location().path()).toBe('/');
		expect(element('.jumbotron').text()).toContain("'Allo, 'Allo achin!");
		expect(element('#successbtn').text()).toContain("Splendid!");
		element('#logout').click();
		expect(browser().location().path()).toBe('/login');

	});


	it('ensures user can change pwd', function () {
		input('user.email').enter(email);
		input('user.password').enter(pwd);
		element('#loginbtn').click();
		expect(browser().location().path()).toBe('/');
		browser().navigateTo('/settings');
		expect(browser().location().path()).toBe('/settings');

		// assuming inputs have ng-model specified, and this combination will successfully change password to the password entered
		input('user.oldPassword').enter(email);
		input('user.newPassword').enter(newPwd);
		element('#submitbtn').click();
		expect(element(".help-block").text()).toContain("Incorrect password");
		input('user.oldPassword').enter(pwd);
		input('user.newPassword').enter(newPwd);
		element('#submitbtn').click();
		expect(element(".help-block").text()).toContain("Password successfully changed.");
		element('#logout').click();
		expect(browser().location().path()).toBe('/login');

	});


	
	it('ensures user can get pwd if forgotten', function () {
		browser().navigateTo('/logout');
		browser().navigateTo('/forgotPwd');
		expect(browser().location().path()).toBe('/forgotPwd');
		expect(element("#fgt").text()).toContain("Forgot Password");
		expect(element(".col-sm-12").text()).toContain("Forgot Password");
		// assuming inputs have ng-model specified, and this input will fetch the new password which would be sent to user mail id 
		input('user.email').enter(email);
		element('#submitbtn').click();
		expect(browser().location().path()).toBe('/forgotPwd');

	});
})