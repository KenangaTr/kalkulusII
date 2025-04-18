document
  .getElementById("calculateButton")
  .addEventListener("click", function () {
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

  const totalPembayaran = cicilanBulananArray.reduce((acc, cicilan) => acc + cicilan, 0);
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
