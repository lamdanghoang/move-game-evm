"use client";

import { useState } from "react";
import { Search, Filter, Star, Users, Play, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameCard from "@/components/features/GameCard";

const Games = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const categories = [
        "all",
        "RPG",
        "Strategy",
        "Racing",
        "Fantasy",
        "Action",
        "Simulation",
    ];

    const allGames = [
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

    const filteredGames = allGames.filter((game) => {
        const matchesSearch =
            game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || game.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-orbitron font-bold mb-4">
                        <span className="text-gradient">Game Library</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Discover the ultimate collection of blockchain games
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-card/50 rounded-xl p-6 mb-8 border border-border/50">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search games..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-background/50 border-border/50"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                Category:
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={
                                    selectedCategory === category
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                                className={
                                    selectedCategory === category
                                        ? "btn-primary"
                                        : "btn-secondary"
                                }
                            >
                                {category === "all" ? "All Games" : category}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Games Grid */}
                <Tabs defaultValue="grid" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="grid">Grid View</TabsTrigger>
                        <TabsTrigger value="list">List View</TabsTrigger>
                    </TabsList>

                    <TabsContent value="grid">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredGames.map((game, index) => (
                                <div
                                    key={game.id}
                                    className="animate-slide-in-up"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                    }}
                                >
                                    <GameCard {...game} />
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="list">
                        <div className="space-y-4">
                            {filteredGames.map((game, index) => (
                                <Card
                                    key={game.id}
                                    className="bg-card/50 border-border/50 card-hover animate-slide-in-up"
                                    style={{
                                        animationDelay: `${index * 0.05}s`,
                                    }}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-6">
                                            <img
                                                src={`https://images.unsplash.com/${game.image}?w=120&h=80&fit=crop`}
                                                alt={game.title}
                                                className="w-24 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-xl font-bold">
                                                        {game.title}
                                                    </h3>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-neon-blue/20 text-neon-blue"
                                                    >
                                                        {game.category}
                                                    </Badge>
                                                    {game.featured && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-neon-green/20 text-neon-green"
                                                        >
                                                            Featured
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-muted-foreground mb-2">
                                                    {game.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                        <span>
                                                            {game.rating}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-4 w-4 text-muted-foreground" />
                                                        <span>
                                                            {game.players.toLocaleString()}{" "}
                                                            players
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button className="btn-primary">
                                                <Play className="h-4 w-4 mr-2" />
                                                Play Now
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {filteredGames.length === 0 && (
                    <div className="text-center py-16">
                        <Gamepad2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            No games found
                        </h3>
                        <p className="text-muted-foreground">
                            Try adjusting your search or filters
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Games;
