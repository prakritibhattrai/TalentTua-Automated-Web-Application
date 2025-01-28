import { motion } from "framer-motion";

const Title = () => {
  return (
    <motion.div
      className={`
        max-w-4xl 
        px-4 
        sm:px-6 
        lg:px-8 
        mx-auto 
        text-center
      `}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl md:text-3xl lg:text-4xl dark:text-white">
        Welcome to TalentTua AI
      </h1>
      <p className="mt-3 text-gray-600 dark:text-neutral-400">
        Your AI-powered copilot for hiring.
      </p>
    </motion.div>
  );
};

export default Title;
