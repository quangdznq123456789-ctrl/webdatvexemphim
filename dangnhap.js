const loginForm = document.getElementById("loginForm");

const accountInput = document.getElementById("account");

const passwordInput = document.getElementById("password");

const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const account = accountInput.value.trim();

  const password = passwordInput.value;

  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

  const user = accounts.find(function (accountData) {
    return accountData.phone === account && accountData.password === password;
  });

  if (user) {
    loginMessage.textContent = "Đăng nhập thành công!";

    loginMessage.style.color = "green";

    localStorage.setItem(
      "user",
      JSON.stringify({
        fullname: user.fullname,
        phone: user.phone,
      }),
    );

    setTimeout(function () {
      window.location.href = "./dangnhapxong.html";
    }, 1000);
  } else {
    loginMessage.textContent = "Số điện thoại hoặc mật khẩu không đúng!";

    loginMessage.style.color = "red";
  }
});
