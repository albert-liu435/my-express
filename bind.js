const person = {
  fullName: function (country, city) {
    return this.firstName + this.lastName + " " + country + " " + city;
  },
};
const newPerson = {
  firstName: "fu",
  lastName: "chaoyang",
};
var p1=person.fullName.bind(newPerson, "china", "xian"); // 打印出fullName函数
console.log(p1)
var p2=person.fullName.bind(newPerson, "china", "xian")(); // fuchaoyang china xian
console.log(p2)
