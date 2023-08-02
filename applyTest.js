// var person = {
//   fullName: function () {
//     return this.firstName + " " + this.lastName;
//   },
// };
// var person1 = {
//   firstName: "Bill",
//   lastName: "Gates",
// };
// var x = person.fullName.apply(person1);
// console.log(x);

var person = {
  fullName: function (city, country) {
    return this.firstName + " " + this.lastName + "," + city + "," + country;
  },
};
var person1 = {
  firstName: "Bill",
  lastName: "Gates",
};
var x = person.fullName.apply(person1, ["Oslo", "Norway"]);

console.log(x);
