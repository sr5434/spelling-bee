"use client";
import { useEffect, useState } from "react";
import classNames from "classnames";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineClose } from "react-icons/md";
import { HiCheck, HiX } from "react-icons/hi";

import {styles} from "./app.css"

const correct = () =>
  toast.custom(
    (t) => (
      <div
        className={classNames([
          "flex flex-row items-center justify-between w-96 bg-gray-900 px-4 py-6 text-white shadow-2xl hover:shadow-none transform-gpu translate-y-0 hover:translate-y-1 rounded-xl relative transition-all duration-500 ease-in-out",
          t.visible ? "top-0" : "-top-96",
        ])}
      >
        <div className="text-xl">
          <HiCheck />
        </div>
        <div className="flex flex-col items-start justify-center ml-4 cursor-default">
          <h1 className="font-bold">Correct</h1>
          <p>
            Congratulations! You spelled the word correctly.
          </p>
        </div>
        <div className="absolute top-2 right-2 cursor-pointer text-lg" onClick={() => toast.dismiss(t.id)}>
          <MdOutlineClose />
        </div>
      </div>
    ),
    { id: "unique-notification", position: "top-center" }
);

const incorrect = (correctSpelling) =>
  toast.custom(
    (t) => (
      <div
        className={classNames([
          "flex flex-row items-center justify-between w-96 bg-gray-900 px-4 py-6 text-white shadow-2xl hover:shadow-none transform-gpu translate-y-0 hover:translate-y-1 rounded-xl relative transition-all duration-500 ease-in-out",
          t.visible ? "top-0" : "-top-96",
        ])}
      >
        <div className="text-xl">
          <HiX />
        </div>
        <div className="flex flex-col items-start justify-center ml-4 cursor-default">
          <h1 className="font-bold">Incorrect</h1>
          <p>
            The correct spelling is:{correctSpelling}.
          </p>
        </div>
        <div className="absolute top-2 right-2 cursor-pointer text-lg" onClick={() => toast.dismiss(t.id)}>
          <MdOutlineClose />
        </div>
      </div>
    ),
    { id: "unique-notification", position: "top-center" }
);

export default function Home() {
  const [updateTrigger, setUpdateTrigger] = useState(0);// We use this to trigger API calls
  const [word, setWord] = useState("");
  const [audio, setAudio] = useState("");
  const [guess, setGuess] = useState("");

  useEffect(() => {
    fetch("/api/pickWord", { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => {
        setWord(data.word);
        const arrayBuffer = new Uint8Array(data.audio.data).buffer;
        const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' }); // Change 'audio/mpeg' to the correct MIME type of your audio
        const url = URL.createObjectURL(blob);
        setAudio(url);
      });
  }, [updateTrigger]);//Trigger when we update updateTrigger
  
  const handleInput = async (e) => {
    const fieldValue = e.target.value;

    await setGuess(fieldValue);
  }
  
  const submitHandler = async (e) => {
    e.preventDefault();
    if (guess === word) {
      correct();
    } else {
      incorrect(word);
    }
    setGuess("");
    setUpdateTrigger(updateTrigger + 1);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Word Picker</h1>
      <audio controls src={audio}/>
      <form onSubmit={submitHandler}>
        <label className="block mb-2 pt-6 text-sm font-medium text-gray-900 dark:text-white" htmlFor="codeInput">Spell the word:</label>
        <textarea
          id="input"
          value={guess}
          onChange={handleInput}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <br />
        <button 
          type="submit"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 shadow-lg"
          >
          Check
        </button>
      </form>
      <Toaster />
    </div>
  );
}
