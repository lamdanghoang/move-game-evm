import { useState } from "react";
import { Trophy, Crown, Medal, Star, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const Leaderboard = () => {
    const topPlayers = [
        {
            rank: 1,
            username: "CyberKing",
            score: 125420,
            gamesPlayed: 48,
            winRate: 89,
            avatar: "photo-1649972904349-6e44c42644a7",
            badges: ["Champion", "Legendary"],
            change: "+2",
        },
        {
            rank: 2,
            username: "QuantumGamer",
            score: 118750,
            gamesPlayed: 52,
            winRate: 85,
            avatar: "photo-1488590528505-98d2b5aba04b",
            badges: ["Elite", "Veteran"],
            change: "-1",
        },
        {
            rank: 3,
            username: "NeonMaster",
            score: 112340,
            gamesPlayed: 45,
            winRate: 87,
            avatar: "photo-1526374965328-7f61d4dc18c5",
            badges: ["Master", "Rising Star"],
            change: "+1",
        },
        {
            rank: 4,
            username: "DigitalWarrior",
            score: 108960,
            gamesPlayed: 41,
            winRate: 82,
            avatar: "photo-1470071459604-3b5ec3a7fe05",
            badges: ["Expert"],
            change: "0",
        },
        {
            rank: 5,
            username: "MetaViking",
            score: 105480,
            gamesPlayed: 39,
            winRate: 84,
            avatar: "photo-1500673922987-e212871fec22",
            badges: ["Champion"],
            change: "+3",
        },
    ];

    const allPlayers = [
        ...topPlayers,
        {
            rank: 6,
            username: "CryptoNinja",
            score: 98750,
            gamesPlayed: 36,
            winRate: 79,
            avatar: "photo-1531297484001-80022131f5a1",
            badges: ["Expert"],
            change: "-2",
        },
        {
            rank: 7,
            username: "BlockchainBeast",
            score: 92340,
            gamesPlayed: 34,
            winRate: 77,
            avatar: "photo-1487058792275-0ad4aaf24ca7",
            badges: ["Rising Star"],
            change: "+1",
        },
        {
            rank: 8,
            username: "SpaceExplorer",
            score: 89120,
            gamesPlayed: 32,
            winRate: 75,
            avatar: "photo-1500375592092-40eb2168fd21",
            badges: ["Veteran"],
            change: "0",
        },
    ];

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="h-6 w-6 text-yellow-400" />;
            case 2:
                return <Medal className="h-6 w-6 text-gray-400" />;
            case 3:
                return <Medal className="h-6 w-6 text-amber-600" />;
            default:
                return (
                    <span className="text-lg font-bold text-muted-foreground">
                        #{rank}
                    </span>
                );
        }
    };

    const getBadgeColor = (badge: string) => {
        switch (badge) {
            case "Champion":
                return "bg-yellow-500/20 text-yellow-400";
            case "Legendary":
                return "bg-purple-500/20 text-purple-400";
            case "Elite":
                return "bg-blue-500/20 text-blue-400";
            case "Master":
                return "bg-green-500/20 text-green-400";
            case "Expert":
                return "bg-orange-500/20 text-orange-400";
            case "Veteran":
                return "bg-red-500/20 text-red-400";
            case "Rising Star":
                return "bg-pink-500/20 text-pink-400";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    const getChangeColor = (change: string) => {
        if (change.startsWith("+")) return "text-green-400";
        if (change.startsWith("-")) return "text-red-400";
        return "text-muted-foreground";
    };

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-orbitron font-bold mb-4">
                        <span className="text-gradient">Leaderboard</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Compete with the best players in the metaverse
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-card/50 border-border/50 text-center">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-center mb-2">
                                <Users className="h-5 w-5 text-neon-blue mr-2" />
                                <div className="text-2xl font-bold text-neon-blue">
                                    25.4K
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Total Players
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50 text-center">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-center mb-2">
                                <Trophy className="h-5 w-5 text-neon-green mr-2" />
                                <div className="text-2xl font-bold text-neon-green">
                                    1.2M
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Total Matches
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50 text-center">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-center mb-2">
                                <Star className="h-5 w-5 text-neon-purple mr-2" />
                                <div className="text-2xl font-bold text-neon-purple">
                                    890K
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Points Earned
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50 text-center">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-center mb-2">
                                <TrendingUp className="h-5 w-5 text-neon-pink mr-2" />
                                <div className="text-2xl font-bold text-neon-pink">
                                    156
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Active Now
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top 3 Podium */}
                <div className="mb-12">
                    <h2 className="text-2xl font-orbitron font-bold text-center mb-8">
                        Hall of Fame
                    </h2>
                    <div className="flex justify-center items-end gap-8 mb-8">
                        {/* 2nd Place */}
                        <div
                            className="text-center animate-slide-in-up"
                            style={{ animationDelay: "0.1s" }}
                        >
                            <div className="bg-card/50 border border-border/50 rounded-xl p-6 card-hover">
                                <div className="relative mb-4">
                                    <img
                                        src={`https://images.unsplash.com/${topPlayers[1].avatar}?w=80&h=80&fit=crop&crop=face`}
                                        alt={topPlayers[1].username}
                                        className="w-20 h-20 rounded-full mx-auto border-4 border-gray-400"
                                    />
                                    <div className="absolute -top-2 -right-2">
                                        <Medal className="h-8 w-8 text-gray-400" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg">
                                    {topPlayers[1].username}
                                </h3>
                                <p className="text-2xl font-bold text-neon-blue mb-2">
                                    {topPlayers[1].score.toLocaleString()}
                                </p>
                                <div className="flex justify-center gap-1">
                                    {topPlayers[1].badges.map((badge, i) => (
                                        <Badge
                                            key={i}
                                            className={getBadgeColor(badge)}
                                            variant="secondary"
                                        >
                                            {badge}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 1st Place */}
                        <div className="text-center animate-slide-in-up">
                            <div className="bg-card/50 border border-border/50 rounded-xl p-8 card-hover transform scale-110">
                                <div className="relative mb-4">
                                    <img
                                        src={`https://images.unsplash.com/${topPlayers[0].avatar}?w=100&h=100&fit=crop&crop=face`}
                                        alt={topPlayers[0].username}
                                        className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-400 glow-blue"
                                    />
                                    <div className="absolute -top-3 -right-3">
                                        <Crown className="h-10 w-10 text-yellow-400 animate-pulse-glow" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl text-gradient">
                                    {topPlayers[0].username}
                                </h3>
                                <p className="text-3xl font-bold text-neon-blue mb-2">
                                    {topPlayers[0].score.toLocaleString()}
                                </p>
                                <div className="flex justify-center gap-1">
                                    {topPlayers[0].badges.map((badge, i) => (
                                        <Badge
                                            key={i}
                                            className={getBadgeColor(badge)}
                                            variant="secondary"
                                        >
                                            {badge}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3rd Place */}
                        <div
                            className="text-center animate-slide-in-up"
                            style={{ animationDelay: "0.2s" }}
                        >
                            <div className="bg-card/50 border border-border/50 rounded-xl p-6 card-hover">
                                <div className="relative mb-4">
                                    <img
                                        src={`https://images.unsplash.com/${topPlayers[2].avatar}?w=80&h=80&fit=crop&crop=face`}
                                        alt={topPlayers[2].username}
                                        className="w-20 h-20 rounded-full mx-auto border-4 border-amber-600"
                                    />
                                    <div className="absolute -top-2 -right-2">
                                        <Medal className="h-8 w-8 text-amber-600" />
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg">
                                    {topPlayers[2].username}
                                </h3>
                                <p className="text-2xl font-bold text-neon-blue mb-2">
                                    {topPlayers[2].score.toLocaleString()}
                                </p>
                                <div className="flex justify-center gap-1">
                                    {topPlayers[2].badges.map((badge, i) => (
                                        <Badge
                                            key={i}
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
                </div>

                {/* Full Leaderboard */}
                <Tabs defaultValue="overall" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="overall">Overall</TabsTrigger>
                        <TabsTrigger value="weekly">This Week</TabsTrigger>
                        <TabsTrigger value="monthly">This Month</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overall">
                        <Card className="bg-card/50 border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-neon-blue" />
                                    Overall Rankings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Rank</TableHead>
                                            <TableHead>Player</TableHead>
                                            <TableHead>Score</TableHead>
                                            <TableHead>Games</TableHead>
                                            <TableHead>Win Rate</TableHead>
                                            <TableHead>Badges</TableHead>
                                            <TableHead>Change</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allPlayers.map((player, index) => (
                                            <TableRow
                                                key={player.username}
                                                className="animate-slide-in-up"
                                                style={{
                                                    animationDelay: `${
                                                        index * 0.05
                                                    }s`,
                                                }}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center justify-center w-8">
                                                        {getRankIcon(
                                                            player.rank
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={`https://images.unsplash.com/${player.avatar}?w=40&h=40&fit=crop&crop=face`}
                                                            alt={
                                                                player.username
                                                            }
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                        <span className="font-semibold">
                                                            {player.username}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-bold text-neon-blue">
                                                    {player.score.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    {player.gamesPlayed}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-neon-green">
                                                        {player.winRate}%
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        {player.badges.map(
                                                            (badge, i) => (
                                                                <Badge
                                                                    key={i}
                                                                    className={getBadgeColor(
                                                                        badge
                                                                    )}
                                                                    variant="secondary"
                                                                >
                                                                    {badge}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={getChangeColor(
                                                            player.change
                                                        )}
                                                    >
                                                        {player.change !==
                                                            "0" &&
                                                            player.change}
                                                        {player.change ===
                                                            "0" && "—"}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="weekly">
                        <Card className="bg-card/50 border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-neon-green" />
                                    Weekly Rankings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Rank</TableHead>
                                            <TableHead>Player</TableHead>
                                            <TableHead>Score</TableHead>
                                            <TableHead>Games</TableHead>
                                            <TableHead>Win Rate</TableHead>
                                            <TableHead>Badges</TableHead>
                                            <TableHead>Change</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allPlayers
                                            .slice()
                                            .reverse()
                                            .map((player, index) => (
                                                <TableRow
                                                    key={player.username}
                                                    className="animate-slide-in-up"
                                                    style={{
                                                        animationDelay: `${
                                                            index * 0.05
                                                        }s`,
                                                    }}
                                                >
                                                    <TableCell>
                                                        <div className="flex items-center justify-center w-8">
                                                            <span className="text-lg font-bold text-muted-foreground">
                                                                #{index + 1}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={`https://images.unsplash.com/${player.avatar}?w=40&h=40&fit=crop&crop=face`}
                                                                alt={
                                                                    player.username
                                                                }
                                                                className="w-10 h-10 rounded-full"
                                                            />
                                                            <span className="font-semibold">
                                                                {
                                                                    player.username
                                                                }
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-bold text-neon-blue">
                                                        {Math.floor(
                                                            player.score * 0.2
                                                        ).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        {Math.floor(
                                                            player.gamesPlayed *
                                                                0.3
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-neon-green">
                                                            {player.winRate}%
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-1">
                                                            {player.badges
                                                                .slice(0, 1)
                                                                .map(
                                                                    (
                                                                        badge,
                                                                        i
                                                                    ) => (
                                                                        <Badge
                                                                            key={
                                                                                i
                                                                            }
                                                                            className={getBadgeColor(
                                                                                badge
                                                                            )}
                                                                            variant="secondary"
                                                                        >
                                                                            {
                                                                                badge
                                                                            }
                                                                        </Badge>
                                                                    )
                                                                )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-neon-green">
                                                            +{index + 1}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="monthly">
                        <Card className="bg-card/50 border-border/50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5 text-neon-purple" />
                                    Monthly Rankings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Rank</TableHead>
                                            <TableHead>Player</TableHead>
                                            <TableHead>Score</TableHead>
                                            <TableHead>Games</TableHead>
                                            <TableHead>Win Rate</TableHead>
                                            <TableHead>Badges</TableHead>
                                            <TableHead>Change</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allPlayers.map((player, index) => (
                                            <TableRow
                                                key={player.username}
                                                className="animate-slide-in-up"
                                                style={{
                                                    animationDelay: `${
                                                        index * 0.05
                                                    }s`,
                                                }}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center justify-center w-8">
                                                        {getRankIcon(
                                                            player.rank
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={`https://images.unsplash.com/${player.avatar}?w=40&h=40&fit=crop&crop=face`}
                                                            alt={
                                                                player.username
                                                            }
                                                            className="w-10 h-10 rounded-full"
                                                        />
                                                        <span className="font-semibold">
                                                            {player.username}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-bold text-neon-blue">
                                                    {Math.floor(
                                                        player.score * 0.8
                                                    ).toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    {Math.floor(
                                                        player.gamesPlayed * 0.7
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-neon-green">
                                                        {player.winRate}%
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        {player.badges.map(
                                                            (badge, i) => (
                                                                <Badge
                                                                    key={i}
                                                                    className={getBadgeColor(
                                                                        badge
                                                                    )}
                                                                    variant="secondary"
                                                                >
                                                                    {badge}
                                                                </Badge>
                                                            )
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={getChangeColor(
                                                            player.change
                                                        )}
                                                    >
                                                        {player.change !==
                                                            "0" &&
                                                            player.change}
                                                        {player.change ===
                                                            "0" && "—"}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Leaderboard;
