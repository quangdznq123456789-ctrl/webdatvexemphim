fetch("http://localhost:3000/api/phim")
  .then((response) => response.json())

  .then((dsPhim) => {
    const container = document.getElementById("danhSachPhim");

    container.innerHTML = "";

    dsPhim.forEach((phim) => {
      const card = document.createElement("div");

      card.className = "movie-card";

      card.innerHTML = `

        <img
          src="${phim.AnhPhim}"
          alt="${phim.TenPhim}"
        >

        <h3>
          ${phim.TenPhim}
        </h3>

      `;

      // Khi click vào phim
      card.addEventListener("click", () => {
        window.location.href = `./chitietphim.html?phim=${encodeURIComponent(phim.TenPhim)}`;
      });

      container.appendChild(card);
    });
  })

  .catch((error) => {
    console.error("Lỗi lấy danh sách phim:", error);
  });
