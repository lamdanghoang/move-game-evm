"use client";

import { useState } from "react";
import {
    Vote,
    Clock,
    CheckCircle,
    XCircle,
    Users,
    PlusCircle,
    TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DAO = () => {
    const [selectedProposal, setSelectedProposal] = useState<string | null>(
        null
    );

    const proposals = [
        {
            id: "1",
            title: "Increase Tournament Prize Pool by 50%",
            description:
                "Proposal to increase the monthly tournament prize pool from 10,000 SUI to 15,000 SUI to attract more competitive players and increase platform engagement.",
            author: "TournamentMaster",
            status: "active",
            category: "Treasury",
            votesFor: 1247,
            votesAgainst: 234,
            quorum: 85,
            timeLeft: "2 days",
            totalVotes: 1481,
            requiredVotes: 1500,
            createdAt: "2024-06-05",
        },
        {
            id: "2",
            title: "Add New Game Category: VR Gaming",
            description:
                "Introduce virtual reality gaming category to the platform with dedicated leaderboards, tournaments, and NFT rewards for VR-compatible games.",
            author: "VREnthusiast",
            status: "active",
            category: "Platform",
            votesFor: 892,
            votesAgainst: 156,
            quorum: 70,
            timeLeft: "5 days",
            totalVotes: 1048,
            requiredVotes: 1500,
            createdAt: "2024-06-03",
        },
        {
            id: "3",
            title: "Partnership with MetaGame Studios",
            description:
                "Establish strategic partnership with MetaGame Studios to bring their AAA blockchain games exclusively to our platform for the first 30 days.",
            author: "BusinessDev",
            status: "passed",
            category: "Partnership",
            votesFor: 1876,
            votesAgainst: 324,
            quorum: 95,
            timeLeft: "Ended",
            totalVotes: 2200,
            requiredVotes: 1500,
            createdAt: "2024-05-28",
        },
        {
            id: "4",
            title: "Reduce Platform Transaction Fees",
            description:
                "Decrease marketplace transaction fees from 5% to 3% to encourage more trading activity and improve user satisfaction.",
            author: "CommunityAdvocate",
            status: "failed",
            category: "Economics",
            votesFor: 743,
            votesAgainst: 1257,
            quorum: 65,
            timeLeft: "Ended",
            totalVotes: 2000,
            requiredVotes: 1500,
            createdAt: "2024-05-20",
        },
        {
            id: "5",
            title: "Implement Cross-Chain Gaming Support",
            description:
                "Add support for cross-chain gaming assets, allowing players to use NFTs from Ethereum and Polygon in Sui-based games.",
            author: "CrossChainDev",
            status: "draft",
            category: "Technical",
            votesFor: 0,
            votesAgainst: 0,
            quorum: 0,
            timeLeft: "Not started",
            totalVotes: 0,
            requiredVotes: 1500,
            createdAt: "2024-06-07",
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-neon-blue/20 text-neon-blue";
            case "passed":
                return "bg-neon-green/20 text-neon-green";
            case "failed":
                return "bg-destructive/20 text-destructive";
            case "draft":
                return "bg-muted text-muted-foreground";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "Treasury":
                return "bg-neon-purple/20 text-neon-purple";
            case "Platform":
                return "bg-neon-blue/20 text-neon-blue";
            case "Partnership":
                return "bg-neon-green/20 text-neon-green";
            case "Economics":
                return "bg-neon-pink/20 text-neon-pink";
            case "Technical":
                return "bg-orange-500/20 text-orange-400";
            default:
                return "bg-muted text-muted-foreground";
        }
    };

    const getVotePercentage = (votes: number, total: number) => {
        return total > 0 ? Math.round((votes / total) * 100) : 0;
    };

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-orbitron font-bold mb-4">
                        <span className="text-gradient">DAO Governance</span>
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Shape the future of gaming together
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-card/50 border-border/50 text-center">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-center mb-2">
                                <Vote className="h-5 w-5 text-neon-blue mr-2" />
                                <div className="text-2xl font-bold text-neon-blue">
                                    23
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Total Proposals
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50 text-center">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-center mb-2">
                                <Users className="h-5 w-5 text-neon-green mr-2" />
                                <div className="text-2xl font-bold text-neon-green">
                                    2.4K
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Active Voters
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50 text-center">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-center mb-2">
                                <CheckCircle className="h-5 w-5 text-neon-purple mr-2" />
                                <div className="text-2xl font-bold text-neon-purple">
                                    87%
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Pass Rate
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50 text-center">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-center mb-2">
                                <TrendingUp className="h-5 w-5 text-neon-pink mr-2" />
                                <div className="text-2xl font-bold text-neon-pink">
                                    15.7K
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Total Votes Cast
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Create Proposal Button */}
                <div className="flex justify-center mb-8">
                    <Button className="btn-primary">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create New Proposal
                    </Button>
                </div>

                {/* Proposals */}
                <Tabs defaultValue="active" className="w-full">
                    <TabsList className="mb-8">
                        <TabsTrigger value="active">
                            Active Proposals
                        </TabsTrigger>
                        <TabsTrigger value="passed">Passed</TabsTrigger>
                        <TabsTrigger value="failed">Failed</TabsTrigger>
                        <TabsTrigger value="draft">Drafts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="active">
                        <div className="space-y-6">
                            {proposals
                                .filter((p) => p.status === "active")
                                .map((proposal, index) => (
                                    <Card
                                        key={proposal.id}
                                        className="bg-card/50 border-border/50 card-hover animate-slide-in-up"
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                        }}
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-xl mb-2">
                                                        {proposal.title}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge
                                                            className={getStatusColor(
                                                                proposal.status
                                                            )}
                                                            variant="secondary"
                                                        >
                                                            {proposal.status.toUpperCase()}
                                                        </Badge>
                                                        <Badge
                                                            className={getCategoryColor(
                                                                proposal.category
                                                            )}
                                                            variant="secondary"
                                                        >
                                                            {proposal.category}
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground">
                                                            by {proposal.author}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-muted-foreground">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    <span className="text-sm">
                                                        {proposal.timeLeft}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground mb-6">
                                                {proposal.description}
                                            </p>

                                            {/* Voting Progress */}
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-sm">
                                                    <span>Voting Progress</span>
                                                    <span>
                                                        {proposal.totalVotes}/
                                                        {proposal.requiredVotes}{" "}
                                                        votes ({proposal.quorum}
                                                        % quorum)
                                                    </span>
                                                </div>

                                                <div className="w-full bg-background rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${
                                                                (proposal.totalVotes /
                                                                    proposal.requiredVotes) *
                                                                100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-neon-green/10 rounded-lg p-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm text-neon-green">
                                                                For
                                                            </span>
                                                            <span className="text-sm font-bold text-neon-green">
                                                                {getVotePercentage(
                                                                    proposal.votesFor,
                                                                    proposal.totalVotes
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                        <div className="text-lg font-bold text-neon-green">
                                                            {proposal.votesFor.toLocaleString()}
                                                        </div>
                                                    </div>

                                                    <div className="bg-destructive/10 rounded-lg p-3">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm text-destructive">
                                                                Against
                                                            </span>
                                                            <span className="text-sm font-bold text-destructive">
                                                                {getVotePercentage(
                                                                    proposal.votesAgainst,
                                                                    proposal.totalVotes
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                        <div className="text-lg font-bold text-destructive">
                                                            {proposal.votesAgainst.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 pt-4">
                                                    <Button className="flex-1 bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border border-neon-green/30">
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Vote For
                                                    </Button>
                                                    <Button className="flex-1 bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/30">
                                                        <XCircle className="h-4 w-4 mr-2" />
                                                        Vote Against
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="passed">
                        <div className="space-y-6">
                            {proposals
                                .filter((p) => p.status === "passed")
                                .map((proposal, index) => (
                                    <Card
                                        key={proposal.id}
                                        className="bg-card/50 border-border/50 animate-slide-in-up"
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                        }}
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-xl mb-2">
                                                        {proposal.title}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge
                                                            className={getStatusColor(
                                                                proposal.status
                                                            )}
                                                            variant="secondary"
                                                        >
                                                            PASSED
                                                        </Badge>
                                                        <Badge
                                                            className={getCategoryColor(
                                                                proposal.category
                                                            )}
                                                            variant="secondary"
                                                        >
                                                            {proposal.category}
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground">
                                                            by {proposal.author}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-muted-foreground">
                                                        {proposal.createdAt}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground mb-4">
                                                {proposal.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-neon-green/10 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm text-neon-green">
                                                            For
                                                        </span>
                                                        <span className="text-sm font-bold text-neon-green">
                                                            {getVotePercentage(
                                                                proposal.votesFor,
                                                                proposal.totalVotes
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="text-lg font-bold text-neon-green">
                                                        {proposal.votesFor.toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="bg-destructive/10 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm text-destructive">
                                                            Against
                                                        </span>
                                                        <span className="text-sm font-bold text-destructive">
                                                            {getVotePercentage(
                                                                proposal.votesAgainst,
                                                                proposal.totalVotes
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="text-lg font-bold text-destructive">
                                                        {proposal.votesAgainst.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="failed">
                        <div className="space-y-6">
                            {proposals
                                .filter((p) => p.status === "failed")
                                .map((proposal, index) => (
                                    <Card
                                        key={proposal.id}
                                        className="bg-card/50 border-border/50 animate-slide-in-up"
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                        }}
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-xl mb-2">
                                                        {proposal.title}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge
                                                            className={getStatusColor(
                                                                proposal.status
                                                            )}
                                                            variant="secondary"
                                                        >
                                                            FAILED
                                                        </Badge>
                                                        <Badge
                                                            className={getCategoryColor(
                                                                proposal.category
                                                            )}
                                                            variant="secondary"
                                                        >
                                                            {proposal.category}
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground">
                                                            by {proposal.author}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-muted-foreground">
                                                        {proposal.createdAt}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground mb-4">
                                                {proposal.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-neon-green/10 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm text-neon-green">
                                                            For
                                                        </span>
                                                        <span className="text-sm font-bold text-neon-green">
                                                            {getVotePercentage(
                                                                proposal.votesFor,
                                                                proposal.totalVotes
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="text-lg font-bold text-neon-green">
                                                        {proposal.votesFor.toLocaleString()}
                                                    </div>
                                                </div>

                                                <div className="bg-destructive/10 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm text-destructive">
                                                            Against
                                                        </span>
                                                        <span className="text-sm font-bold text-destructive">
                                                            {getVotePercentage(
                                                                proposal.votesAgainst,
                                                                proposal.totalVotes
                                                            )}
                                                            %
                                                        </span>
                                                    </div>
                                                    <div className="text-lg font-bold text-destructive">
                                                        {proposal.votesAgainst.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="draft">
                        <div className="space-y-6">
                            {proposals
                                .filter((p) => p.status === "draft")
                                .map((proposal, index) => (
                                    <Card
                                        key={proposal.id}
                                        className="bg-card/50 border-border/50 animate-slide-in-up"
                                        style={{
                                            animationDelay: `${index * 0.1}s`,
                                        }}
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-xl mb-2">
                                                        {proposal.title}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge
                                                            className={getStatusColor(
                                                                proposal.status
                                                            )}
                                                            variant="secondary"
                                                        >
                                                            DRAFT
                                                        </Badge>
                                                        <Badge
                                                            className={getCategoryColor(
                                                                proposal.category
                                                            )}
                                                            variant="secondary"
                                                        >
                                                            {proposal.category}
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground">
                                                            by {proposal.author}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-muted-foreground">
                                                        {proposal.createdAt}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground mb-4">
                                                {proposal.description}
                                            </p>
                                            <Button className="btn-secondary">
                                                <Vote className="h-4 w-4 mr-2" />
                                                Submit for Voting
                                            </Button>
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

export default DAO;
