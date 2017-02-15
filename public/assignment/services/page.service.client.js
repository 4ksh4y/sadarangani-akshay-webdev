/**
 * Created by Akshay on 2/14/2017.
 */
(function () {
    angular
        .module("WebAppMaker")
        .factory("PageService", PageService);

    function PageService() {
        var pages = [
            { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem", created: new Date() },
            { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem", created: new Date() },
            { "_id": "543", "name": "Post 3", "websiteId": "678", "description": "Lorem", created: new Date() }
        ];

        var api = {
            "createPage": createPage,
            "findPageByWebsiteId": findPageByWebsiteId,
            "findPageById": findPageById,
            "deletePage": deletePage,
            "updatePage": updatePage
        };
        return api;

        function findPageByWebsiteId(websiteId) {
            var user_pages = [];
            for (var p in pages) {
                if (pages[p].websiteId === websiteId) {
                    user_pages.push(angular.copy(pages[p]));
                }
            }
            return user_pages;
            }


        function findPageById(pageId) {
            for(var p in pages) {
                if(pages[p]._id === pageId) {
                    return angular.copy(pages[p]);
                }
            }
            return null;
        }
        function deletePage(pageId) {
            for(var p in pages) {
                if(pages[p]._id === pageId) {
                    pages.splice(p, 1);
                }
            }
        }

        function createPage(websiteId, page) {
            page.websiteId = websiteId;
            page._id = (new Date()).getTime();
            page.created = new Date();
            pages.push(page);
            return page;
        }

        function updatePage(pageId, page) {
            for(var p in pages) {
                if( pages[p]._id === pageId) {
                    pages[p].name = page.name;
                    pages[p].description = page.description;
                    return pages[w];
                }
            }
            return null;
        }
    }
})();