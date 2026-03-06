import { MapPin, Shield, AlertTriangle } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const safePoints = [
  { lat: 29.0744, lng: 31.0981, name: "مكتب وحدة مناهضة العنف", desc: "المبنى الإداري، الدور الثاني، مكتب رقم 204", type: "office" },
  { lat: 29.0750, lng: 31.0975, name: "مكتب الأخصائي النفسي", desc: "مبنى كلية الصناعة، الدور الأرضي", type: "support" },
  { lat: 29.0738, lng: 31.0990, name: "أمن الجامعة", desc: "البوابة الرئيسية", type: "security" },
  { lat: 29.0755, lng: 31.0988, name: "قسم الإرشاد الأكاديمي", desc: "المبنى الرئيسي، الدور الأول", type: "guidance" },
];

const SafeMap = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">خريطة الجامعة الآمنة</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          تعرفي على أماكن الدعم، مكاتب الأمن، ونقاط الإبلاغ داخل الحرم الجامعي.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-3xl border border-border h-[500px] overflow-hidden">
          <MapContainer
            center={[29.0744, 31.0981]}
            zoom={17}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", borderRadius: "1.5rem" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {safePoints.map((point, i) => (
              <Marker key={i} position={[point.lat, point.lng]}>
                <Popup>
                  <div className="text-right" dir="rtl">
                    <strong>{point.name}</strong>
                    <br />
                    <span className="text-sm">{point.desc}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4 text-red-700">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-xl font-bold">أرقام الطوارئ</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex justify-between items-center border-b border-red-100 pb-2">
                <span className="font-medium text-foreground">أمن الجامعة</span>
                <span className="font-bold text-red-600 font-mono text-lg">0100000000</span>
              </li>
              <li className="flex justify-between items-center border-b border-red-100 pb-2">
                <span className="font-medium text-foreground">الإسعاف</span>
                <span className="font-bold text-red-600 font-mono text-lg">123</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-medium text-foreground">النجدة</span>
                <span className="font-bold text-red-600 font-mono text-lg">122</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Shield className="h-6 w-6" />
              <h3 className="text-xl font-bold">نقاط آمنة</h3>
            </div>
            <div className="space-y-4">
              {safePoints.map((point, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="bg-accent p-2 rounded-lg text-primary shrink-0 mt-1">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{point.name}</h4>
                    <p className="text-sm text-muted-foreground">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeMap;
