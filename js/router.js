// Application Router script
var router = (function($, Backbone, _, d3, undefined) {
    var router;

    window.App = window.App || {};
    window.App.Models = window.App.Models || {};
    window.App.Collections = window.App.Collections || {};
    window.App.Views = window.App.Views || {};
    window.App.Router = window.App.Router || {};

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
                        {type : 'home', route : ''},
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
            $.ajax({
                url : '/data/personnel.json',
                type : 'GET',
                success : function(data) {
                    var personnelRooms = new App.Collections.Personnel(data);
                    this.personnel = new App.Views.Personnel({ collection: personnelRooms });
                },
                error : function(e) {
                    alert('there was a problem getting the personnel data');
                    router.navigate('/', {trigger:true});
                }
            });
        },
        routeRoom : function(id) {
            // go to the room with that id
            console.log('navigating to room id: ' + id);
            $.ajax({
                url : '/data/room.json',
                type: 'GET',
                success : function(data) {
                    console.log(data);
                    // get the collection of people in this room
                    var roomStatus = new App.Models.Room(data);
                    this.room = new App.Views.Room({ model : roomStatus });
                },
                error : function(e) {
                    //alert('there was an error getting the room data');
                    router.navigate('lobby', {trigger:true});
                }
            });
        },
        routePerson : function(id) {
            // go to the person with that id
            console.log('navigating to person id: ' + id);
            $.ajax({
                url : '/data/person.json',
                type: 'GET',
                success : function(data) {
                    console.log(data);
                    // get the collection of people in this room
                    var personStatus = new App.Models.Person(data);
                    this.person = new App.Views.Person({ model : personStatus });
                },
                error : function(e) {
                    alert('there was an error getting the person data');
                    router.navigate('lobby', {trigger:true});
                }
            });
        }
    });

    router = new App.Router();
    Backbone.history.start();    

    return router;

})(jQuery, Backbone, _, d3);