
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Target, Award, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-brand text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">من نحن</h1>
          <p className="text-xl max-w-2xl mx-auto text-purple-100">
            وحدة مناهضة العنف ضد المرأة بجامعة بني سويف التكنولوجية، نؤمن بأن الأمان حق للجميع.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-full text-primary">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">رؤيتنا</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              الوصول لمجتمع جامعي آمن ومستقر، خالٍ من كافة أشكال العنف والتمييز، يتمتع فيه جميع الأفراد بالاحترام المتبادل والكرامة الإنسانية، مما يعزز البيئة التعليمية والبحثية.
            </p>

            <div className="flex items-center gap-3 mb-4">
              <div className="bg-pink-100 p-3 rounded-full text-secondary">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">رسالتنا</h2>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              توفير آليات فعالة للوقاية والحماية من العنف، ونشر ثقافة الاحترام والمساواة من خلال التوعية والتدريب والدعم النفسي والقانوني، بما يضمن بيئة آمنة ومشجعة للإبداع.
            </p>
          </div>
          <div className="relative">
             <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80" 
              alt="فريق العمل" 
              className="rounded-2xl shadow-xl w-full object-cover h-[400px]"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-primary">3+</div>
                <div className="text-sm text-gray-600">سنوات من<br/>العمل المستمر</div>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">قيمنا الجوهرية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-2 transition-transform">
              <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">السرية والخصوصية</h3>
              <p className="text-gray-600">نلتزم بأقصى درجات السرية في التعامل مع جميع البلاغات والمعلومات الشخصية.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-2 transition-transform">
              <div className="w-14 h-14 bg-pink-50 rounded-full flex items-center justify-center text-secondary mx-auto mb-4">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">الاحترام والدعم</h3>
              <p className="text-gray-600">نتعامل مع الجميع باحترام وتقدير، ونقدم الدعم النفسي والمعنوي اللازم.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-2 transition-transform">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">المهنية والشفافية</h3>
              <p className="text-gray-600">نتبع إجراءات مهنية واضحة وشفافة في معالجة القضايا والشكاوى.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">هل لديك استفسار أو اقتراح؟</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            نحن هنا للاستماع إليك. تواصل معنا لأي استفسار أو لتقديم مقترحات لتطوير عمل الوحدة.
          </p>
          <div className="flex gap-4 justify-center">
             <Link to="/contact">
              <Button size="lg" className="bg-primary">تواصل معنا</Button>
            </Link>
             <Link to="/volunteer">
              <Button size="lg" variant="outline">انضم لفريقنا</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
