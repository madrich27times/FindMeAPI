var app = angular.module('myApp', ['ngRoute', 'ngSanitize']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'home.html',
      controller: 'peopleController'
    })
    .when('/:pagename', {
      templateUrl: 'person.html',
      controller: 'personController'
    });
});

app.service('PeopleService', function ($http) {
  //console.log("running service");
  path = 'https://randomuser.me/api/?results=500&nat=us&seed=abc';
  this.getPeople = function () {
    return $http.get(path)
      .then(function (response) {
        this.people = response.data.results;
        return this.people;
      });
  }
});

app.service('ReturnPerson', function () {
  var person = {};
  return person;
});

var states = new Array({name:"Alabama",abbrev:"AL"},{name:"Alaska",abbrev:"AK"},{name:"Arizona",abbrev:"AZ"},{name:"Arkansas",abbrev:"AR"},{name:"California",abbrev:"CA"},{name:"Colorado",abbrev:"CO"},{name:"Connecticut",abbrev:"CT"},{name:"Delaware",abbrev:"DE"},{name:"Florida",abbrev:"FL"},{name:"Georgia",abbrev:"GA"},{name:"Hawaii",abbrev:"HI"},{name:"Idaho",abbrev:"ID"},{name:"Illinois",abbrev:"IL"},{name:"Indiana",abbrev:"IN"},{name:"Iowa",abbrev:"IA"},{name:"Kansas",abbrev:"KS"},{name:"Kentucky",abbrev:"KY"},{name:"Louisiana",abbrev:"LA"},{name:"Maine",abbrev:"ME"},{name:"Maryland",abbrev:"MD"},{name:"Massachusetts",abbrev:"MA"},{name:"Michigan",abbrev:"MI"},{name:"Minnesota",abbrev:"MN"},{name:"Mississippi",abbrev:"MS"},{name:"Missouri",abbrev:"MO"},{name:"Montana",abbrev:"MT"},{name:"Nebraska",abbrev:"NE"},{name:"Nevada",abbrev:"NV"},{name:"New Hampshire",abbrev:"NH"},{name:"New Jersey",abbrev:"NJ"},{name:"New Mexico",abbrev:"NM"},{name:"New York",abbrev:"NY"},{name:"North Carolina",abbrev:"NC"},{name:"North Dakota",abbrev:"ND"},{name:"Ohio",abbrev:"OH"},{name:"Oklahoma",abbrev:"OK"},{name:"Oregon",abbrev:"OR"},{name:"Pennsylvania",abbrev:"PA"},{name:"Rhode Island",abbrev:"RI"},{name:"South Carolina",abbrev:"SC"},{name:"South Dakota",abbrev:"SD"},{name:"Tennessee",abbrev:"TN"},{name:"Texas",abbrev:"TX"},{name:"Utah",abbrev:"UT"},{name:"Vermont",abbrev:"VT"},{name:"Virginia",abbrev:"VA"},{name:"Washington",abbrev:"WA"},{name:"West Virginia",abbrev:"WV"},{name:"Wisconsin",abbrev:"WI"},{name:"Wyoming",abbrev:"WY"});

app.controller('peopleController', function ($scope, $rootScope, PeopleService) {
  $scope.people = [];
  PeopleService.getPeople().then(function (data) {
    for (let i = 0; i < data.length; i++) {
      data[i].id = i;
      //console.log(data[i].location.state)
    }
    $scope.people = data;
    $scope.male = "male";
    $scope.female = "female";
    //console.log(data);
    $scope.search = '';
    $scope.filterOnFullName = function (person) {
      return (person.name.first.toLowerCase() + " " + person.name.last.toLowerCase()).indexOf($scope.search.toLowerCase()) >= 0;
    };
  });
  $scope.getPerson = function (id) {
    for (let i = 0; i < $scope.people.length; i++) {
      if (i == id) {
        $rootScope.person = $scope.people[i];
        //ReturnPerson.person = $scope.people[i];
      }
    }
  }
  $scope.deselect = function () {
    var malebtn = document.getElementById("malebtn");
    var femalebtn = document.getElementById("femalebtn");
    if (malebtn.checked) {
      malebtn.checked = false;
    }
    else if (femalebtn.checked) {
      femalebtn.checked = false;
    }
  }
  $scope.clearSelected = function () {
    var list = document.getElementById("statelist");
    if (list.selectedIndex != null) {
      list.selectedIndex = -1;
    }
  }
  $scope.states = states;
  // dropdownListInit();
});

app.controller('personController', function ($scope) {
  // var pathArr = window.location.href.split('/');
  // var person_num = pathArr[pathArr.length - 1];
  // var index = parseInt(person_num);
  //$scope.person = ReturnPerson.person; 
});

app.filter('radioFilter', function () {
  return function (people, selectedSearch) {
    var filtered = [];
    if (selectedSearch == undefined) {
      return people;
    }
    else {
      if (selectedSearch.male == "male") {
        filtered = getMales(people);
      }
      if (selectedSearch.female == "female") {
        filtered = getFemales(people);
      }
      if (selectedSearch.state != null && selectedSearch.state != " " && selectedSearch.state != undefined) {
        var state = selectedSearch.state;
        filtered = getStateList(people, states, state);
      }
      return filtered;
    }
  };
});

function getMales(people) {
  var males = [];
  for (let i = 0; i < people.length; i++) {
    if (people[i].name.title == "mr") {
      males.push(people[i]);
    }
  }
  return males;
}

function getFemales(people) {
  var females = [];
  for (let i = 0; i < people.length; i++) {
    if (people[i].name.title == "mrs" || people[i].name.title == "ms" || people[i].name.title == "miss") {
      females.push(people[i]);
    }
  }
  return females;
}

function getStateList(people, states, state) {
  var statesForPeople = [];
  var index = 0;
  for (let i = 0; i < states.length; i++) {
    if (states[i].abbrev == state.abbrev) {
      index = i;
    }
  }
  for (let j = 0; j < people.length; j++) {
    if (states[index].name.toLowerCase() == people[j].location.state) {
      statesForPeople.push(people[j]);
    }
  }
  return statesForPeople;
}

function deselect() {
  var malebtn = document.getElementById("malebtn");
  var femalebtn = document.getElementById("femalebtn");
  if (malebtn.checked) {
    malebtn.checked = false;
  }
  else if (femalebtn.checked) {
    femalebtn.checked = false;
  }
}

function clearSelected() {
  var list = document.getElementById("statelist");
  if (list.selectedIndex != null) {
    list.selectedIndex = -1;
  }
}

app.filter('capitalize', function () {
  return function (input) {
    return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
  };
});

function dropdownListInit() {
  var dropdownLists = document.getElementsByClassName("dropdown-list");
  for (let i = 0; i < dropdownLists.length; i++) {
    console.log("dropdown init");
    dropdownLists[i].addEventListener("click", function () {
      var content = document.getElementsByClassName("dropdown-list-contents");
      if (content[i].style.visibility == "visible") {
        content[i].style.visibility = "hidden";
      } else {
        content[i].style.visibility = "visible";
      }
    });
  }
}

