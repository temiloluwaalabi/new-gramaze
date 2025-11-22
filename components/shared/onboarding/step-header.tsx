// components/onboarding/StepHeader.tsx
type StepHeaderProps = {
  title: string;
  description: string;
};

export const StepHeader = ({ title, description }: StepHeaderProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold md:text-xl lg:text-2xl">{title}</h2>
      <p className="text-xs text-gray-500 md:text-sm">{description}</p>
    </div>
  );
};
