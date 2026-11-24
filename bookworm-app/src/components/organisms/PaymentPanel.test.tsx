import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PaymentPanel } from './PaymentPanel';

type Props = React.ComponentProps<typeof PaymentPanel>;

const renderPanel = (props: Partial<Props> = {}) => {
  const onPay = vi.fn();
  render(
    <PaymentPanel amount={29.1} walletBalance={100} processing={false} error={null} fieldErrors={{}} onPay={onPay} {...props} />
  );
  return { onPay };
};

const fillCard = async (number = '4242424242424242') => {
  await userEvent.type(screen.getByLabelText('Card Number'), number);
  await userEvent.type(screen.getByLabelText('Name on Card'), 'Aarav Mehta');
  await userEvent.type(screen.getByLabelText('CVV'), '123');
  await userEvent.type(screen.getByLabelText('Date of Expiry'), '122099');
};

describe('PaymentPanel', () => {
  it('shows the payable amount in dollars', () => {
    renderPanel({ amount: 1234.5 });
    expect(screen.getByText('Payable Amount: $1,234.50')).toBeInTheDocument();
  });

  it('offers the four payment methods and starts on Credit Card', () => {
    renderPanel();
    ['Credit Card', 'Debit card', 'UPI', 'Wallet'].forEach((name) => {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Credit Card' })).toHaveClass('border-accent-blue');
    expect(screen.getByLabelText('Card Number')).toBeInTheDocument();
  });

  describe('card form', () => {
    it('groups the card number in blocks of four and limits it to 16 digits', async () => {
      renderPanel();
      const number = screen.getByLabelText('Card Number');
      await userEvent.type(number, '4242a4242 4242-42421234');
      expect(number).toHaveValue('4242-4242-4242-4242');
    });

    it('inserts the slash in the expiry date and limits it to MM/YYYY', async () => {
      renderPanel();
      const expiry = screen.getByLabelText('Date of Expiry');
      await userEvent.type(expiry, '1220999');
      expect(expiry).toHaveValue('12/2099');
    });

    it('keeps only digits in the CVV, limited to 4, and hides them', async () => {
      renderPanel();
      const cvv = screen.getByLabelText('CVV');
      await userEvent.type(cvv, '1a2b3c456');
      expect(cvv).toHaveValue('1234');
      expect(cvv).toHaveAttribute('type', 'password');
    });

    it('does not validate the card number itself (the gateway decides)', async () => {
      const { onPay } = renderPanel();
      await fillCard('1234');
      await userEvent.click(screen.getByRole('button', { name: /Pay Now/ }));
      expect(onPay).toHaveBeenCalledTimes(1);
    });

    it('pays by credit card with the typed details', async () => {
      const { onPay } = renderPanel();
      await fillCard();
      await userEvent.click(screen.getByRole('button', { name: /Pay Now/ }));
      expect(onPay).toHaveBeenCalledWith({
        method: 'CREDIT_CARD',
        cardNumber: '4242-4242-4242-4242',
        nameOnCard: 'Aarav Mehta',
        cvv: '123',
        expiry: '12/2099',
      });
    });

    it('pays by debit card after switching tabs', async () => {
      const { onPay } = renderPanel();
      await userEvent.click(screen.getByRole('button', { name: 'Debit card' }));
      await fillCard();
      await userEvent.click(screen.getByRole('button', { name: /Pay Now/ }));
      expect(onPay).toHaveBeenCalledWith(expect.objectContaining({ method: 'DEBIT_CARD' }));
    });

    it('pays when the form is submitted with Enter', async () => {
      const { onPay } = renderPanel();
      await userEvent.type(screen.getByLabelText('Name on Card'), 'A{Enter}');
      expect(onPay).toHaveBeenCalledTimes(1);
    });

    it('shows the gateway field errors under the fields', () => {
      renderPanel({
        fieldErrors: { nameOnCard: 'Name on card is required', cvv: 'CVV must be 3 or 4 digits', expiry: 'This card has expired' },
      });
      expect(screen.getByText('Name on card is required')).toBeInTheDocument();
      expect(screen.getByText('CVV must be 3 or 4 digits')).toBeInTheDocument();
      expect(screen.getByText('This card has expired')).toBeInTheDocument();
    });

    it('shows the demo hint', () => {
      renderPanel();
      expect(screen.getByText(/any card number is accepted/i)).toBeInTheDocument();
    });
  });

  describe('UPI', () => {
    it('pays with the typed UPI id', async () => {
      const { onPay } = renderPanel();
      await userEvent.click(screen.getByRole('button', { name: 'UPI' }));
      await userEvent.type(screen.getByLabelText('UPI ID'), 'aarav@okbank');
      await userEvent.click(screen.getByRole('button', { name: /Pay Now/ }));
      expect(onPay).toHaveBeenCalledWith({ method: 'UPI', vpa: 'aarav@okbank' });
    });

    it('shows the UPI field error', async () => {
      renderPanel({ fieldErrors: { vpa: 'Enter a valid UPI ID, e.g. name@bank' } });
      await userEvent.click(screen.getByRole('button', { name: 'UPI' }));
      expect(screen.getByText('Enter a valid UPI ID, e.g. name@bank')).toBeInTheDocument();
    });
  });

  describe('wallet', () => {
    it('shows the available balance', async () => {
      renderPanel({ walletBalance: 100 });
      await userEvent.click(screen.getByRole('button', { name: 'Wallet' }));
      expect(screen.getByText('Available balance')).toBeInTheDocument();
      expect(screen.getByText('$100.00')).toBeInTheDocument();
    });

    it('pays from the wallet', async () => {
      const { onPay } = renderPanel({ walletBalance: 100 });
      await userEvent.click(screen.getByRole('button', { name: 'Wallet' }));
      await userEvent.click(screen.getByRole('button', { name: /Pay Now/ }));
      expect(onPay).toHaveBeenCalledWith({ method: 'WALLET' });
    });

    it('warns when the balance is below the payable amount', async () => {
      renderPanel({ walletBalance: 5, amount: 29.1 });
      await userEvent.click(screen.getByRole('button', { name: 'Wallet' }));
      expect(screen.getByRole('status')).toHaveTextContent('Your wallet balance is below the payable amount.');
    });

    it('does not warn when the balance covers the amount', async () => {
      renderPanel({ walletBalance: 29.1, amount: 29.1 });
      await userEvent.click(screen.getByRole('button', { name: 'Wallet' }));
      expect(screen.queryByRole('status')).toBeNull();
    });
  });

  describe('processing and errors', () => {
    it('shows the gateway error', () => {
      renderPanel({ error: 'Your card was declined by the bank. Try another card.' });
      expect(screen.getByRole('alert')).toHaveTextContent('Your card was declined by the bank. Try another card.');
    });

    it('shows no alert without an error', () => {
      renderPanel();
      expect(screen.queryByRole('alert')).toBeNull();
    });

    it('disables Pay Now and the tabs while processing', () => {
      renderPanel({ processing: true });
      expect(screen.getByRole('button', { name: /Processing…/ })).toBeDisabled();
      ['Credit Card', 'Debit card', 'UPI', 'Wallet'].forEach((name) => {
        expect(screen.getByRole('button', { name })).toBeDisabled();
      });
    });
  });

  it('is square (no rounded classes)', () => {
    const { container } = render(
      <PaymentPanel amount={1} walletBalance={0} processing={false} error={null} fieldErrors={{}} onPay={() => {}} />
    );
    expect(container.innerHTML).not.toMatch(/rounded/);
  });
});
