import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { getPostBySlug } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon, UserIcon } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => getPostBySlug(slug || ""),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-3xl space-y-8 animate-pulse">
        <div className="h-8 bg-muted w-2/3 rounded" />
        <div className="h-4 bg-muted w-1/3 rounded" />
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-24 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <Button asChild>
          <Link to="/blog">Back to Blog</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <title>{post.title} | Blog</title>
      <meta name="description" content={post.description} />
      {/* Open Graph */}
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.description} />
      <meta property="og:type" content="article" />
      <meta property="article:published_time" content={post.date} />

      <Button asChild variant="ghost" className="mb-8 pl-0 hover:pl-2 transition-all">
        <Link to="/blog" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </Button>

      <article className="prose dark:prose-invert lg:prose-xl max-w-none">
        <div className="mb-8 not-prose border-b pb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-foreground">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            {post.author && (
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-foreground">
          <ReactMarkdown>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
