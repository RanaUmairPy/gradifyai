import React, { useEffect, useState } from "react";
import { 
    Phone, Mail, MapPin, 
    Facebook, Instagram, Linkedin, Twitter, 
    MessageCircle, // Used for WhatsApp
    Send 
} from "lucide-react";

// --- START: Contact Component ---
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // =========================================================================
  // SEO SETUP (No changes needed here, your implementation is already good)
  // =========================================================================
  useEffect(() => {
    // Setting SEO meta tags (Title, Description, OG tags)
    document.title = "Contact Us | GradifyAI - Get in Touch";
    
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

    const description = "Contact GradifyAI for support, inquiries, or feedback. We're here to help educators and students with our AI grading platform.";
    const keywords = "GradifyAI contact, support, inquiry, feedback, educational technology, AI grading help, customer service";

    updateMetaTag('meta[name="description"]', 'content', description);
    updateMetaTag('meta[name="keywords"]', 'content', keywords);

    const ogData = [
      { property: "og:title", content: "Contact GradifyAI | Reach Out to Us" },
      { property: "og:description", content: description },
      { property: "og:url", content: "https://www.gradifyai.online/contact" },
      { property: "twitter:card", content: "summary_large_image" },
    ];
    
    ogData.forEach(({ property, content }) => {
        updateMetaTag(`meta[property="${property}"]`, 'content', content);
    });

  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    // Simulate API call for 2 seconds
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); 
      
      // Success simulation
      setSubmitMessage("Thank you for your message! We will get back to you shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });

    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitMessage("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // SOCIAL LINKS: Number order maintained as requested (348 then 312)
  // =========================================================================
  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/share/1BhXi1X35P/", color: "bg-blue-600 hover:bg-blue-700" },
    { name: "WhatsApp 1", icon: MessageCircle, url: "https://wa.me/923211794510", label: "0321 1794510", color: "bg-green-500 hover:bg-green-600" },
    { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/gradifyai_official", dummy: true, color: "bg-pink-600 hover:bg-pink-700" },
    { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/company/gradifyai", dummy: true, color: "bg-blue-800 hover:bg-blue-900" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com/gradifyai", dummy: true, color: "bg-sky-500 hover:bg-sky-600" },
  ];

  return (
    // Outer container with a subtle background for premium feel
    <div className="min-h-screen bg-gray-50 py-12 sm:py-20 px-4 font-sans">
      {/* Main Card Container with large shadow and border for premium look */}
      <div className="max-w-6xl mx-auto bg-white p-6 sm:p-12 rounded-3xl shadow-2xl border-t-8 border-indigo-600">
        
        {/* ======================= HERO / TITLE SECTION ======================= */}
        <header className="text-center mb-10 sm:mb-16 border-b pb-6 sm:pb-8 border-gray-100">
          <Mail className="w-16 h-16 text-indigo-600 mx-auto mb-4 animate-bounce-slow" /> 
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-3 leading-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">Touch</span>
          </h1>
          <p className="mt-5 text-gray-600 font-medium text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Have questions, feedback, or need support? Reach out to GradifyAI's dedicated team.
          </p>
        </header>

        {/* ======================= CONTACT DETAILS & FORM SECTION ======================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
          
          {/* Left Column: Contact Information Blocks */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2">
              Our Contact Info
            </h2>
            
            {/* Phone/WhatsApp: Number order is 348 then 312 */}
            <div className="flex items-start gap-4 p-5 bg-white border border-indigo-100 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:border-indigo-200">
              <Phone className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Call or Message</h3>
                {/* Number 2 (0321...) is first */}
                <a href="tel:+923211794510" className="block text-indigo-600 hover:text-indigo-800 transition">+(92) 321 1794510</a>
                {/* Number 1 (0325...) is second */}
                <a href="tel:+923258051831" className="block text-indigo-600 hover:text-indigo-800 transition">+(92) 325 8051831</a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 p-5 bg-white border border-indigo-100 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:border-indigo-200">
              <Mail className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Support Email</h3>
                <a href="mailto:support@gradifyai.online" className="text-indigo-600 hover:text-indigo-800 transition">support@gradifyai.online</a>
              </div>
            </div>

            {/* Address: Updated, with direct Tailwind bolding */}
            <div className="flex items-start gap-4 p-5 bg-white border border-indigo-100 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:border-indigo-200">
              <MapPin className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Operational Base</h3>
                <p className="text-gray-600">This is an <span className="font-bold">Online-Based</span> Company.</p>
                <p className="text-gray-600">Located in <span className="font-bold">Nankana Sahib, Pakistan</span>.</p>
              </div>
            </div>

            {/* Social Media Links Section */}
            <div className="pt-8 mt-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Connect on Social Media
              </h2>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {socialLinks.map((social, index) => {
                  const SocialIcon = social.icon;
                  // Handle dummy links for visual indication
                  const isDisabled = social.dummy ? "opacity-60 grayscale cursor-not-allowed" : "";

                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center w-12 h-12 rounded-full text-white transition-all duration-300 transform shadow-md 
                        ${social.color} ${isDisabled}
                        ${!social.dummy ? 'hover:scale-110 hover:shadow-lg' : ''}`}
                      aria-label={`Link to GradifyAI's ${social.name}`}
                      title={social.label || social.name} // Added title for better UX/Tooltip
                      onClick={(e) => social.dummy && e.preventDefault()}
                    >
                      <SocialIcon className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Premium Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-indigo-50/50 rounded-xl shadow-inner">
              
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="shadow-sm border border-gray-200 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  required
                  className="shadow-sm border border-gray-200 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-gray-700 text-sm font-semibold mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Inquiry about GradifyAI"
                  required
                  className="shadow-sm border border-gray-200 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-gray-700 text-sm font-semibold mb-2">
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Type your message here..."
                  required
                  className="shadow-sm border border-gray-200 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-xl hover:bg-indigo-700 transform hover:scale-[1.01] ${isSubmitting ? 'opacity-80 cursor-not-allowed shadow-none' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Send Message
                  </>
                )}
              </button>
              
              {/* Submission Message */}
              {submitMessage && (
                <p className={`mt-4 text-center font-semibold text-sm ${submitMessage.includes("Thank you") ? "text-green-600" : "text-red-600"}`}>
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Footer/Guarantee Statement */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-600 text-sm sm:text-base">
            <p className="mt-2 text-gray-500 font-medium">
                We guarantee a response to all critical inquiries within <span className="font-bold text-indigo-700">24 business hours</span>.
            </p>
        </div>

      </div>
      {/* Required Tailwind CSS for the custom spin animation */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Contact;
