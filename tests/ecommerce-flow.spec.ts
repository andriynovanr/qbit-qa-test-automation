import { test, expect } from '@playwright/test';
import { EcommercePage } from '../pages/EcommercePage';

// Update URL ini dengan aplikasi yang sebenarnya
const BASE_URL = 'https://example.com/shop';

test.describe('Pengujian Flow E-commerce - Split Payment & Diskon', () => {
  let ecommercePage: EcommercePage;

  test.beforeEach(async ({ page }) => {
    ecommercePage = new EcommercePage(page);
    await ecommercePage.goto(BASE_URL);
  });

  test.describe('Pengujian Split Payment 40:60', () => {
    
    test('Verifikasi split payment 40:60 Tunai dan QRIS berhasil', async () => {
      await ecommercePage.addProductToCartByIndex(0);
      
      const cartTotal = await ecommercePage.getCartTotal();
      const totalAmount = parseInt(cartTotal);
      expect(totalAmount).toBeGreaterThanOrEqual(100000);
      
      await ecommercePage.proceedToCheckout();
      await ecommercePage.setupSplitPayment40_60(totalAmount);
      await ecommercePage.confirmPayment();
      
      const isApproved = await ecommercePage.isPaymentApproved();
      expect(isApproved).toBeTruthy();
      
      const isCompleted = await ecommercePage.isTransactionCompleted();
      expect(isCompleted).toBeTruthy();
    });

    test('Verifikasi perhitungan split payment 40:60 akurat', async () => {
      const totalAmount = 250000;
      const expectedCash = totalAmount * 0.4; // 100.000
      const expectedQRIS = totalAmount * 0.6; // 150.000
      
      await ecommercePage.enableSplitPayment();
      await ecommercePage.enterSplitPaymentAmounts(
        expectedCash.toString(),
        expectedQRIS.toString()
      );
      
      const cashValue = await ecommercePage.cashAmountInput.inputValue();
      const qrisValue = await ecommercePage.qrisAmountInput.inputValue();
      
      expect(parseInt(cashValue)).toBe(expectedCash);
      expect(parseInt(qrisValue)).toBe(expectedQRIS);
    });

    test('Verifikasi validasi pembayaran tunai kurang', async () => {
      const totalAmount = 100000;
      const insufficientCash = 30000; // Kurang dari 40% yang seharusnya 40.000
      
      await ecommercePage.enableSplitPayment();
      await ecommercePage.enterSplitPaymentAmounts(
        insufficientCash.toString(),
        '60000'
      );
      await ecommercePage.confirmPayment();
      
      const errorMessage = await ecommercePage.getErrorMessage('minimal');
      await expect(errorMessage).toBeVisible();
    });

    test('Verifikasi penanganan gagal bayar QRIS', async () => {
      const totalAmount = 100000;
      
      await ecommercePage.setupSplitPayment40_60(totalAmount);
      await ecommercePage.confirmPayment();
      
      const paymentStatus = await ecommercePage.getPaymentStatus();
      expect(paymentStatus).toBeTruthy();
    });

    test('Verifikasi split payment dengan total tidak sesuai', async () => {
      const totalAmount = 100000;
      
      await ecommercePage.enableSplitPayment();
      await ecommercePage.enterSplitPaymentAmounts('30000', '50000'); // Total 80.000, tidak sama dengan 100.000
      await ecommercePage.confirmPayment();
      
      const errorMessage = await ecommercePage.getErrorMessage('harus sama dengan total');
      await expect(errorMessage).toBeVisible();
    });
  });

  test.describe('Pengujian Diskon - Minimal Belanja Rp 100.000', () => {
    
    test('Verifikasi diskon tidak berlaku jika belum minimal', async () => {
      await ecommercePage.proceedToCheckout();
      
      const isDiscountApplied = await ecommercePage.isDiscountApplied();
      expect(isDiscountApplied).toBeFalsy();
      
      const eligibilityMessage = await ecommercePage.getDiscountEligibilityMessage();
      await expect(eligibilityMessage).toBeVisible();
    });

    test('Verifikasi diskon diterapkan tepat Rp 100.000', async () => {
      await ecommercePage.applyDiscount();
      
      const isDiscountApplied = await ecommercePage.isDiscountApplied();
      expect(isDiscountApplied).toBeTruthy();
      
      const discountAmount = await ecommercePage.getDiscountAmount();
      expect(parseInt(discountAmount)).toBe(10000); // 10% dari 100.000
      
      const finalTotal = await ecommercePage.getFinalTotal();
      expect(finalTotal).toBe(90000); // 100.000 - 10.000
    });

    test('Verifikasi diskon diterapkan di atas minimal', async () => {
      const cartTotal = 150000;
      const expectedDiscount = 15000; // 10%
      const expectedFinal = 135000;
      
      await ecommercePage.applyDiscount();
      
      const isDiscountApplied = await ecommercePage.isDiscountApplied();
      expect(isDiscountApplied).toBeTruthy();
      
      const discountAmount = await ecommercePage.getDiscountAmount();
      expect(parseInt(discountAmount)).toBe(expectedDiscount);
      
      const finalTotal = await ecommercePage.getFinalTotal();
      expect(finalTotal).toBe(expectedFinal);
    });

    test('Verifikasi diskon dengan split payment', async () => {
      const originalAmount = 120000;
      const discountRate = 0.10;
      const discountAmount = originalAmount * discountRate; // 12.000
      const afterDiscount = originalAmount - discountAmount; // 108.000
      
      await ecommercePage.applyDiscount();
      
      const finalTotal = await ecommercePage.getFinalTotal();
      expect(finalTotal).toBe(afterDiscount);
      
      await ecommercePage.proceedToCheckout();
      
      const expectedCash = afterDiscount * 0.4; // 43.200
      const expectedQRIS = afterDiscount * 0.6; // 64.800
      
      await ecommercePage.setupSplitPayment40_60(afterDiscount);
      
      const cashValue = await ecommercePage.cashAmountInput.inputValue();
      const qrisValue = await ecommercePage.qrisAmountInput.inputValue();
      
      expect(parseInt(cashValue)).toBe(expectedCash);
      expect(parseInt(qrisValue)).toBe(expectedQRIS);
    });

    test('Verifikasi diskon hilang ketika total di bawah minimal', async () => {
      await ecommercePage.applyDiscount();
      
      let isDiscountApplied = await ecommercePage.isDiscountApplied();
      expect(isDiscountApplied).toBeTruthy();
      
      await ecommercePage.removeItemFromCart('Nama Barang');
      
      isDiscountApplied = await ecommercePage.isDiscountApplied();
      expect(isDiscountApplied).toBeFalsy();
    });

    test('Verifikasi apply kode promo manual', async () => {
      const promoCode = 'DISC10';
      
      await ecommercePage.applyPromoCode(promoCode);
      
      const isDiscountApplied = await ecommercePage.isDiscountApplied();
      expect(isDiscountApplied).toBeTruthy();
    });

    test('Verifikasi validasi kode promo tidak valid', async () => {
      const invalidCode = 'INVALID123';
      
      await ecommercePage.applyPromoCode(invalidCode);
      
      const errorMessage = await ecommercePage.getErrorMessage('tidak valid');
      await expect(errorMessage).toBeVisible();
    });

    test('Verifikasi pembulatan perhitungan diskon', async () => {
      const cartTotal = 103500;
      const expectedDiscount = 10350; // 10% dari 103.500
      const expectedFinal = 93150;
      
      await ecommercePage.applyDiscount();
      
      const discountAmount = await ecommercePage.getDiscountAmount();
      expect(parseInt(discountAmount)).toBe(expectedDiscount);
      
      const finalTotal = await ecommercePage.getFinalTotal();
      expect(finalTotal).toBe(expectedFinal);
    });
  });

  test.describe('Pengujian Keranjang & Checkout', () => {
    
    test('Verifikasi tambah barang ke keranjang', async () => {
      await ecommercePage.addProductToCartByIndex(0);
      
      const cartTotal = await ecommercePage.getCartTotal();
      expect(parseInt(cartTotal)).toBeGreaterThan(0);
    });

    test('Verifikasi perhitungan total dengan beberapa barang', async () => {
      await ecommercePage.addProductToCartByIndex(0); // 50.000
      await ecommercePage.addProductToCartByIndex(1); // 30.000
      await ecommercePage.addProductToCartByIndex(1); // 30.000
      await ecommercePage.addProductToCartByIndex(2); // 25.000
      
      const cartTotal = await ecommercePage.getCartTotal();
      expect(parseInt(cartTotal)).toBe(135000); // Total: 135.000
    });

    test('Verifikasi hapus barang dari keranjang', async () => {
      await ecommercePage.addProductToCartByIndex(0);
      await ecommercePage.addProductToCartByIndex(1);
      
      const initialTotal = await ecommercePage.getCartTotal();
      
      await ecommercePage.removeItemFromCart('Nama Barang');
      
      const newTotal = await ecommercePage.getCartTotal();
      expect(parseInt(newTotal)).toBeLessThan(parseInt(initialTotal));
    });

    test('Verifikasi pembatalan transaksi sebelum bayar', async () => {
      await ecommercePage.addProductToCartByIndex(0);
      await ecommercePage.proceedToCheckout();
      
      await ecommercePage.page.goBack();
      
      const cartTotal = await ecommercePage.getCartTotal();
      expect(parseInt(cartTotal)).toBeGreaterThan(0);
    });
  });

  test.describe('Pengujian Pembayaran & Struk', () => {
    
    test('TC-EC-016: Verifikasi input informasi pembayaran valid', async () => {
      await ecommercePage.addProductToCartByIndex(0);
      await ecommercePage.proceedToCheckout();
      await ecommercePage.selectPaymentMethod('qris');
      await ecommercePage.confirmPayment();
      
      const paymentStatus = await ecommercePage.getPaymentStatus();
      expect(paymentStatus).toBeTruthy();
    });

    test('Verifikasi alur pembayaran disetujui', async () => {
      await ecommercePage.addProductToCartByIndex(0);
      await ecommercePage.proceedToCheckout();
      await ecommercePage.selectPaymentMethod('qris');
      await ecommercePage.confirmPayment();
      
      const isApproved = await ecommercePage.isPaymentApproved();
      expect(isApproved).toBeTruthy();
      
      const isCompleted = await ecommercePage.isTransactionCompleted();
      expect(isCompleted).toBeTruthy();
    });

    test('Verifikasi pembuatan struk cetak', async () => {
      await ecommercePage.addProductToCartByIndex(0);
      await ecommercePage.proceedToCheckout();
      await ecommercePage.selectPaymentMethod('cash');
      await ecommercePage.confirmPayment();
      await ecommercePage.printReceipt();
      
      await expect(ecommercePage.printReceiptButton).toBeVisible();
    });

    test('Verifikasi pembuatan struk digital', async () => {
      await ecommercePage.addProductToCartByIndex(0);
      await ecommercePage.proceedToCheckout();
      await ecommercePage.selectPaymentMethod('qris');
      await ecommercePage.confirmPayment();
      await ecommercePage.sendDigitalReceipt('customer@example.com');
      
      const confirmationMessage = await ecommercePage.page.getByText(/berhasil dikirim/i);
      await expect(confirmationMessage).toBeVisible();
    });

    test('Verifikasi transaksi selesai end-to-end lengkap', async () => {
      await ecommercePage.addProductToCartByIndex(0);
      await ecommercePage.applyDiscount();
      await ecommercePage.proceedToCheckout();
      await ecommercePage.selectPaymentMethod('qris');
      await ecommercePage.confirmPayment();
      
      const isCompleted = await ecommercePage.isTransactionCompleted();
      expect(isCompleted).toBeTruthy();
      
      const transactionId = await ecommercePage.getTransactionId();
      expect(transactionId).toBeTruthy();
    });

    test('Verifikasi pembayaran dengan jumlah nol - edge case', async () => {
      await ecommercePage.proceedToCheckout();
      await ecommercePage.cashAmountInput.fill('0');
      await ecommercePage.confirmPayment();
      
      const errorMessage = await ecommercePage.getErrorMessage('lebih dari nol');
      await expect(errorMessage).toBeVisible();
    });
  });
});
