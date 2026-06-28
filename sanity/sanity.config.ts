import { defineConfig } from "sanity";
import { structureTool, type ListItemBuilder, type StructureResolver } from "sanity/structure";

import { schemaTypes } from "./schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "replaceid";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "development";
const singletonDocumentTypes = new Set(["settings"]);

const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Settings")
        .schemaType("settings")
        .child(S.editor().title("Settings").schemaType("settings").documentId("settings")),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem: ListItemBuilder) => {
        const id = listItem.getId();

        return Boolean(id && !singletonDocumentTypes.has(id));
      }),
    ]);

export default defineConfig({
  name: "elreda-website",
  title: "elReda Website",
  projectId,
  dataset,
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});
