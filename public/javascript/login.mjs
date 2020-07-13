import { post } from './helpers/requestHelper.mjs';

const username = sessionStorage.getItem("username");

if (username) {
  window.location.replace("/menu");
}

const submitButton = document.getElementById("submit-button");
const input = document.getElementById("username-input");

const getInputValue = () => input.value;

const onClickSubmitButton = () => {
  const inputValue = getInputValue();
  if (!inputValue) {
    return;
  }
  post('login', { username: inputValue })
    .then(res => {
      if(res.success) {
        sessionStorage.setItem("username", inputValue);
        window.location.replace("/menu");
      } else {
        alert(res.message);
      }
    })
    .catch(err => {

    });
};

const onKeyUp = ev => {
  const enterKeyCode = 13;
  if (ev.keyCode === enterKeyCode) {
    submitButton.click();
  }
};

submitButton.addEventListener("click", onClickSubmitButton);
window.addEventListener("keyup", onKeyUp);
