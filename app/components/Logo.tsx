import { AudioLines } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center bg-transparent" data-theme="corporate">
      <div>
        <AudioLines className="w-6 h-6 text-accent mr-2" />
      </div>
      <div className="text-xl font-bold">Linkify</div>
    </div>
  );
};

export default Logo;
