export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    description: string;
    author?: string;
    content: string; // Markdown content
}

// Helper to parse frontmatter without Node.js 'buffer' dependencies
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
    const frontmatterRegex = /^---[\r\n]+([\s\S]*?)[\r\n]+---[\r\n]+([\s\S]*)$/;
    const match = frontmatterRegex.exec(raw);

    if (!match) {
        return { data: {}, content: raw };
    }

    const frontmatterBlock = match[1];
    const content = match[2];
    const data: Record<string, string> = {};

    frontmatterBlock.split(/\r?\n/).forEach((line) => {
        const colonIndex = line.indexOf(":");
        if (colonIndex !== -1) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            data[key] = value;
        }
    });

    return { data, content };
}

export async function getAllPosts(): Promise<BlogPost[]> {
    // Vite glob import to get raw string content
    const modules = import.meta.glob("/src/content/blog/*.md", {
        query: "?raw",
        import: "default",
    });

    const posts: BlogPost[] = [];

    for (const path in modules) {
        const rawContent = (await modules[path]()) as string;
        const { data, content } = parseFrontmatter(rawContent);

        // Fallback if slug is missing in frontmatter: use filename
        const filenameSlug = path.split("/").pop()?.replace(".md", "") ?? "";

        posts.push({
            slug: data.slug || filenameSlug,
            title: data.title || "Untitled Post",
            date: data.date || new Date().toISOString(),
            description: data.description || "",
            author: data.author,
            content,
        });
    }

    // Sort by date descending
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const posts = await getAllPosts();
    return posts.find((post) => post.slug === slug);
}
