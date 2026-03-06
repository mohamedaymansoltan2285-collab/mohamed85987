
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";

const questions = [
  {
    question: "هل تعرفين ما هو الخط الساخن للإبلاغ عن التحرش؟",
    options: ["نعم", "لا", "سمعت عنه ولكن لا أحفظه"],
    correct: 0,
    info: "الخط الساخن لمكتب شكاوى المرأة هو 15115، والخط الساخن للنجدة هو 122."
  },
  {
    question: "إذا تعرضتِ لمضايقة داخل الجامعة، ما هو التصرف الصحيح؟",
    options: ["الصمت وتجاهل الأمر", "التوجه لوحدة مناهضة العنف وتقديم بلاغ", "نشر الموضوع على فيسبوك"],
    correct: 1,
    info: "التصرف الصحيح والقانوني هو التوجه فوراً لوحدة مناهضة العنف لضمان حقك وحمايتك."
  },
  {
    question: "هل المزاح اللفظي ذو الإيحاءات يعتبر تحرشاً؟",
    options: ["نعم، يعتبر تحرش لفظي", "لا، هو مجرد مزاح", "يعتمد على نية الشخص"],
    correct: 0,
    info: "نعم، أي تلميحات أو ألفاظ ذات طبيعة جنسية غير مرغوب فيها تعتبر تحرشاً لفظياً يعاقب عليه القانون."
  },
  {
    question: "هل تضمن الوحدة سرية بيانات المبلغ؟",
    options: ["لا، يتم نشرها", "نعم، سرية تامة", "حسب الحالة"],
    correct: 1,
    info: "تلتزم الوحدة بميثاق شرف يضمن السرية التامة لبيانات المبلغ ولا يتم مشاركتها إلا مع جهات التحقيق الرسمية إذا لزم الأمر."
  },
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowFeedback(true);
    
    if (optionIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setShowResult(true);
      }
    }, 3000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  if (showResult) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 border border-purple-100">
          <h2 className="text-3xl font-bold mb-6">نتيجة اختبار الوعي</h2>
          <div className="w-40 h-40 rounded-full border-8 border-primary flex items-center justify-center mx-auto mb-6 text-4xl font-bold text-primary">
            {Math.round(percentage)}%
          </div>
          <p className="text-xl text-gray-700 mb-8">
            {percentage >= 75 ? "ممتاز! لديك وعي عالي بحقوقك وآليات الحماية." : "تحتاجين لمعرفة المزيد، ننصحك بتصفح المكتبة التوعوية."}
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={resetQuiz} variant="outline" className="gap-2">
              <RefreshCw size={18} /> إعادة الاختبار
            </Button>
            <Button className="bg-gradient-brand">تصفح المقالات التوعوية</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">اختبر معلوماتك</h1>
        <p className="text-gray-600">أجب عن الأسئلة التالية لقياس مدى وعيك بحقوقك وآليات الحماية</p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <Progress value={(currentQuestion / questions.length) * 100} className="h-2 rounded-none" />
        
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-center mb-8 text-sm font-medium text-gray-500">
            <span>سؤال {currentQuestion + 1} من {questions.length}</span>
            <span className="bg-purple-50 text-primary px-3 py-1 rounded-full">توعية قانونية</span>
          </div>

          <h2 className="text-2xl font-bold mb-8 text-gray-900 leading-snug">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showFeedback && handleAnswer(index)}
                disabled={showFeedback}
                className={`w-full p-4 rounded-xl text-right border-2 transition-all flex justify-between items-center
                  ${showFeedback 
                    ? index === questions[currentQuestion].correct 
                      ? "border-green-500 bg-green-50 text-green-900" 
                      : index === selectedOption 
                        ? "border-red-500 bg-red-50 text-red-900" 
                        : "border-gray-100 opacity-50"
                    : "border-gray-100 hover:border-primary hover:bg-purple-50"
                  }
                `}
              >
                <span className="font-medium">{option}</span>
                {showFeedback && index === questions[currentQuestion].correct && <CheckCircle className="text-green-600" />}
                {showFeedback && index === selectedOption && index !== questions[currentQuestion].correct && <XCircle className="text-red-600" />}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className="mt-8 p-4 bg-blue-50 rounded-xl text-blue-800 text-sm animate-fade-in border border-blue-100">
              <span className="font-bold ml-1">معلومة:</span> 
              {questions[currentQuestion].info}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
