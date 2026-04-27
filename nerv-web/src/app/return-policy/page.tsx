import PolicyLayout from "@/components/PolicyLayout";

export default function ReturnPolicy() {
  return (
    <PolicyLayout title="Return Policy" lastUpdated={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}>
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Digital Products and Services</h2>
        <p>
          NERV-VIPER provides digital software products, API access, and security orchestration services. Due to the digital nature of our products and immediate access upon purchase, we do not accept returns or exchanges for our software licenses, API credits, or subscription plans.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Exceptions</h2>
        <p>
          If you encounter a critical technical issue that prevents you from accessing or using our services entirely, and our technical support team is unable to resolve the issue within a reasonable timeframe, we may, at our sole discretion, offer an alternative solution or compensation.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Accidental Purchases</h2>
        <p>
          We cannot process returns for accidental purchases of higher-tier plans or additional token credits once the purchase is complete and the credits/access have been allocated to your account. Please review your order carefully before finalizing payment.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Contact Information</h2>
        <p>
          If you have any questions or concerns regarding our Return Policy or if you require technical support, please contact us immediately:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li><strong>Email:</strong> <a href="mailto:angshuganguly111@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">angshuganguly111@gmail.com</a></li>
        </ul>
      </section>
    </PolicyLayout>
  );
}
