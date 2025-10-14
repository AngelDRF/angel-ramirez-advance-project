"use client";

import React, { useEffect, useState } from "react";
import { BookTypes } from "../../utilities/BookTypes";
import { use } from "react";
import AudioPlayer from "../../utilities/AudioPlayer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [book, setBook] = useState<BookTypes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fontSize = useSelector((state: RootState) => state.fontSize);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        if (!data.ok) {
          throw new Error("Failed to fetch data");
        }
        const book = await data.json();
        setBook(book);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wrapper">
      <div className="summary">
        <div className="audio__book--summary">
          <div className="audio__book--summary-title">
            <b>{book?.title || "Loading..."}</b>
          </div>
          <div
            className="audio-book--summary-text"
            style={{
              fontSize:
                fontSize === "small"
                  ? "16px"
                  : fontSize === "medium"
                  ? "18px"
                  : fontSize === "large"
                  ? "20px"
                  : "24px",
            }}
          >
            {book.summary}
          </div>
        </div>

        <AudioPlayer
          audioLink={book?.audioLink || ""}
          imageLink={book?.imageLink || ""}
          title={book?.title || ""}
          author={book?.author || ""}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
