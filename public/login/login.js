// Login Post Request
function login(event) {
    event.preventDefault();
    const loginDetails = {
        email: event.target.email.value,
        password: event.target.password.value
      }
    axios
      .post(
        "http://13.236.146.218:5001/user/login", loginDetails)
      .then((response) => {
        console.log(response)
        alert(response.data.message)
        localStorage.setItem("token", response.data.token)
        window.location.href = "../expense/expense.html";
      })
      .catch((err) => {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = '';
        errorMessage.textContent = err.response.data.message;
      })
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

const forgotPasswordBtn = document.getElementById("forgot-password-btn");
const formContainer = document.getElementById("form-block");
const form = document.getElementById("forgotpassword-form");

forgotPasswordBtn.addEventListener("click", () => {
    if (formContainer.style.display === "block") {
      formContainer.style.display = "none";
  } else {
      formContainer.style.display = "block";
  }
})

function forgotpassword(event) {
    event.preventDefault();
    const email = event.target.email.value;
    console.log(email);

    axios
        .post("http://13.236.146.218:5001/password/forgotpassword", { email: email })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => console.log(error))

    formContainer.style.display = "none";
    form.reset();
};