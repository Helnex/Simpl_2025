let a = 1,
  b = 1;

let c = ++a; // 2
let d = b++; // 1

let a2 = 2;

let x = 1 + (a2 *= 2); //a2 = 4; x = 5

"" + 1 + 0; // 10
"" - 1 + 0; // -1
true + false; // 1
6 / "3"; // 2
"2" * "3"; //6
4 + 5 + "px"; // 9px
"$" + 4 + 5; // $45
"4" - 2; // 2
"4px" - 2; // nan
"  -9  " + 5; // "  -9   5"
"  -9  " - 5; // -14
null + 1; // 1
undefined + 1; // nan
" \t \n" - 2; // -2

/*let a = prompt("Первое число?", 1);
let b = prompt("Второе число?", 2);

alert(a + b); // 12*/

//ИСПРАВЛЕННЫЙ КОД

let a3 = Number(prompt("Первое число?", 1));
let b3 = Number(prompt("Второе число?", 2));

alert(a3 + b3); // 12
