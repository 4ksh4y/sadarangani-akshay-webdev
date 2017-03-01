/**
 * Created by Akshay on 2/22/2017.
 */

(function () {
    angular
        .module('wbdvDirectives', [])
        .directive('wbdvDraggable', wbdvDraggableDir)
        .directive('wbdvSortable', wbdvSortableDir);

    function wbdvSortableDir() {
        function linkFunc (scope, element, attributes) {
            element.sortable(
                {
                    axis: "y",
                    handle: ".glyphicon.glyphicon-align-justify"
                });
        }
        return {
            link: linkFunc
        };
    }

    function wbdvDraggableDir() {
        function linkFunction(scope, element) {
            element.draggable();
        }
        return {
            link: linkFunction
        }
    }

})();