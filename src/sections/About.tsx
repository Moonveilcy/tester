import { motion } from 'framer-motion';
import { Shield, Smartphone, Zap } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'All operations run client-side. Your GitHub tokens and Gemini API keys never leave your device.',
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Designed for developers on the go. Commit and push repositories directly from your phone.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'No backend delays. Instant operations with direct API connections.',
    },
  ];

  return (
    <section
      id="about"
      className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-900 to-indigo-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Why GitMoon?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            GitMoon runs fully client-side, using your GitHub Token and Gemini API Key safely.
            We prioritize your privacy and simplicity, making Git operations accessible for
            developers anywhere, anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative p-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
