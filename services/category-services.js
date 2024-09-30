const {
  fetchCategoriesData,
  deleteCategoryData,
} = require("../data/category-data");

exports.getCategories = async () => {
  return await fetchCategoriesData();
};

exports.deleteCategory = async (categoryId) => {
  return await deleteCategoryData(categoryId);
};
