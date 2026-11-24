import { PaymentPanel } from '../organisms';

interface PaymentTemplateProps {
  amount: number;
  onPay: () => void;
}

export function PaymentTemplate({ amount, onPay }: PaymentTemplateProps) {
  return (
    <div className="relative min-h-screen">
      {/* Background books illustration */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 50%, #0d2137 100%)',
        }}
      >
        {/* Decorative book images */}
        <img
          src="https://picsum.photos/seed/book1/300/300"
          alt=""
          aria-hidden="true"
          className="absolute top-8 left-16 w-40 h-48 object-cover opacity-70 rotate-[-15deg]"
        />
        <img
          src="https://picsum.photos/seed/book2/200/280"
          alt=""
          aria-hidden="true"
          className="absolute bottom-16 left-24 w-32 h-44 object-cover opacity-70 rotate-[8deg]"
        />
        <img
          src="https://picsum.photos/seed/book3/180/260"
          alt=""
          aria-hidden="true"
          className="absolute bottom-20 right-1/3 w-32 h-44 object-cover opacity-70 rotate-[-5deg]"
        />
        <img
          src="https://picsum.photos/seed/book4/200/300"
          alt=""
          aria-hidden="true"
          className="absolute top-12 right-16 w-16 h-40 object-cover opacity-70"
        />
      </div>

      {/* Centered payment panel */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-10">
        <div className="w-full max-w-2xl">
          <PaymentPanel amount={amount} onPay={onPay} />
        </div>
      </div>
    </div>
  );
}
