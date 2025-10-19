import { motion } from 'framer-motion';
import { Package, Brain, Lock, Zap } from 'lucide-react';

export default function Feature() {
  const features = [
    {
      icon: Package,
      title: 'Upload ZIP → Extract & Commit',
      description: 'Simply upload a .zip file and GitMoon automatically extracts and commits it to your GitHub repository.',
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      icon: Brain,
      title: 'Auto README Generator',
      description: 'Powered by Gemini AI, automatically generate comprehensive README files for your projects.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: Lock,
      title: 'Secure Client-Side Tokens',
      description: 'Your GitHub tokens and API keys are stored securely in your browser. No backend, no risk.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Fast Mobile Push & Pull',
      description: 'Perform Git operations at lightning speed, directly from your mobile device.',
      gradient: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section
      id="features"
      className="relative py-24 overflow-hidden bg-gradient-to-b from-indigo-950 to-slate-900"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Everything you need to manage your GitHub repositories with ease and speed.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="relative group cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20 rounded-2xl blur-xl group-hover:opacity-30 group-hover:blur-2xl transition-all duration-300`} />

              <div className="relative p-8 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-indigo-500/20 group-hover:border-indigo-500/40 transition-all duration-300 h-full">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
