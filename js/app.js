// back bone application
var app = (function($, Backbone, _, d3, undefined) {

    window.App = {
        Models : {},
        Collections : {},
        Views : {},
        Router : {}
    };

    window.template = function(id) {
        return _.template($('#'+id).html());
    };

    App.Router = Backbone.Router.extend({
        landingPage : null,
        lobby : null,
        personnel : null,
        room : null,
        person : null,
        routes : {
            ''              : 'routeHomepage',
            'lobby'         : 'routeLobby',
            'people'        : 'routePersonnel',
            'room/:id'      : 'routeRoom',
            'person/:id'    : 'routePerson',
            '*actions'      : 'routeHomepage' // default route
        },
        routeHomepage : function() {
            console.log('doing initialize');
            if (!this.landingPage) {
                // render landing page
                var landingCollection = new App.Collections.Landing([
                        {type : 'people', route : 'people'},
                        {type : 'rooms', route : 'lobby'}
                    ]);
                this.landingPage = new App.Views.Landing({ collection: landingCollection });
            } else {
                // re-render the page???
            }
        },
        routeLobby : function() {
            // list of all the chat rooms
            console.log('navigating to the lobby');
            // get the data for the lobby
            $.ajax({
                url : '/data/lobby.json',
                type : 'GET',
                success : function(data) {
                    var lobbyRooms = new App.Collections.Lobby(data);
                    this.lobby = new App.Views.Lobby({ collection: lobbyRooms });
                }, 
                error : function(e) {
                    alert('there was an error getting the lobby data');
                    router.navigate('/', {trigger:true});
                }
            });
        },
        routePersonnel : function() {
            // list of all the people on hipchat
            console.log('navigating to people');
        },
        routeRoom : function(id) {
            // go to the room with that id
            console.log('navigating to room id: ' + id);
            $.ajax({
                url : '/data/room.json',
                type: 'GET',
                success : function(data) {
                    var roomData // get the data for then room
                    // get the collection of people in this room
                },
                error : function(e) {
                    alert('there was an error getting the room data');
                    router.navigate('lobby', {trigger:true});
                }
            })
        },
        routePerson : function(id) {
            // go to the peron with that id
        }
    });



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

    App.Models.Landing = Backbone.Model.extend({
        defaults : {type : 'people', route : 'people'}
    });

    App.Collections.Landing = Backbone.Collection.extend({
        model : App.Models.Landing
    });
    // ******* End Landing Page **********






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

    // must define the model before the collection
    App.Models.RoomTile = Backbone.Model.extend({
        defaults : {id: 0, name: 'default', mood: 0}
    });

    App.Collections.Lobby = Backbone.Collection.extend({
        model : App.Models.RoomTile
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

    


    



    var router = new App.Router();
    Backbone.history.start();

})(jQuery, Backbone, _, d3);