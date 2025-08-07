import Hero from "@/components/features/Hero";
import GameCard from "@/components/features/GameCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap, Users, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

const Index = () => {
    const featuredGames = [
        {
            id: "0",
            title: "Triple Seven",
            description:
                "Triple Seven is a classic slot machine game where players spin three reels in hopes of landing lucky combinations of sevens, fruits, and other symbols to win big rewards",
            image: "https://png.pngtree.com/png-clipart/20250109/original/pngtree-classic-slot-machine-game-for-casino-lovers-png-image_19329677.png",
            rating: 5.0,
            players: 10,
            category: "Gambling",
            featured: true,
        },
    ];

    const trendingGames = [
        {
            id: "0",
            title: "Triple Seven",
            description:
                "Triple Seven is a classic slot machine game where players spin three reels in hopes of landing lucky combinations of sevens, fruits, and other symbols to win big rewards",
            image: "https://png.pngtree.com/png-clipart/20250109/original/pngtree-classic-slot-machine-game-for-casino-lovers-png-image_19329677.png",
            rating: 5.0,
            players: 15420,
            category: "Gambling",
            featured: true,
        },
    ];

    const announcements = [
        {
            title: "New Tournament Season Begins!",
            description:
                "Join the ultimate gaming championship with 100K SUI in prizes",
            date: "2024-06-10",
            badge: "Tournament",
        },
        {
            title: "Partnership with Major Gaming Studio",
            description:
                "Exciting new AAA games coming to the platform this quarter",
            date: "2024-06-08",
            badge: "Partnership",
        },
        {
            title: "NFT Marketplace Update",
            description: "Enhanced trading features and lower fees now live",
            date: "2024-06-05",
            badge: "Update",
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <Hero />

            {/* Featured Games Section */}
            <section className="py-20 bg-gradient-to-b from-background to-background/50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-orbitron font-bold mb-4">
                                <span className="text-gradient">
                                    Featured Games
                                </span>
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Discover the most popular blockchain games
                            </p>
                        </div>
                        <Link href="/games">
                            <Button className="btn-secondary">
                                View All Games
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredGames.map((game, index) => (
                            <div
                                key={game.id}
                                className="animate-slide-in-up"
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                <GameCard {...game} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Games Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex items-center mb-12">
                        <TrendingUp className="h-8 w-8 text-neon-green mr-4" />
                        <div>
                            <h2 className="text-4xl font-orbitron font-bold mb-2">
                                Trending Now
                            </h2>
                            <p className="text-muted-foreground">
                                Hot games gaining popularity
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trendingGames.map((game, index) => (
                            <div
                                key={game.id}
                                className="animate-slide-in-up"
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >
                                <GameCard {...game} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Announcements Section */}
            <section className="py-20 bg-card/30">
                <div className="container mx-auto px-4">
                    <div className="flex items-center mb-12">
                        <Zap className="h-8 w-8 text-neon-blue mr-4" />
                        <div>
                            <h2 className="text-4xl font-orbitron font-bold mb-2">
                                Latest News
                            </h2>
                            <p className="text-muted-foreground">
                                Stay updated with platform announcements
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {announcements.map((announcement, index) => (
                            <div
                                key={index}
                                className="bg-card rounded-xl p-6 border border-border/50 card-hover animate-slide-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <Badge
                                        variant="secondary"
                                        className={`${
                                            announcement.badge === "Tournament"
                                                ? "bg-neon-green/20 text-neon-green"
                                                : announcement.badge ===
                                                  "Partnership"
                                                ? "bg-neon-purple/20 text-neon-purple"
                                                : "bg-neon-blue/20 text-neon-blue"
                                        }`}
                                    >
                                        {announcement.badge}
                                    </Badge>
                                    <div className="flex items-center text-muted-foreground text-sm">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {announcement.date}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold mb-2 text-foreground">
                                    {announcement.title}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {announcement.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Community Stats */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-orbitron font-bold mb-4">
                            <span className="text-gradient">
                                Join the Community
                            </span>
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Be part of the future of gaming
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center animate-slide-in-up">
                            <div className="text-4xl font-bold text-neon-blue mb-2">
                                50K+
                            </div>
                            <div className="text-muted-foreground">
                                Registered Players
                            </div>
                        </div>
                        <div
                            className="text-center animate-slide-in-up"
                            style={{ animationDelay: "0.1s" }}
                        >
                            <div className="text-4xl font-bold text-neon-purple mb-2">
                                100+
                            </div>
                            <div className="text-muted-foreground">
                                Blockchain Games
                            </div>
                        </div>
                        <div
                            className="text-center animate-slide-in-up"
                            style={{ animationDelay: "0.2s" }}
                        >
                            <div className="text-4xl font-bold text-neon-green mb-2">
                                $5M+
                            </div>
                            <div className="text-muted-foreground">
                                Total Rewards
                            </div>
                        </div>
                        <div
                            className="text-center animate-slide-in-up"
                            style={{ animationDelay: "0.3s" }}
                        >
                            <div className="text-4xl font-bold text-neon-pink mb-2">
                                24/7
                            </div>
                            <div className="text-muted-foreground">
                                Platform Uptime
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Index;
