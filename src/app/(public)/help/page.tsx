import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Mail, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Help & FAQ | IBSA Homes",
    description: "Get help and find answers to frequently asked questions about IBSA Homes Property Management System.",
};

const faqs = [
    {
        question: "How do I pay my rent online?",
        answer: "You can pay your rent online safely and securely by logging into your Tenant Dashboard. Navigate to the 'Payments' section, click on 'Pay Rent', and follow the instructions to complete your payment using Paystack."
    },
    {
        question: "How do I submit a maintenance request?",
        answer: "If you need maintenance or repairs, please log into your account and go to the 'Maintenance' tab. Click 'New Request', describe the issue in detail, and optionally upload photos. Our team will review and assign a technician promptly."
    },
    {
        question: "What should I do in case of a maintenance emergency?",
        answer: "For urgent issues like severe leaks, fire, or lack of heating in winter, please call our emergency hotline immediately at +254 700 000 000. Do not use the online portal for life-threatening emergencies."
    },
    {
        question: "How can I view my lease agreement?",
        answer: "Your current lease agreement and related documents are always available in your Tenant Dashboard under the 'Profile' or 'Documents' section."
    },
    {
        question: "I am a landlord. How can I list my property?",
        answer: "If you are a landlord looking to manage your properties with IBSA Homes, please contact our support team or register as a Landlord. Once approved, you can add properties directly from your Landlord Dashboard."
    },
    {
        question: "Can I schedule a viewing of a property?",
        answer: "Yes! You can browse our available properties on the homepage and click 'Book Viewing' on any property you are interested in. One of our agents will confirm the appointment with you."
    }
];

export default function HelpPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="relative py-16 lg:py-24 overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-zinc-100 dark:border-zinc-900">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-slate-50 to-slate-50 dark:from-zinc-900 dark:via-slate-950 dark:to-slate-950 opacity-80 z-0" />
                <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center gap-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
                        <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="space-y-4 max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                            How can we <span className="text-blue-600 dark:text-blue-500">help</span> you?
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            Search our knowledge base or browse the frequently asked questions below to find answers to common inquiries.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 lg:py-24 bg-white dark:bg-slate-950 flex-1">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Frequently Asked Questions</h2>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Find quick answers to the most common questions about using IBSA Homes.
                        </p>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem key={index} value={`item-${index}`} className="border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                                    <AccordionTrigger className="text-left font-semibold text-lg hover:text-blue-600 dark:hover:text-blue-400 py-4 transition-colors">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed pb-4">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>

            {/* Still Need Help Section */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900 border-t border-zinc-100 dark:border-zinc-800">
                <div className="container mx-auto px-4 max-w-5xl text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
                        Still need help?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center group cursor-pointer hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Live Chat</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Chat with our support team in real-time.</p>
                            <span className="text-blue-600 dark:text-blue-400 font-medium text-sm mt-auto">Unavailable right now</span>
                        </div>

                        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center group transition-colors">
                            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Call Us</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Available Mon-Fri, 9am - 5pm.</p>
                            <a href="tel:+254700000000" className="text-green-600 dark:text-green-400 font-medium text-sm mt-auto hover:underline">
                                +254 700 000 000
                            </a>
                        </div>

                        <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center group transition-colors">
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Email Support</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">Get answers within 24 hours.</p>
                            <Link href="/contact" className="mt-auto">
                                <Button variant="outline" size="sm" className="w-full">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
