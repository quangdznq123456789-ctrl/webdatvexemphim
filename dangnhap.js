// const loginForm = document.getElementById("loginForm");

// const accountInput = document.getElementById("account");

// const passwordInput = document.getElementById("password");

// const loginMessage = document.getElementById("loginMessage");

// loginForm.addEventListener("submit", async function (event) {
//   event.preventDefault();

//   const account = accountInput.value.trim();

//   const password = passwordInput.value;

//   try {
//     const response = await fetch("http://localhost:3000/api/dangnhap", {
//       method: "POST",

//       headers: {
//         "Content-Type": "application/json",
//       },

//       body: JSON.stringify({
//         SoDienThoai: account,
//         MatKhau: password,
//       }),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       loginMessage.textContent = result.message || "Đăng nhập thất bại!";

//       loginMessage.style.color = "red";

//       return;
//     }

//     // Đăng nhập thành công

//     loginMessage.textContent = "Đăng nhập thành công!";

//     loginMessage.style.color = "green";

//     const user = result.user;

//     // Lưu người đang đăng nhập
//     localStorage.setItem(
//       "user",
//       JSON.stringify({
//         MaTaiKhoan: user.MaTaiKhoan,

//         fullname: user.HoTen,

//         phone: user.SoDienThoai,

//         role: user.VaiTro,
//       }),
//     );

//     setTimeout(function () {
//       if (user.VaiTro === "Admin") {
//         window.location.href = "./amin/amintrangchu.html";
//       } else {
//         window.location.href = "./dangnhapxong.html";
//       }
//     }, 1000);
//   } catch (error) {
//     console.error(error);

//     loginMessage.textContent = "Không thể kết nối đến Backend!";

//     loginMessage.style.color = "red";
//   }
// });

const loginForm = document.getElementById("loginForm");

const accountInput = document.getElementById("account");

const passwordInput = document.getElementById("password");

const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const account = accountInput.value.trim();

  const password = passwordInput.value;

  try {
    const response = await fetch("http://localhost:3000/api/dangnhap", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      // QUAN TRỌNG: cho phép trình duyệt gửi/nhận cookie session
      credentials: "include",

      body: JSON.stringify({
        SoDienThoai: account,
        MatKhau: password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      loginMessage.textContent = result.message || "Đăng nhập thất bại!";

      loginMessage.style.color = "red";

      return;
    }

    // Đăng nhập thành công
    loginMessage.textContent = "Đăng nhập thành công!";

    loginMessage.style.color = "green";

    const user = result.user;

    // Có thể lưu thông tin để hiển thị trên giao diện
    // Nhưng MaTaiKhoan khi đặt vé sẽ lấy từ SESSION trên server
    localStorage.setItem(
      "user",
      JSON.stringify({
        MaTaiKhoan: user.MaTaiKhoan,
        fullname: user.HoTen,
        phone: user.SoDienThoai,
        role: user.VaiTro,
      }),
    );

    setTimeout(function () {
      if (user.VaiTro === "Quản lý" || user.VaiTro === "Nhân viên") {
        window.location.href = "./amin/amintrangchu.html";
      } else {
        window.location.href = "./dangnhapxong.html";
      }
    }, 1000);
  } catch (error) {
    console.error(error);

    loginMessage.textContent = "Không thể kết nối đến Backend!";

    loginMessage.style.color = "red";
  }
});
