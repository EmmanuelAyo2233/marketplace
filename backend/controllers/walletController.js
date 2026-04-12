// @desc    Get logged in user wallet balance
// @route   GET /api/wallets/me
// @access  Private
export const getMyWallet = async (req, res) => {
  res.json({
    balance: req.user.walletBalance,
  });
};

// @desc    Withdraw from wallet
// @route   POST /api/wallets/withdraw
// @access  Private/Vendor
export const withdrawWallet = async (req, res) => {
  const { amount, bankDetails } = req.body;

  if (amount <= 0 || amount > req.user.walletBalance) {
    res.status(400);
    throw new Error('Invalid withdrawal amount');
  }

  // Deduct from wallet
  req.user.walletBalance -= amount;
  await req.user.save();

  // In a real app, integrate with payment provider to transfer funds to vendor's bank

  res.json({
    message: 'Withdrawal successful',
    balance: req.user.walletBalance,
  });
};
