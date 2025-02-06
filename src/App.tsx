import { useState, useEffect } from "react";
import { Search, Book } from "lucide-react";
import type { DictionaryEntry } from "./types";

function App() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const response = await fetch("/src/dictionary.csv");
        const text = await response.text();
        const [_, ...lines] = text.split("\n");

        const parsedEntries = lines
          .filter((line) => line.trim())
          .map((line) => {
            const [word, amiyah_arab, indonesia, fushah, fushah_arab, contoh] =
              line.split(",");
            return {
              word,
              amiyah_arab,
              indonesia,
              fushah,
              fushah_arab,
              contoh,
            };
          });

        setEntries(parsedEntries);
      } catch (error) {
        console.error("Error loading dictionary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDictionary();
  }, []);

  const filteredEntries = entries.filter(
    (entry) =>
      entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.indonesia.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.fushah.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Book className="w-10 h-10 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-800">
            Kamus Arab Amiyah Saudi
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari kata dalam bahasa Arab atau Indonesia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-colors text-lg"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Memuat kamus...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-lg">
                <p className="text-gray-600 text-lg">
                  Tidak ada kata yang cocok dengan pencarian Anda.
                </p>
              </div>
            ) : (
              filteredEntries.map((entry, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {entry.word}
                        </h2>
                        <p className="text-xl text-gray-600 font-arabic mt-1">
                          {entry.amiyah_arab}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg text-indigo-600 font-semibold">
                          {entry.indonesia}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">
                        Fushah:
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-lg text-gray-800">{entry.fushah}</p>
                        <p className="text-lg text-gray-600 font-arabic">
                          {entry.fushah_arab}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">
                        Contoh Penggunaan:
                      </h3>
                      <p className="text-gray-700">{entry.contoh}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
