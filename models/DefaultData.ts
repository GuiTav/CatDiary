import { db } from "@/app/_layout";
import { catTable } from "./Cat";
import { imageTable } from "./Image";

export async function createDefaultData() {
  await db.insert(catTable).values([
    {
      id: 1,
      name: "Jorge",
      race: "SRD",
      birthdate: new Date(2020, 9).toISOString(),
      sex: 'Macho'
    },
    {
      id: 2,
      name: "Romeu",
      race: "Persa",
      birthdate: new Date(2021, 0).toISOString(),
      sex: 'Macho'
    },
    {
      id: 3,
      name: "Ravena",
      description: "Uma gata preta manhosa que mia bastante, dorme ao lado e passa no meio das suas pernas enquanto anda, então tome cuidado pra não cair!",
      race: "SRD",
      birthdate: new Date(2024, 11).toISOString(),
      sex: 'Fêmea'
    },
    {
      id: 4,
      name: "Estelar",
      description: "Gatinha tricolor beeeem peluda, uma delícia de passar a mão. Evite dormir com ela por perto pois qualquer movimento embaixo da coberta vira uma caçada",
      race: "SRD",
      birthdate: new Date(2024, 10).toISOString(),
      sex: 'Fêmea'
    },
  ]).onConflictDoNothing();

  await db.insert(imageTable).values([
    {
        id: 1,
        catId: 1,
        base64: 'iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg=='
    },
    // {
    //   id: 2,
    //   catId: 3,
    //   base64: 
    // }
  ]).onConflictDoNothing();
}
