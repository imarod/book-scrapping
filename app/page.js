"use client";

import { use, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";

const EMPTY_FORM = {
  title: "",
  price: "",
  rating: 5,
  availability: "in Stock",
  relative_link: "",
  image_url: "",
}

export default function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [sort, setSort] = useState("oldest")
  const [stockIn, setStockIn] = useState(true);
  const [stockOut, setStockOut] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  const [toast, setToast] = useState(null);


  useEffect(() => {
    fetchBooks();
  }, [sort, stockIn, stockOut, page]);

  async function fetchBooks() {
    setLoading(true)

    const stockValues = []
    if (stockIn) stockValues.push("in")
    if (stockOut) stockValues.push("out")

    const params = new URLSearchParams({
      page: page,
      limit: 12,
      sort: sort,
      stock: stockValues.join(","),
    });

    const res = await fetch(`api/books?${params.toString()}`)
    const data = await res.json()

    setBooks(data.books)
    setTotalPages(data.pagination.totalPages);
    setTotalBooks(data.pagination.totalBooks);
    setLoading(false)
  }

  function openAddModal() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  function openEditModal(book) {
    setEditingId(book.id)
    setForm({
      title: book.title,
      price: book.price,
      rating: book.rating,
      availability: book.availability || "In stock",
      relative_link: book.relative_link || "",
      image_url: book.image_url || "",
    })
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    const url = editingId ? `/api/books/${editingId}` : "/api/books"
    const method = editingId ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Request gagal")
      showToast(editingId ? "Buku berhasil diperbarui" : "Buku berhasil ditambahkan")
    } catch (error) {
      showToast("Terjadi kesalahan, coba lagi", "error")
    }
    setSaving(false)
    setShowModal(false)
    fetchBooks()
  }

  async function handleDelete(id) {
    const konfirmasi = confirm("Apakah yakin ingin menghapus buku ini?")
    if (!konfirmasi) return

    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Request gagal")
      showToast("Buku berhasil dihapus")
    } catch (error) {
      showToast("Gagal menghapus buku", "error")
    }

    fetchBooks()
  }

  function handleSortChange(value) {
    setSort(value)
    setPage(1)
  }

  function handleStockChange(type, checked) {
    if (type === "in") setStockIn(checked)
    if (type === "out") setStockOut(checked)
    setPage(1)
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-6 flex items-end justify-between border-b border-[#e5e0d3]">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-[#8a8060] mb-2">
            Arsip Hasil Scraping by Rodhiyati
          </p>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-4xl text-black md:text-5xl font-medium"
          >
            Katalog Buku
          </h1>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#2F5233] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#24401f] transition-colors cursor-pointer"
        >
          + Tambah Buku
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex gap-8">
        <Sidebar
          sort={sort}
          onSortChange={handleSortChange}
          stockIn={stockIn}
          stockOut={stockOut}
          onStockChange={handleStockChange}
        />

        <div className="flex-1 min-w-0">
          <p className="text-sm text-[#5b5648] mb-4">
            Menampilkan {books.length} dari {totalBooks} judul
          </p>

          <div
            className={`transition-opacity duration-200 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"
              }`}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <article
                  key={book.id}
                  className="group bg-[#FBF9F3] rounded-2xl overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className=" relative aspect-[1/1] overflow-hidden bg-[#e4ddc8]">
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#14181C] text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded-full">
                      No. {String(book.id).padStart(3, "0")}
                    </span>

                    <span
                      className={`absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full backdrop-blur-sm ${book.availability?.toLowerCase().includes("in stock")
                        ? "bg-[#0DAD0A]/90 text-white"
                        : "bg-[#B30C17]/90 text-white"
                        }`}
                    >
                      {book.availability}
                    </span>

                    <span
                      style={{ fontFamily: "var(--font-display)" }}
                      className="absolute bottom-3 left-3 text-white text-2xl font-semibold drop-shadow-sm"
                    >
                      £{book.price}
                    </span>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() => openEditModal(book)}
                        className="bg-white text-[#14181C] text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#EFE9DC] cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#D93718] cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <div className="p-2">
                    <h2 className="text-sm text-gray-500 font-semibold leading-snug line-clamp-2 min-h-[1.5em]">
                      {book.title}
                    </h2>
                    <div className="flex items-center gap-0.5 mt-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <svg
                          key={n}
                          viewBox="0 0 20 20"
                          className={`w-5 h-5 ${n <= book.rating ? "fill-[#FAB41E]" : "fill-[#DDD5BE]"
                            }`}
                        >
                          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.2 1.3 6-5.4-3.1-5.4 3.1 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {books.length === 0 && (
              <p className="text-center text-gray-900 py-24">
                Tidak ada buku yang cocok dengan filter ini.
              </p>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="text-gray-400 px-3 py-1.5 text-sm rounded-full border border-[#DDD5BE] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EFE9DC] cursor-pointer"
                >
                  ← Sebelumnya
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 text-sm rounded-full cursor-pointer ${n === page
                      ? "bg-[#2F5233] text-white font-semibold"
                      : "hover:bg-[#EFE9DC] text-[#3d3a30]"
                      }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="text-gray-400 px-3 py-1.5 text-sm rounded-full border border-[#DDD5BE] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#EFE9DC] cursor-pointer"
                >
                  Selanjutnya →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-2xl text-black font-medium mb-4"
            >
              {editingId ? "Edit Buku" : "Tambah Buku Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#5b5648]">Judul</label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="text-black w-full border border-[#DDD5BE] rounded-lg px-3 py-2 mt-1 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5b5648]">Harga (£)</label>
                <input
                  required
                  type="text"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="text-black w-full border border-[#DDD5BE] rounded-lg px-3 py-2 mt-1 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5b5648]">Rating (1-5)</label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                  className="text-black w-full border border-[#DDD5BE] rounded-lg px-3 py-2 mt-1 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5b5648]">Status Stok</label>
                <select
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  className="text-black w-full border border-[#DDD5BE] rounded-lg px-3 py-2 mt-1 text-sm"
                >
                  <option value="In stock">In stock</option>
                  <option value="Out of stock">Out of stock</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#5b5648]">URL Gambar</label>
                <input
                  type="text"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="text-black w-full border border-[#DDD5BE] rounded-lg px-3 py-2 mt-1 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#2F5233] text-white text-sm font-semibold py-2 rounded-full disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-red-700 flex-1 text-white text-sm font-semibold py-2 rounded-full cursor-pointer"
                >
                  Batal
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
      {toast && (
        <div
          className={`fixed top-6 left-6 z-50 px-[60px] py-[30px] rounded-md shadow-lg text-sm font-semibold text-white ${toast.type === "error" ? "bg-red-700" : "bg-[#0275f0]"
            }`}
        >
          {toast.message}
        </div>
      )}
    </main>
  );

}