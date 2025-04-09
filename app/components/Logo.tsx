import { AudioLines } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center bg-transparent" data-theme="corporate">
      <div className="p-2">
        <AudioLines className="w-6 h-6 text-accent" />
      </div>
      <div className="text-xl font-bold">Linkify</div>
    </div>
  );
};

export default Logo;
