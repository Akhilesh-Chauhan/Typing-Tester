const typingText = document.querySelector(".typing-text p");
const inpField = document.querySelector(".wrapper .input-field");
const timeTag = document.querySelector(".time span strong");
const mistakeTag = document.querySelector(".mistake span");
const wpmTag = document.querySelector(".wpm span");
const cpmTag = document.querySelector(".cpm span");
const tryAgainBtn = document.querySelector(".button");

let timer = 60;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = 0;

function randomParagraph() {
  //getting random number and it is allways less than the paragraphs number
  let randIndex = Math.floor(Math.random() * paragraphs.length);
  typingText.innerHTML = "";
  paragraphs[randIndex].split("").forEach((span) => {
    //getting random items from the paragraphs array, splitting all characters of it , adding each character inside span and then adding this span inside p tag
    let spanTag = `<span>${span}</span>`;
    typingText.innerHTML += spanTag;
  });
  typingText.querySelectorAll("span")[0].classList.add("active")
  //focusing input field on keydown or click event
  document.addEventListener("keydown", () => inpField.focus());
  typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
  const characters = typingText.querySelectorAll("span");
  let typedChar = inpField.value.split("")[charIndex];
  if (charIndex < characters.length - 1 && timeLeft > 0) {
    if (!isTyping) {
      //once timer is started, it wont restart on every key clicked
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }

    //  if user hasn't entered any character or passed backspace
    if (typedChar == null) {
      charIndex--; // decremensts charIndex
      // decrement mistakes only if the charIndex span contains incorrect class
      if (characters[charIndex].classList.contains("incorrect")) {
        mistakes--;
      }
      characters[charIndex].classList.remove("correct", "incorrect");
    } else {
      if (characters[charIndex].innerText === typedChar) {
        //if user typed characters shown to him and matched correctly then add the correct class else increment the mistakes and add incorrect class
        characters[charIndex].classList.add("correct");
      } else {
        mistakes++;
        characters[charIndex].classList.add("incorrect");
      }
      // increment charIndex either user typed correct or incorrect
      charIndex++;
    }
    characters.forEach((span) => span.classList.remove("active"));
    characters[charIndex].classList.add("active");

    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
    );
    //  if wpm value is 0, empty, or infinity the setting it's value to 0
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    mistakeTag.innerHTML = mistakes;
    wpmTag.innerHTML = wpm;
    cpmTag.innerHTML = charIndex - mistakes; // cpm will not count mistakes
  } else {
    inpField.value = "";
    clearInterval(timer);
  }
}

function initTimer() {
  // if timeleft is greater than 0 then decrement the timeLeft else clear the timer
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerHTML = timeLeft;
  } else {
    clearInterval(timer);
  }
}

function resetGame() {
  // calling loadParagraph function and reseting aech variables and elements value to default
  randomParagraph();
  inpField.value = "";
  clearInterval(timer);
  timeLeft = maxTime;
  charIndex = mistakes = isTyping = 0;
  timeTag.innerHTML = timeLeft;
  mistakeTag.innerHTML = mistakes;
  wpmTag.innerHTML = 0;
  cpmTag.innerHTML = 0;
}

randomParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
