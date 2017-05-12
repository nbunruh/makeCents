/*=========================================================================
 *Developer:Make Cents
 *Date: 5/11/2017
 *UCSD Code Bootcamp: group project #2
 ==========================================================================*/
var url = window.location.search;
var counter = 0;
// Constructing a newPost object to hand to the database
var newWallet = {
    groceries: null,
    gas: false,
    leisure: null,
    totalSpendings: null
};
//single object to control the DOM
var wallet = {
    init: function() {
        this.cacheDom();
        this.bindEvents();
    },
    cacheDom: function () {
        this.$calcBtn = $("#calcBtn");
        this.$groceriesInput = $("#groceriesInput");
        this.$gasInput = $("#gasInput");
        this.$leisureInput = $("#leisureInput");
        this.$totalArea = $("#totalArea");
        this.$submitBtn = $("#submitBtn");
        // this.$burgers = $("#burgers");
        // this.$btns = $("#btns");
        // this.$eaten = $("#eaten");
    },
    bindEvents: function () {
        //this.$testBtn.on("click", this.postData.bind(this));
        this.$calcBtn.on("click", this.total.bind(this));
        this.$submitBtn.on("click", this.postSpendings);
        //need to have a selector argument for dynamically create buttons.
        // $(document).on("click", ".devBtn", this.eatThatBurger);
    },
    total: function () {
        console.log("about to calculate");
        //grabbing user input
        newWallet.groceries = parseFloat(this.$groceriesInput.val().trim());
        newWallet.gas = parseFloat(this.$gasInput.val().trim());
        newWallet.leisure = parseFloat(this.$leisureInput.val().trim());
        //new button plus total calc.
        var totalAmount = parseFloat(newWallet.groceries) +
            parseFloat(newWallet.gas) +
            parseFloat(newWallet.leisure);
        newWallet.totalSpendings = totalAmount;
        var newBtn = $("<button>");
        newBtn.addClass("btn btn-md btn-info text-center");
        newBtn.attr("name", "total");
        newBtn.append("<p>" + totalAmount.toFixed(2) + " </p>");
        this.$totalArea.append(newBtn);
    },
    postSpendings: function () {
        console.log(newWallet);
        $.post("/users/walletCreate", newWallet).done(function() {
            console.log("posted completed!");
        });
    },

    postGroup: function () {
        console.log(newWallet);
        $.post("/users/walletCreate", newWallet).done(function() {
            console.log("posted completed!");
        });
    }

};

$( document ).ready(function() {
    console.log("about to init the wallet, if you see this message, js file is linked.");
    wallet.init();
});