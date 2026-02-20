import { Mail, MapPin, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata = {
    title: "Contact Us | IBSA Homes",
    description: "Get in touch with IBSA Homes and Real Estate Property Management System.",
};

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="relative py-16 lg:py-24 overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-zinc-100 dark:border-zinc-900">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-slate-50 to-slate-50 dark:from-zinc-900 dark:via-slate-950 dark:to-slate-950 opacity-80 z-0" />
                <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center gap-6">
                    <div className="space-y-4 max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Get in <span className="text-zinc-500 dark:text-zinc-400">Touch</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            We'd love to hear from you. Whether you have a question about our properties,
                            services, or anything else, our team is ready to answer all your questions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Content Section */}
            <section className="py-16 bg-white dark:bg-slate-950 flex-1">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                        {/* Left Column: Contact Information */}
                        <div className="space-y-10">
                            <div>
                                <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Contact Information</h2>
                                <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed mb-8">
                                    Fill out the form and our team will get back to you within 24 hours.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center shrink-0">
                                        <Building className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Company</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400">IBSA Homes and Real Estate Property Management</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Office Location</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400">
                                            Marsabit Central, Kenya
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Email Us</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400">info@ibsahomes.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center shrink-0">
                                        <Phone className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Call Us</h3>
                                        <p className="text-zinc-600 dark:text-zinc-400">+254 700 000 000</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Contact Form */}
                        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 md:p-10 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">Send us a message</h3>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="firstName" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            First name
                                        </label>
                                        <Input id="firstName" placeholder="John" className="bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="lastName" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                            Last name
                                        </label>
                                        <Input id="lastName" placeholder="Doe" className="bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 h-12" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                        Email address
                                    </label>
                                    <Input id="email" type="email" placeholder="john@example.com" className="bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 h-12" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                        Subject
                                    </label>
                                    <Input id="subject" placeholder="How can we help you?" className="bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 h-12" />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                        Message
                                    </label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us more about your inquiry..."
                                        className="min-h-[150px] resize-y bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800"
                                    />
                                </div>

                                <Button type="button" size="lg" className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 font-semibold text-base mt-4 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                    Send Message
                                </Button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
