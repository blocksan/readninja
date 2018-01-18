(function() {

    var app = angular.module('hackathon.core.contentController', []);
    app.controller('contentController', ['$scope', '$stateParams', 'textAngularManager', 'postservice', 'authorservice', function($scope, $stateParams, textAngularManager, postservice, authorservice) {
        console.log('in content controller');
        $scope.loaded = false;
        $scope.content = false;
        $scope.version = textAngularManager.getVersion();
        $scope.versionNumber = $scope.version.substring(1);
        $scope.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><img class="ta-insert-video" ta-insert-video="http://www.youtube.com/embed/2maA1-mvicY" src="" allowfullscreen="true" width="300" frameborder="0" height="250"/></p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE9+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p><h4>Supports non-latin Characters</h4><p>昮朐 魡 燚璒瘭 譾躒鑅, 皾籈譧 紵脭脧 逯郹酟 煃 瑐瑍, 踆跾踄 趡趛踠 顣飁 廞 熥獘 豥 蔰蝯蝺 廦廥彋 蕍蕧螛 溹溦 幨懅憴 妎岓岕 緁, 滍 蘹蠮 蟷蠉蟼 鱐鱍鱕, 阰刲 鞮鞢騉 烳牼翐 魡 骱 銇韎餀 媓幁惁 嵉愊惵 蛶觢, 犝獫 嶵嶯幯 縓罃蔾 魵 踄 罃蔾 獿譿躐 峷敊浭, 媓幁 黐曮禷 椵楘溍 輗 漀 摲摓 墐墆墏 捃挸栚 蛣袹跜, 岓岕 溿 斶檎檦 匢奾灱 逜郰傃</p>';
        $scope.htmlcontent = '';
        $scope.disabled = false;
        $scope.saveText = function() {
            var data = {
                "heading": "My First Post",
                "body": "<p><br></p><p><img src='https://cdn.scotch.io/272/g2A1PWWS0KmiR9E3t5w3_Angular%20-%20Shortcut%20to%20Import%20Your%20Styles%20Files%20in%20Component%201.png.jpg' style='font-size: 1.2em;width: 100%;'><span style='font-size: 1.2em;'>​</span></p><p></p><p>Hello this is my first tutorial</p><p></p><p></p>",
                "tags": ["angular", "css"],
                "banner": "2.png",
                "difficulty": "easy",
                "likes": 0,
                "shares": 0,
                "views": 0,
                "claps": 0,
                "type": "tutorial",
                "readtime": 3,
                "dateadded": "3 Jan 2017",
                "status": "pending",
                "user": "",
                "comments": [""]
            }
            var postPromise = postservice.createPost(data, 'ninjasan');
            postPromise.then(function(response) {
                console.log(response)
            }, function(err) {
                console.log(err)
            })
        }
        $scope.createAuthor = function() {
            var data = {
                "name": "alfedo",
                "username": "alfredo",
                "tagline": "I will hustle more rather than settle",
                "avatar": "/avatar.png",
                "email": "me@sandeepghosh.com",
                "password": "admin",
                "website": "www.readninja.com",
                "bio": "I am a part time writer, machine learning enthusiasts and MEAN stack developer",
                "gitU": "",
                "instaU": "",
                "fbU": "",
                "twitU": "",
                "numberposts": 0,
                "likes": 0,
                "claps": 0,
                "tags": ["angularjs", "css", "js"]

            }
            var authorPromise = authorservice.createAuthor(data);
            authorPromise.then(function(response) {
                console.log(response)
            }, function(err) {
                console.log(err)
            })
        }
        $scope.$watch('htmlcontent', function(newValue, oldValue) {

            var str = newValue;
            var res = str.match(/<pre>/g);
            //res = res + 
        });
        //$scope.allPost = function() {
        var allPostPromise = postservice.allPost();
        allPostPromise.then(function(response) {
            $scope.posts = response;

            //console.log(response, 'all post')
        }, function(error) {
            console.log(error)
        });
        var allAuthorPromise = authorservice.allAuthor();
        allAuthorPromise.then(function(response) {
            //console.log(response)
        }, function(error) {
            console.log(error)
        });
        var author_id_mongo = "5a5451d88f8ada2db029cd13" //for ninjasan
        var getAuthorPromise = authorservice.getAuthorPost(author_id_mongo);
        getAuthorPromise.then(function(response) {
            //$scope.post=response;
            //console.log(response, 'author data')
        }, function(error) {
            console.log(error)
        });




        // var post_id_mongo = "5a5451d88f8ada2db029cd13"
        /* var tags = ["Angular", "Angular2", "CSS", "Javascript", "PHP", "MongoDB", "HTML", "CSS3"]
        var category = ["Tutorial", "Article"]
        var difficulty = ["Easy", "Intermediate", "Advance"]
        var readtime = [3, 4, 7, 10, 5]
        var filterData = {
            tags: tags,
            category: category,
            difficulty: difficulty,
            readtime: readtime
        }
        var filterInsertPromise = postservice.filterkeys(filterData);
        filterInsertPromise.then(function(response) {
            console.log(response, 'post data')
        }, function(error) {
            console.log(error)
        }); */




        //}
        if ($stateParams.keyword) {
            var post_heading = $stateParams.keyword;
            post_heading = post_heading.split(' ').join('-')
            var getPostPromise = postservice.getPost(post_heading);
            getPostPromise.then(function(response) {
                    if (response[0]) {
                        $scope.post = response[0];
                        $scope.author = response[0].user;
                        $scope.content = true;
                    } else
                        $scope.content = false;
                    $scope.loaded = true;
                },
                function(error) {
                    console.log(error)
                });
        } else {
            $scope.content = false;
            $scope.loaded = true;
        }


    }]);
})();