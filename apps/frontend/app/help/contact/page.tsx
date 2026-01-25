"use client";

import { useState } from "react";
import { Mail, Phone, MessageCircle, Clock, Send, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ContactMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  value: string;
  available: string;
}

const contactMethods: ContactMethod[] = [
  {
    id: "email",
    name: "电子邮件",
    icon: <Mail className="w-6 h-6" />,
    description: "发送邮件，我们将在24小时内回复",
    value: "support@snowball.com",
    available: "7x24小时",
  },
  {
    id: "phone",
    name: "客服电话",
    icon: <Phone className="w-6 h-6" />,
    description: "工作时间拨打客服热线",
    value: "400-888-8888",
    available: "工作日 9:00-18:00",
  },
  {
    id: "chat",
    name: "在线客服",
    icon: <MessageCircle className="w-6 h-6" />,
    description: "即时对话，快速解决问题",
    value: "点击开始对话",
    available: "工作日 9:00-21:00",
  },
];

const feedbackTypes = [
  { id: "bug", name: "问题反馈" },
  { id: "feature", name: "功能建议" },
  { id: "data", name: "数据问题" },
  { id: "other", name: "其他" },
];

export default function ContactPage() {
  const [feedbackType, setFeedbackType] = useState("bug");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackContent.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setFeedbackContent("");
      setContactEmail("");
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">联系客服</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          选择合适的方式联系我们，获取帮助
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactMethods.map((method) => (
          <Card key={method.id} className="p-5">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-[var(--primary)] bg-opacity-10 rounded-full flex items-center justify-center text-[var(--primary)] mb-4">
                {method.icon}
              </div>
              <h3 className="font-medium text-[var(--foreground)]">{method.name}</h3>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                {method.description}
              </p>
              <div className="mt-3 py-2 px-3 bg-[var(--muted)] rounded-lg">
                {method.id === "chat" ? (
                  <button className="text-[var(--primary)] font-medium text-sm hover:underline">
                    {method.value}
                  </button>
                ) : (
                  <span className="text-[var(--foreground)] font-medium text-sm">
                    {method.value}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs text-[var(--muted-foreground)]">
                <Clock className="w-3 h-3" />
                <span>{method.available}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Feedback Form */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">提交反馈</h2>

        {isSubmitted ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-[var(--foreground)]">
              反馈提交成功
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mt-2">
              感谢您的反馈，我们会尽快处理
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                反馈类型
              </label>
              <div className="flex flex-wrap gap-2">
                {feedbackTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFeedbackType(type.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      feedbackType === type.id
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Content */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                详细描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
                placeholder="请详细描述您遇到的问题或建议..."
                rows={5}
                className="w-full px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                required
              />
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                请尽量详细描述，包括操作步骤、错误信息等，以便我们更好地帮助您
              </p>
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                联系邮箱（选填）
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="如需回复，请填写您的邮箱"
                className="w-full px-4 py-2.5 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !feedbackContent.trim()}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </span>
                    提交中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    提交反馈
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Service Hours */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-[var(--foreground)] mb-4">服务时间</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-[var(--foreground)]">工作日</h4>
              <p className="text-sm text-[var(--muted-foreground)]">9:00 - 18:00</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                客服电话、在线客服正常服务
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[var(--muted-foreground)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-[var(--foreground)]">周末及节假日</h4>
              <p className="text-sm text-[var(--muted-foreground)]">仅邮件服务</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                邮件会在下一个工作日回复
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
