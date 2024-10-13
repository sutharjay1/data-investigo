"use client";
import Hint from "@/components/global/hint";
import UserDropdownMenu from "@/components/global/user-avatar";
import { Input } from "@/components/ui/input";
import { P } from "@/components/ui/typography";
import { Book, Headphones, Search } from "lucide-react";

const InfoBar = () => {
  return (
    <div className="flex w-full flex-row items-center justify-end gap-6 px-4 py-4 dark:bg-black">
      <span className="hidden items-center gap-2 font-bold md:flex">
        <P className="text-sm font-light text-text">Credits</P>
        {/* {tier == 'Unlimited' ? (
          <span>Unlimited</span>
        ) : (
          <span>
            {credits}/{tier == 'Free' ? '10' : tier == 'Pro' && '100'}
          </span>
        )} */}
      </span>
      <span className="flex items-center rounded-full bg-muted px-4">
        <Search />
        <Input
          placeholder="Quick Search"
          className="border-none bg-transparent"
        />
      </span>
      <Hint label="Contact Support" side="bottom">
        <Headphones />
      </Hint>
      <Hint label="Guide" side="bottom">
        <Book />
      </Hint>
      <Hint label="Guide" side="bottom">
        <UserDropdownMenu />
      </Hint>
      {/* <UserButton /> */}
    </div>
  );
};

export default InfoBar;
