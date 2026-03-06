import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Shield, Lock, FileUp, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  reporterName: z.string().optional(),
  college: z.string().min(1, "يرجى اختيار الكلية"),
  description: z.string().min(10, "يرجى كتابة تفاصيل الواقعة (10 أحرف على الأقل)"),
  contactInfo: z.string().min(1, "يرجى توفير وسيلة تواصل آمنة"),
  isAnonymous: z.boolean().default(false),
});

const Report = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reporterName: "",
      college: "",
      description: "",
      contactInfo: "",
      isAnonymous: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      let attachmentUrls: string[] = [];

      // Upload files if any
      if (files.length > 0) {
        for (const file of files) {
          const fileName = `${Date.now()}-${file.name}`;
          const { data, error: uploadError } = await supabase.storage
            .from("report-attachments")
            .upload(fileName, file);
          if (uploadError) throw uploadError;
          attachmentUrls.push(data.path);
        }
      }

      const { error } = await supabase.from("reports").insert({
        reporter_name: values.isAnonymous ? null : values.reporterName || null,
        college: values.college,
        description: values.description,
        contact_info: values.contactInfo,
        is_anonymous: values.isAnonymous,
        attachments: attachmentUrls.length > 0 ? attachmentUrls : null,
        user_id: user?.id || null,
      });

      if (error) throw error;

      toast.success("تم إرسال البلاغ بنجاح", {
        description: "سيتم التعامل مع بلاغك بسرية تامة والتواصل معك قريباً.",
      });
      form.reset();
      setFiles([]);
    } catch (error: any) {
      toast.error("حدث خطأ أثناء إرسال البلاغ", { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent text-primary mb-4">
          <Shield className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">نموذج الإبلاغ السري</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          هذه القناة آمنة ومشفرة. يتم التعامل مع جميع البلاغات بجدية وسرية تامة من قبل فريق مختص فقط.
        </p>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-primary/10 p-6 md:p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <span className="font-bold block mb-1">تنبيه هام:</span>
            يمكنك تقديم البلاغ بشكل مجهول تماماً إذا رغبت، ولكن توفير وسيلة تواصل يساعدنا في متابعة الحالة.
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="reporterName" render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم (اختياري)</FormLabel>
                  <FormControl><Input placeholder="اسمك الثلاثي" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="college" render={({ field }) => (
                <FormItem>
                  <FormLabel>الكلية <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="اختر الكلية" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="technology">الكلية التكنولوجية</SelectItem>
                      <SelectItem value="industry">كلية الصناعة والطاقة</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="contactInfo" render={({ field }) => (
              <FormItem>
                <FormLabel>وسيلة تواصل آمنة <span className="text-destructive">*</span></FormLabel>
                <FormControl><Input placeholder="رقم هاتف أو بريد إلكتروني" {...field} /></FormControl>
                <FormDescription>لن يتم مشاركة هذه المعلومة مع أحد سوى فريق الوحدة.</FormDescription>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>وصف الواقعة <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea placeholder="يرجى ذكر التفاصيل، المكان، التوقيت..." className="min-h-[150px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="p-4 border border-dashed border-border rounded-lg bg-muted/50 text-center">
              <FileUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">تحميل ملفات (صور، سكرين شوت)</p>
              <p className="text-xs text-muted-foreground mb-3">اختياري - بحد أقصى 5 ميجابايت</p>
              <Input
                type="file"
                multiple
                className="max-w-xs mx-auto text-xs"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </div>

            <FormField control={form.control} name="isAnonymous" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0 rounded-md border p-4 shadow-sm">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none mr-3">
                  <FormLabel>إرسال كبلاغ مجهول</FormLabel>
                  <FormDescription>لن يظهر اسمك في التقرير النهائي.</FormDescription>
                </div>
              </FormItem>
            )} />

            <Button type="submit" size="lg" className="w-full bg-gradient-brand font-bold text-lg" disabled={isSubmitting}>
              {isSubmitting ? "جاري الإرسال..." : "إرسال البلاغ بشكل آمن"} <Lock className="mr-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Report;
