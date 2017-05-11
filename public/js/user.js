/*=========================================================================
*Developer:Khoi Nguyen
*Date: 5/3/2017
*UCSD Code Bootcamp: Homework #15
FE js for burger
==========================================================================*/
var url = window.location.search;
var counter = 0;
// Constructing a newPost object to hand to the database
var newBurger = {
    burger_name: null,
    devour: false,
    created_at: null
};
//single object to control the DOM
var burger = {
    
    init: function() {  
        this.cacheDom();
        this.renderHide();
        this.bindEvents();
    },
    cacheDom: function () {
        this.$displayArea = $("#displayArea");
        this.$textArea = $("#textArea");
        this.$submitBtn = $("#submitBtn");
        this.$burgers = $("#burgers");
        this.$btns = $("#btns");
        this.$eaten = $("#eaten");
    },
    bindEvents: function () {
        this.$submitBtn.on("click", this.postData.bind(this));
        //need to have a selector argument for dynamically create buttons.
        $(document).on("click", ".devBtn", this.eatThatBurger);
    }, 
    renderHide: function () {
        this.$displayArea.hide();
    },
    renderShow: function () {
        this.$displayArea.show();
    },
    //submits a new post to the db
    postData: function() {
        console.log("submit button works");
        console.log(this.$textArea.val().trim());
        newBurger.burger_name = this.$textArea.val().trim();
        //ajax post call with path url and newBurger data entered by user.
        $.post("api/postedBurger", newBurger).done(function() {
            counter++;
            //dynamically appending newly added burger.
            var newBtn = $("<button>");
            newBtn.addClass("btn btn-md btn-warning");
            newBtn.append("<p>" + newBurger.burger_name + " </p>");
            newBtn.attr("id", counter);
            burger.$burgers.append(newBtn);
            //dynamically appending devour buttons.
            var devourBtn = $("<button>Devour</button>");
            devourBtn.addClass("btn btn-md btn-danger devBtn");
            devourBtn.attr("value", counter);
            burger.$btns.append(devourBtn);
        });
        this.$textArea.val("");
        this.renderShow();
    }, 
    // getData: function (id) {
    //     console.log("devour button: " + id);
    //     $.get("api/burgers", function (burgers) {
    //         console.log(burgers[0].id);
    //     });
    // },
    eatThatBurger: function() {
        //storing identifier into variable
        var toDelete = "#" + $(this).val();
        //adding to eaten area
        var newBtn = $("<button>");
        newBtn.addClass("btn btn-md btn-warning");
        newBtn.append("<p>" + $(toDelete).text() + " </p>");
        burger.$eaten.append(newBtn);
        //removing added burger
        $(toDelete).remove();
        //deleting the devour button.
        $(this).remove();     

    }
};

$( document ).ready(function() {
    burger.init();
});