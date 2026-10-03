import { createReview } from "@/lib/queries";

export const dynamic = "force-dynamic";

function clean(value: unknown, max = 240) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const author = clean(payload.author, 80);
  const campus = clean(payload.campus, 80);
  const major = clean(payload.major, 80);
  const title = clean(payload.title, 120);
  const body = clean(payload.body, 1200);
  const rating = Number(payload.rating);

  if (!author || !campus || !title || body.length < 8) {
    return Response.json(
      { error: "Please add your name, college, a headline and a few words." },
      { status: 400 },
    );
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return Response.json({ error: "Pick a rating between 1 and 5." }, { status: 400 });
  }

  const review = await createReview({
    slug,
    author,
    campus,
    major,
    rating: Math.round(rating),
    title,
    body,
  });

  if (!review) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  return Response.json({ review }, { status: 201 });
}
