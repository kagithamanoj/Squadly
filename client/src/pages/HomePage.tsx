import React from "react";

import {
    CheckSquare,
    DollarSign,
    Plane,
    Calendar,
    UtensilsCrossed,
    Users,
    ArrowRight,
    Check,
    Zap,
    Shield
} from "lucide-react";

const HomePage: React.FC = () => {
    const features = [
        {
            icon: CheckSquare,
            title: "Smart Chores",
            description: "Automated task scheduling with smart rotation. Never argue about who does what.",
            color: "blue"
        },
        {
            icon: DollarSign,
            title: "Expense Splitting",
            description: "Track and split expenses instantly. Real-time balance updates for everyone.",
            color: "green"
        },
        {
            icon: Calendar,
            title: "Shared Calendar",
            description: "Sync schedules and never miss important events. Perfect for busy squads.",
            color: "purple"
        },
        {
            icon: UtensilsCrossed,
            title: "Meal Planning",
            description: "Plan meals together and create shared shopping lists automatically.",
            color: "pink"
        },
        {
            icon: Users,
            title: "Shared Living",
            description: "Manage your household with roommate coordination and shared resources.",
            color: "cyan"
        },
        {
            icon: Plane,
            title: "Trip Planning",
            description: "Plan epic adventures together. Coordinate itineraries and split travel costs.",
            color: "orange"
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section id="home" className="relative pt-20 pb-16 md:pt-28 md:pb-20 overflow-hidden">
                {/* Subtle Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Trust Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 mb-6">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-sm font-medium text-blue-400">Trusted by 10,000+ squads</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            <span className="text-white">Organize your squad's</span>{" "}
                            <span className="text-blue-500">home & adventures</span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                            The all-in-one platform for roommates and friends to manage chores,
                            split expenses, plan trips, and coordinate schedules seamlessly.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                            <button className="px-8 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-600/20">
                                Get Started Free
                            </button>
                            <a
                                href="#features"
                                className="px-8 py-3 text-base font-semibold text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors duration-200"
                            >
                                Learn More
                            </a>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-blue-500" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-blue-500" />
                                <span>Free forever plan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-blue-500" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-16 md:py-20">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Everything your squad needs
                        </h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Powerful features designed to keep your squad organized and connected.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="group p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-600/50 hover:bg-slate-800/50 transition-all duration-200"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-colors">
                                        <Icon className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                        {feature.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-blue-500 text-sm font-medium">
                                        Learn more
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative py-16 md:py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 p-8 md:p-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: "10K+", label: "Active Squads" },
                                { value: "50K+", label: "Tasks Completed" },
                                { value: "$2M+", label: "Expenses Tracked" },
                                { value: "4.9/5", label: "User Rating" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="relative py-16 md:py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Built for modern squads
                            </h2>
                            <p className="text-lg text-slate-400 mb-6 leading-relaxed">
                                Squadly brings together all the tools you need to manage shared living and plan adventures.
                                From splitting rent to coordinating group trips, we've got you covered.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Real-time sync</h4>
                                        <p className="text-slate-400 text-sm">Everyone stays updated instantly</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Shield className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Secure & private</h4>
                                        <p className="text-slate-400 text-sm">Your data is encrypted and protected</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Zap className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-1">Lightning fast</h4>
                                        <p className="text-slate-400 text-sm">Optimized for speed and performance</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-slate-700/50"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section id="contact" className="relative py-20 md:py-24 overflow-hidden">
                {/* Subtle Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Ready to organize your squad?
                    </h2>
                    <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Join thousands of squads using Squadly to manage their homes and plan unforgettable adventures.
                    </p>
                    <button className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-600/20">
                        Start Your Squad Free
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-sm text-slate-500 mt-6">
                        Free forever • No credit card required • 2-minute setup
                    </p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
