function HomeController(page) {

}

HomeController.prototype.onShow = function () {
  new SearchController();
};

App.controller('search', HomeController);
App.load('search');