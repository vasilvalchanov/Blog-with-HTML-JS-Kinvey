(function () {

    // Create your own kinvey application

    let baseUrl = "https://baas.kinvey.com";
    let appKey = "kid_SJtraUGK"; // Place your appKey from Kinvey here...
    let appSecret = "357d999499ed47079644dc31bb5498eb"; // Place your appSecret from Kinvey here...
    var _guestCredentials = "55eed8a2-c0ad-4d77-95c5-2b76cc49a6c8.Oq+NBpoUI4yVGLfnLN5dg/3v5JXLWTi+/ofwdal9Hzs="; // Create a guest user using PostMan/RESTClient/Fiddler and place his authtoken here...

    //Create AuthorizationService and Requester
    let authService= new AuthorizationService(baseUrl,
        appKey,
        appSecret,
        _guestCredentials);

    authService.initAuthorizationType("Kinvey");

    let requester = new Requester(authService);

    let selector = ".wrapper";
    let mainContentSelector = ".main-content";

    // Create HomeView, HomeController, UserView, UserController, PostView and PostController
    let homeView = new HomeView(selector, mainContentSelector);
    let homeController = new HomeController(homeView, requester, baseUrl, appKey);

    let userView = new UserView(selector, mainContentSelector);
    let userController= new UserController(userView,requester,baseUrl,appKey);

    let postView= new PostView(selector,mainContentSelector);
    let postController = new PostController(postView,requester,baseUrl,appKey);

    //postController.showCreatePostPage();

    initEventServices();

    onRoute("#/", function () {
        // Check if user is logged in and if its not show the guest page, otherwise show the user page...
        if(!authService.isLoggedIn()){
            homeController.showGuestPage();
        }else{
            homeController.showUserPage();
        }
    });

    onRoute("#/post-:id", function () {
        // Create a redirect to one of the recent posts...
        let top = $("#post-" + this.params['id']).position().top;
        $(window).scrollTop(top);
    });

    onRoute("#/login", function () {
        // Show the login page...
        userController.showLoginPage(authService.isLoggedIn());
    });

    onRoute("#/register", function () {
        // Show the register page...
        userController.showRegisterPage(authService.isLoggedIn());
    });

    onRoute("#/logout", function () {
        // Logout the current user...
        userController.logout();
    });

    onRoute('#/posts/create', function () {
        // Show the new post page...
        let data = {
            fullname: sessionStorage['fullname']
        };

        postController.showCreatePostPage(data,authService.isLoggedIn());
    });

    bindEventHandler('login', function (ev, data) {
        // Login the user...
        userController.login(data);
    });

    bindEventHandler('register', function (ev, data) {
        // Register a new user...
        userController.register(data);
    });

    bindEventHandler('createPost', function (ev, data) {
        // Create a new post...
        postController.createPost(data);
    });

    run('#/');
})();
