"use client";
import { CheckCircle2, Clock, Shield, Zap } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

export default function HomePage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const sendLandingView = async () => {
      try {
        await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "landing_view" }),
        });
      } catch (error) {
        console.error("Failed to send landing_view event:", error);
      }
    };

    void sendLandingView();
  }, []);

  const handleHeroCtaClick = async () => {
    try {
      await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "cta_click" }),
      });
    } catch (error) {
      console.error("Failed to send cta_click event:", error);
    } finally {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage(null);

    try {
      const form = event.currentTarget;
      const formData = new FormData(form);

      const name = String(formData.get("name") ?? "").trim();
      const contact = String(formData.get("contact") ?? "").trim();
      const consent = formData.get("consent") === "on";

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, contact, consent }),
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        let message = "Не удалось отправить заявку. Попробуйте ещё раз.";
        try {
          const data = await response.json();
          if (data?.error && typeof data.error === "string") {
            message = data.error;
          }
        } catch {
          // ignore JSON parse errors
        }
        setStatus("error");
        setErrorMessage(message);
      }
    } catch (error) {
      console.error("Failed to submit lead form:", error);
      setStatus("error");
      setErrorMessage("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-24 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        {/* Hero */}
        <section className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
          <div>
            <p className="mb-4 inline-flex items-center rounded-full bg-zinc-900/60 px-3 py-1 text-xs font-medium text-zinc-300 ring-1 ring-zinc-700/60">
              Легкий запуск · Без лишней сложности
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Ваш продукт в&nbsp;одном клике
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base text-zinc-300 sm:text-lg">
              Подключите клиентов, автоматизируйте заявки и собирайте лиды в
              одном месте. Без кода, без долгого онбординга — только результат.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleHeroCtaClick}
                className="inline-flex items-center justify-center rounded-full bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-950 shadow-lg shadow-zinc-950/40 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                Начать сейчас
              </button>
              <p className="text-sm text-zinc-400">
                Без привязки карты · Можно отменить в любой момент
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-6 shadow-xl shadow-zinc-950/40 sm:p-8">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                Моментальная аналитика
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/40">
                <CheckCircle2 className="h-3 w-3" />
                Активно
              </span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-zinc-400">Лидов за неделю</p>
                <p className="text-2xl font-semibold tracking-tight text-zinc-50">
                  327
                </p>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-sm text-zinc-400">Конверсия</p>
                <p className="text-2xl font-semibold tracking-tight text-emerald-400">
                  42%
                </p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-zinc-500">
                  Обновление каждые 5 минут
                </p>
                <div className="flex -space-x-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[10px] font-medium text-zinc-200 ring-2 ring-zinc-950">
                    AV
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-[10px] font-medium text-zinc-100 ring-2 ring-zinc-950">
                    MK
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-600 text-[10px] font-medium text-zinc-100 ring-2 ring-zinc-950">
                    DN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proof */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Цифры, которым можно доверять
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "клиентов", value: "1000+", hint: "от малого до крупного бизнеса" },
              { label: "довольных", value: "99%", hint: "по результатам опросов" },
              { label: "поддержка", value: "24/7", hint: "реальные люди, не боты" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-center shadow-sm shadow-zinc-950/30 sm:p-5"
              >
                <p className="text-3xl font-semibold tracking-tight text-zinc-50">
                  {item.value}
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-300">
                  {item.label}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{item.hint}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Почему это работает
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: Zap,
                title: "Быстрый запуск",
                description:
                  "Поднимите лендинг и сбор заявок за вечер, а не за недели разработки.",
              },
              {
                icon: Shield,
                title: "Безопасность данных",
                description:
                  "Все данные проходят через защищённые каналы и надежно шифруются.",
              },
              {
                icon: Clock,
                title: "Экономия времени",
                description:
                  "Готовые блоки и интеграции позволяют фокусироваться только на продукте.",
              },
              {
                icon: CheckCircle2,
                title: "Прозрачная аналитика",
                description:
                  "Отслеживайте источники трафика и показатели конверсии в одном интерфейсе.",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 shadow-sm shadow-zinc-950/30 sm:p-5"
              >
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-50">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-50 sm:text-base">
                    {benefit.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-300">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Частые вопросы
          </h2>
          <div className="space-y-3">
            {[
              {
                question: "Нужны ли разработчики, чтобы запустить лендинг?",
                answer:
                  "Нет. Вы можете использовать готовый шаблон и базовые настройки. При необходимости команда сможет доработать решение при помощи наших API.",
              },
              {
                question: "Можно ли подключить Telegram или почту для заявок?",
                answer:
                  "Да. Заявки могут отправляться в Telegram-бот, на почту или в вашу CRM. Настройка занимает несколько минут.",
              },
              {
                question: "Как считается стоимость и есть ли пробный период?",
                answer:
                  "Мы используем модель с фиксированной mensalной оплатой и честным лимитом по заявкам. Для новых проектов доступен бесплатный тестовый период.",
              },
              {
                question: "Что с безопасностью и хранением персональных данных?",
                answer:
                  "Все данные шифруются и хранятся в соответствии с современными стандартами безопасности. Вы можете запросить удаление данных в любой момент.",
              },
            ].map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm shadow-sm shadow-zinc-950/30 sm:px-5 sm:py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left text-zinc-50">
                  <span className="font-medium">{item.question}</span>
                  <span className="text-xs text-zinc-400 group-open:hidden">
                    Показать
                  </span>
                  <span className="hidden text-xs text-zinc-400 group-open:inline">
                    Скрыть
                  </span>
                </summary>
                <p className="mt-3 text-sm text-zinc-300">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA / Lead Form */}
        <section className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/40 p-6 shadow-xl shadow-zinc-950/40 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Готовы протестировать на своем продукте?
              </h2>
              <p className="mt-3 text-sm text-zinc-300 sm:text-base">
                Оставьте контакты — мы поможем подготовить первый лендинг,
                подключим Telegram-уведомления и подскажем, как повысить
                конверсию уже в первую неделю.
              </p>
              <p className="mt-3 text-xs text-zinc-500">
                Нажимая «Отправить», вы даёте согласие на связь по указанным
                контактам.
              </p>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl bg-zinc-950/40 p-4 ring-1 ring-zinc-800 sm:p-5"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400"
                >
                  Имя
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Например, Алексей"
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/60"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact"
                  className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400"
                >
                  Контакт
                </label>
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  required
                  placeholder="Email или телефон"
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500/60"
                />
              </div>

              <label className="flex items-start gap-2 text-xs text-zinc-400">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/60"
                />
                <span>
                  Согласен на обработку данных в соответствии с политикой
                  конфиденциальности.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-full bg-zinc-50 px-5 py-2.5 text-sm font-medium text-zinc-950 shadow-lg shadow-zinc-950/40 transition hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
              </button>

              {status === "success" && (
                <p className="text-sm text-emerald-400">
                  Спасибо! Мы свяжемся с вами.
                </p>
              )}
              {status === "error" && errorMessage && (
                <p className="text-sm text-red-400">{errorMessage}</p>
              )}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
