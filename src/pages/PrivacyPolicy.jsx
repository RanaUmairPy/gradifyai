import React, { useEffect } from "react";
import { ShieldCheck, UserCheck, Lock, Mail, ServerCog, Globe, FileText } from "lucide-react";

// --- Enhanced Privacy Policy Content Data (Using HTML <b> Tag) ---
const policySections = [
  {
    icon: UserCheck,
    title: "1. The Data We Securely Collect",
    content: [
      "<b>Account Details:</b> During registration, we collect your name, email, role (<b>Teacher/Student</b>), and a strongly hashed password. This is mandatory for service access.",
      "<b>Educational Data:</b> This includes <b>submitted assignments</b>, custom rubrics, generated grades, and <b>AI-powered feedback</b>. This data is the core of our service delivery.",
      "<b>Usage & Interaction Data:</b> We automatically log data on platform usage (e.g., login times, feature utilization) solely for system maintenance and performance enhancement.",
    ],
  },
  {
    icon: ServerCog,
    title: "2. Purpose of Data Utilization",
    content: [
      "<b>Service Delivery:</b> To provide the designated GradifyAI services, ensuring precise AI grading and personalized, instant feedback.",
      "<b>AI & Platform Improvement:</b> We use <b>aggregated and anonymized data</b> to continually refine our AI models and enhance overall platform stability and user experience.",
      "<b>Essential Communication:</b> To send crucial service updates, security alerts, and to promptly address your support requests.",
    ],
  },
  {
    icon: Lock,
    title: "3. Our Commitment to Data Security",
    content: [
      "<b>Encryption:</b> All data, both <b>in transit and at rest</b>, is protected using state-of-the-art encryption standards (<b>SSL/TLS</b>).",
      "<b>Secure Storage:</b> Passwords are never stored in plain text. We utilize advanced, military-grade cryptographic hashing techniques.",
      "<b>Access Control:</b> Access to educational records is strictly limited. Our servers are located in [<b>Specify Your Secure Cloud Region, e.g., Tier-1 EU Data Centers</b>], adhering to global privacy standards.",
    ],
  },
  {
    icon: Globe,
    title: "4. Information Sharing & Third Parties",
    content: [
      "<b>Zero Selling:</b> GradifyAI absolutely <b>does not sell or rent</b> your personal or educational data to any third party for marketing purposes.",
      "<b>Trusted Partners:</b> Data may be shared with trusted third-party cloud providers (e.g., hosting) only when absolutely necessary to run the service. These partners are legally bound by strict <b>confidentiality agreements</b>.",
      "<b>Legal Disclosure:</b> We will only disclose information if mandated by a valid, legally enforceable government request or court order.",
    ],
  },
  {
    icon: Mail,
    title: "5. Your Data Rights & Contact Information",
    content: [
      "You retain the right to <b>access, modify, or request the deletion</b> of your personal data held by us. Please contact us to exercise these rights.",
      "For any queries regarding this policy or data handling:",
      "<b>Email:</b> privacy@gradifyai.online",
      "<b>Data Protection Officer:</b> GradifyAI Team",
    ],
  },
];

const PrivacyPolicy = () => {
  useEffect(() => {
    // --- SEO Setup for Privacy Policy Page ---
    document.title = "GradifyAI Privacy Policy | Your Data, Our Commitment";
    
    // Helper function to manage meta tags
    const updateMetaTag = (selector, attribute, content) => {
        let tag = document.querySelector(selector);
        if (tag) {
            tag.setAttribute(attribute, content);
        } else {
            tag = document.createElement("meta");
            tag.setAttribute(attribute, selector.includes('name') ? 'name' : 'property');
            tag.content = content;
            document.head.appendChild(tag);
        }
    };

    const description = "Understand how GradifyAI collects, uses, and protects your educational data with our comprehensive Privacy Policy. Your trust and data security are our top priorities.";
    const keywords = "GradifyAI privacy policy, data protection, student data privacy, AI grading security, educational technology privacy, personal information, data usage, GradifyAI legal";

    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="keywords"]', 'content', keywords);

    // Open Graph Tags
    const ogData = [
      { property: "og:title", content: "GradifyAI Privacy Policy | Data Security & Trust" },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://www.gradifyai.online/privacy" },
      { property: "twitter:card", content: "summary_large_image" },
    ];
    
    ogData.forEach(({ property, content }) => {
        updateMetaTag(`meta[property="${property}"]`, 'content', content);
    });

  }, []);

  return (
    // Base container: Clean, modern background for a professional feel
    <div className="min-h-screen bg-gray-50 py-12 sm:py-20 px-4 font-sans">
      <div className="max-w-5xl mx-auto bg-white p-6 sm:p-12 rounded-3xl shadow-2xl border-t-8 border-indigo-700/80">
        
        {/* ======================= HERO / TITLE SECTION (Premium Look) ======================= */}
        <header className="text-center mb-10 sm:mb-16 border-b pb-6 sm:pb-8 border-indigo-100">
          <ShieldCheck className="w-16 h-16 text-indigo-700 mx-auto mb-4" /> 
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-3 leading-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">Privacy Commitment</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium">
            Last Updated: <b>October 7, 2025</b> | Version 2.2
          </p>
          <p className="mt-5 text-gray-700 font-normal text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Your <b>trust</b> and the security of your <b>educational data</b> are paramount. We are committed to transparency and adherence to global privacy standards.
          </p>
        </header>

        {/* ======================= POLICY SECTIONS (Structured, Tab-like Design) ======================= */}
        <section className="space-y-10 sm:space-y-16">
          {policySections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div 
                key={index} 
                className="flex flex-col sm:flex-row gap-6 sm:gap-12 pb-8 last:pb-0 group"
              >
                
                {/* Left Side: Title & Icon Card (Premium Accent) */}
                <div className="sm:w-1/3 flex-shrink-0">
                    <div className="flex items-center sm:flex-col sm:items-start gap-4 p-4 sm:p-6 rounded-xl bg-indigo-50 border border-indigo-200 transition-all duration-300 group-hover:bg-indigo-100">
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-700 flex-shrink-0" />
                        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-800 leading-snug">
                            {section.title}
                        </h2>
                    </div>
                </div>

                {/* Right Side: Content List (Clean Readability) */}
                <div className="sm:w-2/3">
                    <ul className="list-none space-y-4 text-gray-700 leading-relaxed border-l-4 border-purple-300 pl-4 sm:pl-6">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3 text-sm sm:text-base">
                          {/* Custom bullet point as a small indicator */}
                          <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div> 
                          <p dangerouslySetInnerHTML={{ __html: item }}></p>
                        </li>
                      ))}
                    </ul>
                </div>
              </div>
            );
          })}
        </section>
        
        {/* Final Legal Statement */}
        <div className="mt-16 pt-8 border-t border-indigo-200 text-center text-gray-600 text-sm sm:text-base">
            <p className="font-semibold text-gray-700">
                <b>Legal Notice:</b> By continuing to use the GradifyAI platform, you acknowledge and consent to the terms outlined in this Privacy Policy.
            </p>
            <p className="mt-2 text-gray-500 text-xs">
                We are fully dedicated to maintaining the highest standards of data privacy and security.
            </p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;