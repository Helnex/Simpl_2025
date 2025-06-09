//задание 1
function A() {
  return obj;
}
function B() {
  return obj;
}

let a = new A();
let b = new B();

alert(a == b); // true
//задание 2
function Calculator() {
  this.read = function () {
    this.a = +prompt("Enter a");
    this.b = +prompt("Enter b");
  };
  this.sum = function () {
    return this.a + this.b;
  };

  this.mul = function () {
    return this.a * this.b;
  };
}
let calculator = new Calculator();
calculator.read();

alert("Sum=" + calculator.sum());
alert("Mul=" + calculator.mul());
//задание 3
function Accumulator(startingValue) {
  this.value = startingValue;
  this.read = function () {
    let number = +prompt("Enter number:");
    this.value += number;
  };
}
let accumulator = new Accumulator(1);
accumulator.read();
accumulator.read();
alert(accumulator.value);
