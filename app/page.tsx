"use client";
import { useState, useEffect, useRef } from "react";
import {
  Check,
  ArrowRight,
  Shield,
  Zap,
  Target,
  Layout,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
  Clock,
  Globe,
  BarChart3,
  MessageSquare,
  MessageCircle,
  Mail,
  User,
  Rocket,
} from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mounted, setMounted] = useState(false);
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = ["approach", "process", "scope"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      setActiveSection(current || "");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    }, 100);
  };

  const handleContactClick = () => {
    setShowContactForm(true);
    setIsMenuOpen(false);
    setSubmitError(null);
  };

  const handleProcessButtonClick = () => {
    handleNavClick("#process");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        // ✅ FIRE GOOGLE ADS CONVERSION HERE
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "conversion", {
            send_to: "AW-17933281806/Frc1CNcavfMbEI7Uo0oC",
            value: 1.0,
            currency: "EUR",
          });
        }

        setSubmitSuccess(true);

        setFormData({
          name: "",
          email: "",
          website: "",
          message: "",
        });

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
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <button
                className="flex items-center gap-3 group cursor-pointer active:scale-95 transition-transform focus:outline-none"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Go to top"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ease-out">
                    <TrendingUp className="w-6 h-6 text-white transition-transform group-hover:rotate-12 duration-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
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
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transform cursor-pointer flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                  <X className="w-6 h-6 transition-transform duration-300" />
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
              style={{
                top: "calc(100% + 0.5rem)",
              }}
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
                    className="mt-2 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300 ease-out shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2 group active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

        {/* Hero Section */}
<section className="pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
  {/* Animated Background Elements */}
  <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
  <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slower"></div>

  <div className="container mx-auto max-w-4xl text-center relative z-10">
    {/* Badge */}
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up cursor-default border border-blue-100 shadow-sm">
      <Sparkles className="w-4 h-4 animate-pulse" />
      <span>For Coaches &amp; Consultants Selling $2k+ Offers (With Traffic, But No Calls)</span>
    </div>

    {/* H1 */}
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight animate-fade-in-up animation-delay-100">
      Turn Website Visitors Into{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x">
        Booked Calls
      </span>{" "}
      — Without More Traffic
    </h1>

    {/* Subheading */}
    <p className="text-lg sm:text-xl text-slate-600 mb-6 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
      If you’re getting clicks but not consults, the issue usually isn’t your offer — it’s your site’s{" "}
      <span className="font-semibold text-slate-800">clarity, trust, and booking flow</span>. We redesign your
      front-end so the right prospects immediately “get it” and taking the next step feels effortless —{" "}
      <span className="font-semibold text-slate-800">mobile-first, fast, and conversion-led</span>.
    </p>

    {/* Scanner Bullets */}
    <div className="max-w-2xl mx-auto mb-6 animate-fade-in-up animation-delay-250">
      <div className="grid gap-3 text-left sm:text-center">
        {[
          "Identify the exact reason visitors don’t book (clarity, trust, CTA, mobile friction)",
          "Get a prioritized fix list (what to change first to increase calls)",
          "Delivered in 8–12 hours — no call required",
        ].map((t, i) => (
          <div
            key={i}
            className="flex items-start sm:items-center gap-3 justify-start sm:justify-center text-slate-700"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
              <Check className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-base sm:text-lg">{t}</span>
          </div>
        ))}
      </div>
    </div>

    {/* 🔥 Micro-Proof Strip (NEW) */}
    <div className="mb-10 animate-fade-in-up animation-delay-275">
      <div className="inline-flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <span className="text-sm sm:text-base text-slate-700 font-medium">
          Audit includes screenshots, rewritten headline suggestions, and a clear priority order.
        </span>
      </div>
    </div>

    {/* CTAs */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-300">
      <button
        onClick={handleContactClick}
        className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 ease-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transform cursor-pointer flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <span>Get My Free 5-Point Audit</span>
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300" />
      </button>

      <button
        onClick={handleProcessButtonClick}
        className="group px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 ease-out text-lg cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4 transition-transform group-hover:rotate-180 duration-700" />
          See the 2–3 Day Process
        </span>
      </button>
    </div>

    {/* Reassurance */}
    <p className="mt-4 text-sm sm:text-base text-slate-500 animate-fade-in-up animation-delay-350">
      <span className="font-medium text-slate-600">No call required.</span> You’ll receive the audit by email first.
    </p>
  </div>
</section>



        {/* Pain Points Section */}
        <section
          id="approach"
          className="py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-slate-50"
        >
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Your Website Should{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-500">
                  Sell While You Sleep
                </span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                These are the silent conversion killers that make qualified prospects bounce — even when they want what you offer.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all duration-500 ease-out shadow-lg hover:shadow-xl hover:-translate-y-2 transform cursor-default group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-3">
                    <item.icon className="w-7 h-7 text-blue-600 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors duration-300 group-hover:text-blue-700">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                  <div className="mt-6 flex items-center gap-2">
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
        <section className="py-20 px-4 sm:px-6">
          <div className="container mx-auto max-w-5xl">
            <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl p-8 sm:p-12 border border-blue-100 shadow-2xl animate-fade-in-up hover:shadow-3xl transition-shadow duration-500 ease-out">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full text-sm font-medium text-blue-700 mb-6 border border-blue-200 cursor-default transition-all duration-300 hover:scale-105">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>What You Get</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                  A Website Built to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                    Convert High-Intent Visitors
                  </span>{" "}
                  Into Calls
                </h2>

                <p className="text-lg sm:text-xl text-slate-700 mb-10 leading-relaxed">
                  We rebuild your front-end around one goal: <span className="font-semibold">booked calls</span>.
                  Clear messaging, premium positioning, and a frictionless path to action — so the right clients
                  understand your value and move forward confidently.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
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
                      className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200 hover:border-blue-300 transition-all duration-500 ease-out cursor-default hover:translate-y-1"
                    >
                      <h4 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-transform duration-300 group-hover:scale-150"></div>
                        {column.title}
                      </h4>
                      <ul className="space-y-3">
                        {column.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 group/item">
                            <div className="w-5 h-5 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-blue-200">
                              <Check className="w-3 h-3 text-blue-600 transition-transform group-hover/item:scale-110" />
                            </div>
                            <span className="text-slate-700 transition-colors duration-300 group-hover/item:text-slate-900">
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
          className="py-20 px-4 sm:px-6 bg-gradient-to-b from-white to-slate-50"
        >
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Best Fit for Coaches Who Want{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  More Calls
                </span>{" "}
                (Not More Busywork)
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                We focus on conversion-first front-end redesign — not “everything for everyone.”
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="animate-fade-in-left">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200 shadow-xl h-full transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-500 hover:rotate-12">
                      <Check className="w-6 h-6 text-white transition-transform duration-500 hover:scale-110" />
                    </div>
                    Perfect If You’re…
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Selling a premium service (coaching, consulting, done-for-you)",
                      "Getting traffic/referrals but booking is inconsistent",
                      "Ready to tighten your messaging & positioning",
                      "Tired of attracting low-quality leads and price shoppers",
                      "Looking for a mobile-first site that loads fast and drives action",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 group cursor-default">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-200">
                          <Check className="w-4 h-4 text-green-600 transition-transform group-hover:scale-110" />
                        </div>
                        <span className="text-slate-700 flex-1 transition-colors duration-300 group-hover:text-slate-900">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column */}
              <div className="animate-fade-in-right">
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border-2 border-slate-300 shadow-xl h-full transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-500 hover:rotate-12">
                      <Shield className="w-6 h-6 text-white transition-transform duration-500 hover:scale-110" />
                    </div>
                    Not a Fit If You Need…
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Custom backends or complex databases",
                      "Membership portals or LMS platforms",
                      "Large web apps or data-heavy dashboards",
                      "E-commerce with complex inventory management",
                      "Community or social network features",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 group cursor-default">
                        <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center mt-1 transition-all duration-300 group-hover:scale-110 group-hover:bg-slate-300">
                          <X className="w-4 h-4 text-slate-500 transition-transform duration-500 group-hover:rotate-180" />
                        </div>
                        <span className="text-slate-500 flex-1 transition-colors duration-300 group-hover:text-slate-700">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 p-4 bg-white/50 rounded-lg border border-slate-200 transition-all duration-300 hover:bg-white/80">
                    <p className="text-sm text-slate-600 italic">
                      “We don’t try to do everything. We specialize in conversion-focused front-end redesigns
                      that turn your current traffic into booked calls — fast.”
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-20 px-4 sm:px-6 scroll-mt-20">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Simple Process.
                </span>{" "}
                Serious Results.
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Built for busy operators: clear steps, fast execution, measurable outcomes.
              </p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-200 transform -translate-y-1/2"></div>

              <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
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
                    <div className="bg-white p-8 rounded-2xl border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-3 transform cursor-default group">
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-12">
                          {item.step}
                        </div>
                      </div>
                      <div className="pt-6 text-center">
                        <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors duration-300 group-hover:text-blue-700">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 transition-colors duration-300 group-hover:text-slate-800">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 text-center animate-fade-in-up">
              <p className="text-lg text-slate-600 mb-8">
                Want to know why your site isn’t booking calls? I’ll tell you. Free.
              </p>
              <button
                onClick={handleContactClick}
                className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 ease-out text-lg shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transform cursor-pointer flex items-center gap-3 mx-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Get free conversion audit"
              >
                <span>Get My Free 5-Point Audit</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300" />
              </button>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 sm:px-6 scroll-mt-20">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl animate-fade-in-up hover:shadow-3xl transition-shadow duration-500 ease-out overflow-hidden relative">
              <div className="absolute top-1/4 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
              <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slower"></div>

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Get a Free Audit That Shows{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                    Exactly What to Fix
                  </span>
                </h2>

                <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                  I’ll review your site and send back a short, actionable breakdown: what’s hurting conversions,
                  what to change first, and how to increase booked calls — without buying more traffic.
                </p>

                <div className="max-w-md mx-auto mb-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700 transition-all duration-300 hover:bg-slate-800/70">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400 animate-pulse" />
                    What You’ll Receive:
                  </h4>
                  <ul className="space-y-3 text-left">
                    {[
                      "Above-the-fold clarity + offer positioning",
                      "Trust + authority gaps (proof placement)",
                      "CTA + booking flow friction (mobile + desktop)",
                      "3 priority fixes you can implement immediately",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-slate-300 group">
                        <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-blue-500/40">
                          <Check className="w-3 h-3 text-blue-400 transition-transform group-hover:scale-110" />
                        </div>
                        <span className="transition-colors duration-300 group-hover:text-white">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleContactClick}
                  className="group px-10 py-4 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-300 ease-out text-lg shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transform cursor-pointer flex items-center gap-3 mx-auto animate-pulse-subtle focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Request your free conversion audit"
                >
                  <span>Send Me the Free Audit</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <p className="mt-8 text-slate-400 text-sm flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  No pressure • No spam • Just a clear plan to get more calls
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 border-t border-slate-200 bg-white">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="flex items-center gap-3 mb-3 group cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                  aria-label="Go to top"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
                    <TrendingUp className="w-6 h-6 text-white transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div>
                    <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ConversionFlow
                    </div>
                    <div className="text-xs text-slate-500">Website Redesign</div>
                  </div>
                </button>
                <p className="text-slate-600 max-w-md">
                  Conversion-first front-end redesign for coaches &amp; consultants — turning existing traffic into booked calls with clarity, trust, and flow.
                </p>
              </div>

              <div className="flex flex-col items-center md:items-end gap-4">
                <div className="text-sm text-slate-500 text-center md:text-right">
                  <p>© {new Date().getFullYear()} ConversionFlow • Global Service</p>
                  <p className="mt-1">No Backend Projects • Conversion-Focused Only</p>
                </div>
                <div className="flex gap-4">
                  {["Coaches", "Consultants", "Conversion-First"].map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full font-medium transition-all duration-300 hover:bg-slate-200 hover:scale-105"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>

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

          @keyframes pulse-subtle {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.02);
            }
          }

          @keyframes gradient-x {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
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

          .animate-pulse-subtle {
            animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }

          .animation-delay-100 {
            animation-delay: 100ms;
          }

          .animation-delay-200 {
            animation-delay: 200ms;
          }

          .animation-delay-300 {
            animation-delay: 300ms;
          }

          .animation-delay-400 {
            animation-delay: 400ms;
          }

          html {
            scroll-behavior: smooth;
            scroll-padding-top: 80px;
          }

          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
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

          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #2563eb, #7c3aed);
          }
        `}</style>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div
            ref={contactFormRef}
            className="relative w-full max-w-lg my-auto sm:my-0 bg-white rounded-2xl shadow-2xl border border-slate-200 animate-fade-in-up transform overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-indigo-100/20 to-blue-100/20 rounded-full -translate-x-20 translate-y-20"></div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowContactForm(false);
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2.5 sm:p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
              aria-label="Close form"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>

            <div
              className="relative p-4 sm:p-6 md:p-8 overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 2rem)" }}
            >
              {submitSuccess ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                    Request Received!
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                    Got it — I’ve received your request. You’ll get your audit within{" "}
                    <span className="font-semibold">8–12 hours</span> with clear, prioritized fixes to help you book more calls.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-50 text-green-800 rounded-full text-xs sm:text-sm">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    No pressure • No spam • Just a clear plan
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6 sm:mb-8">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                      <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      Free 5-Point Conversion Audit
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700">
                      Share your site + goals. I’ll send a clear breakdown within{" "}
                      <span className="font-semibold">8–12 hours</span>.
                    </p>
                  </div>

                  {submitError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 flex items-center gap-2">
                        <Shield className="w-4 h-4 flex-shrink-0" />
                        {submitError}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-800 mb-1.5 flex items-center gap-2"
                        >
                          <User className="w-4 h-4 text-blue-600" />
                          First name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none placeholder:text-gray-500 text-gray-900 text-base disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                          placeholder="John"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-800 mb-1.5 flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4 text-blue-600" />
                          Best email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none placeholder:text-gray-500 text-gray-900 text-base disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                          placeholder="john@yourdomain.com"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="website"
                          className="block text-sm font-medium text-gray-800 mb-1.5 flex items-center gap-2"
                        >
                          <Globe className="w-4 h-4 text-blue-600" />
                          Your website *
                        </label>
                        <input
                          type="text"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none placeholder:text-gray-500 text-gray-900 text-base disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-800 mb-1.5 flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4 text-blue-600" />
                          What are you trying to achieve? *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={2}
                          required
                          disabled={isSubmitting}
                          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 outline-none placeholder:text-gray-500 text-gray-900 text-base disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed resize-none"
                          placeholder='Example: “Getting traffic but no booked calls. I want more qualified inquiries for my $2k+ offer.”'
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">What you’ll receive:</p>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-2">
                              <Check className="w-3 h-3 text-blue-600 flex-shrink-0" />
                              <span className="text-blue-800">
                                A 5-point audit (clarity, trust, CTA, flow, mobile)
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-3 h-3 text-blue-600 flex-shrink-0" />
                              <span className="text-blue-800">
                                A prioritized fix list (do this first)
                              </span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="w-3 h-3 text-blue-600 flex-shrink-0" />
                              <span className="text-blue-800">
                                Optional next step if you want help implementing
                              </span>
                            </li>
                          </ul>

                          <p className="mt-2 text-blue-800">
                            <span className="font-semibold">No call required.</span> You’ll get the audit by email first.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 active:opacity-80 transition-all duration-300 ease-out shadow-lg hover:shadow-xl active:scale-95 transform cursor-pointer flex items-center justify-center gap-2 sm:gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <span>Get My Audit</span>
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-600">
                      By submitting, you agree to our privacy policy. Your data is processed securely by Formspree.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
