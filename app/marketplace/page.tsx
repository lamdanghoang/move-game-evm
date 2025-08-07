"use client";

import { useState } from "react";
import { Search, Filter, TrendingUp, Clock, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Marketplace = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const categories = [
        "all",
        "Weapons",
        "Characters",
        "Vehicles",
        "Land",
        "Collectibles",
    ];

    const marketplaceItems = [
        {
            id: "1",
            name: "Legendary Cyber Sword",
            description: "Rare weapon with +50 damage boost",
            image: "photo-1526374965328-7f61d4dc18c5",
            price: "125 SUI",
            rarity: "Legendary",
            category: "Weapons",
            seller: "CyberWarrior",
            trending: true,
        },
        {
            id: "2",
            name: "Quantum Racing Ship",
            description: "Ultra-fast spaceship with advanced engines",
            image: "photo-1470071459604-3b5ec3a7fe05",
            price: "89 SUI",
            rarity: "Epic",
            category: "Vehicles",
            seller: "SpeedDemon",
            trending: false,
        },
        {
            id: "3",
            name: "Mystic Dragon Companion",
            description: "Loyal dragon companion with fire breath",
            image: "photo-1500673922987-e212871fec22",
            price: "200 SUI",
            rarity: "Mythic",
            category: "Characters",
            seller: "DragonMaster",
            trending: true,
        },
        {
            id: "4",
            name: "Cyber City Plot",
            description: "Prime real estate in the metaverse",
            image: "photo-1487058792275-0ad4aaf24ca7",
            price: "450 SUI",
            rarity: "Rare",
            category: "Land",
            seller: "MetaBuilder",
            trending: false,
        },
        {
            id: "5",
            name: "Mech Battle Armor",
            description: "Advanced armor with energy shields",
            image: "photo-1531297484001-80022131f5a1",
            price: "156 SUI",
            rarity: "Epic",
            category: "Weapons",
            seller: "MechPilot",
            trending: true,
        },
        {
            id: "6",
            name: "Golden Achievement Badge",
            description: "Exclusive tournament winner badge",
            image: "photo-1488590528505-98d2b5aba04b",
            price: "75 SUI",
            rarity: "Rare",
            category: "Collectibles",
            seller: "Champion",
            trending: false,
        },
    ];

    const filteredItems = marketplaceItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "all" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case "Mythic":
                return "bg-neon-pink/20 text-neon-pink";
            case "Legendary":
                return "bg-neon-purple/20 text-neon-purple";
            case "Epic":
                return "bg-neon-blue/20 text-neon-blue";
            case "Rare":
                return "bg-neon-green/20 text-neon-green";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-orbitron font-bold mb-4">
                        <span className="text-gradient">NFT Marketplace</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Trade unique in-game assets and collectibles
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-card/50 border-border/50 text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-neon-blue">
                                2.4K
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Items Listed
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50 text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-neon-green">
                                890
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Items Sold Today
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50 text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-neon-purple">
                                15.7K SUI
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Volume 24h
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50 text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-neon-pink">
                                1.2K
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Active Traders
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <div className="bg-card/50 rounded-xl p-6 mb-8 border border-border/50">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search NFTs..."
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
                                {category === "all" ? "All Items" : category}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Marketplace Items */}
                <Tabs defaultValue="trending" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="trending">Trending</TabsTrigger>
                        <TabsTrigger value="recent">
                            Recently Listed
                        </TabsTrigger>
                        <TabsTrigger value="ending">Ending Soon</TabsTrigger>
                    </TabsList>

                    <TabsContent value="trending">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.map((item, index) => (
                                <Card
                                    key={item.id}
                                    className="bg-card/50 border-border/50 card-hover animate-slide-in-up"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                    }}
                                >
                                    <CardHeader className="p-0">
                                        <div className="relative">
                                            <img
                                                src={`https://images.unsplash.com/${item.image}?w=400&h=300&fit=crop`}
                                                alt={item.name}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                            {item.trending && (
                                                <div className="absolute top-3 right-3">
                                                    <Badge className="bg-neon-green/20 text-neon-green">
                                                        <TrendingUp className="h-3 w-3 mr-1" />
                                                        Trending
                                                    </Badge>
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <Badge
                                                    className={getRarityColor(
                                                        item.rarity
                                                    )}
                                                >
                                                    {item.rarity}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <CardTitle className="text-lg mb-2">
                                            {item.name}
                                        </CardTitle>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center justify-between mb-3">
                                            <div className="text-sm text-muted-foreground">
                                                Seller:{" "}
                                                <span className="text-foreground">
                                                    {item.seller}
                                                </span>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className="bg-neon-blue/20 text-neon-blue"
                                            >
                                                {item.category}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-lg font-bold text-neon-blue">
                                                {item.price}
                                            </div>
                                            <Button className="btn-primary">
                                                <Zap className="h-4 w-4 mr-2" />
                                                Buy Now
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="recent">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems
                                .slice()
                                .reverse()
                                .map((item, index) => (
                                    <Card
                                        key={item.id}
                                        className="bg-card/50 border-border/50 card-hover animate-slide-in-up"
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                        }}
                                    >
                                        <CardHeader className="p-0">
                                            <div className="relative">
                                                <img
                                                    src={`https://images.unsplash.com/${item.image}?w=400&h=300&fit=crop`}
                                                    alt={item.name}
                                                    className="w-full h-48 object-cover rounded-t-lg"
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <Badge className="bg-neon-purple/20 text-neon-purple">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        New
                                                    </Badge>
                                                </div>
                                                <div className="absolute top-3 left-3">
                                                    <Badge
                                                        className={getRarityColor(
                                                            item.rarity
                                                        )}
                                                    >
                                                        {item.rarity}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <CardTitle className="text-lg mb-2">
                                                {item.name}
                                            </CardTitle>
                                            <p className="text-muted-foreground text-sm mb-3">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-sm text-muted-foreground">
                                                    Seller:{" "}
                                                    <span className="text-foreground">
                                                        {item.seller}
                                                    </span>
                                                </div>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-neon-blue/20 text-neon-blue"
                                                >
                                                    {item.category}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="text-lg font-bold text-neon-blue">
                                                    {item.price}
                                                </div>
                                                <Button className="btn-primary">
                                                    <Zap className="h-4 w-4 mr-2" />
                                                    Buy Now
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="ending">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.slice(0, 3).map((item, index) => (
                                <Card
                                    key={item.id}
                                    className="bg-card/50 border-border/50 card-hover animate-slide-in-up"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                    }}
                                >
                                    <CardHeader className="p-0">
                                        <div className="relative">
                                            <img
                                                src={`https://images.unsplash.com/${item.image}?w=400&h=300&fit=crop`}
                                                alt={item.name}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <Badge className="bg-destructive/20 text-destructive">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    2h left
                                                </Badge>
                                            </div>
                                            <div className="absolute top-3 left-3">
                                                <Badge
                                                    className={getRarityColor(
                                                        item.rarity
                                                    )}
                                                >
                                                    {item.rarity}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <CardTitle className="text-lg mb-2">
                                            {item.name}
                                        </CardTitle>
                                        <p className="text-muted-foreground text-sm mb-3">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center justify-between mb-3">
                                            <div className="text-sm text-muted-foreground">
                                                Seller:{" "}
                                                <span className="text-foreground">
                                                    {item.seller}
                                                </span>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className="bg-neon-blue/20 text-neon-blue"
                                            >
                                                {item.category}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-lg font-bold text-neon-blue">
                                                {item.price}
                                            </div>
                                            <Button className="btn-primary">
                                                <Zap className="h-4 w-4 mr-2" />
                                                Buy Now
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Marketplace;
