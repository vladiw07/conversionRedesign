"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Clock,
  Globe,
  Layout,
  Mail,
  Menu,
  MessageCircle,
  MessageSquare,
  Rocket,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";

/** Mobile sticky CTA (opens your existing contact modal) */


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mounted, setMounted] = useState(false);

  // ✅ Defer below-fold rendering (big mobile perf win, no visual change above fold)
  const [showBelowFold, setShowBelowFold] = useState(false);

  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement | null>(null);
  const contactFormRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);

    // ✅ Render below-fold when the browser has breathing room
    const run = () => setShowBelowFold(true);

    // Prefer idle time, fallback to short timeout
    // @ts-ignore
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      // @ts-ignore
      const id = window.requestIdleCallback(run, { timeout: 600 });
      return () => {
        // @ts-ignore
        window.cancelIdleCallback?.(id);
      };
    } else {
      const t = setTimeout(run, 80);
      return () => clearTimeout(t);
    }
  }, []);

  // ✅ Scroll listener: delayed + rAF-throttled + passive
  useEffect(() => {
    let raf = 0;
    let enabled = false;

    const computeActiveSection = () => {
      const sections = ["approach", "process", "scope"] as const;
      const current = sections.find((section) => {
        const el = document.getElementById(section);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      });
      setActiveSection(current || "");
    };

    const onScroll = () => {
      if (!enabled) return;
      if (raf) return;

      raf = window.requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > 20);
        computeActiveSection();
      });
    };

    // Delay attaching to reduce competition during LCP
    const t = setTimeout(() => {
      enabled = true;
      window.addEventListener("scroll", onScroll, { passive: true });
      // initial compute
      onScroll();
    }, 250);

    return () => {
      clearTimeout(t);
      enabled = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll as any);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menuEl = mobileMenuRef.current;
      const buttonEl = hamburgerButtonRef.current;
      const target = event.target as Node | null;
      if (!menuEl || !target) return;

      if (!menuEl.contains(target)) {
        if (!buttonEl || !buttonEl.contains(target)) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close contact form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const formEl = contactFormRef.current;
      const target = event.target as Node | null;
      if (!formEl || !target) return;

      if (!formEl.contains(target)) {
        setShowContactForm(false);
      }
    };

    if (showContactForm) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showContactForm]);

  type SectionId = "approach" | "process" | "scope";
  type NavHref = `#${SectionId}`;

  const navItems: { label: string; href: NavHref; icon: React.ElementType }[] =
    [
      { label: "Revenue Leaks", href: "#approach", icon: BarChart3 },
      { label: "How It Works", href: "#process", icon: Rocket },
      { label: "Who It’s For", href: "#scope", icon: Target },
    ];

  const handleNavClick = (href: NavHref) => {
    setIsMenuOpen(false);

    setTimeout(() => {
      const element = document.querySelector<HTMLElement>(href);
      if (!element) return;

      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }, 80);
  };

  const handleContactClick = () => {
    setShowContactForm(true);
    setIsMenuOpen(false);
    setSubmitError(null);
  };

  const handleProcessButtonClick = () => {
    handleNavClick("#process");
  };

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("https://formspree.io/f/xkovwqpb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          website: formData.website,
          message: formData.message,
          _subject: `Free Conversion Audit Request from ${formData.name}`,
          _replyto: formData.email,
          _format: "plain",
        }),
      });

      if (response.ok) {
        // ✅ Google Ads conversion
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "conversion", {
            send_to: "AW-17933281806/Frc1CNcavfMbEI7Uo0oC",
            value: 1.0,
            currency: "EUR",
          });
        }

        setSubmitSuccess(true);
        setFormData({ name: "", email: "", website: "", message: "" });

        setTimeout(() => {
          setShowContactForm(false);
          setSubmitSuccess(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-x-hidden">
        {/* Navigation */}
        <nav
          className={`fixed top-0 w-full z-40 transition-all duration-300 ease-out ${
            scrolled
              ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
              : "bg-transparent py-5"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <button
                className="flex items-center gap-3 group cursor-pointer active:scale-95 transition-transform focus:outline-none"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Go to top"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ease-out">
                    <TrendingUp className="w-6 h-6 text-white transition-transform group-hover:rotate-12 duration-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                    ConversionFlow
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Website Redesign
                  </div>
                </div>
              </button>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 transform cursor-pointer relative group flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1 ${
                      activeSection === item.href.slice(1)
                        ? "text-blue-600"
                        : "text-slate-700 hover:text-blue-600"
                    }`}
                    aria-label={`Go to ${item.label} section`}
                  >
                    <item.icon
                      className={`w-4 h-4 transition-transform duration-300 ${
                        activeSection === item.href.slice(1) ? "scale-110" : ""
                      }`}
                    />
                    {item.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out ${
                        activeSection === item.href.slice(1)
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </button>
                ))}
                <button
                  onClick={handleContactClick}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:shadow-xl hover:scale-105 active:scale-95 transform cursor-pointer flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                  aria-label="Get free conversion audit"
                >
                  <span>Free Conversion Audit</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                ref={hamburgerButtonRef}
                className={`md:hidden p-3 rounded-xl transition-all duration-300 ease-out cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50 ${
                  isMenuOpen
                    ? "bg-blue-50 text-blue-600"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="w-6 h-6 transition-transform duration-300" />
                )}
              </button>
            </div>

            {/* Enhanced Mobile Navigation */}
            <div
              ref={mobileMenuRef}
              className={`md:hidden absolute left-0 right-0 mx-4 transition-all duration-300 ease-out z-40 ${
                isMenuOpen
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 -translate-y-4 invisible pointer-events-none"
              }`}
              style={{ top: "calc(100% + 0.5rem)" }}
            >
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="flex flex-col p-2">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.href)}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ease-out group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        activeSection === item.href.slice(1)
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                      aria-label={`Go to ${item.label} section`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            activeSection === item.href.slice(1)
                              ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white"
                              : "bg-slate-100 group-hover:bg-blue-100 text-slate-600"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 transition-all duration-300 ${
                          activeSection === item.href.slice(1)
                            ? "text-blue-500"
                            : "text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1"
                        }`}
                      />
                    </button>
                  ))}
                  <button
                    onClick={handleContactClick}
                    className="mt-2 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-xl transition-all duration-300 ease-out shadow-lg cursor-pointer flex items-center justify-center gap-2 group active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Get free conversion audit"
                  >
                    Get My Free Audit
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* HERO — SPEED OPTIMIZED WITHOUT VISUAL CHANGE */}
        <section className="relative overflow-hidden pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6">
          {/* Background (mobile cheaper blur, sm+ keeps your look) */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/40 to-indigo-200/25 blur-xl sm:blur-3xl opacity-70" />
            <div className="absolute bottom-[-160px] right-[-120px] h-[520px] w-[520px] rounded-full bg-gradient-to-br from-indigo-200/30 to-sky-200/20 blur-2xl sm:blur-3xl hidden sm:block" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.07),transparent_55%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.95),rgba(255,255,255,0.985))]" />
          </div>

          <div className="container mx-auto max-w-7xl relative">
            <div className="grid items-start gap-8 lg:gap-12 lg:grid-cols-2">
              {/* LEFT */}
              <div className="text-center lg:text-left">
                {/* Badge (remove backdrop blur on mobile; keep on sm+) */}
                <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 rounded-full border border-blue-200/60 bg-white/80 sm:bg-white/70 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-blue-700 shadow-sm sm:backdrop-blur">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Coach &amp; Consultant Website Design</span>
                  <span className="mx-1 h-3 w-px bg-slate-200 hidden sm:inline" />
                  <span className="font-medium text-slate-600">
                    Built to get booked calls
                  </span>
                </div>

                {/* H1 (mobile solid color = faster paint; desktop keeps gradient look) */}
                <h1 className="mt-4 sm:mt-6 text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  <span className="text-blue-600 sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-blue-600 sm:to-indigo-600">
                    Website Design
                  </span>{" "}
                  for Coaches &amp; Consultants
                  <span className="block mt-2 text-slate-900">
                    That Turns Visitors Into{" "}
                    <span className="underline decoration-blue-300/70 decoration-4 underline-offset-4">
                      Booked Calls
                    </span>
                  </span>
                </h1>

                <p className="mt-4 text-base sm:text-lg lg:text-xl leading-relaxed text-slate-600 max-w-2xl mx-auto lg:mx-0">
                  Redesign your site so people instantly understand your offer,
                  trust you fast, and take the next step —
                  <b className="text-slate-800"> especially on mobile</b>.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <button
                    onClick={handleContactClick}
                    className="group relative px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-white font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] bg-gradient-to-r from-blue-600 to-indigo-600 w-full sm:w-auto"
                    aria-label="Get your free conversion audit"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                      Get My Free Audit
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </button>

                  <button
                    onClick={handleProcessButtonClick}
                    className="group px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-slate-800 font-semibold text-base sm:text-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all active:scale-[0.98] w-full sm:w-auto sm:bg-white/85 sm:backdrop-blur"
                    aria-label="See the process"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/5">
                        <Clock className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                      </span>
                      See the process
                    </span>
                  </button>
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">
                    No sales call trap.
                  </span>{" "}
                  Audit delivered by email within{" "}
                  <span className="font-semibold">8–12 hours</span>.
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                  {[
                    { icon: <Clock className="h-4 w-4" />, text: "8–12 hour delivery" },
                    { icon: <Check className="h-4 w-4" />, text: "No call required" },
                    { icon: <Check className="h-4 w-4" />, text: "Priority fix list" },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 sm:bg-white/70 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 shadow-sm sm:backdrop-blur"
                    >
                      <span className="text-blue-600">{c.icon}</span>
                      <span>{c.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — PROOF CARD (mobile no backdrop blur; desktop keeps it) */}
              <div className="lg:justify-self-end max-w-md mx-auto lg:max-w-none w-full order-2 lg:order-none">
                <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden sm:bg-white/75 sm:backdrop-blur">
                  <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-200/70">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Audit preview
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-700 flex-shrink-0">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                          “Here’s what’s stopping calls — and what to fix first”
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm text-slate-600">
                          Annotated screenshots + headline options + priority
                          order.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-3">
                      <div className="h-14 w-full rounded-lg bg-slate-100 border border-slate-200 relative overflow-hidden">
                        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          Offer not clear fast
                        </div>
                        <div className="absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-full bg-white/90 border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          CTA too early
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {[
                          { label: "Fix #1", text: "Headline" },
                          { label: "Fix #2", text: "Proof" },
                          { label: "Fix #3", text: "CTA" },
                        ].map((fix, i) => (
                          <div
                            key={i}
                            className="rounded-lg border border-slate-200 bg-white p-2"
                          >
                            <div className="text-[10px] font-semibold text-slate-500">
                              {fix.label}
                            </div>
                            <div className="mt-1 text-xs font-bold text-slate-900">
                              {fix.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2">
                      <div className="text-xs font-semibold text-slate-800">
                        Free 5-point audit
                      </div>
                      <div className="text-[10px] font-semibold text-slate-500">
                        Email delivery • No meeting
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Everything below fold is deferred to improve mobile LCP */}
        {showBelowFold && (
          <>
            {/* Pain Points Section */}
            <section
              id="approach"
              className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-slate-50 scroll-mt-20"
            >
              <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
                    Your Website Should{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500">
                      Sell While You Sleep
                    </span>
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
                    These are the silent conversion killers that make qualified
                    prospects bounce — even when they want what you offer.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      icon: Layout,
                      title: "Unclear Offer (Above the Fold)",
                      desc: "If people can’t understand who it’s for, what you do, and why it matters in 5 seconds — they leave.",
                    },
                    {
                      icon: Shield,
                      title: "Trust Isn’t Earned Fast Enough",
                      desc: "Premium buyers need proof, authority, and reassurance immediately — not “scroll and hope.”",
                    },
                    {
                      icon: Zap,
                      title: "Weak Booking Momentum",
                      desc: "The page doesn’t create a clear next step, so visitors “think about it”… and disappear.",
                    },
                    {
                      icon: Target,
                      title: "Mobile Friction",
                      desc: "If booking feels annoying on mobile, it won’t happen. Most coaches lose calls here.",
                    },
                    {
                      icon: TrendingUp,
                      title: "No Conversion Path",
                      desc: "Great content, zero direction. Your site needs a designed journey, not a brochure.",
                    },
                    {
                      icon: Users,
                      title: "Attracting the Wrong Leads",
                      desc: "Messaging that’s too broad pulls tire-kickers and price shoppers instead of ready-to-buy clients.",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-slate-200 hover:border-blue-300 transition-all duration-500 ease-out shadow-lg hover:shadow-xl hover:-translate-y-2 transform cursor-default group animate-fade-in-up"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3">
                        <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-blue-700">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="mt-4 sm:mt-6 flex items-center gap-2">
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-transform duration-1000 ease-out -translate-x-full group-hover:translate-x-0"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Promise Section */}
            <section className="py-16 sm:py-20 px-4 sm:px-6">
              <div className="container mx-auto max-w-7xl">
                <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-blue-100 shadow-2xl animate-fade-in-up hover:shadow-3xl transition-shadow duration-500 ease-out">
                  <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 sm:gap-3 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-blue-700 mb-4 sm:mb-6 border border-blue-200 cursor-default transition-all duration-300 hover:scale-105">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>What You Get</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
                      A Website Built to{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Convert High-Intent Visitors
                      </span>{" "}
                      Into Calls
                    </h2>

                    <p className="text-base sm:text-lg md:text-xl text-slate-700 mb-8 sm:mb-10 leading-relaxed">
                      We rebuild your front-end around one goal:{" "}
                      <span className="font-semibold">booked calls</span>. Clear
                      messaging, premium positioning, and a frictionless path to
                      action — so the right clients understand your value and
                      move forward confidently.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                      {[
                        {
                          title: "Core Pages (Conversion First)",
                          items: [
                            "Homepage (Primary Conversion Hub)",
                            "About (Authority + Trust)",
                            "Services (Offer Clarity + Proof)",
                            "Contact (Booking Engine)",
                            "+ One High-Intent Landing Page (Optional Use)",
                          ],
                        },
                        {
                          title: "Conversion Systems We Install",
                          items: [
                            "Clarity-First Messaging",
                            "Premium Positioning & Trust",
                            "Conversion-Focused Page Flow",
                            "Mobile-First UX (No Friction)",
                            "Social Proof Placement Strategy",
                          ],
                        },
                      ].map((column, colIdx) => (
                        <div
                          key={colIdx}
                          className="bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-500 ease-out cursor-default hover:translate-y-1"
                        >
                          <h4 className="font-bold text-slate-900 mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                            {column.title}
                          </h4>
                          <ul className="space-y-2 sm:space-y-3">
                            {column.items.map((item, idx) => (
                              <li
                                key={idx}
                                className="flex items-center gap-2 sm:gap-3"
                              >
                                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                                </div>
                                <span className="text-xs sm:text-sm text-slate-700">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Scope Section */}
            <section
              id="scope"
              className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-slate-50 scroll-mt-20"
            >
              <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
                    Best Fit for Coaches Who Want{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                      More Calls
                    </span>{" "}
                    (Not More Busywork)
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
                    We focus on conversion-first front-end redesign — not
                    “everything for everyone.”
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="animate-fade-in-left">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-green-200 shadow-xl h-full transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        Perfect If You’re…
                      </h3>
                      <ul className="space-y-3 sm:space-y-4">
                        {[
                          "Selling a premium service (coaching, consulting, done-for-you)",
                          "Getting traffic/referrals but booking is inconsistent",
                          "Ready to tighten your messaging & positioning",
                          "Tired of attracting low-quality leads and price shoppers",
                          "Looking for a mobile-first site that loads fast and drives action",
                        ].map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 sm:gap-3 cursor-default"
                          >
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                            </div>
                            <span className="text-sm sm:text-base text-slate-700 flex-1">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="animate-fade-in-right">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-slate-300 shadow-xl h-full transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        Not a Fit If You Need…
                      </h3>
                      <ul className="space-y-3 sm:space-y-4">
                        {[
                          "Custom backends or complex databases",
                          "Membership portals or LMS platforms",
                          "Large web apps or data-heavy dashboards",
                          "E-commerce with complex inventory management",
                          "Community or social network features",
                        ].map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 sm:gap-3 cursor-default"
                          >
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-slate-200 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                              <X className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                            </div>
                            <span className="text-sm sm:text-base text-slate-500 flex-1">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white/50 rounded-lg border border-slate-200">
                        <p className="text-xs sm:text-sm text-slate-600 italic">
                          “We don’t try to do everything. We specialize in
                          conversion-focused front-end redesigns that turn your
                          current traffic into booked calls — fast.”
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Process Section */}
            <section
              id="process"
              className="py-16 sm:py-20 px-4 sm:px-6 scroll-mt-20"
            >
              <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                      Simple Process.
                    </span>{" "}
                    Serious Results.
                  </h2>
                  <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4">
                    Built for busy operators: clear steps, fast execution,
                    measurable outcomes.
                  </p>
                </div>

                <div className="relative">
                  <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 transform -translate-y-1/2"></div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                    {[
                      {
                        step: "01",
                        title: "Conversion Audit",
                        desc: "We find the exact spots you’re leaking calls (clarity, trust, CTA, mobile flow).",
                      },
                      {
                        step: "02",
                        title: "Offer & Messaging Clarity",
                        desc: "We sharpen positioning so the right clients instantly understand your value.",
                      },
                      {
                        step: "03",
                        title: "Wireframe the Booking Journey",
                        desc: "We design a frictionless path from first glance → trust → action.",
                      },
                      {
                        step: "04",
                        title: "Premium Front-End Implementation",
                        desc: "Fast, responsive build optimized for performance + conversions.",
                      },
                      {
                        step: "05",
                        title: "Launch + Tracking",
                        desc: "We ensure tracking works and review what happens after launch.",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="relative z-10 animate-fade-in-up"
                        style={{ animationDelay: `${idx * 150}ms` }}
                      >
                        <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-3 transform cursor-default group h-full">
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-12">
                              {item.step}
                            </div>
                          </div>
                          <div className="pt-6 sm:pt-8 text-center">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-blue-700">
                              {item.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 transition-colors duration-300 group-hover:text-slate-800">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 sm:mt-16 text-center animate-fade-in-up">
                  <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 px-4">
                    Want to know why your site isn’t booking calls? I’ll tell
                    you. Free.
                  </p>
                  <button
                    onClick={handleContactClick}
                    className="group px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transform cursor-pointer flex items-center gap-2 sm:gap-3 mx-auto transition-all duration-300 text-base sm:text-lg shadow-xl"
                    aria-label="Get free conversion audit"
                  >
                    <span>Get My Free 5-Point Audit</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1 duration-300" />
                  </button>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 sm:py-20 px-4 sm:px-6 scroll-mt-20">
              <div className="container mx-auto max-w-5xl">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center text-white shadow-2xl animate-fade-in-up hover:shadow-3xl transition-shadow duration-500 ease-out overflow-hidden relative">
                  <div className="absolute top-1/4 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                  <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slower"></div>

                  <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                      Get a Free Audit That Shows{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                        Exactly What to Fix
                      </span>
                    </h2>

                    <p className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 lg:mb-10 leading-relaxed">
                      I’ll review your site and send back a short, actionable
                      breakdown: what’s hurting conversions, what to change
                      first, and how to increase booked calls — without buying
                      more traffic.
                    </p>

                    <div className="max-w-md mx-auto mb-6 sm:mb-8 bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-700">
                      <h4 className="font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                        What You’ll Receive:
                      </h4>
                      <ul className="space-y-2 sm:space-y-3 text-left">
                        {[
                          "Above-the-fold clarity + offer positioning",
                          "Trust + authority gaps (proof placement)",
                          "CTA + booking flow friction (mobile + desktop)",
                          "3 priority fixes you can implement immediately",
                        ].map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 sm:gap-3 text-slate-300"
                          >
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400" />
                            </div>
                            <span className="text-xs sm:text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={handleContactClick}
                      className="group px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transform cursor-pointer flex items-center gap-2 sm:gap-3 mx-auto transition-all duration-300 text-base sm:text-lg shadow-2xl"
                      aria-label="Request your free conversion audit"
                    >
                      <span>Send Me the Free Audit</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>

                    <p className="mt-4 sm:mt-6 text-slate-400 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                      No pressure • No spam • Just a clear plan to get more calls
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-10 sm:py-12 px-4 sm:px-6 border-t border-slate-200 bg-white">
              <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
                  <div className="text-center md:text-left">
                    <button
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 group cursor-pointer transition-transform duration-300 hover:scale-105 mx-auto md:mx-0"
                      aria-label="Go to top"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          ConversionFlow
                        </div>
                        <div className="text-[10px] sm:text-xs text-slate-500">
                          Website Redesign
                        </div>
                      </div>
                    </button>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                      Conversion-first front-end redesign for coaches &amp;
                      consultants — turning existing traffic into booked calls
                      with clarity, trust, and flow.
                    </p>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-3 sm:gap-4">
                    <div className="text-xs sm:text-sm text-slate-500 text-center md:text-right">
                      <p>© {new Date().getFullYear()} ConversionFlow • Global Service</p>
                      <p className="mt-1">No Backend Projects • Conversion-Focused Only</p>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                      {["Coaches", "Consultants", "Conversion-First"].map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 sm:px-3 py-1 bg-slate-100 text-slate-700 text-[10px] sm:text-xs rounded-full font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </>
        )}

        

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div
              ref={contactFormRef}
              className="relative w-full max-w-lg my-auto sm:my-0 bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-slate-200 animate-fade-in-up transform overflow-hidden"
            >
              <button
                onClick={() => setShowContactForm(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors duration-200 z-10"
                aria-label="Close form"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
              </button>

              <div className="relative p-5 sm:p-6 md:p-8 overflow-y-auto max-h-[90vh]">
                {submitSuccess ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      Request Received!
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 mb-4">
                      Got it — I’ve received your request. You’ll get your audit
                      within <span className="font-semibold">8–12 hours</span>.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-5 sm:mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                        Free 5-Point Conversion Audit
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700">
                        Share your site + goals. I’ll send a clear breakdown
                        within <span className="font-semibold">8–12 hours</span>.
                      </p>
                    </div>

                    {submitError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs sm:text-sm text-red-800 flex items-center gap-2">
                          <Shield className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          {submitError}
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1 flex items-center gap-1.5">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          First name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="John"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          Best email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="john@yourdomain.com"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1 flex items-center gap-1.5">
                          <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          Your website *
                        </label>
                        <input
                          type="text"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1 flex items-center gap-1.5">
                          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          What are you trying to achieve? *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={3}
                          required
                          className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                          placeholder="Getting traffic but no booked calls..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Sending…</span>
                          </>
                        ) : (
                          <>
                            <span>Get My Audit</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Global Styles */}
        <style jsx global>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fade-in-left {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fade-in-right {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes pulse-slow {
            0%,
            100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.5;
            }
          }

          @keyframes pulse-slower {
            0%,
            100% {
              opacity: 0.2;
            }
            50% {
              opacity: 0.4;
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          .animate-fade-in-left {
            animation: fade-in-left 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          .animate-fade-in-right {
            animation: fade-in-right 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          .animate-pulse-slow {
            animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .animate-pulse-slower {
            animation: pulse-slower 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          /* Custom breakpoint for extra small devices */
          @media (min-width: 480px) {
            .xs\\:inline {
              display: inline;
            }
            .xs\\:block {
              display: block;
            }
          }

          html {
            scroll-behavior: smooth;
            scroll-padding-top: 80px;
          }

          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* ✅ Big mobile win: disable backdrop-filter on mobile (minimal visual change) */
          @media (max-width: 767px) {
            .backdrop-blur,
            .backdrop-blur-sm,
            .backdrop-blur-md,
            .backdrop-blur-lg,
            .backdrop-blur-xl,
            .backdrop-blur-2xl {
              backdrop-filter: none !important;
              -webkit-backdrop-filter: none !important;
            }

            /* Optional but usually helps LCP further */
            .animate-fade-in-up,
            .animate-fade-in-left,
            .animate-fade-in-right {
              animation: none !important;
            }

            /* Keep content visible above sticky CTA */
            body {
              padding-bottom: 92px;
            }
          }

          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: #f1f5f9;
          }

          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
            border-radius: 4px;
          }
        `}</style>
      </div>
    </>
  );
}
