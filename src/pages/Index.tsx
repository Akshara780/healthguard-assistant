import { Link } from "react-router-dom";
import { MessageCircle, Search, MapPin, Syringe, Bell, ArrowRight, Shield, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: MessageCircle,
    title: "AI Health Chatbot",
    description: "Get instant health guidance from our AI assistant powered by advanced language models.",
    to: "/chat",
    color: "bg-health-blue-light text-health-blue",
  },
  {
    icon: Search,
    title: "Symptom Checker",
    description: "Describe your symptoms and get AI-powered analysis with urgency recommendations.",
    to: "/symptoms",
    color: "bg-health-green-light text-health-green",
  },
  {
    icon: MapPin,
    title: "Hospital Finder",
    description: "Find nearby hospitals and clinics with details on specialties and emergency services.",
    to: "/hospitals",
    color: "bg-health-orange-light text-health-orange",
  },
  {
    icon: Syringe,
    title: "Vaccination Tracker",
    description: "Track your vaccination history and get reminders for upcoming doses.",
    to: "/vaccinations",
    color: "bg-health-blue-light text-health-blue",
  },
  {
    icon: Bell,
    title: "Health Alerts",
    description: "Stay informed about disease outbreaks, vaccination drives, and public health advisories.",
    to: "/alerts",
    color: "bg-health-red-light text-health-red",
  },
];

export default function Index() {
  return (
    <div className="pb-20 md:pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 health-gradient opacity-5" />
        <div className="container py-16 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-health-blue-light px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Shield className="h-4 w-4" />
              AI-Powered Public Health Assistant
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              Your Health,{" "}
              <span className="health-gradient-text">Guarded</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
              Get instant health guidance, check symptoms, find hospitals, and track vaccinations — all powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button asChild size="lg" className="health-gradient border-0 text-primary-foreground font-semibold">
                <Link to="/chat">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Health Chat
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/symptoms">
                  <Search className="mr-2 h-5 w-5" />
                  Check Symptoms
                </Link>
              </Button>
              <a
                href="https://wa.me/14155238886?text=Hi%20HealthGuard!%20I%20need%20health%20guidance.%0A%0A%E0%AE%B5%E0%AE%A3%E0%AE%95%E0%AF%8D%E0%AE%95%E0%AE%AE%E0%AF%8D!%20%E0%AE%A8%E0%AE%BE%E0%AE%A9%E0%AF%8D%20%E0%AE%89%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AE%B3%E0%AF%8D%20%E0%AE%89%E0%AE%A4%E0%AE%B5%E0%AE%BF%20%E0%AE%A4%E0%AF%87%E0%AE%B5%E0%AF%88."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-[#25D366] hover:bg-[#1da851] transition-colors shadow-lg"
                title="Chat on WhatsApp (Tamil & English)"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">Everything You Need</h2>
          <p className="text-muted-foreground">Comprehensive health tools at your fingertips</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link to={feature.to}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-4`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                    <span className="inline-flex items-center text-sm font-medium text-primary">
                      Get started <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="container pb-12">
        <Card className="border-health-blue/20 bg-health-blue-light/50">
          <CardContent className="p-6 flex items-start gap-4">
            <Heart className="h-8 w-8 text-health-red shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Important Health Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                HealthGuard provides general health information and is not a substitute for professional medical advice,
                diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider
                with any questions you may have regarding a medical condition. In case of emergency, call your local emergency number immediately.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
