import { Play, Zap, Gamepad2, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 grid-pattern opacity-30"></div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 animate-float">
                <div className="w-20 h-20 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-full glow-blue"></div>
            </div>
            <div
                className="absolute top-40 right-20 animate-float"
                style={{ animationDelay: "1s" }}
            >
                <div className="w-16 h-16 bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-full glow-purple"></div>
            </div>
            <div
                className="absolute bottom-40 left-20 animate-float"
                style={{ animationDelay: "2s" }}
            >
                <div className="w-12 h-12 bg-gradient-to-br from-neon-green/20 to-neon-blue/20 rounded-full"></div>
            </div>

            {/* Hero Content */}
            <div className="container mx-auto p-4 text-center relative z-10">
                <div className="max-w-4xl mx-auto animate-slide-in-up">
                    {/* Main Headline */}
                    <h1 className="text-6xl md:text-8xl font-orbitron font-black mb-6">
                        <span className="text-gradient animate-gradient">
                            NEXT-GEN
                        </span>
                        <br />
                        <span className="text-foreground">BLOCKCHAIN</span>
                        <br />
                        <span className="text-6xl md:text-8xl text-neon-blue animate-pulse-glow">
                            GAMING
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto font-exo">
                        Experience the future of gaming on the Sui blockchain.
                        Play, earn, and own your digital assets in revolutionary
                        games.
                    </p>

                    {/* Stats */}
                    <div
                        className="flex flex-wrap justify-center gap-8 mb-12 animate-slide-in-up"
                        style={{ animationDelay: "0.3s" }}
                    >
                        <div className="text-center">
                            <div className="text-3xl font-bold text-neon-blue">
                                10K+
                            </div>
                            <div className="text-muted-foreground">
                                Active Players
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-neon-purple">
                                50+
                            </div>
                            <div className="text-muted-foreground">
                                Blockchain Games
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-neon-green">
                                $2M+
                            </div>
                            <div className="text-muted-foreground">
                                Rewards Distributed
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                        className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-up"
                        style={{ animationDelay: "0.6s" }}
                    >
                        <Link href="/games">
                            <Button
                                size="lg"
                                className="btn-primary text-lg px-8 py-4"
                            >
                                <Play className="h-5 w-5 mr-2" />
                                Start Playing
                            </Button>
                        </Link>
                        <Link href="/wallet">
                            <Button
                                size="lg"
                                variant="outline"
                                className="btn-secondary text-lg px-8 py-4"
                            >
                                <Zap className="h-5 w-5 mr-2" />
                                Connect Wallet
                            </Button>
                        </Link>
                    </div>

                    {/* Features Grid */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-slide-in-up"
                        style={{ animationDelay: "0.9s" }}
                    >
                        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 card-hover">
                            <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <Gamepad2 className="h-6 w-6 text-background" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Play & Earn
                            </h3>
                            <p className="text-muted-foreground">
                                Earn real value while playing your favorite
                                blockchain games
                            </p>
                        </div>

                        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 card-hover">
                            <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <Zap className="h-6 w-6 text-background" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Own Assets
                            </h3>
                            <p className="text-muted-foreground">
                                True ownership of in-game items and characters
                                as NFTs
                            </p>
                        </div>

                        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 card-hover">
                            <div className="w-12 h-12 bg-gradient-to-br from-neon-green to-neon-blue rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <Trophy className="h-6 w-6 text-background" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Compete</h3>
                            <p className="text-muted-foreground">
                                Join tournaments and climb leaderboards for epic
                                rewards
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
