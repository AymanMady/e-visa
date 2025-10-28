import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface FormStepProps {
  step: number;
  children: React.ReactNode;
  className?: string;
}

const FormStep: React.FC<FormStepProps> = memo(({ step, children, className = "" }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.3, delay: 0.1 }}
      viewport={{ once: true }}
      className={`animate_top mx-auto max-w-c-1154 ${className}`}
    >
      {children}
    </motion.div>
  );
});

FormStep.displayName = 'FormStep';

export default FormStep;
