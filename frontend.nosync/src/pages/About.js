import FAQ from "../components/FAQ";

export default function About() {
  return (
    <>
      <section className="bg-gray-50 py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            At <span className="font-semibold text-indigo-600">EchoPolicy</span>, 
            our mission is simple: to amplify public and workplace voices through short, 
            impactful polls — influencing policies that truly matter. 
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            We believe that your opinion shouldn’t end at the watercooler. 
            With EchoPolicy, it resonates where it counts — inspiring change, 
            shaping conversations, and driving meaningful decisions.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            Together, we turn everyday perspectives into catalysts for progress.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

    </>
  );
}
