import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <div className="fixed bottom-0 w-full p-4 border-t bg-white bg-slate-100">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button size="sm" variant='ghost' >
            Privacy Policy
          </Button>
          <Button variant='ghost' size='sm'>
            Terms of Service
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
