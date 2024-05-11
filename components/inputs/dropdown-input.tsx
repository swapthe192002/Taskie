"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent, 
    DropdownMenuGroup, 
    DropdownMenuItem 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface DropdownInputProps{
  label: string;
  onSelect: (status: string) => void;
  menuItems: string[];
  className?: string;
}

export const DropdownInput = ({ 
    label, 
    onSelect, 
    menuItems,
    className
} : DropdownInputProps) => {

  return (
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full h-[4rem] ">
          <Button variant="outline" className="w-full flex justify-start text-black dark:text-white">
            {label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={`-mt-3 rounded-[5px] max-h-[10rem] overflow-y-scroll scrollbar-hide z-[9999] ${className}`}>
          <DropdownMenuGroup>
            {menuItems.map((item, index) => (
              <DropdownMenuItem
                key={index}
                className="rounded-[5px] hover:cursor-pointer"
                onClick={() => onSelect(item)}
              >
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
  );
};