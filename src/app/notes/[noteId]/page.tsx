"use client";
import { Note } from "@/types/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const NoteDetailspage = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(noteId);

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/notes.json");
        const notes: Note[] = await response.json();

        // Find the contract with matching ID
        const foundNote = notes.find(
          (note) => note.id === noteId || note?.id === noteId
        );

        if (foundNote) {
          setNote(foundNote);
        } else {
          setError(`Contract with ID ${noteId} not found`);
        }
      } catch (err) {
        setError("Failed to load contract data");
        console.error("Error fetching contract:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [noteId]);

  if (loading) {
    return <div className="mt-6 text-center">Loading contract details...</div>;
  }

  if (error) {
    return <div className="mt-6 text-center text-red-500">{error}</div>;
  }

  if (!note) {
    return <div className="mt-6 text-center">Note is not available</div>;
  }
  return (
    <div>
      <div>
        <div className="border-b border-gray-300 py-10">
          <div className=" mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
              <div>
                <p>{note.noteName}</p>
              </div>
              <div>
                <p>Date : {note.date}</p>
                <p>Time : {note.time}</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="my-10 text-center">
            <p className="text-lg">{note.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailspage;
