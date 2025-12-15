import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "@/lib/blog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

export default function BlogIndex() {
    const { data: posts, isLoading } = useQuery({
        queryKey: ["blog-posts"],
        queryFn: getAllPosts,
    });

    return (
        <div className="container mx-auto py-12 px-4 max-w-6xl">
            <title>Blog | Engineering & Updates</title>
            <meta
                name="description"
                content="Read our latest thoughts on engineering, product, and building cool things."
            />

            <div className="flex flex-col gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Our Blog
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Insights, tutorials, and updates from the team.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader className="h-32 bg-muted/50" />
                                <CardContent className="h-24 bg-muted/30 mt-4" />
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {posts?.map((post) => (
                            <Card key={post.slug} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="line-clamp-2 leading-tight">
                                        <Link to={`/blog/${post.slug}`} className="hover:underline">
                                            {post.title}
                                        </Link>
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        {new Date(post.date).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-muted-foreground line-clamp-3">
                                        {post.description}
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild variant="secondary" className="w-full">
                                        <Link to={`/blog/${post.slug}`}>Read Article</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
