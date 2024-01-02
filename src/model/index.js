import { user } from "./user";
import { product } from "./product";
import { project } from "./project";
import { projectfeedback } from "./projectfeedback";
import { projectreference } from "./projectreference";
import { subcategory } from "./subcategory";
import { projecttask } from "./projecttask";
import { status } from "./status";

const default_col = [
  { name: "name", label: "Name", w: 220 },
  { name: "desc", label: "Description", w: "auto" },
];

const default_datamap = (d) => {
  return {
    ...d,
  };
};

function getDefault(target) {
  switch (target) {
    case "datamap":
      return default_datamap;
    case "col":
      return default_col;
    case "includes":
      return {};
    default:
      return null;
  }
}

export function getInfo(model, target) {
  const lib = { user, product, project, projectreference, subcategory, projectfeedback, projecttask, status };

  return target ? lib?.[model]?.[target] || getDefault(target) : lib?.[model];
}
