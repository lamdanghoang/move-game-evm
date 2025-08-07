"use client";

import { useState } from "react";
import {
    User,
    Trophy,
    Star,
    Gamepad2,
    Wallet,
    Settings,
    Edit,
    Badge as BadgeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);

    const userProfile = {
        username: "CyberGamer2024",
        email: "cyber.gamer@example.com",
        walletAddress: "0x742d...f8c3",
        joinDate: "March 2024",
        avatar: "photo-1649972904349-6e44c42644a7",
        level: 42,
        experience: 28750,
        nextLevelExp: 30000,
        totalGamesPlayed: 156,
        winRate: 73,
        totalEarnings: "1,247 SUI",
        rank: 8,
        badges: [
            "Champion",
            "Elite Player",
            "Tournament Winner",
            "Early Adopter",
        ],
        favoriteGames: ["Cyber Legends", "Space Conquest", "Digital Racing"],
    };

    const gameStats = [
        {
            game: "Cyber Legends",
            image: "photo-1526374965328-7f61d4dc18c5",
            gamesPlayed: 48,
            winRate: 89,
            bestScore: 125420,
            timeSpent: "120h",
        },
        {
            game: "Space Conquest",
            image: "photo-1470071459604-3b5ec3a7fe05",
            gamesPlayed: 35,
            winRate: 71,
            bestScore: 98750,
            timeSpent: "85h",
        },
        {
            game: "Digital Racing",
            image: "photo-1488590528505-98d2b5aba04b",
            gamesPlayed: 29,
            winRate: 66,
            bestScore: 87320,
            timeSpent: "65h",
        },
    ];

    const nftCollection = [
        {
            id: "1",
            name: "Legendary Cyber Sword",
            image: "photo-1526374965328-7f61d4dc18c5",
            rarity: "Legendary",
            value: "125 SUI",
        },
        {
            id: "2",
            name: "Quantum Racing Ship",
            image: "photo-1470071459604-3b5ec3a7fe05",
            rarity: "Epic",
            value: "89 SUI",
        },
        {
            id: "3",
            name: "Mystic Dragon Companion",
            image: "photo-1500673922987-e212871fec22",
            rarity: "Mythic",
            value: "200 SUI",
        },
        {
            id: "4",
            name: "Cyber City Plot",
            image: "photo-1487058792275-0ad4aaf24ca7",
            rarity: "Rare",
            value: "450 SUI",
        },
    ];

    const achievements = [
        {
            title: "First Victory",
            description: "Win your first game",
            icon: Trophy,
            earned: true,
            date: "2024-03-15",
        },
        {
            title: "Win Streak",
            description: "Win 10 games in a row",
            icon: Star,
            earned: true,
            date: "2024-04-02",
        },
        {
            title: "Tournament Champion",
            description: "Win a tournament",
            icon: BadgeIcon,
            earned: true,
            date: "2024-05-18",
        },
        {
            title: "NFT Collector",
            description: "Own 10 unique NFTs",
            icon: Wallet,
            earned: false,
            date: null,
        },
    ];

    const getBadgeColor = (badge: string) => {
        switch (badge) {
            case "Champion":
                return "bg-yellow-500/20 text-yellow-400";
            case "Elite Player":
                return "bg-purple-500/20 text-purple-400";
            case "Tournament Winner":
                return "bg-green-500/20 text-green-400";
            case "Early Adopter":
                return "bg-blue-500/20 text-blue-400";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

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
                {/* Profile Header */}
                <div className="bg-card/50 rounded-xl p-8 mb-8 border border-border/50">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <img
                                src={`https://images.unsplash.com/${userProfile.avatar}?w=150&h=150&fit=crop&crop=face`}
                                alt={userProfile.username}
                                className="w-32 h-32 rounded-full border-4 border-neon-blue glow-blue"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-neon-blue text-background rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                {userProfile.level}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                                <h1 className="text-3xl font-orbitron font-bold text-gradient">
                                    {userProfile.username}
                                </h1>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="btn-secondary"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-neon-blue">
                                        #{userProfile.rank}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Global Rank
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neon-green">
                                        {userProfile.winRate}%
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Win Rate
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neon-purple">
                                        {userProfile.totalGamesPlayed}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Games Played
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-neon-pink">
                                        {userProfile.totalEarnings}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Total Earnings
                                    </div>
                                </div>
                            </div>

                            {/* Experience Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Level {userProfile.level}</span>
                                    <span>
                                        {userProfile.experience}/
                                        {userProfile.nextLevelExp} XP
                                    </span>
                                </div>
                                <div className="w-full bg-background rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-neon-blue to-neon-purple h-3 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${
                                                (userProfile.experience /
                                                    userProfile.nextLevelExp) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                {userProfile.badges.map((badge, index) => (
                                    <Badge
                                        key={index}
                                        className={getBadgeColor(badge)}
                                        variant="secondary"
                                    >
                                        {badge}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Content */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="games">Game Stats</TabsTrigger>
                        <TabsTrigger value="nfts">NFT Collection</TabsTrigger>
                        <TabsTrigger value="achievements">
                            Achievements
                        </TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Profile Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="bg-card/50 border-border/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-neon-blue" />
                                            Profile Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Username
                                                    </label>
                                                    <div className="text-foreground">
                                                        {userProfile.username}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Email
                                                    </label>
                                                    <div className="text-foreground">
                                                        {userProfile.email}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Wallet Address
                                                    </label>
                                                    <div className="text-foreground font-mono">
                                                        {
                                                            userProfile.walletAddress
                                                        }
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-muted-foreground">
                                                        Member Since
                                                    </label>
                                                    <div className="text-foreground">
                                                        {userProfile.joinDate}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="bg-card/50 border-border/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Gamepad2 className="h-5 w-5 text-neon-green" />
                                            Favorite Games
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {userProfile.favoriteGames.map(
                                                (game, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                                                    >
                                                        <Gamepad2 className="h-5 w-5 text-neon-blue" />
                                                        <span>{game}</span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Activity */}
                            <div>
                                <Card className="bg-card/50 border-border/50">
                                    <CardHeader>
                                        <CardTitle>Recent Activity</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                                                <Trophy className="h-5 w-5 text-yellow-400" />
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        Won Tournament
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        2 hours ago
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                                                <Star className="h-5 w-5 text-neon-purple" />
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        Level Up!
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        1 day ago
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                                                <Wallet className="h-5 w-5 text-neon-green" />
                                                <div>
                                                    <div className="text-sm font-medium">
                                                        NFT Purchase
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        3 days ago
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="games">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gameStats.map((game, index) => (
                                <Card
                                    key={game.game}
                                    className="bg-card/50 border-border/50 card-hover animate-slide-in-up"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                    }}
                                >
                                    <CardHeader className="p-0">
                                        <img
                                            src={`https://images.unsplash.com/${game.image}?w=400&h=200&fit=crop`}
                                            alt={game.game}
                                            className="w-full h-32 object-cover rounded-t-lg"
                                        />
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <CardTitle className="text-lg mb-4">
                                            {game.game}
                                        </CardTitle>

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Games Played
                                                </span>
                                                <span className="font-semibold">
                                                    {game.gamesPlayed}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Win Rate
                                                </span>
                                                <span className="font-semibold text-neon-green">
                                                    {game.winRate}%
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Best Score
                                                </span>
                                                <span className="font-semibold text-neon-blue">
                                                    {game.bestScore.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">
                                                    Time Spent
                                                </span>
                                                <span className="font-semibold text-neon-purple">
                                                    {game.timeSpent}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="nfts">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {nftCollection.map((nft, index) => (
                                <Card
                                    key={nft.id}
                                    className="bg-card/50 border-border/50 card-hover animate-slide-in-up"
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                    }}
                                >
                                    <CardHeader className="p-0">
                                        <div className="relative">
                                            <img
                                                src={`https://images.unsplash.com/${nft.image}?w=300&h=300&fit=crop`}
                                                alt={nft.name}
                                                className="w-full h-48 object-cover rounded-t-lg"
                                            />
                                            <div className="absolute top-3 right-3">
                                                <Badge
                                                    className={getRarityColor(
                                                        nft.rarity
                                                    )}
                                                    variant="secondary"
                                                >
                                                    {nft.rarity}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        <h3 className="font-bold mb-2">
                                            {nft.name}
                                        </h3>
                                        <div className="text-lg font-bold text-neon-blue">
                                            {nft.value}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="achievements">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {achievements.map((achievement, index) => (
                                <Card
                                    key={achievement.title}
                                    className={`bg-card/50 border-border/50 animate-slide-in-up ${
                                        achievement.earned
                                            ? "card-hover"
                                            : "opacity-60"
                                    }`}
                                    style={{
                                        animationDelay: `${index * 0.1}s`,
                                    }}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                                    achievement.earned
                                                        ? "bg-neon-blue/20 text-neon-blue"
                                                        : "bg-muted text-muted-foreground"
                                                }`}
                                            >
                                                <achievement.icon className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg">
                                                    {achievement.title}
                                                </h3>
                                                <p className="text-muted-foreground text-sm">
                                                    {achievement.description}
                                                </p>
                                                {achievement.earned &&
                                                    achievement.date && (
                                                        <p className="text-xs text-neon-green mt-1">
                                                            Earned on{" "}
                                                            {achievement.date}
                                                        </p>
                                                    )}
                                                {!achievement.earned && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Not earned yet
                                                    </p>
                                                )}
                                            </div>
                                            {achievement.earned && (
                                                <div className="text-neon-green">
                                                    <Trophy className="h-6 w-6" />
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="settings">
                        <div className="max-w-2xl">
                            <Card className="bg-card/50 border-border/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="h-5 w-5 text-neon-blue" />
                                        Account Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">
                                            Privacy Settings
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span>
                                                    Show profile to other
                                                    players
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="btn-secondary"
                                                >
                                                    Toggle
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>
                                                    Show gaming statistics
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="btn-secondary"
                                                >
                                                    Toggle
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>Show NFT collection</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="btn-secondary"
                                                >
                                                    Toggle
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">
                                            Notification Settings
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span>Game invitations</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="btn-secondary"
                                                >
                                                    Toggle
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>
                                                    Tournament announcements
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="btn-secondary"
                                                >
                                                    Toggle
                                                </Button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span>
                                                    Achievement notifications
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="btn-secondary"
                                                >
                                                    Toggle
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border">
                                        <Button className="btn-primary w-full">
                                            Save Settings
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Profile;
