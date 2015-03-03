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
            console.log('initialising: Landing');
            _.bindAll(this, 'render', 'showItemType', 'renderItem');  // every function that uses 'this' as the current object should be in here
            this.render();
        },
        events : {
            'click .show-type' : 'showItemType'
        },
        render : function() {
            this.$el.appendTo('#main-menu');
            this.collection.each(this.renderItem, this);
            return this;
        },
        renderItem : function(item) {
            this.$el.append(this.template(item.attributes));
        },
        showItemType : function(e) {
            e.preventDefault();
            var el = $(e.originalEvent.target),
                // get the value
                dataRoute = el.attr('href');

            el.parent().siblings().removeClass('active');
            el.parent().addClass('active');
            // navigate to route
            router.navigate(dataRoute, {trigger:true});
        }
    });

    // ******* Personnel Page
    App.Views.Personnel = Backbone.View.extend({
        type : 'Personnel',
        tagName : 'ul',
        id : 'personnel-tiles',
        initialize : function() {
            console.log('initialising: Personnel');
            _.bindAll(this, 'render', 'addPerson', 'showPerson');
            this.render();
        },
        events : {
            'click .home' : 'landingPage',
            'click .person-tile' : 'showPerson'
        },
        render : function() {
            this.$el.appendTo('#app');
            this.collection.each(this.addPerson, this);
            this.$el.append('<a href="/">home</a>');
            return this;
        },
        addPerson : function(item) {
            var personTile = new App.Views.PersonTile({ model: item});
            this.$el.append(personTile.render().el);
        },
        showPerson : function(e) {
            var roomId = $(e.originalEvent.target).closest('div').attr('id').replace('person-', '');
            console.log(roomId);
            router.navigate('person/' + roomId, {trigger:true});
        },
        landingPage : function() {
            router.navigate('/', {trigger:true});
        }
    });

    App.Views.PersonTile = Backbone.View.extend({
        type : 'PersonTile',
        tagName : 'li',
        className : 'person-tile',
        template : template('person-tile'),
        initialize : function() {
            console.log('initialising: PersonTile');
            _.bindAll(this, 'render');
        },
        events : {
        },
        render : function() {
            this.$el.html( this.template(this.model.toJSON()) );            
            return this;  
        }
    });

    // Room view
    App.Views.Person = Backbone.View.extend({
        type : 'Person',
        className : 'person-container',
        template : template('person'),
        initialize : function() {
            console.log('initialising person');
            _.bindAll(this, 'render', 'showRoom');
            this.render();
        },
        events : {
            'click .room' : 'showRoom'
        },
        render : function() {
            var modelData = this.model.toJSON(),
                rooms = '';

            this.$el.appendTo('#app');
            this.$el.html( this.template(modelData) );
            
            _.each(modelData.rooms, function(value, key) {
                rooms += '<li class="room">' + value.name + ' : <span>' + value.mood + '</span></li>'; 
            });
            // add the members to the interface
            this.$el.find('.rooms').append(rooms);
            return this;
        },
        showRoom : function() {
            // show the details of that person
            console.log('showing room profile');
        }
    });

    // ******* Lobby Page
    App.Views.Lobby = Backbone.View.extend({
        type : 'Lobby',
        tagName : 'ul',
        id : 'room-tiles',
        initialize : function() {
            console.log('initialising: Lobby');
            _.bindAll(this, 'render', 'addRoom', 'showRoom');
            this.render();
        },
        events : {
            'click .home' : 'landingPage',
            'click .room-tile' : 'showRoom'
        },
        render : function() {
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
        },
        landingPage : function() {
            router.navigate('/', {trigger:true});
        }
    });

    // ******* Room Tile **********
    App.Views.RoomTile = Backbone.View.extend({
        type : 'RoomTile',
        tagName : 'li',
        className : 'room-tile',
        template : template('room-tile'),
        initialize : function() {
            console.log('initialising: RoomTile');
            _.bindAll(this, 'render');
        },
        events : {
        },
        render : function() {
            this.$el.html( this.template(this.model.toJSON()) );            
            return this;  
        }
    });

    // Room view
    App.Views.Room = Backbone.View.extend({
        type : 'Room',
        className : 'room-container',
        template : template('room'),
        initialize : function() {
            console.log('initialising room');
            _.bindAll(this, 'render');
            this.render();
        },
        events : {
            'click .member' : 'showProfile'
        },
        render : function() {
            var modelData = this.model.toJSON(),
                members = '';

            this.$el.appendTo('#app');
            this.$el.html( this.template(modelData) );
            
            _.each(modelData.members, function(value, key) {
                members += '<li class="member">' + value.name + ' : <span>' + value.mood + '</span></li>'; 
            });
            // add the members to the interface
            this.$el.find('.members').append(members);
            return this;
        },
        showProfile : function() {
            // show the details of that person
            console.log('showing member profile');
        }
    });



})(jQuery, Backbone, _, d3);