// Components/WordForm.js
import React, { useState, useRef, useEffect } from 'react';
import Recorder from 'recorder-js';

function WordForm({ initialWord = {}, onSubmit, isEdit = false }) {
  const [headword, setHeadword] = useState(initialWord.headword || '');
  const [pronunciation, setPronunciation] = useState(initialWord.pronunciation || '');
  const [origin, setOrigin] = useState(initialWord.origin || '');
  const [meanings, setMeanings] = useState(initialWord.meanings || [{ partOfSpeech: '', definitions: [{ definition: '', example: '', synonyms: '', antonyms: '' }] }]);
  const [status, setStatus] = useState(initialWord.status || 'pending');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(initialWord.mp3Url || null);
  const recorder = useRef(null);

  useEffect(() => {
    if (initialWord.mp3Url) {
      setAudioUrl(initialWord.mp3Url);
    }
  }, [initialWord]);

  const addMeaning = () => {
    setMeanings([...meanings, { partOfSpeech: '', definitions: [{ definition: '', example: '', synonyms: '', antonyms: '' }] }]);
  };

  const handleMeaningChange = (index, event) => {
    const newMeanings = [...meanings];
    newMeanings[index][event.target.name] = event.target.value;
    setMeanings(newMeanings);
  };

  const handleDefinitionChange = (meaningIndex, definitionIndex, event) => {
    const newMeanings = [...meanings];
    newMeanings[meaningIndex].definitions[definitionIndex][event.target.name] = event.target.value;
    setMeanings(newMeanings);
  };

  const addDefinition = (meaningIndex) => {
    const newMeanings = [...meanings];
    newMeanings[meaningIndex].definitions.push({ definition: '', example: '', synonyms: '', antonyms: '' });
    setMeanings(newMeanings);
  };

  const startRecording = async () => {
    if (!recorder.current) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recorder.current = new Recorder(audioContext);
      recorder.current.init(stream);
      recorder.current.stream = stream; // Save the stream to stop it later
    }
    recorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = async () => {
    if (recorder.current) {
      const { blob } = await recorder.current.stop();
      setAudioBlob(blob);
      setAudioUrl(URL.createObjectURL(blob)); // Create a URL for the audio blob for preview
      setIsRecording(false);

      // Stop all tracks on the stream to release the microphone and remove the red dot on the tab
      const tracks = recorder.current.stream.getTracks();
      tracks.forEach((track) => track.stop());

      // Reset the recorder to allow for a new recording if needed
      recorder.current = null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const wordData = {
      headword,
      pronunciation,
      origin,
      status,
      meanings,
    };

    if (audioBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        wordData.mp3Base64 = reader.result.split(',')[1]; // Get the base64 part of the DataURL
        onSubmit(wordData);
      };
    } else {
      wordData.mp3Base64 = null;
      onSubmit(wordData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Headword</label>
        <input
          type="text"
          name="headword"
          value={headword}
          onChange={(e) => setHeadword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Pronunciation</label>
        <input
          type="text"
          name="pronunciation"
          value={pronunciation}
          onChange={(e) => setPronunciation(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">Origin</label>
        <input
          type="text"
          name="origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block text-gray-700">MP3 Recording</label>
        <div className="flex items-center">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Start Recording
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={stopRecording}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Stop Recording
              </button>
              <span className="ml-2 bg-red-500 w-3 h-3 rounded-full inline-block"></span> {/* Red dot */}
            </>
          )}
        </div>
        {audioUrl && (
          <div className="mt-4">
            <label className="block text-gray-700">Preview Recording</label>
            <audio controls src={audioUrl} className="w-full mt-2" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-gray-700">Meanings</label>
        {meanings.map((meaning, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-400 rounded">
            <input
              type="text"
              name="partOfSpeech"
              placeholder="Part of Speech"
              value={meaning.partOfSpeech}
              onChange={(e) => handleMeaningChange(index, e)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
              required
            />
            {meaning.definitions.map((definition, defIndex) => (
              <div key={defIndex} className="mb-2 p-2 border border-gray-300 rounded">
                <input
                  type="text"
                  name="definition"
                  placeholder="Definition"
                  value={definition.definition}
                  onChange={(e) => handleDefinitionChange(index, defIndex, e)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                  required
                />
                <input
                  type="text"
                  name="example"
                  placeholder="Example"
                  value={definition.example}
                  onChange={(e) => handleDefinitionChange(index, defIndex, e)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <input
                  type="text"
                  name="synonyms"
                  placeholder="Synonyms"
                  value={definition.synonyms}
                  onChange={(e) => handleDefinitionChange(index, defIndex, e)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <input
                  type="text"
                  name="antonyms"
                  placeholder="Antonyms"
                  value={definition.antonyms}
                  onChange={(e) => handleDefinitionChange(index, defIndex, e)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => addDefinition(index)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              + Add Definition
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addMeaning}
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          + Add Meaning
        </button>
      </div>

      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        {isEdit ? 'Update Word' : 'Add Word'}
      </button>
    </form>
  );
}

export default WordForm;
