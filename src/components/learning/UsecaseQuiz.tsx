import { useState } from 'react';
import { CheckCircle, XCircle, BrainCircuit, ArrowRight, Lightbulb, RefreshCcw } from 'lucide-react';

interface QuizQuestion {
  id: number;
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const quizData: QuizQuestion[] = [
  {
    id: 1,
    scenario: "Tim Anda adalah tim dukungan IT yang menerima tiket bug dan permintaan fitur kecil secara terus-menerus setiap harinya. Prioritas sering berubah tiba-tiba dari manajemen.",
    question: "Pendekatan apa yang paling cocok untuk tim ini?",
    options: [
      { id: 'a', text: 'Scrum dengan Sprint 2 minggu', isCorrect: false, explanation: 'Scrum mengunci scope selama Sprint, sehingga tidak cocok untuk pekerjaan yang prioritasnya berubah setiap hari.' },
      { id: 'b', text: 'Kanban', isCorrect: true, explanation: 'Kanban sangat cocok untuk pekerjaan berkelanjutan (continuous flow) dan prioritas yang bisa berubah kapan saja asalkan batas WIP (Work in Progress) dipatuhi.' },
      { id: 'c', text: 'Waterfall', isCorrect: false, explanation: 'Waterfall tidak cocok karena tidak fleksibel terhadap perubahan.' },
      { id: 'd', text: 'Extreme Programming (XP)', isCorrect: false, explanation: 'XP lebih fokus pada praktik rekayasa perangkat lunak, sementara masalah utamanya di sini adalah manajemen aliran kerja.' }
    ]
  },
  {
    id: 2,
    scenario: "Di pertengahan Sprint, seorang stakeholder penting (klien) meminta fitur baru yang mendesak untuk segera dimasukkan ke rilis ini.",
    question: "Apa tindakan terbaik yang harus dilakukan oleh Product Owner (PO) dan tim?",
    options: [
      { id: 'a', text: 'Langsung mengerjakannya karena klien adalah raja', isCorrect: false, explanation: 'Ini akan merusak fokus tim dan menggagalkan Sprint Goal.' },
      { id: 'b', text: 'Menolak mentah-mentah dan menyuruh klien menunggu berbulan-bulan', isCorrect: false, explanation: 'Agile menyambut perubahan kebutuhan. Menolak tanpa diskusi bukan praktik yang baik.' },
      { id: 'c', text: 'Memasukkan ke Product Backlog untuk di-prioritaskan di Sprint berikutnya', isCorrect: true, explanation: 'PO berdiskusi dengan klien, menyambut perubahan, lalu menambahkannya ke Product Backlog untuk Sprint berikutnya, agar fokus Sprint saat ini terjaga.' },
      { id: 'd', text: 'Menghentikan Sprint saat ini dan memulai Sprint baru', isCorrect: false, explanation: 'Sprint hanya dibatalkan jika Sprint Goal sudah tidak relevan atau usang secara fundamental, bukan sekadar ada tambahan fitur.' }
    ]
  },
  {
    id: 3,
    scenario: "Tim terus melakukan kesalahan yang sama dalam komunikasi selama beberapa Sprint, mengakibatkan kode sering bentrok.",
    question: "Dalam acara Scrum mana tim harus membahas dan menyelesaikan masalah ini?",
    options: [
      { id: 'a', text: 'Daily Standup', isCorrect: false, explanation: 'Daily Standup untuk merencanakan pekerjaan 24 jam ke depan, terlalu singkat untuk memecahkan masalah mendasar.' },
      { id: 'b', text: 'Sprint Planning', isCorrect: false, explanation: 'Sprint Planning fokus pada APA yang akan dikerjakan di Sprint.' },
      { id: 'c', text: 'Sprint Review', isCorrect: false, explanation: 'Sprint Review fokus mendemonstrasikan produk ke stakeholder.' },
      { id: 'd', text: 'Sprint Retrospective', isCorrect: true, explanation: 'Retrospective adalah waktu khusus bagi tim untuk mengevaluasi BAGAIMANA mereka bekerja dan mencari perbaikan proses.' }
    ]
  },
  {
    id: 4,
    scenario: "Sebuah tim ingin beralih dari Tradisional (Waterfall) ke Agile. Mereka terbiasa dengan manajer proyek yang membagi tugas ke setiap orang.",
    question: "Perubahan pola pikir (mindset) utama apa yang harus diadopsi tim?",
    options: [
      { id: 'a', text: 'Tim harus bisa mengatur dirinya sendiri (Self-organizing)', isCorrect: true, explanation: 'Dalam Agile, tim memutuskan sendiri bagaimana menyelesaikan pekerjaan (Self-organizing), bukan disuapi tugas oleh manajer.' },
      { id: 'b', text: 'Scrum Master bertindak sebagai bos baru yang membagi tugas', isCorrect: false, explanation: 'Scrum Master adalah servant-leader, bukan manajer proyek yang membagi tugas.' },
      { id: 'c', text: 'Tidak butuh dokumentasi sama sekali', isCorrect: false, explanation: 'Agile masih butuh dokumentasi, hanya saja lebih mengutamakan produk yang berfungsi.' },
      { id: 'd', text: 'Bekerja lembur setiap hari agar cepat selesai', isCorrect: false, explanation: 'Agile mengutamakan "sustainable pace" (kecepatan kerja berkelanjutan), bukan kerja berlebihan.' }
    ]
  }
];

export function UsecaseQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const question = quizData[currentQuestion];

  const handleSelectOption = (id: string) => {
    if (isSubmitted) return;
    setSelectedOption(id);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    setIsSubmitted(true);
    const isCorrect = question.options.find(o => o.id === selectedOption)?.isCorrect;
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    const percentage = Math.round((score / quizData.length) * 100);
    let message = "";
    if (percentage === 100) message = "Luar Biasa! Anda sudah menjadi Master Agile.";
    else if (percentage >= 75) message = "Bagus Sekali! Pemahaman Anda tentang Agile sangat baik.";
    else if (percentage >= 50) message = "Lumayan! Pelajari lagi beberapa konsep dasar.";
    else message = "Jangan menyerah! Mari baca Pusat Materi kembali.";

    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white rounded-3xl p-10 border-2 border-gray-100 border-b-8 shadow-sm text-center">
          <div className="w-24 h-24 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <BrainCircuit size={48} className="text-brand-orange" />
          </div>
          <h2 className="text-4xl font-extrabold text-brand-text mb-4">Hasil Kuis</h2>
          <div className="text-7xl font-black text-brand-text mb-6">
            {score}<span className="text-4xl text-gray-400">/{quizData.length}</span>
          </div>
          <div className="inline-block bg-gray-100 px-6 py-2 rounded-full text-lg font-bold text-gray-700 mb-8">
            {message}
          </div>
          
          <div>
            <button 
              onClick={resetQuiz}
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-text hover:bg-black text-white font-extrabold rounded-2xl border-2 border-transparent border-b-4 active:border-b-0 active:translate-y-2 transition-all"
            >
              <RefreshCcw size={20} /> Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-brand-text flex items-center gap-3">
            <div className="p-3 bg-brand-orange/10 rounded-xl text-brand-orange">
              <BrainCircuit size={24} />
            </div>
            Uji Pemahaman Usecase
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Analisa skenario di bawah ini dan pilih tindakan terbaik berdasarkan prinsip Agile.</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Pertanyaan</div>
          <div className="text-2xl font-black text-brand-text">{currentQuestion + 1} <span className="text-gray-300 text-lg">/ {quizData.length}</span></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden border-2 border-gray-100 border-b-8 shadow-sm">
        <div className="bg-gray-50 px-8 py-6 border-b-2 border-gray-100">
          <div className="flex gap-4">
            <Lightbulb className="text-brand-orange shrink-0 mt-1" size={24} />
            <div>
              <div className="text-sm font-bold text-brand-orange uppercase tracking-wider mb-2">Skenario</div>
              <p className="text-gray-700 text-lg leading-relaxed font-medium">{question.scenario}</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <h3 className="text-xl font-extrabold text-brand-text mb-6">{question.question}</h3>
          
          <div className="space-y-4">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id;
              let btnClass = "border-2 border-gray-200 border-b-4 hover:border-gray-300 hover:bg-gray-50 text-gray-600";
              
              if (isSubmitted) {
                if (option.isCorrect) {
                  btnClass = "border-2 border-green-500 bg-green-50 text-green-700 shadow-sm";
                } else if (isSelected && !option.isCorrect) {
                  btnClass = "border-2 border-red-300 bg-red-50 text-red-700";
                } else {
                  btnClass = "border-2 border-gray-100 bg-gray-50 text-gray-400 opacity-60";
                }
              } else if (isSelected) {
                btnClass = "border-2 border-brand-orange bg-brand-orange/5 text-brand-orange shadow-sm translate-y-1 border-b-2";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-5 rounded-2xl flex items-start gap-4 transition-all duration-200 ${btnClass}`}
                >
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-sm transition-colors ${
                    isSubmitted && option.isCorrect ? 'bg-green-500 text-white' :
                    isSubmitted && isSelected && !option.isCorrect ? 'bg-red-400 text-white' :
                    isSelected ? 'bg-brand-orange text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isSubmitted && option.isCorrect ? <CheckCircle size={16} /> : 
                     isSubmitted && isSelected && !option.isCorrect ? <XCircle size={16} /> : 
                     option.id.toUpperCase()}
                  </div>
                  <div className="flex-1 mt-1 font-semibold text-lg">{option.text}</div>
                </button>
              );
            })}
          </div>

          {isSubmitted && (
            <div className={`mt-8 p-6 rounded-2xl border-2 flex items-start gap-4 animate-in slide-in-from-bottom-4 fade-in duration-300 ${
              question.options.find(o => o.id === selectedOption)?.isCorrect 
                ? 'border-green-200 bg-green-50/50' 
                : 'border-red-200 bg-red-50/50'
            }`}>
              <div className="mt-1 shrink-0">
                {question.options.find(o => o.id === selectedOption)?.isCorrect 
                  ? <CheckCircle size={28} className="text-green-500" />
                  : <XCircle size={28} className="text-red-500" />
                }
              </div>
              <div className="flex-1">
                <h4 className={`font-extrabold text-lg mb-2 ${
                  question.options.find(o => o.id === selectedOption)?.isCorrect 
                    ? 'text-green-700' 
                    : 'text-red-700'
                }`}>
                  {question.options.find(o => o.id === selectedOption)?.isCorrect ? 'Tepat Sekali!' : 'Kurang Tepat'}
                </h4>
                <p className="text-gray-700 font-medium leading-relaxed">
                  {question.options.find(o => o.id === (question.options.find(opt => opt.isCorrect)?.id))?.explanation}
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end">
            {!isSubmitted ? (
              <button 
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={`px-8 py-4 font-extrabold rounded-2xl border-2 transition-all ${
                  selectedOption 
                    ? 'bg-brand-text text-white border-transparent border-b-4 hover:bg-black active:border-b-0 active:translate-y-2' 
                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
              >
                Cek Jawaban
              </button>
            ) : (
              <button 
                onClick={handleNext}
                className="px-8 py-4 bg-brand-orange hover:bg-orange-600 text-white font-extrabold rounded-2xl border-2 border-transparent border-b-4 active:border-b-0 active:translate-y-2 transition-all flex items-center gap-2"
              >
                {currentQuestion < quizData.length - 1 ? 'Pertanyaan Berikutnya' : 'Lihat Hasil Akhir'} <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
