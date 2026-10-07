import { Page, Locator } from '@playwright/test';

export class EcommercePage {
  readonly page: Page;
  
  // Cart elements
  readonly cartIcon: Locator;
  readonly cartTotal: Locator;
  readonly addToCartButton: Locator;
  readonly removeFromCartButton: Locator;
  readonly cartItemsList: Locator;
  
  // Discount/Promotion elements
  readonly applyDiscountButton: Locator;
  readonly promoCodeInput: Locator;
  readonly applyPromoButton: Locator;
  readonly discountAmount: Locator;
  readonly discountMessage: Locator;
  
  // Checkout elements
  readonly checkoutButton: Locator;
  readonly subtotalAmount: Locator;
  readonly finalTotalAmount: Locator;
  
  // Payment elements
  readonly paymentMethodCash: Locator;
  readonly paymentMethodQRIS: Locator;
  readonly splitPaymentCheckbox: Locator;
  readonly cashAmountInput: Locator;
  readonly qrisAmountInput: Locator;
  readonly confirmPaymentButton: Locator;
  readonly paymentStatus: Locator;
  
  // Receipt elements
  readonly printReceiptButton: Locator;
  readonly sendDigitalReceiptButton: Locator;
  readonly emailInput: Locator;
  readonly receiptDetails: Locator;
  
  // Transaction completion
  readonly completionMessage: Locator;
  readonly transactionId: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Cart - using getByRole and getByText
    this.cartIcon = page.getByRole('button', { name: /cart/i });
    this.cartTotal = page.getByText(/total:/i);
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.removeFromCartButton = page.getByRole('button', { name: /remove/i });
    this.cartItemsList = page.getByRole('list', { name: /cart items/i });
    
    // Discount/Promotion
    this.applyDiscountButton = page.getByRole('button', { name: /apply discount|apply promotion/i });
    this.promoCodeInput = page.getByRole('textbox', { name: /promo code|coupon/i });
    this.applyPromoButton = page.getByRole('button', { name: /apply promo|apply code/i });
    this.discountAmount = page.getByText(/discount:/i);
    this.discountMessage = page.getByText(/discount applied|promo applied/i);
    
    // Checkout
    this.checkoutButton = page.getByRole('button', { name: /checkout|proceed/i });
    this.subtotalAmount = page.getByText(/subtotal:/i);
    this.finalTotalAmount = page.getByText(/final total|total amount:/i);
    
    // Payment
    this.paymentMethodCash = page.getByRole('radio', { name: /cash|tunai/i });
    this.paymentMethodQRIS = page.getByRole('radio', { name: /qris/i });
    this.splitPaymentCheckbox = page.getByRole('checkbox', { name: /split payment/i });
    this.cashAmountInput = page.getByLabel(/cash amount/i);
    this.qrisAmountInput = page.getByLabel(/qris amount/i);
    this.confirmPaymentButton = page.getByRole('button', { name: /confirm payment|pay now/i });
    this.paymentStatus = page.getByText(/payment approved|payment pending|payment failed/i);
    
    // Receipt
    this.printReceiptButton = page.getByRole('button', { name: /print receipt/i });
    this.sendDigitalReceiptButton = page.getByRole('button', { name: /send digital receipt|email receipt/i });
    this.emailInput = page.getByLabel(/email/i);
    this.receiptDetails = page.getByText(/receipt|transaction details/i);
    
    // Completion
    this.completionMessage = page.getByText(/transaction complete|order complete|success/i);
    this.transactionId = page.getByText(/transaction id|order id/i);
  }

  /**
   * Navigate to e-commerce site
   * @param url - URL of the e-commerce application
   */
  async goto(url: string) {
    await this.page.goto(url);
  }

  /**
   * Add product to cart
   * @param productName - Name of the product to add
   */
  async addProductToCart(productName: string) {
    const product = this.page.getByRole('button', { name: new RegExp(productName, 'i') });
    await product.click();
    await this.addToCartButton.click();
  }

  /**
   * Add product to cart by index
   * @param index - Index of add to cart button
   */
  async addProductToCartByIndex(index: number) {
    await this.addToCartButton.nth(index).click();
  }

  /**
   * Remove item from cart
   * @param itemName - Name of item to remove
   */
  async removeItemFromCart(itemName: string) {
    const item = this.page.getByText(itemName);
    await item.hover();
    await this.removeFromCartButton.first().click();
  }

  /**
   * Get cart total amount
   */
  async getCartTotal(): Promise<string> {
    const totalText = await this.cartTotal.textContent();
    return totalText?.replace(/[^0-9]/g, '') || '0';
  }

  /**
   * Apply discount/promotion automatically
   */
  async applyDiscount() {
    await this.applyDiscountButton.click();
  }

  /**
   * Enter and apply promo code
   * @param promoCode - Promo code to apply
   */
  async applyPromoCode(promoCode: string) {
    await this.promoCodeInput.fill(promoCode);
    await this.applyPromoButton.click();
  }

  /**
   * Check if discount is applied
   */
  async isDiscountApplied(): Promise<boolean> {
    return await this.discountAmount.isVisible();
  }

  /**
   * Get discount amount
   */
  async getDiscountAmount(): Promise<string> {
    const discountText = await this.discountAmount.textContent();
    return discountText?.replace(/[^0-9]/g, '') || '0';
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Select payment method
   * @param method - 'cash' or 'qris'
   */
  async selectPaymentMethod(method: 'cash' | 'qris') {
    if (method === 'cash') {
      await this.paymentMethodCash.check();
    } else {
      await this.paymentMethodQRIS.check();
    }
  }

  /**
   * Enable split payment
   */
  async enableSplitPayment() {
    await this.splitPaymentCheckbox.check();
  }

  /**
   * Enter split payment amounts
   * @param cashAmount - Amount to pay by cash (40%)
   * @param qrisAmount - Amount to pay by QRIS (60%)
   */
  async enterSplitPaymentAmounts(cashAmount: string, qrisAmount: string) {
    await this.cashAmountInput.fill(cashAmount);
    await this.qrisAmountInput.fill(qrisAmount);
  }

  /**
   * Setup split payment 40:60
   * @param totalAmount - Total amount to split
   */
  async setupSplitPayment40_60(totalAmount: number) {
    await this.enableSplitPayment();
    
    const cashAmount = Math.floor(totalAmount * 0.4);
    const qrisAmount = Math.floor(totalAmount * 0.6);
    
    await this.enterSplitPaymentAmounts(cashAmount.toString(), qrisAmount.toString());
  }

  /**
   * Confirm and process payment
   */
  async confirmPayment() {
    await this.confirmPaymentButton.click();
  }

  /**
   * Complete full split payment flow
   * @param totalAmount - Total transaction amount
   */
  async completeSplitPayment40_60(totalAmount: number) {
    await this.setupSplitPayment40_60(totalAmount);
    await this.confirmPayment();
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(): Promise<string | null> {
    return await this.paymentStatus.textContent();
  }

  /**
   * Check if payment is approved
   */
  async isPaymentApproved(): Promise<boolean> {
    const status = await this.getPaymentStatus();
    return status?.toLowerCase().includes('approved') || false;
  }

  /**
   * Print receipt
   */
  async printReceipt() {
    await this.printReceiptButton.click();
  }

  /**
   * Send digital receipt
   * @param email - Email address to send receipt
   */
  async sendDigitalReceipt(email: string) {
    await this.emailInput.fill(email);
    await this.sendDigitalReceiptButton.click();
  }

  /**
   * Check if transaction is completed
   */
  async isTransactionCompleted(): Promise<boolean> {
    return await this.completionMessage.isVisible();
  }

  /**
   * Get transaction ID
   */
  async getTransactionId(): Promise<string | null> {
    const idText = await this.transactionId.textContent();
    return idText?.match(/[A-Z0-9-]+/)?.[0] || null;
  }

  /**
   * Get error message
   * @param errorText - Expected error text
   */
  getErrorMessage(errorText: string) {
    return this.page.getByText(errorText, { exact: false });
  }

  /**
   * Get final total amount
   */
  async getFinalTotal(): Promise<number> {
    const totalText = await this.finalTotalAmount.textContent();
    const amount = totalText?.replace(/[^0-9]/g, '') || '0';
    return parseInt(amount);
  }

  /**
   * Verify discount eligibility message
   */
  async getDiscountEligibilityMessage() {
    return this.page.getByText(/add.*more for discount/i);
  }
}
