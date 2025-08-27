import { useState } from "react";

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 text-left focus:outline-none"
      >
        <span className="text-lg font-medium text-gray-900">{question}</span>
        <span className="ml-4 text-gray-500">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="pb-4 text-gray-700 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const faqs = [
    {
      question: "How can I create a poll?",
      answer:
         "Just click on 'Create Polls,' enter your question, add the answer options, and publish—it’s that simple! You don’t need to sign up unless you want to make your poll public or save it for later use. Otherwise, you can create a quick poll without an account."
    },
    {
      question: "Why is it only one question poll?",
      answer:
        "Our mission is to keep polls short and impactful. A single question ensures clarity, encourages participation, and makes it easier for results to influence decisions without overwhelming users."
    },
    {
      question: "Is EchoPolicy free to use?",
      answer:
        "Yes, EchoPolicy is completely free to use. We believe everyone’s voice deserves to be heard without barriers."
    },
    {
      question: "How are poll results used?",
      answer:
        "Poll results help spark conversations, inform policies, and drive meaningful change in workplaces and communities."
    },
    {
      question: "How to contribute to the code?",
      answer:
        "EchoPolicy is open-source! You can visit our GitHub repository, fork it, and submit pull requests. Contributions of all kinds — bug fixes, features, or documentation improvements — are welcome."
    },
  ];

  return (
    <section className="bg-white py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-gray-200">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}