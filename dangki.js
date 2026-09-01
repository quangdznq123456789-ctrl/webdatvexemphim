const form = document.getElementById("registerForm");

const phoneInput = document.querySelector('input[name="account"]');

const passwordInput = document.getElementById("password");

const confirmPasswordInput = document.getElementById("confirmPassword");

const matchError = document.getElementById("matchError");

function setupToggle(btnId, inputId) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);

  if (!btn || !input) {
    return;
  }

  btn.addEventListener("click", function () {
    const isHidden = input.type === "password";

    if (isHidden) {
      input.type = "text";
      btn.textContent = "Ẩn";
      btn.setAttribute("aria-label", "Ẩn mật khẩu");
    } else {
      input.type = "password";
      btn.textContent = "Hiện";
      btn.setAttribute("aria-label", "Hiện mật khẩu");
    }
  });
}

setupToggle("togglePass", "password");

setupToggle("toggleConfirmPass", "confirmPassword");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const fullname = document
    .querySelector('input[name="fullname"]')
    .value.trim();

  const phone = phoneInput.value.trim();

  const password = passwordInput.value;

  const confirmPassword = confirmPasswordInput.value;

  if (password !== confirmPassword) {
    matchError.textContent = "Mật khẩu xác nhận không khớp!";

    matchError.style.display = "block";

    confirmPasswordInput.focus();

    return;
  }

  matchError.style.display = "none";

  let accounts = JSON.parse(localStorage.getItem("accounts")) || [];

  const phoneExists = accounts.some(function (account) {
    return account.phone === phone;
  });

  if (phoneExists) {
    alert("Số điện thoại đã tồn tại!");

    phoneInput.focus();

    return;
  }

  const passwordExists = accounts.some(function (account) {
    return account.password === password;
  });

  if (passwordExists) {
    alert("Mật khẩu đã tồn tại!");

    passwordInput.focus();

    return;
  }

  const newAccount = {
    fullname: fullname,

    phone: phone,

    password: password,
  };

  accounts.push(newAccount);

  localStorage.setItem("accounts", JSON.stringify(accounts));

  alert("Đăng ký thành công!");

  form.reset();

  window.location.href = "./indexdangnhap.html";
});
