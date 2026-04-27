import PolicyLayout from "@/components/PolicyLayout";

export default function Disclaimer() {
  return (
    <PolicyLayout title="Disclaimer" lastUpdated={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}>
      <section>
        <p className="lead">
          The information and tools provided by NERV-VIPER are intended for educational, research, and authorized security testing purposes only.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Authorized Use Only</h2>
        <p>
          NERV-VIPER is an advanced security orchestration framework. You must only use this tool to scan, test, and analyze systems, networks, and applications that you own or have explicit written authorization to test. Unauthorized use of this tool against targets without permission is strictly prohibited and may violate local, state, national, and international laws.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. No Warranty</h2>
        <p>
          The software and services are provided "as is" and "as available," without warranty of any kind, express or implied. We do not guarantee that the framework will detect all vulnerabilities, nor do we guarantee that the systems tested are completely secure even if no vulnerabilities are found.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Limitation of Liability</h2>
        <p>
          In no event shall the creators, authors, or contributors of NERV-VIPER be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this software, even if advised of the possibility of such damage.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. User Responsibility</h2>
        <p>
          By using NERV-VIPER, you assume full responsibility for your actions. Any damage caused by the use or misuse of this tool is the sole responsibility of the user. We assume no liability and are not responsible for any misuse or damage caused by this program.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Contact Information</h2>
        <p>
          If you have any questions regarding this disclaimer, please contact:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li><strong>Email:</strong> <a href="mailto:angshuganguly111@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors">angshuganguly111@gmail.com</a></li>
        </ul>
      </section>
    </PolicyLayout>
  );
}
