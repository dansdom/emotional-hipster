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

    // http://stackoverflow.com/questions/9960353/backbone-js-how-to-clean-up-views-when-navigate-to-another-url
    var dispatcher = _.clone(Backbone.Events);

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
            // remove all the views except this one
            dispatcher.trigger('CloseView');

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
            dispatcher.trigger('CloseView');
            dispatcher.on('CloseView', this.close, this);
            _.bindAll(this, 'render', 'addPerson', 'showPerson', 'runIsotope');
            this.render();
        },
        close : function() {
            console.log('closing personnel');
            dispatcher.off('CloseView', this.close, this);
            this.$el.isotope('destroy');
            $('#sort-controls').off().remove();
            this.remove();
        },
        events : {
            'click .person-tile' : 'showPerson'
        },
        render : function() {
            this.$el.appendTo('#page-content');
            this.collection.each(this.addPerson, this);
            this.runIsotope();
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
        runIsotope : function() {
            var container = this.$el.isotope({
                itemSelector : 'li',
                layoutMode: 'fitRows',
                getSortData: {
                    name : '.name',
                    mood : '.mood'
                }
            });
            this.$el.after('<div id="sort-controls"><input type="button" class="btn" id="sort-name" value="Sort By Name" /><input type="button" class="btn" id="sort-mood" value="Sort By Mood" /></div>');
            $('#sort-name').on('click', function() {
                container.isotope({ sortBy: 'name' });
            });
            $('#sort-mood').on('click', function() {
                container.isotope({ sortBy: 'mood' });
            });

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

    // Person view
    App.Views.Person = Backbone.View.extend({
        type : 'Person',
        className : 'person-container',
        template : template('person'),
        initialize : function() {
            console.log('initialising person');
            dispatcher.trigger('CloseView');
            dispatcher.on('CloseView', this.close, this);
            _.bindAll(this, 'render', 'showRoom');
            this.render();
        },
        close : function() {
            console.log('closing person');
            dispatcher.off('CloseView', this.close, this);
            this.remove();
        },
        events : {
            'click .room' : 'showRoom'
        },
        render : function() {
            var modelData = this.model.toJSON(),
                rooms = '';

            this.$el.appendTo('#page-content');
            this.$el.html( this.template(modelData) );
            
            _.each(modelData.rooms, function(value, key) {
                rooms += '<li class="room" id="room-' + value.id + '">' + value.name + ' : <span>' + value.mood + '</span></li>'; 
            });
            // add the members to the interface
            this.$el.find('.rooms').append(rooms);
            return this;
        },
        showRoom : function(e) {
            // show the details of that person
            console.log('showing room profile');
            var roomId = $(e.originalEvent.target).attr('id').replace('room-', '');
            console.log(roomId);
            router.navigate('room/' + roomId, {trigger:true});
        }
    });

    // ******* Lobby Page
    App.Views.Lobby = Backbone.View.extend({
        type : 'Lobby',
        tagName : 'ul',
        id : 'room-tiles',
        initialize : function() {
            console.log('initialising: Lobby');
            dispatcher.trigger('CloseView');
            dispatcher.on('CloseView', this.close, this);
            _.bindAll(this, 'render', 'addRoom', 'showRoom', 'runIsotope');
            this.render();
        },
        close : function() {
            console.log('closing lobby');
            dispatcher.off('CloseView', this.close, this);
            this.$el.isotope('destroy');
            this.remove();
        },
        events : {
            'click .room-tile' : 'showRoom'
        },
        render : function() {
            this.$el.appendTo('#page-content');
            this.collection.each(this.addRoom, this);
            this.runIsotope();
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
        runIsotope : function() {
            console.log('running isotope');
            this.$el.isotope({
                itemSelector : 'li',
                layoutMode: 'fitRows'
            });
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
            dispatcher.trigger('CloseView');
            dispatcher.on('CloseView', this.close, this);
            _.bindAll(this, 'render', 'showProfile');
            this.render();
        },
        close : function() {
            dispatcher.off('CloseView', this.close, this);
            this.remove();
        },
        events : {
            'click .member' : 'showProfile'
        },
        render : function() {
            var modelData = this.model.toJSON(),
                members = '';

            this.$el.appendTo('#page-content');
            this.$el.html( this.template(modelData) );
            
            _.each(modelData.members, function(value, key) {
                members += '<li class="member" id="person-' + value.id + '">' + value.name + ' : <span>' + value.mood + '</span></li>'; 
            });
            // add the members to the interface
            this.$el.find('.members').append(members);
            return this;
        },
        showProfile : function(e) {
            // show the details of that person
            console.log('showing member profile');
            var personId = $(e.originalEvent.target).attr('id').replace('person-', '');
            console.log(personId);
            router.navigate('person/' + personId, {trigger:true});
        }
    });



})(jQuery, Backbone, _, d3);