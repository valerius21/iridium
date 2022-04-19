import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// We export a function, so that we can parse all csv-files from the ./sample-data directory into an array of objects.
const parseCsv = <T extends unknown>(filePath: string): T[] => {
  const csv = fs.readFileSync(filePath, "utf8");
  const lines = csv.split("\n") || [];
  const headers = lines[0]?.split(",");
  if (!headers || !lines) return [];
  const data: T[] = lines.slice(1).map((line) => {
    const obj: any = {};
    const values = line.split(",");
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj as T;
  });
  return data;
};

const seed = async () => {
  type ImageCsvType = { id: string; filename: string };
  const privateImages = parseCsv<ImageCsvType>(
    path.join(__dirname, "./sample-data/private-images.csv")
  )
    // .map(({ filename }) => filename)
    .filter(({ filename }) => filename && filename.length > 0);
  const publicImages = parseCsv<ImageCsvType>(
    path.join(__dirname, "./sample-data/public-images.csv")
  )
    // .map(({ filename }) => filename)
    .filter(({ filename }) => filename && filename.length > 0);

  await db.dataset.createMany({
    data: privateImages.map((img) => ({
      id: img.id,
      attributes: { filename: img.filename, isPrivate: true },
    })),
    skipDuplicates: true,
  });
  await db.dataset.createMany({
    data: publicImages.map((img) => ({
      id: img.id,
      attributes: { filename: img.filename, isPrivate: false },
    })),
    skipDuplicates: true,
  });
};

seed();

export default seed;
