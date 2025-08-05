// components/onboarding/StepHeader.tsx
type StepHeaderProps = {
  title: string;
  description: string;
};

export const StepHeader = ({ title, description }: StepHeaderProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg md:text-xl lg:text-2xl font-semibold">{title}</h2>
      <p className="text-gray-500 text-xs md:text-sm">{description}</p>
    </div>
  );
};
