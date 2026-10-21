export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md border border-slate-200">
        <h1 className="text-3xl font-extrabold text-indigo-600 mb-2">
          Tokoku App 🛍️
        </h1>
        <p className="text-slate-600 text-sm mb-4">
          Tailwind CSS v4 & React 19 berhasil dikonfigurasi!
        </p>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors cursor-pointer shadow-md shadow-indigo-200">
          Siap Memulai!
        </button>
      </div>
    </div>
  )
}
