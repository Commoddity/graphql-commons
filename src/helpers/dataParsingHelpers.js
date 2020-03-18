const flattenUserRelations = (user) => {
  user.bills = user.bills.map((bill) => bill.id);
  user.categories = user.categories.map((category) => category.id);
  return user;
};

module.exports = { flattenUserRelations };
