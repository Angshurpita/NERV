import PolicyLayout from "@/components/PolicyLayout";

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}>
      <section>
        <p className="lead">
          Your privacy is critically important to us. This Privacy Policy outlines the types of information we collect, how it is used, and how we protect your data when you use the NERV-VIPER framework and our website.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Personal Information:</strong> When you create an account, purchase a subscription, or contact us, we may collect personal information such as your name, email address, and payment information (handled securely by our payment processors).</li>
          <li><strong>Usage Data:</strong> We automatically collect certain information when you visit, use, or navigate our services. This may include your IP address, browser and device characteristics, operating system, referring URLs, and information about how and when you use our services.</li>
          <li><strong>Telemetry Data:</strong> The NERV-VIPER CLI may collect anonymized telemetry data regarding scan durations, AI model utilization, and error rates to help us improve the framework. <em>We do not collect or store the source code or specific vulnerabilities found in your repositories unless explicitly shared with us for support.</em></li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use personal information collected via our website for a variety of business purposes described below:</p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>To facilitate account creation and logon process.</li>
          <li>To fulfill and manage your orders, payments, and subscriptions.</li>
          <li>To send administrative information to you, such as product updates or changes to our terms.</li>
          <li>To protect our services from fraud and abuse.</li>
          <li>To request feedback and contact you about your use of our Services.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Sharing Your Information</h2>
        <p>
          We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may share your data with third-party vendors, service providers, or contractors who perform services for us or on our behalf (e.g., payment processing, data analysis, email delivery, hosting services).
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Contact Information</h2>
        <p>
          If you have questions or comments about this Privacy Policy, you may email us at:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li><strong>Email:</strong> <a href="mailto:angshuganguly111@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">angshuganguly111@gmail.com</a></li>
        </ul>
      </section>
    </PolicyLayout>
  );
}
