export async function getQuizData(sectionSlug) {
  try {
    // This dynamically imports ONLY the file needed for this request
    const data = await import(`@/data/a1/${sectionSlug}.json`);
    return data.default;
  } catch (error) {
    console.error("Could not find quiz file:", sectionSlug);
    return null;
  }
}
