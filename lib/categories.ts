export type ProductCategory = {
  value: string;
  label: string;
  sortOrder: number;
};

export type AdminProductCategory = ProductCategory & {
  productCount: number;
};

export const defaultProductCategories: ProductCategory[] = [
  { value: "mens", label: "男装", sortOrder: 1 },
  { value: "womens", label: "女装", sortOrder: 2 },
  { value: "footwear", label: "鞋履", sortOrder: 3 },
  { value: "accessories", label: "配饰", sortOrder: 4 },
  { value: "slides", label: "拖鞋", sortOrder: 5 }
];

export function normalizeCategoryValue(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
