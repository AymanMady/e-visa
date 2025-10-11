import Link from "next/link";
import { Post } from "@/models/post";

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-bold">
        <Link href={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      <p className="text-gray-600 mt-2">
        {post.content.substring(0, 100)}...
      </p>
    </div>
  );
}
