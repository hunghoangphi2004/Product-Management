module.exports.priceNewProducts = (products) => {
    const newProducts = products.map(item => {
        item.priceNew = item.price - (item.price * item.discountPercentage / 100).toFixed(1);
        return item;
    })
    return newProducts;
}

// module.exports.priceNewProduct = (product) => {
//     const priceNew = Number(product.price - (product.price * product.discountPercentage / 100).toFixed(0));
//     return priceNew
// }
module.exports.priceNewProduct = (product) => {
  return Math.round(product.price - (product.price * product.discountPercentage / 100));
};
