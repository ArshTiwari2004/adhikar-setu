import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  TreePine,
  Users,
  MapPin,
  Database,
  BarChart3,
  Shield,
  Github,
  LogIn,
  Mail,
  Phone,
  MapIcon,
  ExternalLink,
  Twitter,
  Linkedin,
  FileText,
  Globe,
  BookOpen,
  Scale,
} from "lucide-react";
import digitalMap from "@/assets/digital-map.jpg";
import tribalCommunity from "@/assets/tribal-community.png";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleElements, setVisibleElements] = useState(new Set());
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const workRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements((prev) =>
            new Set(prev).add(entry.target.dataset.animate)
          );
        }
      });
    }, observerOptions);

    // Observe elements
    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observer.observe(el));

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const isVisible = (elementId) => visibleElements.has(elementId);

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideInFromRight {
            from { opacity: 0; transform: translateX(100px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInFromLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes popOut {
            0% { transform: translateZ(0) scale(1); box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            100% { transform: translateZ(20px) scale(1.05); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
          }
          @keyframes parallaxRotate {
            0% { transform: rotateX(-5deg) rotateY(-10deg) translateY(0px); opacity: 0.8; }
            50% { transform: rotateX(0deg) rotateY(0deg) translateY(-20px); opacity: 1; }
            100% { transform: rotateX(5deg) rotateY(10deg) translateY(-40px); opacity: 0.9; }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          .animate-slide-right {
            animation: slideInFromRight 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          .animate-slide-left {
            animation: slideInFromLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          .animate-pop-out:hover {
            animation: popOut 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          .parallax-card {
            animation: parallaxRotate 2s ease-in-out infinite alternate;
            transform-style: preserve-3d;
          }
          
          .glass-content {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          
          .hero-bg {
            background-image: url('${tribalCommunity}');
            background-size: cover;
            background-position: center;
            position: relative;
          }
          .hero-bg::before {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(2px);
          }
          .hero-bg::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(59, 130, 246, 0.2));
          }
          
          .work-item {
            opacity: 0;
            transform: translateX(-50px);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .work-item.visible {
            opacity: 1;
            transform: translateX(0);
          }
          .work-item:nth-child(1).visible { transition-delay: 0.1s; }
          .work-item:nth-child(2).visible { transition-delay: 0.2s; }
          .work-item:nth-child(3).visible { transition-delay: 0.3s; }
          .work-item:nth-child(4).visible { transition-delay: 0.4s; }

          .card-stagger:nth-child(1) { animation-delay: 0.1s; }
          .card-stagger:nth-child(2) { animation-delay: 0.2s; }
          .card-stagger:nth-child(3) { animation-delay: 0.3s; }
          .card-stagger:nth-child(4) { animation-delay: 0.4s; }
          .card-stagger:nth-child(5) { animation-delay: 0.5s; }
          .card-stagger:nth-child(6) { animation-delay: 0.6s; }

          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>

      <div className="min-h-screen bg-ivory-white font-sans">
        {/* Header */}
        <header className="border-b border-light-gray bg-ivory-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
              <div className="flex items-center space-x-3">
                <TreePine
                  className="h-8 w-8 text-forest-green transition-transform hover:scale-110"
                  aria-hidden="true"
                />
                <span className="text-2xl font-extrabold text-warm-gray tracking-tight">
                  Adhikar Setu
                </span>
              </div>

              <nav className="hidden md:flex items-center space-x-10">
                <a
                  href="#about"
                  className="text-warm-gray hover:text-forest-green transition-all hover:scale-105 text-lg font-medium"
                >
                  About FRA
                </a>
                <a
                  href="#work"
                  className="text-warm-gray hover:text-forest-green transition-all hover:scale-105 text-lg font-medium"
                >
                  Our Work
                </a>
                <a
                  href="#impact"
                  className="text-warm-gray hover:text-forest-green transition-all hover:scale-105 text-lg font-medium"
                >
                  Impact
                </a>
                <a
                  href="#contact"
                  className="text-warm-gray hover:text-forest-green transition-all hover:scale-105 text-lg font-medium"
                >
                  Contact
                </a>
              </nav>

              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com/ArshTiwari2004/adhikar-setu"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex items-center space-x-2 bg-ivory-white/80 border-light-gray text-warm-gray hover:bg-light-gray animate-pop-out rounded-full"
                  >
                    <Github className="h-4 w-4" />
                    <span>Star Repo</span>
                  </Button>
                </a>

                <Link to="/login">
                  <Button
                    size="sm"
                    className="flex items-center space-x-2 bg-forest-green hover:bg-forest-green/90 text-ivory-white animate-pop-out rounded-full"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section with Background Image */}
        <section
          className="py-24 lg:py-32 hero-bg relative overflow-hidden"
          ref={heroRef}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="glass-content space-y-6">
                  <Badge
                    variant="secondary"
                    className="w-fit bg-lime-green/20 text-white border-lime-green/30 backdrop-blur-sm"
                  >
                    Forest Rights Act 2006
                  </Badge>
                  <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight">
                    Adhikar Setu
                  </h1>
                  <p className="text-xl lg:text-2xl text-white font-medium">
                    Bridging Forest Rights with Communities
                  </p>
                  <p className="text-lg text-white/90 leading-relaxed">
                    Empowering tribal and forest-dwelling communities through
                    digital transformation of the Forest Rights Act. We're
                    building an AI-powered platform to digitize FRA claims,
                    create interactive atlases, and enable data-driven decision
                    making for sustainable forest governance.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 relative z-20">
                  <a
                    href="https://www.fra.org.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      className="text-lg px-8 bg-forest-green hover:bg-forest-green/90 text-ivory-white animate-pop-out rounded-full transform-gpu"
                    >
                      Learn About FRA
                    </Button>
                  </a>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg px-8 bg-white/20 border-white/30 text-white hover:bg-white/30 animate-pop-out rounded-full backdrop-blur-sm"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About FRA Section with Enhanced Parallax */}
        <section
          id="about"
          className="py-20 bg-ivory-white/80 backdrop-blur-sm overflow-hidden"
          ref={aboutRef}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16" data-animate="about-header">
              <h2
                className={`text-4xl lg:text-5xl font-extrabold text-warm-gray mb-4 tracking-tight transform-gpu ${
                  isVisible("about-header") ? "animate-fade-in" : "opacity-0"
                }`}
              >
                Understanding the Forest Rights Act
              </h2>
              <p
                className={`text-xl text-warm-gray max-w-3xl mx-auto font-medium transform-gpu ${
                  isVisible("about-header") ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                The Forest Rights Act (2006) recognizes the rights of
                forest-dwelling communities to land and resources, but
                implementation faces significant challenges.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                {
                  icon: Shield,
                  title: "Land Rights Recognition",
                  description:
                    "Recognizing Individual Forest Rights (IFR) and Community Rights (CR) for forest-dwelling communities who have been living in forests for generations.",
                  id: "card-1",
                },
                {
                  icon: Users,
                  title: "Community Empowerment",
                  description:
                    "Empowering tribal communities with legal recognition of their traditional rights and sustainable forest resource management practices.",
                  id: "card-2",
                },
                {
                  icon: TreePine,
                  title: "Sustainable Forests",
                  description:
                    "Promoting sustainable forest management through Community Forest Resource Rights (CFR) that balance conservation with community needs.",
                  id: "card-3",
                },
                {
                  icon: FileText,
                  title: "Legal Framework",
                  description:
                    "Establishing comprehensive legal provisions for recognition of forest dwellers' rights and their role in forest conservation.",
                  id: "card-4",
                },
                {
                  icon: Globe,
                  title: "Resource Management",
                  description:
                    "Enabling sustainable use of forest resources including timber, non-timber forest produce, and grazing rights.",
                  id: "card-5",
                },
                {
                  icon: Scale,
                  title: "Justice & Equity",
                  description:
                    "Ensuring historical injustices to forest communities are addressed through proper recognition and compensation mechanisms.",
                  id: "card-6",
                },
              ].map((card, index) => {
                const Icon = card.icon;
                return (
                  <Card
                    key={card.id}
                    data-animate={card.id}
                    className={`border-light-gray bg-ivory-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-700 transform-gpu card-stagger ${
                      isVisible(card.id)
                        ? "animate-fade-in parallax-card"
                        : "opacity-0"
                    }`}
                    style={{
                      transform: `translateY(${
                        scrollY * 0.02 * (index + 1)
                      }px) rotateX(${Math.sin(scrollY * 0.01) * 5}deg)`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <CardHeader>
                      <Icon className="h-12 w-12 text-forest-green mb-4 hover:animate-pulse" />
                      <CardTitle className="text-warm-gray font-semibold text-xl">
                        {card.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-lg text-warm-gray leading-relaxed">
                        {card.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* What We're Doing Section with Enhanced Animations */}
        <section
          id="work"
          className="py-20 bg-gradient-radial from-lime-green/10 to-ivory-white overflow-hidden"
          ref={workRef}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16" data-animate="work-header">
              <h2
                className={`text-4xl lg:text-5xl font-extrabold text-warm-gray mb-4 tracking-tight transform-gpu ${
                  isVisible("work-header") ? "animate-fade-in" : "opacity-0"
                }`}
              >
                Our Digital Transformation Initiative
              </h2>
              <p
                className={`text-xl text-warm-gray max-w-3xl mx-auto font-medium transform-gpu ${
                  isVisible("work-header") ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                Leveraging AI, satellite data, and modern technology to
                revolutionize FRA implementation and monitoring.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {[
                  {
                    icon: Database,
                    title: "Data Digitization & Standardization",
                    description:
                      "Converting legacy FRA records into standardized digital formats using AI-powered OCR and Named Entity Recognition to extract village names, patta holders, and claim status.",
                    id: "work-1",
                  },
                  {
                    icon: MapPin,
                    title: "Interactive FRA Atlas",
                    description:
                      "Creating a comprehensive WebGIS platform with interactive layers showing IFR/CR boundaries, village data, land-use patterns, and real-time progress tracking.",
                    id: "work-2",
                  },
                  {
                    icon: BarChart3,
                    title: "AI-Powered Asset Mapping",
                    description:
                      "Using satellite imagery and computer vision to map agricultural land, forest cover, water bodies, and infrastructure in FRA villages for better resource planning.",
                    id: "work-3",
                  },
                  {
                    icon: ExternalLink,
                    title: "Decision Support System",
                    description:
                      "Building an intelligent DSS to recommend and layer Central Sector Schemes benefits for FRA patta holders, enabling targeted development interventions.",
                    id: "work-4",
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      data-animate={item.id}
                      className={`flex items-start space-x-4 hover:bg-lime-green/20 p-4 rounded-2xl transition-all duration-500 work-item ${
                        isVisible(item.id) ? "visible" : ""
                      }`}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-forest-green rounded-full flex items-center justify-center hover:rotate-6 transition-transform">
                        <Icon className="h-6 w-6 text-ivory-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-warm-gray mb-2">
                          {item.title}
                        </h3>
                        <p className="text-warm-gray text-lg leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                className="relative"
                ref={imageRef}
                data-animate="work-image"
              >
                <img
                  src={digitalMap}
                  alt="Digital FRA Atlas interface"
                  className={`rounded-3xl shadow-2xl w-full h-auto transform-gpu transition-all duration-1000 ${
                    isVisible("work-image")
                      ? "animate-slide-right"
                      : "opacity-0 translate-x-20"
                  }`}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Impact Numbers Section */}
        <section
          id="impact"
          className="py-20 bg-ivory-white/80 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16" data-animate="impact-header">
              <h2
                className={`text-4xl lg:text-5xl font-extrabold text-warm-gray mb-4 tracking-tight transform-gpu ${
                  isVisible("impact-header") ? "animate-fade-in" : "opacity-0"
                }`}
              >
                Our Impact & Reach
              </h2>
              <p
                className={`text-xl text-warm-gray max-w-2xl mx-auto font-medium transform-gpu ${
                  isVisible("impact-header") ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                Transforming forest governance through technology and community
                empowerment.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { number: "50+", label: "Villages Mapped", id: "stat-1" },
                { number: "100+", label: "FRA Claims Digitized", id: "stat-2" },
                { number: "100+", label: "People Reached", id: "stat-3" },
                { number: "4", label: "States Covered", id: "stat-4" },
              ].map((stat, index) => (
                <div
                  key={stat.id}
                  data-animate={stat.id}
                  className={`text-center bg-ivory-white/80 shadow-sm rounded-2xl p-6 transform-gpu transition-all duration-700 ${
                    isVisible(stat.id) ? "animate-fade-in" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-5xl font-bold text-lime-green mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg text-warm-gray font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 bg-gradient-to-br from-lime-green/10 to-forest-green/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="max-w-2xl mx-auto text-center"
              data-animate="newsletter"
            >
              <h2
                className={`text-4xl lg:text-5xl font-extrabold text-warm-gray mb-4 tracking-tight transform-gpu ${
                  isVisible("newsletter") ? "animate-fade-in" : "opacity-0"
                }`}
              >
                Stay Updated on FRA Rights & Our Initiatives
              </h2>
              <p
                className={`text-lg text-warm-gray mb-8 font-medium transform-gpu ${
                  isVisible("newsletter") ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ animationDelay: "0.2s" }}
              >
                Get the latest updates on forest rights, policy changes, and our
                technology initiatives delivered to your inbox.
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-4 max-w-md mx-auto transform-gpu ${
                  isVisible("newsletter") ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ animationDelay: "0.4s" }}
              >
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 border-light-gray bg-ivory-white/80 focus:ring-2 focus:ring-sky-blue rounded-full"
                />
                <Button
                  size="lg"
                  className="px-8 bg-forest-green hover:bg-forest-green/90 text-ivory-white animate-pop-out rounded-full"
                >
                  Subscribe
                </Button>
              </div>

              <p
                className={`text-sm text-warm-gray mt-4 font-medium transform-gpu ${
                  isVisible("newsletter") ? "animate-fade-in" : "opacity-0"
                }`}
                style={{ animationDelay: "0.6s" }}
              >
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-t from-light-gray to-ivory-white border-t border-light-gray">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-12">
              {/* Brand Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-forest-green to-lime-green rounded-lg shadow-sm">
                    <TreePine className="h-6 w-6 text-ivory-white" />
                  </div>
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-forest-green to-lime-green bg-clip-text text-transparent tracking-tight">
                    Adhikar Setu
                  </span>
                </div>
                <p className="text-warm-gray text-sm leading-relaxed font-medium">
                  Bridging forest rights with communities through technology and
                  empowerment.
                </p>

                <div className="flex space-x-4 pt-2">
                  <a
                    href="https://github.com/ArshTiwari2004/adhikar-setu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-ivory-white/80 rounded-lg shadow-sm border border-light-gray text-warm-gray hover:text-ivory-white hover:bg-forest-green hover:scale-110 transition-all duration-300"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-ivory-white/80 rounded-lg shadow-sm border border-light-gray text-warm-gray hover:text-ivory-white hover:bg-sky-blue hover:scale-110 transition-all duration-300"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-ivory-white/80 rounded-lg shadow-sm border border-light-gray text-warm-gray hover:text-ivory-white hover:bg-sky-blue hover:scale-110 transition-all duration-300"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-warm-gray mb-4 text-lg tracking-tight relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-forest-green after:to-lime-green">
                  Quick Links
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="#about"
                      className="text-warm-gray hover:text-forest-green transition-all hover:scale-105 flex items-center group text-sm font-medium"
                    >
                      <span className="w-2 h-2 bg-lime-green/20 rounded-full mr-2 group-hover:bg-forest-green transition-colors"></span>
                      About FRA
                    </a>
                  </li>
                  <li>
                    <a
                      href="#work"
                      className="text-warm-gray hover:text-forest-green transition-all hover:scale-105 flex items-center group text-sm font-medium"
                    >
                      <span className="w-2 h-2 bg-lime-green/20 rounded-full mr-2 group-hover:bg-forest-green transition-colors"></span>
                      Our Work
                    </a>
                  </li>
                  <li>
                    <a
                      href="#impact"
                      className="text-warm-gray hover:text-forest-green transition-all hover:scale-105 flex items-center group text-sm font-medium"
                    >
                      <span className="w-2 h-2 bg-lime-green/20 rounded-full mr-2 group-hover:bg-forest-green transition-colors"></span>
                      Impact
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      className="text-warm-gray hover:text-forest-green transition-all hover:scale-105 flex items-center group text-sm font-medium"
                    >
                      <span className="w-2 h-2 bg-lime-green/20 rounded-full mr-2 group-hover:bg-forest-green transition-colors"></span>
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-semibold text-warm-gray mb-4 text-lg tracking-tight relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-forest-green after:to-lime-green">
                  Resources
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://www.fra.org.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-warm-gray hover:text-forest-green transition-all hover:scale-105 flex items-center group text-sm font-medium"
                    >
                      <span className="w-2 h-2 bg-lime-green/20 rounded-full mr-2 group-hover:bg-forest-green transition-colors"></span>
                      FRA Guidelines
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-warm-gray hover:text-forest-green transition-all hover:scale-105 flex items-center group text-sm font-medium"
                    >
                      <span className="w-2 h-2 bg-lime-green/20 rounded-full mr-2 group-hover:bg-forest-green transition-colors"></span>
                      Documentation
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-semibold text-warm-gray mb-4 text-lg tracking-tight relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-forest-green after:to-lime-green">
                  Contact
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3 text-warm-gray text-sm font-medium">
                    <div className="flex-shrink-0 w-8 h-8 bg-lime-green/10 rounded-lg flex items-center justify-center mt-0.5 hover:animate-bounce">
                      <Mail className="h-4 w-4 text-forest-green" />
                    </div>
                    <span>arshtiwari12345@gmail.com</span>
                  </li>
                  <li className="flex items-start space-x-3 text-warm-gray text-sm font-medium">
                    <div className="flex-shrink-0 w-8 h-8 bg-lime-green/10 rounded-lg flex items-center justify-center mt-0.5 hover:animate-bounce">
                      <Phone className="h-4 w-4 text-forest-green" />
                    </div>
                    <span>+91 11 2345 6789</span>
                  </li>
                  <li className="flex items-start space-x-3 text-warm-gray text-sm font-medium">
                    <div className="flex-shrink-0 w-8 h-8 bg-lime-green/10 rounded-lg flex items-center justify-center mt-0.5 hover:animate-bounce">
                      <MapIcon className="h-4 w-4 text-forest-green" />
                    </div>
                    <span>New Delhi, India</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-light-gray mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between">
              <p className="text-warm-gray text-sm font-medium">
                © 2025{" "}
                <span className="font-semibold text-warm-gray">
                  Adhikar Setu
                </span>
                . All Rights Reserved.
              </p>
              <p className="mt-4 sm:mt-0 text-sm text-warm-gray font-medium flex items-center">
                Built for empowering tribal communities & sustainable forest
                governance
                <span className="ml-2 text-forest-green">🌱</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
