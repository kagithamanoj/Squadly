import React from "react";


const Footer: React.FC = () => {
    return (
        <footer className="relative bg-slate-900/50 border-t border-slate-800/50 py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">S</span>
                            </div>
                            <span className="text-lg font-semibold text-white">Squadly</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Organize your squad's home & adventures
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#about" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    Terms
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="pt-8 border-t border-slate-800/50">
                    <p className="text-center text-sm text-slate-500">
                        © {new Date().getFullYear()} Squadly. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
