import { useState } from 'react';
import { BookOpen, CheckCircle, CheckSquare,  ChevronRight, PlayCircle, BookA, Layout, Rocket, Users, ArrowRight, ArrowDown } from 'lucide-react';

const courses = [
  {
    id: 'dasar',
    title: 'Dasar Manajemen Pekerjaan',
    icon: <BookA className="text-white" size={24} />,
    color: 'from-blue-500 to-cyan-400',
    lessons: [
      { 
        id: 'l1', 
        title: 'Sejarah & Mengapa Kita Butuh Manajemen Pekerjaan?', 
        content: (
          <div className="space-y-5">
            <div className="bg-brand-blue p-5 rounded-2xl border border-brand-orange/20 mb-6">
              <h4 className="font-bold text-xl text-brand-text mb-3">Hook Sejarah: Membangun Kemegahan Dunia</h4>
              <p className="text-brand-text leading-relaxed">
                Bayangkan Anda adalah kepala arsitek yang sedang membangun <strong>Piramida Giza</strong> atau <strong>Tembok Besar Tiongkok</strong> pada zaman dahulu. Bagaimana Anda mengatur jutaan blok batu, puluhan ribu pekerja, dan target penyelesaian puluhan tahun tanpa alat komunikasi modern?
              </p>
            </div>
            
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg" alt="Piramida" className="w-full h-64 object-cover rounded-2xl shadow-md mb-4 object-center" />
            
            <h4 className="font-bold text-lg text-brand-text mt-6 mb-2">Titik Rasa Sakit (Pain Points) di Masa Lalu:</h4>
            <p className="text-gray-700 leading-relaxed">Proyek raksasa sering kali berujung pada kekacauan karena komunikasi yang buruk, tidak ada pembagian tugas yang jelas, dan ketiadaan tenggat waktu. Pekerja kebingungan, bahan bangunan terbuang, dan waktu terbuang sia-sia.</p>
            <p className="text-gray-700 leading-relaxed">Dari kekacauan inilah manusia mulai beradaptasi. Mereka menyadari perlunya sebuah <strong>sistem</strong> untuk memecah pekerjaan raksasa menjadi potongan-potongan kecil yang dapat dikelola oleh kelompok-kelompok kecil. Inilah cikal bakal Manajemen Proyek (Project Management).</p>
          </div>
        )
      },
      { 
        id: 'l2', 
        title: 'Konsep Dasar: Project, Task & Workflow', 
        content: (
          <div className="space-y-6">
            <p className="text-gray-700 text-lg">Untuk memahami berbagai metodologi, kita perlu menyepakati bahasa dan istilah yang sama:</p>
            <div className="grid grid-cols-1 gap-5">
              <div className="bg-white p-5 rounded-xl border-l-4 border-l-blue-500 shadow-sm border border-gray-100">
                <h4 className="font-bold text-lg text-brand-text mb-1">Project (Proyek)</h4>
                <p className="text-gray-600">Tujuan besar dengan awal dan akhir yang jelas. Contoh: "Membangun Aplikasi", "Mengadakan Konser Musik".</p>
              </div>
              <div className="bg-white p-5 rounded-xl border-l-4 border-l-green-500 shadow-sm border border-gray-100">
                <h4 className="font-bold text-lg text-brand-text mb-1">Task / Work Item (Tugas)</h4>
                <p className="text-gray-600">Bagian terkecil dari proyek yang bisa dikerjakan 1 orang dalam waktu singkat. Contoh: "Mendesain Logo", "Mencetak Tiket".</p>
              </div>
              <div className="bg-white p-5 rounded-xl border-l-4 border-l-purple-500 shadow-sm border border-gray-100">
                <h4 className="font-bold text-lg text-brand-text mb-1">Workflow (Alur Kerja)</h4>
                <p className="text-gray-600">Perjalanan sebuah tugas dari belum mulai hingga selesai (To Do &rarr; In Progress &rarr; Done).</p>
              </div>
            </div>
          </div>
        )
      },
      { 
        id: 'l3', 
        title: 'Berbagai Macam Framework', 
        content: (
          <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
            <p>Seiring berjalannya waktu, manusia menciptakan berbagai <strong>Framework</strong> (kerangka kerja) untuk mengelola proyek yang disesuaikan dengan jenis industrinya:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-brand-bg p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-brand-text">Waterfall</h4>
                <p className="text-sm mt-1 text-gray-600">Tradisional, berurutan, sangat cocok untuk industri fisik seperti konstruksi.</p>
              </div>
              <div className="bg-brand-bg p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-brand-text">Agile & Scrum</h4>
                <p className="text-sm mt-1 text-gray-600">Fleksibel, iteratif, diciptakan khusus untuk industri software yang cepat berubah.</p>
              </div>
              <div className="bg-brand-bg p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-brand-text">Kanban</h4>
                <p className="text-sm mt-1 text-gray-600">Sistem visual dari Toyota. Fokus pada aliran kerja berkelanjutan (Continuous Flow).</p>
              </div>
              <div className="bg-brand-bg p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-brand-text">Lean & Six Sigma</h4>
                <p className="text-sm mt-1 text-gray-600">Fokus pada pengurangan pemborosan (waste) dan peningkatkan kualitas data-driven.</p>
              </div>
            </div>
            <p className="mt-6 font-medium text-brand-orange">Pilih materi berikutnya untuk membedah framework di atas satu per satu secara mendalam.</p>
          </div>
        )
      },
    ]
  },
  {
    id: 'waterfall',
    title: 'Metode Tradisional (Waterfall)',
    icon: <Layout className="text-white" size={24} />,
    color: 'from-purple-500 to-indigo-400',
    lessons: [
      { 
        id: 'w1', 
        title: 'Apa itu Waterfall?', 
        content: (
          <div className="space-y-5">
            <p className="text-gray-700 text-lg leading-relaxed">Waterfall adalah metode manajemen tradisional di mana sebuah proyek mengalir ke bawah seperti air terjun (waterfall). Setiap fase <strong>harus diselesaikan dan dikunci</strong> sebelum fase berikutnya dapat dimulai.</p>
            <div className="bg-brand-bg p-8 rounded-2xl border border-gray-200 mt-6 relative shadow-inner">
              <div className="flex flex-col items-center">
                <div className="bg-indigo-100 text-indigo-800 font-bold px-6 py-4 rounded-xl w-[90%] md:w-3/4 shadow-sm z-10 border border-indigo-200 text-center">1. Requirements (Analisis Kebutuhan)</div>
                <div className="h-6 w-1.5 bg-indigo-300"></div>
                <ArrowDown className="text-indigo-300 -mt-2 z-0" size={28} />
                
                <div className="bg-indigo-200 text-indigo-900 font-bold px-6 py-4 rounded-xl w-[90%] md:w-3/4 ml-0 md:ml-8 shadow-sm z-10 border border-indigo-300 mt-2 text-center">2. Design (Perancangan Sistem)</div>
                <div className="h-6 w-1.5 bg-indigo-400 ml-0 md:ml-8"></div>
                <ArrowDown className="text-indigo-400 -mt-2 ml-0 md:ml-8 z-0" size={28} />

                <div className="bg-indigo-300 text-indigo-900 font-bold px-6 py-4 rounded-xl w-[90%] md:w-3/4 ml-0 md:ml-16 shadow-sm z-10 border border-indigo-400 mt-2 text-center">3. Implementation (Pengerjaan/Ekeskusi)</div>
                <div className="h-6 w-1.5 bg-indigo-500 ml-0 md:ml-16"></div>
                <ArrowDown className="text-indigo-500 -mt-2 ml-0 md:ml-16 z-0" size={28} />

                <div className="bg-indigo-400 text-white font-bold px-6 py-4 rounded-xl w-[90%] md:w-3/4 ml-0 md:ml-24 shadow-sm z-10 border border-indigo-500 mt-2 text-center">4. Verification (Pengujian Kualitas)</div>
                <div className="h-6 w-1.5 bg-indigo-600 ml-0 md:ml-24"></div>
                <ArrowDown className="text-indigo-600 -mt-2 ml-0 md:ml-24 z-0" size={28} />

                <div className="bg-indigo-500 text-white font-bold px-6 py-4 rounded-xl w-[90%] md:w-3/4 ml-0 md:ml-32 shadow-sm z-10 border border-indigo-600 mt-2 text-center">5. Maintenance (Pemeliharaan)</div>
              </div>
            </div>
          </div>
        )
      },
      { 
        id: 'w2', 
        title: 'Kelebihan, Kekurangan & Penggunaan', 
        content: (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-brand-teal p-6 rounded-2xl border border-green-200">
                <h4 className="font-bold text-xl text-green-800 mb-3 flex items-center gap-2"><CheckCircle size={20}/> Kelebihan</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-2 leading-relaxed">
                  <li>Sangat terstruktur dan mudah dimengerti oleh semua orang.</li>
                  <li>Jadwal dan anggaran dikunci di awal, sehingga mudah dihitung dan diajukan.</li>
                  <li>Dokumentasi sangat lengkap, pergantian anggota tim tidak menjadi masalah besar.</li>
                </ul>
              </div>
              <div className="bg-red-50 p-6 rounded-2xl border border-red-200">
                <h4 className="font-bold text-xl text-red-800 mb-3 flex items-center gap-2"><ArrowDown size={20} className="rotate-[-45deg]"/> Kekurangan</h4>
                <ul className="list-disc pl-5 text-gray-700 space-y-2 leading-relaxed">
                  <li>Sangat kaku. Jika di tahap Pengujian ada desain yang salah, harus mengulang jauh ke belakang dengan biaya besar.</li>
                  <li>Klien baru melihat hasil akhir di bulan-bulan terakhir.</li>
                  <li>Jika dunia berubah saat proyek berjalan, proyek bisa usang (outdated) saat rilis.</li>
                </ul>
              </div>
            </div>
            <div className="bg-brand-blue p-5 rounded-xl border border-brand-orange/30">
              <h4 className="font-bold text-brand-text mb-2">Kapan Cocok Digunakan?</h4>
              <p className="text-brand-text text-sm md:text-base">Contoh ideal: <strong>Pembangunan jembatan atau gedung pencakar langit.</strong> Anda tidak mungkin membangun jembatan dengan konsep "coba-coba" (Agile) atau mengubah letak pondasi pilar saat jembatan sudah setengah jadi. Anda butuh spesifikasi 100% yang disetujui di awal proyek.</p>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 'agile',
    title: 'Agile & Scrum Framework',
    icon: <Rocket className="text-white" size={24} />,
    color: 'from-pink-500 to-rose-400',
    lessons: [
      { 
        id: 'a1', 
        title: 'Pola Pikir Agile', 
        content: (
          <div className="space-y-6">
            <p className="text-gray-700 text-lg leading-relaxed">Di tahun 2001, para ahli pembuat software menyadari bahwa Waterfall terlalu kaku untuk industri teknologi yang cepat berubah. Mereka berkumpul dan menciptakan <strong>Agile Manifesto</strong>.</p>
            <div className="bg-pink-50 p-8 rounded-2xl border border-pink-200 flex flex-col items-center text-center shadow-sm">
              <h4 className="font-bold text-2xl text-pink-900 mb-6">Iterasi & Adaptasi (Visualisasi Agile)</h4>
              <div className="flex items-center gap-3 flex-wrap justify-center bg-white p-6 rounded-xl shadow-sm border border-pink-100">
                <div className="px-5 py-3 bg-pink-100 rounded-full text-pink-700 font-bold shadow-sm">Rencana Pendek</div>
                <ArrowRight className="text-pink-400" size={24} />
                <div className="px-5 py-3 bg-pink-200 rounded-full text-pink-800 font-bold shadow-sm">Bangun Fitur</div>
                <ArrowRight className="text-pink-400" size={24} />
                <div className="px-5 py-3 bg-pink-300 rounded-full text-pink-900 font-bold shadow-sm">Rilis & Tes</div>
                <ArrowRight className="text-pink-400" size={24} />
                <div className="px-5 py-3 bg-pink-500 rounded-full text-white font-bold shadow-sm">Umpan Balik Klien</div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-pink-700 font-semibold bg-pink-100/50 px-4 py-2 rounded-lg">
                <Rocket size={18} /> Siklus ini diputar berulang-ulang, bukan berjalan satu garis lurus.
              </div>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">Penting untuk diingat: Agile bukanlah sebuah tahapan teknis, melainkan <strong>pola pikir (Mindset)</strong> bahwa perubahan di tengah jalan itu baik, dan kolaborasi manusia jauh lebih penting daripada kontrak tertulis yang kaku.</p>
          </div>
        )
      },
      { 
        id: 'a2', 
        title: 'Mengenal Scrum & Gambaran Visual', 
        content: (
          <div className="space-y-6">
            <p className="text-gray-700 text-lg leading-relaxed">Scrum adalah salah satu cara (Framework) untuk mempraktikkan Agile. Scrum membagi pekerjaan raksasa menjadi siklus kerja 1-4 minggu yang disebut <strong>Sprint</strong>.</p>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-md">
              <h4 className="font-bold text-2xl text-brand-text text-center mb-10">Siklus Kerja Scrum</h4>
              
              <div className="overflow-x-auto pb-4 w-full">
                <div className="flex flex-row items-center justify-between gap-6 min-w-[700px]">
                  {/* Product Backlog */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-32 bg-brand-bg rounded-lg border-2 border-gray-300 flex flex-col justify-end p-1.5 gap-1.5 shadow-inner">
                      <div className="h-4 w-full bg-brand-blue0 rounded-md"></div>
                      <div className="h-4 w-full bg-brand-teal rounded-md"></div>
                      <div className="h-4 w-full bg-yellow-500 rounded-md"></div>
                      <div className="h-4 w-full bg-red-500 rounded-md"></div>
                      <div className="h-4 w-full bg-purple-500 rounded-md"></div>
                    </div>
                    <span className="text-sm font-bold mt-3 text-center text-brand-text">Product<br/>Backlog</span>
                  </div>
                  
                  <ArrowRight className="text-gray-400" size={32} />
                  
                  {/* Sprint Planning */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-brand-blue rounded-full border-4 border-brand-orange/30 flex items-center justify-center shadow-sm">
                      <Users size={32} className="text-brand-orange" />
                    </div>
                    <span className="text-sm font-bold mt-3 text-center text-brand-text">Sprint<br/>Planning</span>
                  </div>
                  
                  <ArrowRight className="text-gray-400" size={32} />
                  
                  {/* Sprint Backlog */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-28 bg-brand-blue/50 rounded-lg border-2 border-blue-400 flex flex-col justify-start p-1.5 gap-1.5 shadow-md">
                      <div className="h-4 w-full bg-brand-blue0 rounded-md"></div>
                      <div className="h-4 w-full bg-brand-teal rounded-md"></div>
                    </div>
                    <span className="text-sm font-bold mt-3 text-center text-brand-text">Sprint<br/>Backlog</span>
                  </div>

                  <ArrowRight className="text-gray-400" size={32} />
                  
                  {/* Sprint Execution */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-28 h-28">
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-rose-500 animate-[spin_10s_linear_infinite]"></div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-black text-rose-600">Sprint</span>
                        <span className="text-xs font-bold text-gray-600 mt-1">1-4 Mgg</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold mt-3 text-center text-brand-text">Eksekusi &<br/>Daily Standup</span>
                  </div>

                  <ArrowRight className="text-gray-400" size={32} />
                  
                  {/* Potentially Shippable Product */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-brand-teal rounded-2xl border-4 border-green-500 flex flex-col items-center justify-center shadow-lg shadow-green-100">
                      <CheckCircle size={36} className="text-brand-teal mb-1" />
                    </div>
                    <span className="text-sm font-bold mt-3 text-center text-brand-text">Increment<br/>(Hasil Jadi)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-brand-text text-lg mb-3">Terdapat 4 rapat utama (Events) di Scrum:</h4>
              <ul className="space-y-3 text-gray-700">
                <li><strong className="text-brand-orange">1. Sprint Planning:</strong> Rencana awal sebelum Sprint dimulai.</li>
                <li><strong className="text-brand-orange">2. Daily Standup:</strong> Sinkronisasi harian tim (Maksimal 15 menit setiap pagi).</li>
                <li><strong className="text-brand-orange">3. Sprint Review:</strong> Pamer hasil fitur/pekerjaan (Demo) ke klien di akhir Sprint.</li>
                <li><strong className="text-brand-orange">4. Sprint Retrospective:</strong> Evaluasi kinerja dan emosional internal tim untuk perbaikan Sprint berikutnya.</li>
              </ul>
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 'kanban',
    title: 'Kanban & Pendekatan Hybrid',
    icon: <Users className="text-white" size={24} />,
    color: 'from-emerald-500 to-teal-400',
    lessons: [
      { 
        id: 'k1', 
        title: 'Apa itu Kanban? (Bentuk Visual)', 
        content: (
          <div className="space-y-6">
            <p className="text-gray-700 text-lg leading-relaxed">Kanban berasal dari bahasa Jepang yang berarti "Papan Visual". Metode ini diciptakan oleh Toyota untuk mengatur aliran produksi perakitan mobil agar efisien dan tidak ada barang yang menumpuk di gudang.</p>
            
            <div className="bg-[#1e293b] p-6 rounded-2xl shadow-xl mt-6 mb-6 border border-gray-700">
              <h4 className="text-white font-bold text-xl text-center mb-6 flex items-center justify-center gap-2">
                <Layout size={24} className="text-emerald-400"/> Papan Kanban Digital
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* To Do */}
                <div className="bg-[#0f172a] rounded-xl p-4 min-h-[200px] border border-gray-700">
                  <div className="text-gray-400 text-sm font-bold mb-4 uppercase tracking-wider text-center">To Do</div>
                  <div className="bg-white/95 p-4 rounded-lg shadow-sm border-l-4 border-l-yellow-400 mb-3 hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="flex gap-1 mb-2">
                      <div className="h-1.5 w-8 bg-yellow-400 rounded-full"></div>
                      <div className="h-1.5 w-4 bg-purple-400 rounded-full"></div>
                    </div>
                    <div className="text-sm text-brand-text font-bold mb-1">Riset Pasar Q3</div>
                    <div className="text-xs text-gray-500">Menganalisis tren kompetitor</div>
                  </div>
                  <div className="bg-white/95 p-4 rounded-lg shadow-sm border-l-4 border-l-blue-500 mb-3 hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="flex gap-1 mb-2">
                      <div className="h-1.5 w-6 bg-brand-blue0 rounded-full"></div>
                    </div>
                    <div className="text-sm text-brand-text font-bold mb-1">Desain Brosur Acara</div>
                  </div>
                </div>
                
                {/* Doing */}
                <div className="bg-[#0f172a] rounded-xl p-4 min-h-[200px] relative border border-blue-900/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  <div className="text-blue-400 text-sm font-bold mb-4 uppercase tracking-wider flex justify-between items-center px-1">
                    <span>Doing / In Progress</span>
                    <span className="text-xs bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/30" title="WIP Limit (Batas Kerja Maksimal)">WIP: 2 (Limit)</span>
                  </div>
                  <div className="bg-white/95 p-4 rounded-lg shadow-lg border-l-4 border-l-rose-500 mb-3 rotate-1 transform-gpu cursor-pointer">
                    <div className="flex gap-1 mb-2">
                      <div className="h-1.5 w-10 bg-rose-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-brand-text font-bold mb-1">Meeting Klien VIP</div>
                    <div className="text-xs text-gray-500 flex items-center justify-between mt-2">
                      <span>Studi Kasus</span>
                      <img src="https://ui-avatars.com/api/?name=St&background=0D8ABC&color=fff&size=20" className="rounded-full" alt="Avatar"/>
                    </div>
                  </div>
                </div>
                
                {/* Done */}
                <div className="bg-[#0f172a] rounded-xl p-4 min-h-[200px] border border-gray-700 opacity-90">
                  <div className="text-emerald-400 text-sm font-bold mb-4 uppercase tracking-wider text-center flex items-center justify-center gap-1">
                    Done <CheckCircle size={16}/>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg shadow-sm border-l-4 border-l-emerald-500 mb-3 opacity-60">
                    <div className="text-sm text-gray-600 font-bold line-through mb-1">Kirim Invoice Bulanan</div>
                    <div className="text-xs text-emerald-600 font-medium mt-2">Selesai 2 jam yang lalu</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
              <h4 className="font-bold text-yellow-900 text-lg mb-2">Aturan Emas Kanban:</h4>
              <p className="text-yellow-800 leading-relaxed">
                Batasi <strong>Work-In-Progress (WIP)</strong>. Jika kolom "Doing" dibatasi maksimal 2 kartu, tim Anda tidak boleh mengambil tugas baru dari "To Do" sampai ada tugas di "Doing" yang selesai dan digeser ke "Done". Ini mencegah penumpukan pekerjaan (bottleneck) dan kelelahan (burnout)!
              </p>
            </div>
          </div>
        )
      },
      { 
        id: 'k1-5', 
        title: 'Perbedaan Utama: Scrum vs Kanban', 
        content: (
          <div className="space-y-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              Walaupun sama-sama berada di bawah payung <strong>Agile</strong>, Scrum dan Kanban memiliki pendekatan eksekusi yang sangat berbeda.
            </p>
            
            {/* Table Comparison 1 */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-brand-orange/5">
                  <div className="flex items-center gap-3 mb-6 justify-center bg-brand-orange text-white py-3 rounded-lg shadow-sm">
                    <Rocket size={24} />
                    <h4 className="font-bold text-xl uppercase tracking-wider">Scrum</h4>
                  </div>
                  <ul className="space-y-4 text-brand-text">
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0 font-bold">1</div> <span className="mt-1"><strong>Fixed time-boxes:</strong> Bekerja dalam kotak waktu yang tetap (Sprint).</span></li>
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0 font-bold">2</div> <span className="mt-1"><strong>Tasks are Estimated:</strong> Setiap tugas wajib diestimasi poin atau waktunya.</span></li>
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0 font-bold">3</div> <span className="mt-1"><strong>Track velocity:</strong> Mengukur kecepatan tim dalam menyelesaikan tugas per Sprint.</span></li>
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0 font-bold">4</div> <span className="mt-1"><strong>Scrum Master:</strong> Memiliki peran khusus (Scrum Master, Product Owner).</span></li>
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0 font-bold">5</div> <span className="mt-1"><strong>Cross-functional teams:</strong> Diwajibkan memiliki tim lintas fungsi.</span></li>
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0 font-bold">6</div> <span className="mt-1"><strong>Terkunci:</strong> Tidak bisa menambah tugas saat Sprint sedang berjalan.</span></li>
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0 font-bold">7</div> <span className="mt-1"><strong>Reset:</strong> Papan Scrum direset setiap kali Sprint baru dimulai.</span></li>
                  </ul>
                </div>
                
                <div className="w-full md:w-1/2 p-6 bg-brand-teal/5">
                  <div className="flex items-center gap-3 mb-6 justify-center bg-brand-teal text-white py-3 rounded-lg shadow-sm">
                    <Layout size={24} />
                    <h4 className="font-bold text-xl uppercase tracking-wider">Kanban</h4>
                  </div>
                  <ul className="space-y-4 text-brand-text">
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center shrink-0 font-bold">1</div> <span className="mt-1"><strong>No time-boxes:</strong> Aliran pekerjaan terus-menerus tanpa batas waktu.</span></li>
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center shrink-0 font-bold">2</div> <span className="mt-1"><strong>No Tasks Estimates:</strong> Estimasi tugas opsional, tidak diwajibkan.</span></li>
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center shrink-0 font-bold">3</div> <span className="mt-1"><strong>Track flow:</strong> Mengukur siklus waktu (Cycle time) dan membatasi antrean (WIP).</span></li>
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center shrink-0 font-bold">4</div> <span className="mt-1"><strong>Tanpa Peran Khusus:</strong> Seluruh tim memiliki prosesnya secara bersama-sama.</span></li>
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center shrink-0 font-bold">5</div> <span className="mt-1"><strong>Specialist teams allowed:</strong> Tim dengan keahlian spesifik diperbolehkan.</span></li>
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center shrink-0 font-bold">6</div> <span className="mt-1"><strong>Sangat Fleksibel:</strong> Dapat menambah tugas kapan saja selama kapasitas tersedia.</span></li>
                    <li className="flex gap-3 items-start"><div className="w-8 h-8 rounded-full bg-brand-teal/20 text-brand-teal flex items-center justify-center shrink-0 font-bold">7</div> <span className="mt-1"><strong>Persistent:</strong> Papan Kanban persisten dan tidak pernah direset.</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Visualisasi Papan */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm p-8 mt-6">
              <h4 className="font-bold text-center text-xl text-gray-800 mb-8">Gambaran Visual Eksekusi</h4>
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Visual Kanban */}
                <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                  <h5 className="font-bold text-brand-teal text-lg mb-2">Kanban Board</h5>
                  <p className="text-sm text-gray-500 text-center mb-6">Tugas bersifat berkelanjutan dan mengalir (continuous) tanpa terikat batasan waktu.</p>
                  
                  <div className="flex gap-2 w-full justify-center">
                    {/* Columns */}
                    <div className="flex flex-col gap-2 w-1/4">
                      <div className="text-xs font-bold text-gray-400 text-center uppercase">To Do</div>
                      <div className="h-24 bg-blue-100 rounded border border-blue-200 p-1 flex flex-col gap-1">
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-1/4">
                      <div className="text-xs font-bold text-gray-400 text-center uppercase">In Progress</div>
                      <div className="h-24 bg-yellow-100 rounded border border-yellow-200 p-1 flex flex-col gap-1">
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-1/4">
                      <div className="text-xs font-bold text-gray-400 text-center uppercase">Verify</div>
                      <div className="h-24 bg-orange-100 rounded border border-orange-200 p-1 flex flex-col gap-1">
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-1/4">
                      <div className="text-xs font-bold text-gray-400 text-center uppercase">Done</div>
                      <div className="h-24 bg-green-100 rounded border border-green-200 p-1 flex flex-col gap-1">
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 text-brand-teal text-sm font-medium">
                    <ArrowRight size={16} /> Mengalir Terus Menerus
                  </div>
                </div>

                {/* Visual Scrum */}
                <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
                  <h5 className="font-bold text-brand-orange text-lg mb-2">Scrum Board</h5>
                  <p className="text-sm text-gray-500 text-center mb-6">Tujuan utamanya adalah memindahkan SEMUA tugas yang disepakati ke kolom "Done" dalam kurun waktu Sprint.</p>
                  
                  <div className="relative flex gap-2 w-full justify-center">
                    {/* Arch */}
                    <div className="absolute top-2 left-[20%] right-[20%] h-6 border-t-2 border-dashed border-gray-400 rounded-t-full"></div>
                    <ArrowRight size={16} className="absolute top-0 right-[15%] text-gray-500 bg-white" />
                    
                    {/* Columns */}
                    <div className="flex flex-col gap-2 w-1/4 mt-6">
                      <div className="text-xs font-bold text-gray-400 text-center uppercase">Sprint To Do</div>
                      <div className="h-24 bg-gray-50 rounded border border-gray-200 p-1 flex flex-col gap-1 items-center justify-center text-xs text-gray-400">
                        (Kosong di akhir)
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-1/4 mt-6">
                      <div className="text-xs font-bold text-gray-400 text-center uppercase">In Progress</div>
                      <div className="h-24 bg-gray-50 rounded border border-gray-200 p-1 flex flex-col gap-1 items-center justify-center text-xs text-gray-400">
                        (Kosong)
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-1/4 mt-6">
                      <div className="text-xs font-bold text-gray-400 text-center uppercase">Verify</div>
                      <div className="h-24 bg-gray-50 rounded border border-gray-200 p-1 flex flex-col gap-1 items-center justify-center text-xs text-gray-400">
                        (Kosong)
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 w-1/4 mt-6">
                      <div className="text-xs font-bold text-gray-400 text-center uppercase">Done</div>
                      <div className="h-24 bg-green-100 rounded border border-green-200 p-1 flex flex-col gap-1">
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                        <div className="h-4 bg-white rounded-sm shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 text-brand-orange text-sm font-medium">
                    <CheckCircle size={16} /> Target: Selesai Semua di Akhir Sprint
                  </div>
                </div>
              </div>
            </div>

            {/* Karakteristik Tim */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                 <h4 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Kecocokan Tim</h4>
                 <ul className="space-y-3">
                   <li className="flex gap-2">
                     <span className="font-semibold w-24 shrink-0 text-gray-600">Scrum:</span>
                     <span className="text-gray-700">Cocok untuk tim dengan tujuan/objektif yang kompleks, yang membutuhkan komitmen bersama untuk menyelesaikan fitur.</span>
                   </li>
                   <li className="flex gap-2">
                     <span className="font-semibold w-24 shrink-0 text-gray-600">Kanban:</span>
                     <span className="text-gray-700">Cocok untuk tim yang bervariasi, terdistribusi, atau tim dengan banyak pemain yang mengerjakan tugas-tugas terpisah (Support, Maintenance).</span>
                   </li>
                 </ul>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                 <h4 className="font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Ideologi & Asal</h4>
                 <ul className="space-y-3">
                   <li className="flex gap-2">
                     <span className="font-semibold w-24 shrink-0 text-gray-600">Scrum:</span>
                     <span className="text-gray-700">Berasal dari <em>Software Development</em>. Ideologi utamanya adalah memecahkan masalah kompleks sembari memberikan nilai produk (valuable products).</span>
                   </li>
                   <li className="flex gap-2">
                     <span className="font-semibold w-24 shrink-0 text-gray-600">Kanban:</span>
                     <span className="text-gray-700">Berasal dari <em>Lean Manufacturing</em> (Pabrik Toyota). Ideologi utamanya menggunakan visual untuk memperbaiki aliran dan proses kerja.</span>
                   </li>
                 </ul>
              </div>
            </div>

          </div>
        )
      },
      { 
        id: 'k2', 
        title: 'Pendekatan Hybrid (Jalan Tengah)', 
        content: (
          <div className="space-y-6">
            <p className="text-gray-700 text-lg leading-relaxed">Bagaimana jika atasan Anda (C-Level/Manajemen) meminta kepastian jadwal kaku seperti Waterfall, sementara tim eksekutor Anda butuh fleksibilitas adaptasi seperti Agile? Jawabannya adalah <strong>Hybrid Framework</strong>.</p>
            
            <div className="flex flex-col md:flex-row gap-6 items-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
              
              <div className="w-full md:w-1/2 bg-teal-50 p-6 rounded-xl border border-teal-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-200 text-teal-800 rounded-full flex items-center justify-center font-bold">1</div>
                  <h4 className="font-bold text-teal-900 text-xl">Level Manajemen<br/><span className="text-sm text-teal-700 font-medium">Perencanaan Makro</span></h4>
                </div>
                <p className="text-teal-800 leading-relaxed bg-white p-4 rounded-lg shadow-sm border border-teal-100">
                  Menggunakan <strong>Waterfall</strong>.<br/>Manajemen merencanakan timeline proyek tahunan, budget, dan target pencapaian Q1-Q4. Mereka membutuhkan kepastian administratif kapan proyek X selesai dan butuh dana berapa.
                </p>
              </div>
              
              <div className="hidden md:flex flex-col items-center">
                <ArrowRight className="text-teal-400" size={32} />
                <span className="text-xs font-bold text-teal-600 mt-2 uppercase tracking-wider">Diturunkan Ke</span>
              </div>
              
              <div className="w-full md:w-1/2 bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-200 text-indigo-800 rounded-full flex items-center justify-center font-bold">2</div>
                  <h4 className="font-bold text-indigo-900 text-xl">Level Operasional<br/><span className="text-sm text-indigo-700 font-medium">Eksekusi Mikro</span></h4>
                </div>
                <p className="text-indigo-800 leading-relaxed bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                  Menggunakan <strong>Scrum / Kanban</strong>.<br/>Target tahunan dari manajemen dipecah menjadi Sprint mingguan. Tim eksekusi sehari-hari menggunakan papan visual (Kanban) dan sinkronisasi harian (Standup).
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 italic text-center text-sm">Metode Hybrid ini paling sering diterapkan di institusi pemerintahan, perbankan, dan perusahaan korporat berskala raksasa.</p>
          </div>
        )
      }
    ]
  }
];

export function Materi() {
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const course = courses.find(c => c.id === activeCourse);

  const markComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
    if (course && activeLesson < course.lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
    } else {
      setActiveCourse(null);
    }
  };

  const getCourseProgress = (courseId: string) => {
    const c = courses.find(c => c.id === courseId);
    if (!c) return 0;
    const completed = c.lessons.filter(l => completedLessons.includes(l.id)).length;
    return Math.round((completed / c.lessons.length) * 100);
  };

  if (activeCourse && course) {
    const lesson = course.lessons[activeLesson];
    return (
      <div className="max-w-5xl mx-auto py-8 animate-in fade-in zoom-in duration-300 px-4">
        <button onClick={() => setActiveCourse(null)} className="text-sm font-bold text-gray-600 hover:text-brand-text mb-6 flex items-center gap-2 hover:-translate-x-1 transition-transform bg-white px-5 py-2.5 rounded-2xl border-2 border-gray-200 border-b-4 hover:bg-gray-50">
           &larr; Kembali ke Daftar Kelas
        </button>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 shrink-0">
             <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-6 shadow-lg shadow-blue-100/50`}>
                  {course.icon}
                </div>
                <h3 className="font-extrabold text-2xl text-brand-text mb-6 leading-tight">{course.title}</h3>
                
                <div className="space-y-3">
                  {course.lessons.map((l, idx) => {
                    const isCompleted = completedLessons.includes(l.id);
                    const isActive = activeLesson === idx;
                    return (
                      <button 
                        key={l.id}
                        onClick={() => setActiveLesson(idx)}
                        className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all ${isActive ? 'bg-brand-blue/80 text-brand-orange font-bold shadow-sm border border-brand-orange/20' : 'hover:bg-brand-bg text-gray-600 font-medium border border-transparent'}`}
                      >
                        {isCompleted ? <CheckCircle size={22} className="text-brand-teal shrink-0" /> : <PlayCircle size={22} className={isActive ? 'text-brand-orange shrink-0' : 'text-gray-300 shrink-0'} />}
                        <span className="text-sm leading-tight flex-1">{l.title}</span>
                      </button>
                    )
                  })}
                </div>
             </div>
          </div>
          
          <div className="w-full md:w-2/3">
             <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-8 md:p-10 flex-1 bg-white">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-blue text-brand-orange text-xs font-bold rounded-full mb-6 uppercase tracking-widest border border-brand-orange/20">
                     <BookOpen size={14} /> Materi {activeLesson + 1}
                   </div>
                   <h2 className="text-3xl font-extrabold text-brand-text mb-8 leading-tight">{lesson.title}</h2>
                   <div className="prose prose-blue max-w-none">
                     {lesson.content}
                   </div>
                </div>
                
                <div className="p-6 md:p-8 bg-brand-bg/80 border-t border-gray-100 flex justify-end">
                   <button 
                     onClick={() => markComplete(lesson.id)}
                     className="px-8 py-4 bg-brand-text hover:bg-black text-white font-extrabold rounded-2xl border-2 border-transparent border-b-4 shadow-sm transition-all flex items-center gap-3 hover:gap-4 hover:-translate-y-0.5"
                   >
                     {activeLesson === course.lessons.length - 1 ? 'Selesaikan Modul Pembelajaran' : 'Lanjut ke Materi Berikutnya'} 
                     <ChevronRight size={22} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl mb-8 text-white shadow-xl shadow-gray-200">
           <BookOpen size={36} />
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-text mb-6 tracking-tight">
          MaxAgile Academy
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Pusat pembelajaran interaktif untuk meningkatkan produktivitas Anda. Pelajari metodologi kerja modern melalui kurikulum visual langkah demi langkah yang dirancang untuk pemula.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map(c => {
          const progress = getCourseProgress(c.id);
          return (
            <div key={c.id} onClick={() => { setActiveCourse(c.id); setActiveLesson(0); }} className="bg-white rounded-3xl p-8 border-2 border-gray-100 border-b-8 hover:border-b-4 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all duration-200 shadow-sm cursor-pointer group relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full -z-10 group-hover:scale-125 transition-transform duration-700"></div>
              
              <div className="flex gap-8">
                <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${c.color} flex items-center justify-center shrink-0 shadow-xl group-hover:scale-105 transition-transform duration-300 text-white`}>
                   {c.icon}
                </div>
                <div className="flex-1 flex flex-col justify-center py-2">
                  <h3 className="font-extrabold text-2xl text-brand-text mb-2 group-hover:text-brand-orange transition-colors leading-tight">{c.title}</h3>
                  <p className="text-sm font-semibold text-gray-500 mb-6 flex items-center gap-2">
                    <CheckCircle size={16} className={progress === 100 ? "text-brand-teal" : "text-gray-300"}/> 
                    {c.lessons.length} Materi Pembelajaran
                  </p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                      <span>Progres Belajar</span>
                      <span className="text-brand-orange group-hover:underline flex items-center gap-1">{progress}% <ChevronRight size={14}/></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className={`h-3 rounded-full transition-all duration-1000 ease-out ${progress === 100 ? 'bg-brand-teal' : 'bg-brand-orange'}`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
