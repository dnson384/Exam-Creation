"use client";

import ChapterBlock from "@/presentation/components/Generate/Exam/ChapterBlock";
import NavBar from "@/presentation/components/layout/NavBar";
import useChapter from "@/presentation/hooks/Generate/Exam/Child/useChapter";

export default function GenerateExam() {
  const {
    draft,
    categories,
    isLoading,
    isError,
    errorMessage,
    selectedChapters,
    setSelectedChapters,
    handleChapterSelect,
    handleAddChapter,
    handleContinueClick,
  } = useChapter();

  const chapters = categories.map((category) => ({
    id: category.id,
    name: category.chapter,
  }));
  const chaptersData = chapters.filter(
    (chapter) =>
      !Object.values(selectedChapters)
        .map((chapter) => chapter.id)
        .includes(chapter.id),
  );

  return (
    <>
      <NavBar />

      <main className="mt-26 w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center">Chương / chủ đề</h1>
        <section className="mt-10">
          {selectedChapters.map((currentChapter, index) => {
            return (
              <ChapterBlock
                currentChapter={{
                  id: currentChapter?.id || "",
                  name: currentChapter?.name || "",
                }}
                key={index}
                selectedChapters={selectedChapters}
                index={index}
                chaptersData={chaptersData}
                handleChapterSelect={handleChapterSelect}
                setSelectedChapters={setSelectedChapters}
                handleAddChapter={handleAddChapter}
              />
            );
          })}

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
            <div className="max-w-6xl mx-auto flex justify-end">
              <button
                type="button"
                onClick={handleContinueClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-medium shadow-md transition-colors cursor-pointer"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
