export const product = {
  idType: "string",
  list: { deleteable: true, viewable: true },
  includes: { status: true, brand: true, category: true, location: true, subcategory: true },
  col: [
    { name: "name", label: "Name", w: 220 },
    { name: "desc", label: "Description", w: "auto" },
    { name: "status", label: "Status", w: "auto" },
    { name: "brand", label: "Brand", w: "auto" },
    { name: "category", label: "Category", w: "auto" },
    { name: "location", label: "Location", w: "auto" },
    { name: "subcategory", label: "Subcategory", w: "auto" },
  ],

  datamap: (d) => {
    return {
      id: d.id,
      name: d.name,
      desc: d.desc,
      status: d?.status?.deleted_at ? "unknown" : d?.status?.name,
      brand: d?.brand?.name,
      category: d?.category?.name,
      subcategory: d?.subcategory?.name,
      location: d?.location?.name,
    };
  },
};
