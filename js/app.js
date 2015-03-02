// back bone application
(function($, Backbone, _, d3, undefined) {

    window.App = window.App || {};
    window.App.Models = window.App.Models || {};
    window.App.Collections = window.App.Collections || {};
    window.App.Views = window.App.Views || {};
    window.App.Router = window.App.Router || {};

    window.template = function(id) {
        return _.template($('#'+id).html());
    };

    // ********* Landing Page ********
    App.Views.Landing = Backbone.View.extend({
        type : 'LandingView',
        tagName : 'ul',
        id : 'landing-tiles',
        template : template('template-landing-page'),
        initialize : function() {
            _.bindAll(this, 'render', 'showItemType', 'renderItem');  // every function that uses 'this' as the current object should be in here
            this.render();
        },
        events : {
            'click .show-type' : 'showItemType'
        },
        render : function() {
            this.$el.appendTo('#app');
            this.collection.each(this.renderItem, this);
            return this;
        },
        renderItem : function(item) {
            this.$el.append(this.template(item.attributes));
        },
        showItemType : function(e) {
            // get the value
            var dataRoute = $(e.originalEvent.target).attr('data-route');
            // navigate to route
            router.navigate(dataRoute, {trigger:true});
        }
    });

    
    // ******* Lobby Page
    App.Views.Lobby = Backbone.View.extend({
        type : 'LobbyView',
        tagName : 'ul',
        id : 'room-tiles',
        initialize : function() {
            _.bindAll(this, 'render', 'addRoom', 'showRoom');
            this.render();
        },
        events : {
            //'click .home' : 'landingPage',
            'click .room-tile' : 'showRoom'
        },
        render : function() {
            console.log('doing render');
            this.$el.appendTo('#app');
            this.collection.each(this.addRoom, this);
            this.$el.append('<a href="/">home</a>');
            return this;
        },
        addRoom : function(item) {
            var roomTile = new App.Views.RoomTile({ model: item});
            this.$el.append(roomTile.render().el);
        },
        showRoom : function(e) {
            var roomId = $(e.originalEvent.target).closest('div').attr('id').replace('room-', '');
            console.log(roomId);
            router.navigate('room/' + roomId, {trigger:true});
        }
    });

    

    // ******* Room Tile **********
    App.Views.RoomTile = Backbone.View.extend({
        type : 'RoomTile',
        tagName : 'li',
        className : 'room-tile',
        template : template('room-tile'),
        initialize : function() {
            _.bindAll(this, 'render');
        },
        events : {
            'click li' : 'showRoom'
        },
        render : function() {
            this.$el.html( this.template(this.model.toJSON()) );
            return this;  
        }
    });


})(jQuery, Backbone, _, d3);