document.addEventListener("DOMContentLoaded", function () {
  const burgerMenu = document.querySelector(".burger");
  const navbarContainer = document.querySelector(".navbar-container");

  if (burgerMenu && navbarContainer) {
    burgerMenu.addEventListener("click", function () {
      navbarContainer.classList.toggle("active"); // Tambahkan atau hapus kelas "active"
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Animasi saat membuka halaman
  const fadeInElements = document.querySelectorAll(".fade-in");
  fadeInElements.forEach((el) => {
    el.classList.add("visible");
  });

  // Animasi saat scroll
  const scrollFadeElements = document.querySelectorAll(".scroll-fade");

  const handleScroll = () => {
    scrollFadeElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add("visible");
      }
    });
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Panggil sekali untuk elemen yang sudah terlihat
});

  const calculateButton = document.getElementById("calculateButton");
  if (calculateButton) {
    calculateButton.addEventListener("click", function () {
      const pokokPinjaman = parseFloat(
        document.getElementById("principal").value
      );
      const tenorBulan = parseInt(document.getElementById("tenor").value);
      const bungaPerBulan =
        parseFloat(document.getElementById("interest").value) / 100;

      const hasil = {
        flat: hitungFlat(pokokPinjaman, tenorBulan, bungaPerBulan),
        anuitas: hitungAnuitas(pokokPinjaman, tenorBulan, bungaPerBulan),
        efektif: hitungEfektif(pokokPinjaman, tenorBulan, bungaPerBulan),
      };

      let tabelHasil = `
          <table border="1" style="width: 100%; text-align: left;">
              <thead>
                  <tr>
                      <th>Bulan</th>
                      <th>Flat</th>
                      <th>Anuitas</th>
                      <th>Efektif</th>
                  </tr>
              </thead>
              <tbody>
      `;

      for (let i = 0; i < tenorBulan; i++) {
        tabelHasil += `
              <tr>
                  <td>${i + 1}</td>
                  <td>Rp ${hasil.flat.cicilanBulanan[i].toFixed(2)}</td>
                  <td>Rp ${hasil.anuitas.cicilanBulanan[i].toFixed(2)}</td>
                  <td>Rp ${hasil.efektif.cicilanBulanan[i].toFixed(2)}</td>
              </tr>
          `;
      }

      tabelHasil += `
              </tbody>
              <tfoot>
                  <tr>
                      <th>Total</th>
                      <th>Rp ${hasil.flat.totalPembayaran.toFixed(2)}</th>
                      <th>Rp ${hasil.anuitas.totalPembayaran.toFixed(2)}</th>
                      <th>Rp ${hasil.efektif.totalPembayaran.toFixed(2)}</th>
                  </tr>
                  <tr>
                      <th>Total Bunga</th>
                      <th>Rp ${hasil.flat.totalBunga.toFixed(2)}</th>
                      <th>Rp ${hasil.anuitas.totalBunga.toFixed(2)}</th>
                      <th>Rp ${hasil.efektif.totalBunga.toFixed(2)}</th>
                  </tr>
              </tfoot>
          </table>`;

      document.getElementById("result").innerHTML = tabelHasil;

      // Generate chart
      generateMonthlyChart(hasil, tenorBulan);
    });
  }

  const dendaButton = document.getElementById("dendaButton");
  if (dendaButton) {
    dendaButton.addEventListener("click", function () {
      const pokokPinjaman = parseFloat(document.getElementById("principal").value);
      const tenorBulan = parseInt(document.getElementById("tenor").value);
      const lamaPinjam = parseInt(document.getElementById("lamaPinjam").value);
      const dendaType = document.getElementById("dendaType").value;
      const dendaValue = parseFloat(document.getElementById("denda").value);
      

      // Step 1: Calculate cicilanBulanan: cicilanBulananArray, totalPembayaran, totalBunga 
      cicilanBulanan = pokokPinjaman/tenorBulan ;
      
      // Step 2: Calculate paid loan
      let totalDibayar = 0;
      for (let i = 0; i < lamaPinjam; i++) {
        totalDibayar += cicilanBulanan;
      }

      // Step 3: Calculate remaining loan and penalty
      const sisaPinjaman = pokokPinjaman - totalDibayar;
      let denda = 0;
      if (dendaType === "Persen") {
        denda = sisaPinjaman * (dendaValue / 100);
      } else if (dendaType === "Nominal") {
        denda = dendaValue;
      }

      // Step 4: Calculate total to be paid
      const totalBayar = sisaPinjaman + denda;

      // Display results
      const resultHTML = `
      <p><strong>Total Denda:</strong> Rp ${denda.toFixed(2)}</p>
      <p><strong>Sisa Pinjaman:</strong> Rp ${sisaPinjaman.toFixed(2)}</p>
        <p><strong>Total yang Harus Dibayar:</strong> Rp ${totalBayar.toFixed(
          2
        )}</p>
      `;
      document.getElementById("result").innerHTML = resultHTML;
    });
  }


function hitungFlat(pokokPinjaman, tenorBulan, bungaPerBulan) {
  const bungaBulanan = pokokPinjaman * bungaPerBulan;
  const cicilanBulanan = pokokPinjaman / tenorBulan + bungaBulanan;
  const totalPembayaran = cicilanBulanan * tenorBulan;
  const totalBunga = bungaBulanan * tenorBulan;
  const cicilanBulananArray = Array(tenorBulan).fill(cicilanBulanan);
  return { cicilanBulanan: cicilanBulananArray, totalPembayaran, totalBunga };
}

function hitungEfektif(pokokPinjaman, tenorBulan, bungaPerBulan) {
  const cicilanPokok = pokokPinjaman / tenorBulan;
  let sisaPinjaman = pokokPinjaman;
  const cicilanBulananArray = [];

  for (let i = 0; i < tenorBulan; i++) {
    const bunga = sisaPinjaman * bungaPerBulan;
    const cicilanBulanan = cicilanPokok + bunga;
    cicilanBulananArray.push(cicilanBulanan);
    sisaPinjaman -= cicilanPokok;
  }

  const totalPembayaran = cicilanBulananArray.reduce(
    (acc, cicilan) => acc + cicilan,
    0
  );
  const totalBunga = totalPembayaran - pokokPinjaman;
  return { cicilanBulanan: cicilanBulananArray, totalPembayaran, totalBunga };
}

function hitungAnuitas(pokokPinjaman, tenorBulan, bungaPerBulan) {
  const bungaBulanan = bungaPerBulan;
  const faktorAnuitas =
    (bungaBulanan * Math.pow(1 + bungaBulanan, tenorBulan)) /
    (Math.pow(1 + bungaBulanan, tenorBulan) - 1);
  const cicilanBulanan = pokokPinjaman * faktorAnuitas;
  const totalPembayaran = cicilanBulanan * tenorBulan;
  const totalBunga = totalPembayaran - pokokPinjaman;
  const cicilanBulananArray = Array(tenorBulan).fill(cicilanBulanan);
  return { cicilanBulanan: cicilanBulananArray, totalPembayaran, totalBunga };
}

function generateMonthlyChart(hasil, tenorBulan) {
  const ctx = document.getElementById("chart").getContext("2d");
  const labels = Array.from({ length: tenorBulan }, (_, i) => `Bulan ${i + 1}`);

  const data = {
    labels,
    datasets: [
      {
        label: "Flat",
        data: hasil.flat.cicilanBulanan,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Anuitas",
        data: hasil.anuitas.cicilanBulanan,
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Efektif",
        data: hasil.efektif.cicilanBulanan,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  new Chart(ctx, {
    type: "line",
    data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Perbandingan Cicilan Per Bulan",
        },
      },
    },
  });
}
