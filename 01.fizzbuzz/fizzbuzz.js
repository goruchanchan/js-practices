let fizzBuzz = (num) => {
  if (num % 15 == 0) {
    return "FizzBuzz";
  } else if (num % 5 == 0) {
    return "Buzz";
  } else if (num % 3 == 0) {
    return "Fizz";
  } else {
    return num;
  }
};

for (let i = 0; i < 20; i++) {
  console.log(fizzBuzz(i));
}
