import { AudioLines } from "lucide-react";
import { FC } from "react";
interface LogoProps {
  theme?: string;
}

const Logo: FC<LogoProps> = ({ theme }) => {
  return (
    <div
      className="flex items-center bg-transparent"
      data-theme={`${theme}` || "corporate"}
    >
      <div>
        <AudioLines className="w-6 h-6 text-accent mr-2" />
      </div>
      <div className="text-xl font-bold">Linkify</div>
    </div>
  );
};

export default Logo;
