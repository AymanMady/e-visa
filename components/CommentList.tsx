import { useEffect, useState } from "react";

interface Comment {
  id: number;
  content: string;
  authorId: number;
  createdAt: string;
}

export default function CommentList({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch(`/api/comments/${postId}`)
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/comments/${postId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment }),
    });
    if (res.ok) {
      const comment = await res.json();
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Commentaires</h3>
      <ul className="space-y-2">
        {comments.map((c) => (
          <li key={c.id} className="border-b pb-2">
            {c.content}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <textarea
          className="border p-2 w-full"
          placeholder="Ajouter un commentaire..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" className="bg-gray-700 text-white px-3 py-1 rounded">
          Envoyer
        </button>
      </form>
    </div>
  );
}
