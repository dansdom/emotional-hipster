// back bone application
(function($, Backbone, _, d3, undefined) {

    window.App = window.App || {};
    window.App.Models = window.App.Models || {};
    window.App.Collections = window.App.Collections || {};
    window.App.Views = window.App.Views || {};
    window.App.Router = window.App.Router || {};

    // *** must define the model before the collection ***

    // landing page models
    App.Models.Landing = Backbone.Model.extend({
        defaults : {type : 'people', route : 'people'}
    });

    App.Collections.Landing = Backbone.Collection.extend({
        model : App.Models.Landing
    });

    // room tiles models
    App.Models.RoomTile = Backbone.Model.extend({
        defaults : {id: 0, name: 'default', mood: 0}
    });

    App.Collections.Lobby = Backbone.Collection.extend({
        model : App.Models.RoomTile
    });

    // person tiles models
    App.Models.PersonTile = Backbone.Model.extend({
        defaults : {id: 0, name: 'default', mood: 0}
    });

    App.Collections.Personnel = Backbone.Collection.extend({
        model : App.Models.PersonTile
    });

    App.Models.Room = Backbone.Model.extend({
        defaults : {id: 0, name: 'default', mood: 0, members: []}
    });



})(jQuery, Backbone, _, d3);