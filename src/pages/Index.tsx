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
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
