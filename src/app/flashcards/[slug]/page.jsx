import FlashcardViewer from "@/components/FlashCardViewer/FlashCardViewer";

export default async function FlashcardsPage({ params }) {
  const { slug } = await params; // ✅ FIX HERE

  let data;

  try {
    data = (await import(`@/data/a1/flashcards/${slug}.json`)).default;
  } catch (err) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Flashcards not found under app</h2>
        <p>{slug}</p>
      </div>
    );
  }

  const cards = data.questions.map((item) => ({
    front: item.Word,
    back: {
      meaning: item.Meaning,
      sentences: [
        {
          fr: item["Sentence 1"],
          en: item["Sentence1Eng"],
        },
        {
          fr: item["Sentence 2"],
          en: item["Sentence 2 Eng"],
        },
        {
          fr: item["Sentence 3"],
          en: item["Sentence 3 Eng"],
        },
      ].filter((s) => s.fr || s.en),
    },
  }));

  return (
    <div style={{ padding: 20 }}>
      <h1>{data.title}</h1>
      <p style={{ opacity: 0.6 }}>Level: {data.level}</p>

      <FlashcardViewer cards={cards} />
    </div>
  );
}
