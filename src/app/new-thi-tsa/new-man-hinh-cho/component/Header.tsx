import Image from "next/image";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-gray-100 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2">
          <Image src = "/logo.jpg" alt = "logo" width={65} height={65} className="rounded-full"/>
          <div className="text-2xl">
            <div className="font-semibold text-black">{title}</div>
            <div className="text-xm text-black">{subtitle}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
