import PolicyLayout from "@/components/PolicyLayout";

export default function RefundPolicy() {
  return (
    <PolicyLayout title="Refund Policy" lastUpdated={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}>
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Subscription Refunds</h2>
        <p>
          NERV-VIPER offers a free tier for users to evaluate our services. As such, all purchases for premium subscriptions (Starter, Pro, Elite, etc.) and token top-ups are generally non-refundable once the transaction is complete and access is granted.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Subscription Cancellations</h2>
        <p>
          You may cancel your subscription at any time. Cancellation will take effect at the end of the current billing cycle. You will not receive a refund for the billing cycle in which you cancel, but you will retain access to your premium features until the cycle concludes.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Eligibility for Refunds</h2>
        <p>
          We may grant refunds only in the following exceptional circumstances:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li><strong>Duplicate Charges:</strong> If you were accidentally charged multiple times for the same transaction.</li>
          <li><strong>Fraudulent Charges:</strong> If the purchase was made fraudulently using your payment method (requires verification).</li>
          <li><strong>Service Unavailability:</strong> If our platform experiences extended, unplanned downtime that severely impacts your ability to use the service you paid for, we may issue a prorated refund at our discretion.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Requesting a Refund</h2>
        <p>
          To request a refund under the eligible circumstances, please contact us within 14 days of the original charge. Please provide your account details, transaction ID, and a detailed explanation of the reason for your request.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Contact Information</h2>
        <p>
          To request a refund or if you have any questions regarding billing, please contact us at:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li><strong>Email:</strong> <a href="mailto:angshuganguly111@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">angshuganguly111@gmail.com</a></li>
        </ul>
      </section>
    </PolicyLayout>
  );
}
