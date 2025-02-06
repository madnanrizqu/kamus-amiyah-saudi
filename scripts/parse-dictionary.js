import fs from "fs/promises";
import path from "path";
import url from "url";

main();

async function main() {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
  const root = path.join(__dirname, "..");
  const input = path.join(__dirname, "./dictionary.csv");
  const output = path.join(root, "./src/__generated__/dictionary.json");

  console.log(`Parsing dictionary csv in ${input}`);

  const text = await fs.readFile(input, "utf8");
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

  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, JSON.stringify(parsedEntries));

  console.log(`Generated dictionary json file to ${output}`);
}
