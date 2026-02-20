import Link from "next/link";
import { Users, Target, Heart, Award, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "About Us | IBSA Homes",
    description: "Learn more about IBSA Homes, our mission, values, and our dedication to providing exceptional property management services.",
};

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen pt-20">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-32 overflow-hidden bg-slate-50 dark:bg-slate-950 border-b border-zinc-100 dark:border-zinc-900">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-slate-50 to-slate-50 dark:from-zinc-900 dark:via-slate-950 dark:to-slate-950 opacity-80 z-0" />
                <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center gap-6">
                    <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 mb-4 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                        About Us
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-4xl">
                        Redefining <span className="text-zinc-500 dark:text-zinc-400">Property Management</span> for Everyone
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mt-4">
                        At IBSA Homes, we believe that finding a home or managing a property shouldn't be a hassle.
                        We blend innovative technology with personalized service to create seamless experiences for tenants, landlords, and agents alike.
                    </p>
                </div>
            </section>

            {/* Our Story / Mission Section */}
            <section className="py-24 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2 space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Our Story</h2>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                                    Founded with the vision to simplify real estate operations, IBSA Homes started as a small team of industry experts who recognized a glaring gap in the market: the lack of intuitive, transparent, and efficient property management systems.
                                </p>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    We built our platform from the ground up to address the unique pain points of everyday renting and leasing. Today, we empower hundreds of property owners to maximize their investments while ensuring tenants enjoy comfortable, well-maintained homes with 24/7 support.
                                </p>
                            </div>
                        </div>

                        {/* Visual Grid representing "Story/Growth" */}
                        <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-8 aspect-square flex flex-col justify-center items-center text-center border border-zinc-200 dark:border-zinc-800">
                                    <h3 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 mb-2">500+</h3>
                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Properties Managed</p>
                                </div>
                                <div className="bg-zinc-950 dark:bg-zinc-100 rounded-2xl p-8 aspect-[4/3] flex flex-col justify-center items-center text-center shadow-lg">
                                    <h3 className="text-4xl font-black text-white dark:text-zinc-900 mb-2">98%</h3>
                                    <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Client Satisfaction</p>
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-8 aspect-[4/3] flex flex-col justify-center items-center text-center border border-zinc-200 dark:border-zinc-800">
                                    <h3 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 mb-2">24/7</h3>
                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Support Access</p>
                                </div>
                                <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-8 aspect-square flex flex-col justify-center items-center text-center border border-zinc-200 dark:border-zinc-800">
                                    <h3 className="text-4xl font-black text-zinc-900 dark:text-zinc-50 mb-2">10+</h3>
                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Years Experience</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-24 bg-zinc-50 dark:bg-zinc-900/40 border-t border-zinc-100 dark:border-zinc-900">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">Our Core Values</h2>
                        <p className="text-zinc-600 dark:text-zinc-400">
                            The principles that guide our everyday decisions and shape the way we serve our community.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Value 1 */}
                        <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Shield className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-50">Trust & Transparency</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                                We communicate openly and honestly, ensuring you never encounter hidden fees or unexpected surprises.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Target className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-50">Excellence</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                                We hold ourselves to the highest standards, delivering premium service and meticulously maintained properties.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Users className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-50">Community First</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                                We build more than just portfolios; we foster vibrant, inclusive communities where people want to live and thrive.
                            </p>
                        </div>

                        {/* Value 4 */}
                        <div className="bg-white dark:bg-zinc-950 p-8 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Heart className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-50">Empathy</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                                We listen, understand, and act with compassion. Your home is your sanctuary, and we treat it with the respect it deserves.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet the Team Placeholder (Optional but good for About Us pages) */}
            <section className="py-24 bg-white dark:bg-zinc-950">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-16">Leadership</h2>
                    <div className="flex flex-wrap justify-center gap-12">
                        {/* Team Member 1 */}
                        <div className="flex flex-col items-center">
                            <div className="w-32 h-32 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-4 overflow-hidden border-4 border-white dark:border-zinc-900 shadow-lg flex items-center justify-center">
                                <span className="text-3xl text-zinc-400 dark:text-zinc-600 font-bold">LP</span>
                            </div>
                            <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">LIBAN PHILIP</h4>
                            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">CEO & Founder</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-zinc-950 dark:bg-zinc-950 border-t border-zinc-800 text-zinc-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-800/50 via-zinc-950 to-zinc-950 opacity-50 z-0" />
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Experience the Difference</h2>
                    <p className="text-zinc-400 mb-10 max-w-2xl mx-auto text-lg">
                        Whether you are looking for your next home or need a reliable partner to manage your property, our team is ready to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/properties">
                            <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-300 font-bold px-8 h-12 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
                                Find a Property
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg" className="border-zinc-700 hover:bg-zinc-800 text-zinc-50 hover:text-white px-8 h-12 rounded-full transition-all w-full sm:w-auto">
                                Partner With Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
