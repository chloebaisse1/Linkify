import { UserButton } from "@clerk/nextjs";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <div className="px-5 md:px-[10%] pt-4">
      <div className="flex justify-between items-center">
        <Logo />
        <div className="">
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
