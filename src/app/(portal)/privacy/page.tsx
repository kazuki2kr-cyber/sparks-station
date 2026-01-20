
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | Sparks Station',
};

export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <header className="space-y-4 border-b border-neutral-800 pb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
                <p className="text-neutral-400">Last updated: January 20, 2026</p>
            </header>

            <div className="prose prose-invert prose-emerald max-w-none text-neutral-300">
                <h2>1. Introduction</h2>
                <p>
                    At Sparks Station ("we," "our," or "us"), we respect your privacy and are committed to protecting it through our compliance with this policy.
                </p>

                <h2>2. Data Collection</h2>
                <p>
                    We do not collect personal information unless you voluntarily provide it (e.g., via contact forms). However, we may use third-party tools that collect non-personal data.
                </p>

                <h2>3. Cookies and Web Beacons</h2>
                <p>
                    Like any other website, Sparks Station uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                </p>

                <h2>4. DoubleClick DART Cookie</h2>
                <p>
                    Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-emerald-400 hover:text-emerald-300 underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
                </p>

                <h2>5. Advertising Partners Privacy Policies</h2>
                <p>
                    You may consult this list to find the Privacy Policy for each of the advertising partners of Sparks Station.
                    <br />
                    Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Sparks Station, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
                    <br />
                    Note that Sparks Station has no access to or control over these cookies that are used by third-party advertisers.
                </p>

                <h2>6. Third Party Privacy Policies</h2>
                <p>
                    Sparks Station's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                </p>

                <h2>7. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us.
                </p>
            </div>
        </div>
    );
}
