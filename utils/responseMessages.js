const message = {
  success: {
    buy: (quantity) =>
      `Congratulations! You have successfully bought ${quantity} Passes `,

    cancel: (quantity) => `You have successfully cancel ${quantity} Passes `,

    update: (data) => `${data} updated successfuly`,
  },
  error: {
    buy: (available) =>
      `Can not buy more than available quantity.Available passes are ${available}`,

    cancel: (bought) =>
      `Can not cancel more than you have bought.You have bought ${bought} passes`,
  },
};
module.exports = message;
