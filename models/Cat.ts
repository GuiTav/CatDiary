import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { imageTable } from "./Image";

export const catTable = sqliteTable("catTable", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  birthdate: text().notNull(),
  race: text().notNull(),
  sex: text().notNull(),
});

export function catAccumulator(rows: joinCatImage[]) {
  return rows.reduce<catAccumulatorResult[]>((acc, row) => {
    const cat = row.catTable;
    const image = row.imageTable;

    if (!acc.some((value) => value.id === cat.id)) {
      acc.push({ ...cat, images: [] });
    }

    if (image) {
      acc[acc.length - 1].images.push(image);
    }

    return acc;
  }, []);
}

export type joinCatImage = {
  catTable: typeof catTable.$inferSelect;
  imageTable: typeof imageTable.$inferSelect | null;
};

export type catAccumulatorResult = typeof catTable.$inferSelect & {
  images: (typeof imageTable.$inferSelect)[];
};
