import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/about-us" className="hover:text-foreground transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/help-support" className="hover:text-foreground transition-colors">Help & Support</Link></li>
                            <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                            <li><Link to="/report-block-functionality" className="hover:text-foreground transition-colors">Report & Block</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/cookie-policy" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
                            <li><Link to="/community-guidelines" className="hover:text-foreground transition-colors">Community Guidelines</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Policies</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/refund-policy" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
                            <li><Link to="/cancellation-policy" className="hover:text-foreground transition-colors">Cancellation Policy</Link></li>
                            <li><Link to="/safety-and-security" className="hover:text-foreground transition-colors">Safety & Security</Link></li>
                        </ul>
                    </div>

                </div>
                <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
