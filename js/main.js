// ── Dark / Light Mode Toggle ──
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark');
    themeToggle.setAttribute('aria-checked', 'true');
}

themeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    themeToggle.setAttribute('aria-checked', isDark ? 'true' : 'false');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ── Ambil elemen ──
const itemInput        = document.getElementById("item");
const jumlahInput      = document.getElementById("jumlah");
const kategoriSelect   = document.querySelector("select#kategori");
const btnTambah        = document.getElementById("btnTambah");
const kategoriBaru     = document.getElementById("kategori-baru");
const btnTambahKat     = document.getElementById("btnTambahKategori");
const daftarKatCustom  = document.getElementById("daftar-kategori-custom");
const sortBy           = document.getElementById("sortBy");

// ── Data dari localStorage ──
let transactions   = JSON.parse(localStorage.getItem("transactions"))   || [];
let customKategori = JSON.parse(localStorage.getItem("customKategori")) || [];

// Warna palette untuk kategori custom
const paletteWarna = [
    "#4ade80", "#38bdf8", "#fb923c", "#e879f9",
    "#facc15", "#34d399", "#f87171", "#60a5fa"
];

// ── Helper ──
function capitalize(str) {
    if (!str || typeof str !== "string") return "-";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

function getWarnaKategori(key) {
    const custom = customKategori.find(k => k.key === key);
    if (custom) return custom.warna;
    const defaults = { makanan: "#FEDD3F", transport: "#8A5BA6", hiburan: "#F13B57" };
    return defaults[key] || "#94a3b8";
}

// ── Kategori Custom ──
function saveKategori() {
    localStorage.setItem("customKategori", JSON.stringify(customKategori));
}

function renderKategoriOptions() {
    while (kategoriSelect.options.length > 3) kategoriSelect.remove(3);
    customKategori.forEach(k => {
        const opt = document.createElement("option");
        opt.value = k.key;
        opt.textContent = k.label;
        kategoriSelect.appendChild(opt);
    });
}

function renderDaftarKategoriCustom() {
    daftarKatCustom.innerHTML = "";
    if (customKategori.length === 0) return;

    daftarKatCustom.style.cssText = "margin-top:10px; display:flex; flex-wrap:wrap; gap:8px;";

    customKategori.forEach((k, i) => {
        const tag = document.createElement("span");
        tag.style.cssText = `
            display: inline-flex; align-items: center; gap: 6px;
            background: ${k.warna}22; color: ${k.warna};
            border: 1px solid ${k.warna}55;
            padding: 4px 10px; border-radius: 999px;
            font-size: 0.8rem; font-weight: 600;
        `;
        tag.innerHTML = `
            ${k.label}
            <button onclick="hapusKategori(${i})" style="
                background:none; border:none; color:inherit; cursor:pointer;
                padding:0; font-size:1rem; line-height:1; width:auto; box-shadow:none;
            " title="Hapus kategori">×</button>
        `;
        daftarKatCustom.appendChild(tag);
    });
}

function hapusKategori(index) {
    const keyDihapus = customKategori[index].key;
    const masihDipakai = transactions.some(t => t.kategori === keyDihapus);
    if (masihDipakai) {
        alert(`Kategori "${customKategori[index].label}" masih digunakan oleh transaksi. Hapus transaksinya dulu.`);
        return;
    }
    customKategori.splice(index, 1);
    saveKategori();
    renderKategoriOptions();
    renderDaftarKategoriCustom();
    updateChart();
}

btnTambahKat.addEventListener("click", () => {
    const nama = kategoriBaru.value.trim();
    if (!nama) { alert("Masukkan nama kategori."); return; }

    const key = nama.toLowerCase().replace(/\s+/g, "-");
    const existing = ["makanan", "transport", "hiburan", ...customKategori.map(k => k.key)];
    if (existing.includes(key)) { alert("Kategori sudah ada."); return; }

    const warna = paletteWarna[customKategori.length % paletteWarna.length];
    customKategori.push({ key, label: nama, warna });
    saveKategori();
    renderKategoriOptions();
    renderDaftarKategoriCustom();
    updateChart();
    kategoriBaru.value = "";
});

// ── Sorting ──
function getSortedTransactions() {
    const sorted = [...transactions];
    switch (sortBy.value) {
        case "terbaru":   sorted.sort((a, b) => b.id - a.id); break;
        case "terlama":   sorted.sort((a, b) => a.id - b.id); break;
        case "tertinggi": sorted.sort((a, b) => b.jumlah - a.jumlah); break;
        case "terendah":  sorted.sort((a, b) => a.jumlah - b.jumlah); break;
        case "nama":      sorted.sort((a, b) => a.item.localeCompare(b.item)); break;
    }
    return sorted;
}

sortBy.addEventListener("change", renderTransactions);

// ── Chart JS ──
const ctx = document.getElementById("expenseChart");
const expenseChart = new Chart(ctx, {
    type: "pie",
    data: { labels: [], datasets: [{ data: [], backgroundColor: [], borderWidth: 0 }] },
    options: { responsive: true, plugins: { legend: { position: "bottom" } } }
});

// ── Render daftar transaksi ──
function renderTransactions() {
    const container = document.getElementById("daftar-transaksi");
    const headerEl  = container.firstElementChild;
    container.innerHTML = "";
    container.appendChild(headerEl);

    const sorted = getSortedTransactions();
    if (sorted.length === 0) {
        container.innerHTML += `<p class="status-kosong">Belum ada transaksi. Tambahkan pengeluaran pertamamu!</p>`;
        return;
    }

    sorted.forEach((trx) => {
        const warna = getWarnaKategori(trx.kategori);
        const el = document.createElement("div");
        el.classList.add("transaksi-item");
        el.dataset.id = trx.id;
        el.innerHTML = `
            <div class="info-transaksi">
                <h5>${trx.item}</h5>
                <span class="kategori-transaksi" style="background:${warna}22;color:${warna};border:1px solid ${warna}55;">${capitalize(trx.kategori)}</span>
            </div>
            <div class="transaksi-kanan">
                <p class="nominal-transaksi">${formatRupiah(trx.jumlah)}</p>
                <button class="delete-btn" onclick="hapusTransaksi(${trx.id})">Hapus</button>
            </div>
        `;
        container.appendChild(el);
    });
}

// ── Update total ──
function updateTotal() {
    const total = transactions.reduce((sum, t) => sum + t.jumlah, 0);
    document.querySelector("header h3").textContent = formatRupiah(total);
}

// ── Update chart (semua kategori dinamis) ──
function updateChart() {
    const semuaKategori = [
        { key: "makanan",   label: "Makanan",   warna: "#FEDD3F" },
        { key: "transport", label: "Transport",  warna: "#8A5BA6" },
        { key: "hiburan",   label: "Hiburan",    warna: "#F13B57" },
        ...customKategori
    ];

    const totals = {};
    semuaKategori.forEach(k => { totals[k.key] = 0; });
    transactions.forEach(trx => {
        if (totals[trx.kategori] !== undefined) totals[trx.kategori] += trx.jumlah;
        else totals[trx.kategori] = trx.jumlah;
    });

    const aktif = semuaKategori.filter(k => totals[k.key] > 0);
    expenseChart.data.labels = aktif.map(k => k.label);
    expenseChart.data.datasets[0].data = aktif.map(k => totals[k.key]);
    expenseChart.data.datasets[0].backgroundColor = aktif.map(k => k.warna);
    expenseChart.update();
}

// ── Hapus transaksi ──
function hapusTransaksi(id) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
    updateTotal();
    updateChart();
}

// ── Tambah transaksi ──
btnTambah.addEventListener("click", () => {
    const item     = itemInput.value.trim();
    const jumlah   = parseFloat(jumlahInput.value);
    const kategori = kategoriSelect.value;

    if (!item || isNaN(jumlah) || jumlah <= 0) {
        alert("Semua field harus diisi dengan benar.");
        return;
    }

    transactions.push({ id: Date.now(), item, jumlah, kategori });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    itemInput.value = "";
    jumlahInput.value = "";
    kategoriSelect.selectedIndex = 0;

    renderTransactions();
    updateTotal();
    updateChart();
});

// ── Inisialisasi ──
renderKategoriOptions();
renderDaftarKategoriCustom();
renderTransactions();
updateTotal();
updateChart();