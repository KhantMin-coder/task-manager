import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const Logo = () => {
  return (
   <Link href="/">
      {/* Hidden by default, in medium and up visible */}
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image src="/logo.svg" alt="logo" height={30} width={30} />
        <p className="text-lg text-neutral-700 pb-1">Mini Trello</p>
      </div>
    </Link>
  );
};

export default Logo;
