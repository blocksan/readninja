(function() {
    var app = angular.module('hackthaon.partials.postsController', []);
    app.controller('postsController', ['authorservice', '$scope', '$mdDialog', 'postservice', function(authorservice, $scope, $mdDialog, postservice) {

        $scope.loadTab = false;
        var tempPosts;
        loadingData();

        function loadingData() {


            var authorPostsAllPromise = authorservice.authorPostsAll();
            authorPostsAllPromise.then(function(response) {

                $scope.posts = response[0].posts;
                tempPosts = angular.copy($scope.posts);
                $scope.loadTab = true;
            }, function(error) {

            })
        }
        $scope.goto = function(type) {
            $scope.loadTab = false;
            $scope.posts = [];
            if (type != 'all') {
                $scope.posts = tempPosts.filter(function(post) {

                    return post.status == type
                });
                $scope.loadTab = true;
            } else {
                $scope.posts = angular.copy(tempPosts);
                $scope.loadTab = true;
            }

        }
        $scope.deleteConfirm = function(ev, id) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete your post?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('yes')
                .cancel('oops!');

            $mdDialog.show(confirm).then(function() {

                var deletePostPromise = postservice.deletePost(id);
                deletePostPromise.then(function(response) {
                    loadingData();
                }, function(err) {
                    console.log(err);
                })
            }, function() {

            });
        };
    }])
})();