'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// Alert
alert("user = js \npin = 1111")

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2024-09-30T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2024-09-30T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPased = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPased(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ''; //* Reemplaza todo el contenido

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b) //*Sort afecta el array original
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]); //*Por cada movimiento
    //*Manera de recorrer dos arrays, date de las dates array[i]
    const displayDate = formatMovementDate(date, acc.locale);
    // console.log(displayDate); //mov.toFixed(2)

    const formattedMov = formatCur(mov.toFixed(2), acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
     <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html); //*Crea nuevo contenido
  });
};

const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency); //acc.balance.toFixed(2)
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency); //incomes.toFixed(2)

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency); //Math.abs(out.toFixed(2))

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency); //interest.toFixed(2)
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  let time = 300; //* Conversion segundos a minutos
  const tick = () => {
    // const hour = String(Math.trunc(time / 3600)).padStart(2, 0);
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }

    // Decrese 1s
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000); 
  return timer;
};

///////////////////////////////////////
// Event handlers

// Simular que estamos conectados
let currentAccount, timer;
const now = new Date();
// //? Internationalizing Dates (Intl)

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const options = {
      day: 'numeric', //*2-digit
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      // weekday: 'long',
    };
    // const locale = navigator.language; //*Acceder al tiempo del usuario, objeto navegador y propiedad lenguaje
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    //* Se pone el namespace intl, se llama a al funcion asignando idioma y pais, y se formatea la fecha

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer); //*En caso ya exista un intervalo, lo limpia
    timer = startLogOutTimer(); //*Se vuelve a declarar globalmente que es igual al intervalo que retorna

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value); //*Convierte cada deposito en el entero menor

  //* Si es mayor que 0 y es alguno de los movimientos es mayor al 10% de ese monto
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString()); //*Es un deposito hacia nosotros
      // console.log(account1);

      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 1000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//* Todos los numeros son decimales, por eso 23===23.0
//*Se representan en formato 64 base 2
// console.log(23 === 23.0);

// Base 10 - 0 to 9 1/10 0.1
// Binary base 2 - 0 1
// console.log(0.1 + 0.2); //*Porque en binario 0.1 es un bucle infinito como 3.3333
// console.log(0.1 + 0.2 === 0.3);
//*No se pueden hacer calculos con precision cientifica o financieros en javascript

// Conversion
// console.log(Number('23'));
// console.log(+'23'); //* cuando ve el mas, automaticamente hace coerción de tipos, conversion
let one = 1;

const nuevoarr = Array.from({ length: 7 }, (_, i) => i + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;

const isEven = n => n % 2 === 0; //*True o false porque es condicion booleana
labelBalance.addEventListener('click', function () {
  //*Selecciona todas las clases, no solo la primera
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    //*Si se deja afuera del listener, se disparara al iniciar la app, y como esta opacity 100 no se mostrara
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    // 0, 2, 4, 6
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
    // 0, 3, 6, 9
  });
});

const num = 10; //*Para numeros pequeños sirve la funcion global bigInt

//? Operation with Dates
const future = new Date(2002, 10, 33, 18, 45);
const calcDaysPased = (date1, date2) =>
  Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)); //*Para convertirlo a t unix, se divide entre 1000mx, 60seg, 60min, 24hrs
const days1 = calcDaysPased(new Date(2037, 3, 1), new Date(2037, 3, 4)); //*Nos

const today = new Date(); //*metodo setDate da el numero unix
const pasado = new Date(new Date().setDate(new Date().getDate() - 3));
const message = `${(today - pasado) / (1000 * 60 * 60 * 24)} dias han pasado`;
// console.log(message);

const welcome = document.querySelector('.welcome');

welcome.setAttribute('tabindex', '0');

welcome.addEventListener('keydown', function (e) {
  // console.log(e);
  const colors = {
    r: 'red',
    b: 'blue',
    v: 'green',
  };
  if (e.key) {
    welcome.style.backgroundColor = colors[e.key];
  }
});
//*Acepta [[],[]]
const mapita = new Map([
  [22, 'si'],
  ['siu', 45],
]);
mapita.set(4, 'hola');
// console.log(mapita);
// console.log(['hola', 2, 3].entries());

const nuevoA = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(nuevoA);

// const hoy = new Date();
// const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
// const resta = (hoy - yesterday) / (1000 * 60 * 60 * 24); //*No es necesario establecer año
// // console.log(resta);

//? Internationalizing Number (Intl)

const number = 3897987245.633347;

const options = {
  style: 'unit', //unit //percent
  unit: 'celsius', //mile-per-hour
  currency: 'EUR', //currency, no definido por el pais
  useGrouping: false, //*Quita o pone las comas
};

// const sort1 = Array.from({ length: 5 }, (_, i) => i + 1);
// // console.log(sort1.sort((a, b) => b - a)); //*Sort afecta al array original
//? Timers: setTimeout and setInterval
//*Se pasan los args como tercer arg de la higher order fun
// setTimeout
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (
    ing1,
    ing2 // console.log(`Heres your pizza with ${ing1} and ${ing2}`),
  ) => 3000,
  ...ingredients
);
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);
//TODO Hacer un reloj en la consola que tome horas, minutos y segundos
// setInterval(function () {
//   // const now = new Date();
//   // // console.log(now);
//   // console.log(
//     new Intl.DateTimeFormat(navigator.language, {
//       hour: 'numeric',
//       minute: 'numeric',
//       second: 'numeric',
//     }).format(new Date())
//   );
// }, 1000);

// const holiwis = setInterval(() => { //*Siempre se ejecuta aunque se elmacena
//   // console.log('hola');
// }, 500);
let siu;
