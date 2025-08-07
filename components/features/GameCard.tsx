import { Play, Star, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface GameCardProps {
    id: string;
    title: string;
    description: string;
    image: string;
    rating: number;
    players: number;
    category: string;
    featured?: boolean;
    className?: string;
}

const GameCard = ({
    id,
    title,
    description,
    image,
    rating,
    players,
    category,
    featured = false,
    className = "",
}: GameCardProps) => {
    return (
        <div
            className={`group relative bg-card rounded-xl overflow-hidden card-hover border border-border/50 ${className}`}
        >
            {/* Featured Badge */}
            {featured && (
                <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-to-r from-neon-purple to-neon-pink text-background font-bold animate-pulse-glow">
                        <Zap className="h-3 w-3 mr-1" />
                        Featured
                    </Badge>
                </div>
            )}

            {/* Game Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Link href={`/games/${id}`}>
                        <Button
                            size="lg"
                            className="btn-primary animate-scale-in"
                        >
                            <Play className="h-5 w-5 mr-2" />
                            Play Now
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Game Info */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-neon-blue transition-colors duration-300">
                            {title}
                        </h3>
                        <Badge variant="secondary" className="mt-1 text-xs">
                            {category}
                        </Badge>
                    </div>
                    <div className="flex items-center space-x-1 text-neon-green">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-semibold">{rating}</span>
                    </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">
                            {players.toLocaleString()} players
                        </span>
                    </div>

                    <Link href={`/games/${id}`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="btn-secondary text-xs"
                        >
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
    );
};

export default GameCard;
