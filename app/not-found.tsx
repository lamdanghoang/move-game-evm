import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen">
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/50">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-8">Page Not Found</h2>
                <p className="text-lg text-gray-400 mb-8">
                    The page you are looking for does not exist or has been
                    moved.
                </p>
                <Link href="/">
                    <Button className="btn-primary">Go to Homepage</Button>
                </Link>
            </div>
        </div>
    );
}
